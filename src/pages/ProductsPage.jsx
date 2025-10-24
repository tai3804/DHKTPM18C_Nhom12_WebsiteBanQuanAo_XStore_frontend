import { toast } from "react-toastify";
import Header from "../components/header/Header";

export default function ProductsPage() {
  const handleClick = () => {
    toast.success("Thêm sản phẩm thành công! 🎉");
    toast.error("Có lỗi xảy ra!");
    toast.info("Đang xử lý...");
  };

  return (
    <div>
        <Header />

      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Show Toast
      </button>
    </div>
  );
}
