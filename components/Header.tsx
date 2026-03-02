"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Link as LinkIcon } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <LinkIcon className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl tracking-tight text-gray-900">OkayNotice</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">Login</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-50" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <Link href="#features" className="block px-3 py-2 text-gray-600 rounded-md hover:bg-gray-50 font-medium">Features</Link>
          <Link href="#pricing" className="block px-3 py-2 text-gray-600 rounded-md hover:bg-gray-50 font-medium">Pricing</Link>
          <Link href="/login" className="block px-3 py-2 text-blue-600 rounded-md hover:bg-blue-50 font-medium">Login</Link>
        </div>
      )}
    </header>
  );
}