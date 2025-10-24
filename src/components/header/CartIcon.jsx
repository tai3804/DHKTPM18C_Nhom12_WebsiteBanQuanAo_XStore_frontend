import { ShoppingCart } from "lucide-react";
import NavigationLink from "./NavigationLink";

export default function CartIcon() {
  return (
    <NavigationLink to="/cart">
      <ShoppingCart className="h-5 w-5" />
    </NavigationLink>
  );
}
