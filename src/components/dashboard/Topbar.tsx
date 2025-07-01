"use client";
import { Bell, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow">
      {/* Left side (add logo/title/menu as you need) */}
      <div className="font-bold text-lg">
        <Image
          src="/generic/logo.png"
          alt="HITT CENTER"
          width={150}
          height={50}
          className="mr-3"
          priority
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 relative">
        {/* Message Icon */}
        <button className="relative p-2 rounded hover:bg-gray-100">
          <MessageSquare className="w-5 h-5" />
        </button>
        {/* Notification Icon (with dot) */}
        <button className="relative p-2 rounded hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        {/* Avatar/Profile button */}
        <button className="ml-2" onClick={() => setOpen((v) => !v)}>
          <Image
            src="/avatar.png" // Use your user's avatar or a placeholder
            alt="User"
            width={50}
            height={50}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-14 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-30">
            <div className="p-4 border-b">
              <span className="text-gray-400 text-sm">Profile settings</span>
              <div className="font-bold text-base pt-1 cursor-pointer hover:text-primary">
                View profile
              </div>
            </div>
            <ul className="px-4 py-2 space-y-1">
              <li className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 rounded px-2">
                <span className="text-gray-600">
                  <MessageSquare size={18} />
                </span>
                <span>Explore creators</span>
              </li>
              <li className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 rounded px-2">
                <span className="text-gray-600">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21C12 21 4 13.432 4 8.8C4 5.387 7.134 3 10.5 3C11.98 3 13.312 3.712 14 4.664C14.688 3.712 16.02 3 17.5 3C20.866 3 24 5.387 24 8.8C24 13.432 16 21 16 21H12Z"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                <span>Manage membership</span>
              </li>
              <li className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 rounded px-2">
                <span className="text-gray-600">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 5L19 9M19 9L15 13M19 9H9C7.34315 9 6 10.3431 6 12V19"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                <span>Invite creators</span>
              </li>
            </ul>
            <hr />
            <button
              onClick={() => {
                // your logout logic here!
                localStorage.removeItem("hitcenter_token");
                window.location.href = "/login";
              }}
              className="block w-full text-left px-4 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-b-xl"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
