import { useState } from "react";
import { ShoppingCart, Search, Bell, User, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

import LogoMenu from "./LogoMenu";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";
import UserIcon from "./UserIcon.jsx";
import { NavLink } from "react-router-dom";
import CartIcon from "./CartIcon.jsx";
import NotiIcon from "./NotiIcon.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const themeMode = useSelector(selectThemeMode);

  return (
    <header
      className={`sticky w-full top-0 flex justify-between px-8 h-16 items-center z-50 transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-gray-900 border-b border-gray-800 shadow-sm"
          : "bg-white border-b border-gray-200 shadow-sm"
      }`}
    >
      <LogoMenu />

      {/* Navigation links */}
      <Navigation />

      {/* Search Bar */}
      <SearchBar />

      {/* Right Icons */}
      <div className="flex items-center space-x-2">
        {/* Mobile search icon */}
        <button
          className={`lg:hidden p-2 rounded-full transition-all duration-200 border border-transparent ${
            themeMode === "dark"
              ? "hover:bg-gray-800 hover:border-gray-700"
              : "hover:bg-gray-100 hover:border-gray-300"
          }`}
          title="Tìm kiếm"
        >
          <Search
            className={`h-5 w-5 transition-colors ${
              themeMode === "dark"
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-gray-800"
            }`}
          />
        </button>

        {/* Cart */}
        <CartIcon />

        {/* Notification */}
        <div
          className={`p-2 rounded-full transition-all duration-200 border border-transparent ${
            themeMode === "dark"
              ? "hover:bg-gray-800 hover:border-gray-700"
              : "hover:bg-gray-100 hover:border-gray-300"
          }`}
        >
          <NotiIcon />
        </div>

        {/* Account */}
        <div
          className={`rounded-full transition-all duration-200 border border-transparent ${
            themeMode === "dark"
              ? "hover:bg-gray-800 hover:border-gray-700"
              : "hover:bg-gray-100 hover:border-gray-300"
          }`}
        >
          <UserIcon />
        </div>

        {/* Theme toggle placed between User and Manage */}
        <ThemeToggle />

        {/* Manage link chỉ hiện nếu là ADMIN */}
        {user?.account?.role === "ADMIN" && (
          <NavLink
            to="/admin"
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 border ${
              themeMode === "dark"
                ? "text-gray-200 hover:text-white hover:bg-gray-800 hover:border-gray-700 border-transparent"
                : "text-gray-700 hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 border-transparent"
            }`}
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
