import { useState } from "react"
import { CircleUser } from "lucide-react"
import { ShoppingCart, Search } from "lucide-react"

import LogoMenu from "./LogoMenu"
import Navigation from "./Navigation"
import SearchBar from "./SearchBar"
import ThemeToggle from "./ThemeToggle.jsx"
import NavigationLink from "./NavigationLink.jsx"
import UserIcon from "./UserIcon.jsx"

export default function Header() {
  const [isDark, setIsDark] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
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

            {/* Account */}
            <UserIcon />

            {/* Cart */}
            <NavigationLink to="/cart">
              <ShoppingCart className="h-5 w-5" />
            </NavigationLink>

            {/* Theme toggle */}
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          </div>
        </div>
      </div>
    </header>
  )
}
