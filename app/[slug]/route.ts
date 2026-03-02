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

    if (!docSnap.exists()) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const data = docSnap.data();

    // ==========================================
    // NEW: Check for Expiration
    // ==========================================
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      return NextResponse.redirect(new URL(`/expired`, req.url));
    }

    // Increment views
    updateDoc(docRef, { "analytics.totalViews": increment(1) }).catch(console.error);

    // Intercept Password Protected Links
    if (data.password) {
      return NextResponse.redirect(new URL(`/locked/${slug}`, req.url));
    }

    // Handle Secure Cloudflare R2 Files
    if (data.target && data.target.startsWith("r2://")) {
      const fileKey = data.target.replace("r2://", "");
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
      });
      const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
      return NextResponse.redirect(signedUrl);
    }

    // Handle Standard URLs
    return NextResponse.redirect(data.target);
    
  } catch (error) {
    console.error("Redirect Error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}