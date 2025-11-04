import NavigationLink from "./NavigationLink";
import { useSelector } from "react-redux";

export default function Navigation() {
  const favouriteCount = useSelector(
    (state) => state.favourite?.favourites?.length || 0
  );

  return (
    <nav className="hidden md:flex items-center space-x-2 ml-8">
      <NavigationLink to="/">Trang Chủ</NavigationLink>
      <NavigationLink to="/products">Sản phẩm</NavigationLink>
      <NavigationLink to="/hot">Hot</NavigationLink>
      <NavigationLink to="/sale">Giảm giá</NavigationLink>
      <NavigationLink to="/contact">Chúng tôi</NavigationLink>
      <NavigationLink to="/favourite">
        <span className="relative flex items-center">
          Yêu thích
          {favouriteCount > 0 && (
            <span className="absolute top-0 -right-2 bg-red-500 rounded-full h-2 w-2"></span>
          )}
        </span>
      </NavigationLink>
    </nav>
  );
}
