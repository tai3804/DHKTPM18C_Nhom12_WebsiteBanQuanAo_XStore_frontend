import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function LogoMenu() {
  return (
    <div className="flex items-center space-x-4">
      {/* Mobile menu icon */}
      <button className="md:hidden p-2 hover:bg-muted rounded-md transition-colors">
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo */}
      <NavLink
        className="h-20 w-20  rounded-lg flex items-center justify-center font-bold text-primary"
        to={"/"}
      >
        <img src="/logo.png" alt="" />
      </NavLink>
    </div>
  );
}
