import { Sun } from "lucide-react"

export default function ThemeToggle({ isDark, setIsDark }) {
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 hover:bg-amber-100 rounded-md transition-colors"
    >
      <Sun className="h-5 w-5 text-amber-500" />
    </button>
  )
}
