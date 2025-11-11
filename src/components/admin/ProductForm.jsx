// ProductForm.jsx
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createProduct, updateProduct } from "../../slices/ProductSlice";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

export default function ProductForm({
  product,
  onCancel,
  onSuccess,
  types = [],
}) {
  const dispatch = useDispatch();
  const isEdit = !!product;
  const modalRef = useRef(null);

  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const [form, setForm] = useState({
    name: "",
    brand: "",
    color: "",
    size: "M",
    fabric: "",
    description: "",
    image: "",
    price: 0,
    priceInStock: 0,
    type: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        brand: product.brand || "",
        color: product.color || "",
        size: product.size || "M",
        fabric: product.fabric || "",
        description: product.description || "",
        image: product.image || "",
        price: product.price || 0,
        priceInStock: product.priceInStock || 0,
        type: product.type?.id || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onCancel();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.type) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    const productData = {
      ...form,
      type: form.type ? { id: parseInt(form.type) } : null,
    };

    try {
      if (isEdit) {
        await dispatch(updateProduct({ id: product.id, productData }));
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await dispatch(createProduct(productData));
        toast.success("Thêm sản phẩm thành công!");
      }
      onSuccess?.();
    } catch (err) {
      console.error("Error submitting product:", err);
      toast.error("Error: " + err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl border border-gray-100 animate-fadeIn"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Tên sản phẩm"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Tên sản phẩm"
            />
            <FormInput
              label="Thương hiệu"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Thương hiệu"
            />
            <FormInput
              label="Màu sắc"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Màu sắc"
            />
            <FormSelect
              label="Kích cỡ"
              name="size"
              value={form.size}
              onChange={handleChange}
              options={sizes.map((s) => ({ value: s, label: s }))}
            />
            <FormInput
              label="Chất liệu"
              name="fabric"
              value={form.fabric}
              onChange={handleChange}
              placeholder="Chất liệu"
            />
            <FormInput
              label="Hình ảnh (URL)"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="URL hình ảnh"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition"
              rows="3"
            />
          </div>

          {/* Loại sản phẩm */}
          <FormSelect
            label="Loại sản phẩm"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={types.map((t) => ({ value: t.id, label: t.name }))}
            required
          />

          {/* Giá & tồn kho */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Giá"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
            />
            <FormInput
              label="Giá tồn kho"
              name="priceInStock"
              type="number"
              value={form.priceInStock}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition cursor-pointer"
            >
              {isEdit ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
