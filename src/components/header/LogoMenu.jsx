import { Menu } from "lucide-react"

export default function LogoMenu() {
  return (
    <div className="flex items-center space-x-4">
      {/* Mobile menu icon */}
      <button className="md:hidden p-2 hover:bg-muted rounded-md transition-colors">
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo */}
      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary">
        CM
      </div>
    </div>
  )
}
