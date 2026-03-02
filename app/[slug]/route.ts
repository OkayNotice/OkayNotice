import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

// In Next.js 15, params must be awaited
export async function GET(
  req: Request, 
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // 1. Look up the slug in Firestore
    const docRef = doc(db, "links", slug);
    const docSnap = await getDoc(docRef);

    // 2. If it doesn't exist, send them back to the homepage
    if (!docSnap.exists()) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const data = docSnap.data();

    // 3. Increment the click counter in the background
    // We don't 'await' this so it doesn't slow down the user's redirect!
    updateDoc(docRef, { clicks: increment(1) }).catch(console.error);

    // 4. Redirect the user to the original long URL
    return NextResponse.redirect(data.target);
    
  } catch (error) {
    console.error("Redirect Error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}