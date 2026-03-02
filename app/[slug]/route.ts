import { NextResponse } from "next/server";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

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

    // Increment clicks silently in background
    updateDoc(docRef, { clicks: increment(1) }).catch(console.error);

    return NextResponse.redirect(data.target);
    
  } catch (error) {
    console.error("Redirect Error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}