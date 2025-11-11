import { useState } from "react";
import { ShoppingCart, Search, Bell, User, Settings } from "lucide-react";
import { useSelector } from "react-redux";

import LogoMenu from "./LogoMenu";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";
import UserIcon from "./UserIcon.jsx";
import { NavLink } from "react-router-dom";
import CartIcon from "./CartIcon.jsx";
import NotiIcon from "./NotiIcon.jsx";

export default function Header() {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky w-full top-0 bg-white border-b border-gray-200 flex justify-between px-8 h-16 items-center z-50 shadow-sm">
      <LogoMenu />

      {/* Navigation links */}
      <Navigation />

      {/* Search Bar */}
      <SearchBar />

      {/* Right Icons */}
      <div className="flex items-center space-x-2">
        {/* Mobile search icon */}
        <button
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Tìm kiếm"
        >
          <Search className="h-5 w-5 text-gray-700 hover:text-gray-900" />
        </button>

        {/* Cart */}
        <CartIcon />

        {/* Notification */}
        <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <NotiIcon />
        </div>

        {/* Account */}
        <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <UserIcon />
        </div>

        {/* Manage link chỉ hiện nếu là ADMIN */}
        {user?.account?.role === "ADMIN" && (
          <NavLink
            to="/admin"
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            title="Quản lý"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden xl:inline">Quản lý</span>
          </NavLink>
        )}
      </div>
    </header>
  );
}
