import { toast } from "react-toastify";
import Header from "../components/header/Header";
import ProductList from "../components/product/ProductList";
export default function ProductsPage() {
  return (
    <div>
      <Header />

      <ProductList></ProductList>
    </div>
  );
}
