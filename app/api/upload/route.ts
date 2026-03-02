import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "../../../lib/r2";
import { nanoid } from "nanoid";

// The absolute maximum file size for anonymous users (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

export async function POST(req: Request) {
  try {
    const { filename, contentType, fileSize } = await req.json();

    // 1. Budget Protection: Reject files larger than 5MB
    if (!fileSize || fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB for free users." }, 
        { status: 400 }
      );
    }

    // 2. Security: Never trust the user's file name. 
    // If two people upload "assignment.pdf", one would overwrite the other.
    // We add a random ID to the front of it.
    const fileExtension = filename.split('.').pop();
    const safeKey = `${nanoid(10)}.${fileExtension}`;

    // 3. Ask Cloudflare R2 for an upload pass
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: safeKey,
      ContentType: contentType,
    });

    // The pass is only valid for 60 seconds.
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 });

    return NextResponse.json({ 
      success: true,
      signedUrl: signedUrl, 
      fileKey: safeKey 
    });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" }, 
      { status: 500 }
    );
  }
}