import { Edit3, Trash2 } from "lucide-react";

export default function ProductItem({ product, onEdit, onDelete }) {
  return (
    <div
      className="
        flex items-center justify-between w-full
        bg-white border border-gray-200 rounded-xl 
        shadow-sm hover:shadow-md 
        transition-all duration-200 ease-in-out 
        overflow-hidden p-5
      "
    >
      {/* Ảnh bên trái */}
      <div className=" w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={
            product.image || "https://via.placeholder.com/150x150?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thông tin chi tiết ở giữa */}
      <div className="flex-1 px-6 grid  gap-x-6 gap-y-1 text-sm text-gray-700">
        <p>
          <span className="font-medium text-gray-800">Tên:</span> {product.name}
        </p>
        <p className="col-span-2">
          <span className="font-medium text-gray-800">Mô tả:</span>{" "}
          {product.description || "Không có mô tả"}
        </p>
        <p>
          <span className="font-medium text-gray-800">Thương hiệu:</span>{" "}
          {product.brand || "Không rõ"}
        </p>
        <p>
          <span className="font-medium text-gray-800">Loại:</span>{" "}
          {product.type?.name || "Không rõ"}
        </p>
        <p>
          <span className="font-medium text-gray-800">Màu sắc:</span>{" "}
          {product.color || "Không rõ"}
        </p>
        <p>
          <span className="font-medium text-gray-800">size:</span>{" "}
          {product.size || "Không rõ"}
        </p>
        <p>
          <span className="font-medium text-gray-800">Chất liệu:</span>{" "}
          {product.fabric || "Không rõ"}
        </p>
        <p>
          <span className="font-medium text-gray-800">Giá:</span>{" "}
          {product.price?.toLocaleString()}₫
        </p>
        <p>
          <span className="font-medium text-gray-800">Tồn kho:</span>{" "}
          {product.priceInStock}
        </p>
      </div>

      {/* Icon bên phải */}
      <div className="flex flex-col gap-3 items-center pr-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition cursor-pointer"
          title="Chỉnh sửa"
        >
          <Edit3 size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition cursor-pointer"
          title="Xóa sản phẩm"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
