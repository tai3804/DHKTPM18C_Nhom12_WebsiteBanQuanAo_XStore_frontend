import React, { useEffect, useRef, useState } from "react";
import { Bell, User, LogOut, Info, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import UserIcon from "../header/UserIcon";
import NotiIcon from "../header/NotiIcon";
import ThemeToggle from "../header/ThemeToggle";
import { NavLink, useNavigate } from "react-router-dom";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function Header() {
  const themeMode = useSelector(selectThemeMode);
  const navigate = useNavigate();
  return (
    <header
      className={`border-b flex items-center justify-between px-8 py-3 w-full h-16 transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="w-20 h-fit rounded-md">
          <NavLink
            className="h-20 w-20  rounded-lg flex items-center justify-center font-bold text-primary"
            to={"/admin/dashboard"}
          >
            <img src="/logo.png" alt="" />
          </NavLink>
        </div>
      </div>
      <h1
        className={`text-xl font-semibold tracking-tight transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        Bảng Điều Khiển XStore
      </h1>

      {/* Right: Icons */}
      <div className="flex items-center gap-6 relative">
        {/* Notification */}
        <NotiIcon />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User dropdown */}
        <UserIcon />

        {/* return to website */}
        <button
          onClick={() => navigate("/")}
          className={`transition-colors duration-300 p-2 rounded-lg cursor-pointer ${
            themeMode === "dark"
              ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          title="Quay lại trang chủ"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
    </header>
  );
}
