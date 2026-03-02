import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { BarChart3, Eye, Link as LinkIcon } from "lucide-react";

// Because there is no "use client" here, this entire file runs SECURELY on Vercel's servers.
export default async function StatsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const docRef = doc(db, "links", resolvedParams.slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div className="p-10 text-center text-red-500 mt-20 font-bold">Link not found!</div>;
  }

  const data = docSnap.data();
  
  // THE GATEKEEPER: We only extract the safe numbers. 
  // The password and target URL are destroyed here on the server and never sent to the browser.
  const views = data.analytics?.totalViews || 0;
  const type = data.type || "url";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <BarChart3 className="text-blue-600 w-8 h-8" /> 
        Live Analytics
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Eye className="w-5 h-5" /> Total Views
          </div>
          <div className="text-5xl font-black text-gray-900">
            {views}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <LinkIcon className="w-5 h-5" /> Type
          </div>
          <div className="text-2xl font-bold text-gray-900 capitalize">
            {type} Link
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
        <p className="text-sm text-blue-800">
          <strong>Pro Tip:</strong> Bookmark this exact page URL right now so you can check back later to see how many people opened your link!
        </p>
      </div>
    </div>
  );
}