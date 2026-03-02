import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "OkayNotice | Secure Short Links",
  description: "Create secure short links for URLs, Files, and Audio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* min-h-screen and flex-col push the footer to the bottom */}
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}