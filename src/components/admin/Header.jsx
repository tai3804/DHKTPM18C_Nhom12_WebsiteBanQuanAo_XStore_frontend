import React, { useEffect, useRef, useState } from "react";
import { Bell, User, LogOut, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import UserIcon from "../header/UserIcon";
import NotiIcon from "../header/NotiIcon";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-8 py-3 w-full h-16">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="w-20 h-fit rounded-md">
          <img src="../../../../public/logo.png" alt="" />
        </div>
      </div>
      <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
        Store Manager
      </h1>

      {/* Right: Icons */}
      <div className="flex items-center gap-6 relative">
        {/* Notification */}
        <NotiIcon />

        {/* User dropdown */}
        <UserIcon />

        {/* return to website */}
        <NavLink to="/">Back</NavLink>
      </div>
    </header>
  );
}
