import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "../../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { destinationUrl, type } = await req.json();
    const slug = nanoid(7);

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