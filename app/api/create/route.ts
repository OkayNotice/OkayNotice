import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
// Note: You will need to set up Firebase/Firestore next for this to save
// For now, this logic generates the short ID (slug)

export async function POST(req: Request) {
  try {
    const { destinationUrl, type } = await req.json();

    // 1. Generate a random 7-character slug
    const slug = nanoid(7);

    // 2. Logic to save to Firestore will go here next
    
    return NextResponse.json({ 
      success: true, 
      shortLink: `https://okaynotice.com/${slug}`,
      slug: slug 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}