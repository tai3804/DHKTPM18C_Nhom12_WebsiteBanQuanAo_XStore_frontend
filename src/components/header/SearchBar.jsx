import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="hidden lg:flex items-center max-w-sm flex-1 mx-8">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  )
}
