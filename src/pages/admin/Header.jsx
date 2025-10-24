import React, { useEffect, useRef, useState } from 'react'
import { Bell, User, LogOut, Info } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../slices/AuthSlice';

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();
  const dispath = useDispatch();

  const user = useSelector(state => state.auth.user)

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
      <header className="bg-white border-b border-gray-200 flex items-center justify-between px-8 py-3 w-full">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-md" />
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            Store Manager
          </h1>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-6 relative" ref={menuRef}>
          {/* Notification */}
          <button className="relative">
            <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 transition" />
            <span className="absolute top-0 right-0 block w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>

          {/* User dropdown */}
          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
          >
            <User className="w-5 h-5 text-gray-700" />
          </button>

          {/* Dropdown menu */}
          {openMenu && (
            <div className="absolute right-0 top-12 w-44 bg-white border border-gray-200 shadow-lg rounded-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 text-sm text-gray-600">
                <p className="font-medium text-gray-800">{user.firstName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                <Info className="w-4 h-4" />
                Profile
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm text-red-600 hover:bg-gray-100 transition"
                onClick={() => alert("Logging out...")}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
  )
}
