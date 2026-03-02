import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { destinationUrl, type } = await req.json();

    // 1. Generate a random 7-character slug
    const slug = nanoid(7);

    // 2. Save to Firestore using the slug as the Document ID
    await setDoc(doc(db, "links", slug), {
      target: destinationUrl,
      type: type || "url",
      createdAt: serverTimestamp(),
      clicks: 0
    });
    
    return NextResponse.json({ 
      success: true, 
      shortLink: `https://okaynotice.com/${slug}`,
      slug: slug 
    });
  } catch (error) {
    console.error("Firebase Error:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}