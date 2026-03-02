import { Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ExpiredPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
        <p className="text-gray-500 mb-8">
          This link has reached its expiration date and is no longer available. 
          The creator has chosen to automatically delete it for security.
        </p>

        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-medium w-full">
          Create your own link
        </Link>
      </div>
    </div>
  );
}