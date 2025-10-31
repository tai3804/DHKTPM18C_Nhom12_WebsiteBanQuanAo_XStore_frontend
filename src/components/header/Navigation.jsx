import NavigationLink from "./NavigationLink";

export default function Navigation() {
  return (
    <nav className="hidden md:flex items-center space-x-2 ml-8">
      <NavigationLink to="/">Trang Chủ</NavigationLink>
      <NavigationLink to="/products">Sản phẩm</NavigationLink>
      <NavigationLink to="/contact">Chúng tôi</NavigationLink>
      <NavigationLink to="/sale">Giảm giá</NavigationLink>
      <NavigationLink to="/favourite">Yêu thích</NavigationLink>
    </nav>
  );
}
