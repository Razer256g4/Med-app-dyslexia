"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-gray-100 text-gray-900 shadow-md p-4 flex justify-between items-center">
      {/* Left - App Name */}
      <h1 className="text-xl font-bold">Dyslexia Notes</h1>

      {/* Center - Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Menu ▼
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md">
            <Link href="/dyslexia">
              <p className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">Dyslexia</p>
            </Link>
            <Link href="/settings">
              <p className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">Settings</p>
            </Link>
          </div>
        )}
      </div>

      {/* Right - Account Info */}
      <div className="flex items-center space-x-2">
        <img
          src="/avatar.png"
          alt="User Avatar"
          className="w-8 h-8 rounded-full border"
        />
        <p className="text-sm font-medium">John Doe</p>
      </div>
    </nav>
  );
}
