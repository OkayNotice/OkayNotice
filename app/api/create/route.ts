import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "../../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { destinationUrl, type, password, expiresInDays } = await req.json();
    const slug = nanoid(7);

    // Calculate expiration date if requested
    let expiresAt = null;
    if (expiresInDays && expiresInDays > 0) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(expiresInDays));
      expiresAt = expiryDate.toISOString();
    }

    await setDoc(doc(db, "links", slug), {
      target: destinationUrl,
      type: type || "url",
      password: password || null,
      expiresAt: expiresAt, // NEW: Save the expiration date
      createdAt: serverTimestamp(),
      analytics: {
        totalViews: 0
      }
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