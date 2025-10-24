import { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { useSelector } from "react-redux";

import LogoMenu from "./LogoMenu";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle.jsx";
import NavigationLink from "./NavigationLink.jsx";
import UserIcon from "./UserIcon.jsx";
import { NavLink } from "react-router-dom";
import CartIcon from "./CartIcon.jsx";
import NotiIcon from "./NotiIcon.jsx";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky w-full top-0 bg-background border-b border-border bg-white flex justify-between px-8 h-16 items-center">
      <LogoMenu />

      {/* Navigation links */}
      <Navigation />

      {/* Search Bar */}
      <SearchBar />

      {/* Right Icons */}
      <div className="flex items-center space-x-2">
        {/* Mobile search icon */}
        <button className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors">
          <Search className="h-5 w-5" />
        </button>

        {/* Cart */}
        <CartIcon />

        {/* noti */}
        <NotiIcon />

        {/* Account */}
        <UserIcon />

        {/* Theme toggle */}
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

        {/* Manage link chỉ hiện nếu là ADMIN */}
        {user?.account?.role === "ADMIN" && (
          <NavLink to="/admin">Manage</NavLink>
        )}
      </div>
    </header>
  );
}
