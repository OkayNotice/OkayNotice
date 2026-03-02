import { NextResponse } from "next/server";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "../../lib/r2";

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const docRef = doc(db, "links", slug);
    const docSnap = await getDoc(docRef);

    // If the link doesn't exist, send them back home
    if (!docSnap.exists()) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const data = docSnap.data();

    // Increment the click counter silently in the background
    updateDoc(docRef, { clicks: increment(1) }).catch(console.error);

    // ==========================================
    // MAGIC: Handle Secure Cloudflare R2 Files
    // ==========================================
    if (data.target && data.target.startsWith("r2://")) {
      const fileKey = data.target.replace("r2://", "");
      
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
      });

      // Generate a temporary download link that expires in 15 minutes (900 seconds)
      const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
      
      return NextResponse.redirect(signedUrl);
    }

    // ==========================================
    // STANDARD: Handle Normal URLs
    // ==========================================
    return NextResponse.redirect(data.target);
    
  } catch (error) {
    console.error("Redirect Error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}