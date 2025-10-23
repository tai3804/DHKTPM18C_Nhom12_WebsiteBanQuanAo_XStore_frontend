import NavigationLink from "./NavigationLink"

export default function Navigation() {
  return (
    <nav className="hidden md:flex items-center space-x-2 ml-8">
      <NavigationLink to="/">Home</NavigationLink>
      <NavigationLink to="/products">Product</NavigationLink>
      <NavigationLink to="/contact">Contact</NavigationLink>
      <NavigationLink to="/sale">Salse</NavigationLink>
    </nav>
  )
}
