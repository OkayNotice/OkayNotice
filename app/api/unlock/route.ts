import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "../../../lib/r2";

export async function POST(req: Request) {
  try {
    const { slug, password } = await req.json();
    const docSnap = await getDoc(doc(db, "links", slug));

    if (!docSnap.exists() || docSnap.data().password !== password) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const data = docSnap.data();
    let finalUrl = data.target;

    // If it's a locked R2 file, generate the secure download pass NOW
    if (data.target.startsWith("r2://")) {
      const fileKey = data.target.replace("r2://", "");
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
      });
      finalUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
    }

    return NextResponse.json({ success: true, target: finalUrl });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}