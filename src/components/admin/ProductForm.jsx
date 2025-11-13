// ProductForm.jsx
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createProduct, updateProduct } from "../../slices/ProductSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { Trash2, Plus } from "lucide-react";

export default function ProductForm({
  product,
  onCancel,
  onSuccess,
  types = [],
}) {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const isEdit = !!product;
  const modalRef = useRef(null);

  const commonSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const [form, setForm] = useState({
    name: "",
    brand: "",
    fabric: "",
    description: "",
    image: null,
    imagePreview: "",
    price: 0,
    priceInStock: 0,
    type: "",
    colors: [],
    sizes: [],
  });

  const [newColor, setNewColor] = useState({ name: "", hexCode: "#000000" });
  const [newSize, setNewSize] = useState({ name: "M", description: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        brand: product.brand || "",
        fabric: product.fabric || "",
        description: product.description || "",
        image: null,
        imagePreview: product.image || "",
        price: product.price || 0,
        priceInStock: product.priceInStock || 0,
        type: product.type?.id || "",
        colors: product.colors || [],
        sizes: product.sizes || [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddColor = () => {
    const trimmedName = newColor.name.trim();

    console.log("🎨 handleAddColor called:", {
      newColor,
      trimmedName,
      currentColorsCount: form.colors.length,
      currentColors: form.colors,
    });

    if (!trimmedName) {
      toast.error("Vui lòng nhập tên màu!");
      return;
    }

    if (!newColor.hexCode) {
      toast.error("Vui lòng chọn mã màu!");
      return;
    }

    const duplicate = form.colors.find(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicate) {
      toast.error("Màu này đã tồn tại!");
      return;
    }

    const colorToAdd = { name: trimmedName, hexCode: newColor.hexCode };
    console.log("✅ Adding color:", colorToAdd);

    setForm((prev) => {
      const updated = {
        ...prev,
        colors: [...prev.colors, colorToAdd],
      };
      console.log("📤 Form updated with colors:", updated.colors);
      return updated;
    });

    setNewColor({ name: "", hexCode: "#000000" });
    console.log("🔄 newColor reset to:", { name: "", hexCode: "#000000" });
    toast.success("Thêm màu thành công!");
  };

  const handleRemoveColor = (index) => {
    console.log(
      "🗑️ Removing color at index:",
      index,
      "Color:",
      form.colors[index]
    );
    setForm((prev) => {
      const updated = {
        ...prev,
        colors: prev.colors.filter((_, i) => i !== index),
      };
      console.log("✅ Colors after removal:", updated.colors);
      return updated;
    });
  };

  const handleAddSize = () => {
    if (!newSize.name.trim()) {
      toast.error("Vui lòng chọn size!");
      return;
    }

    const duplicate = form.sizes.find((s) => s.name === newSize.name);

    if (duplicate) {
      toast.error("Size này đã tồn tại!");
      return;
    }

    const sizeToAdd = { name: newSize.name, description: newSize.description };

    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, sizeToAdd],
    }));

    setNewSize({ name: "M", description: "" });
    toast.success("Thêm size thành công!");
  };

  const handleRemoveSize = (index) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onCancel();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "🔍 Form validation - form.type:",
      form.type,
      "form.name:",
      form.name
    );
    console.log("🔍 Form state:", form);

    if (!form.name.trim() || !form.type) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      console.log("❌ Validation failed - name or type empty");
      return;
    }

    // Chỉ yêu cầu ảnh khi thêm mới, không yêu cầu khi chỉnh sửa nếu đã có ảnh cũ
    if (!isEdit && !form.image) {
      toast.error("Vui lòng chọn ảnh sản phẩm!");
      return;
    }

    if (form.colors.length === 0) {
      toast.error("Vui lòng thêm ít nhất một màu!");
      return;
    }

    if (form.sizes.length === 0) {
      toast.error("Vui lòng thêm ít nhất một size!");
      return;
    }

    // Tạo FormData để gửi file
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("fabric", form.fabric);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("priceInStock", form.priceInStock);
    formData.append("typeId", form.type ? parseInt(form.type) : 0);

    // Append file nếu có
    if (form.image) {
      formData.append("image", form.image);
    }

    // Append colors và sizes dạng JSON
    formData.append("colors", JSON.stringify(form.colors));
    formData.append("sizes", JSON.stringify(form.sizes));

    console.log("📤 Submitting product data with FormData");

    try {
      if (isEdit) {
        await dispatch(
          updateProduct({ id: product.id, productData: formData })
        );
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await dispatch(createProduct(formData));
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
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className={`rounded-2xl p-8 w-full max-w-2xl shadow-xl border animate-fadeIn transition-colors duration-300 max-h-[90vh] overflow-y-auto ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <h2
          className={`text-2xl font-bold text-center pb-4 mb-6 border-b transition-colors duration-300 ${
            themeMode === "dark"
              ? "text-gray-100 border-gray-700"
              : "text-gray-800 border-gray-200"
          }`}
        >
          {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h3
              className={`text-sm font-semibold mb-4 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Thông tin cơ bản
            </h3>
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
                label="Chất liệu"
                name="fabric"
                value={form.fabric}
                onChange={handleChange}
                placeholder="Chất liệu"
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-2">
              <label
                className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Hình ảnh
              </label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                      themeMode === "dark"
                        ? "border-gray-600 bg-gray-700 hover:border-indigo-500 hover:bg-gray-600"
                        : "border-gray-300 bg-gray-50 hover:border-indigo-500 hover:bg-indigo-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      📷 Chọn file ảnh
                    </span>
                  </label>
                </div>

                {/* Preview ảnh */}
                {form.imagePreview && (
                  <div className="relative w-20 h-20">
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border-2 border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Mô tả
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 outline-none transition-all duration-300 ${
                themeMode === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  : "bg-white border-gray-200 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
              }`}
              rows="3"
            />
          </div>

          {/* Loại sản phẩm & Giá */}
          <div className="grid grid-cols-3 gap-4">
            <FormSelect
              label="Loại sản phẩm"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={types.map((t) => ({ value: t.id, label: t.name }))}
              required
            />
            <FormInput
              label="Giá"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
            />
            <FormInput
              label="Tồn kho"
              name="priceInStock"
              type="number"
              value={form.priceInStock}
              onChange={handleChange}
            />
          </div>

          {/* Màu sắc */}
          <div>
            <h3
              className={`text-sm font-semibold mb-4 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Màu sắc
            </h3>
            <div className="space-y-3">
              {/* Add Color Form */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label
                    className={`block text-sm mb-1 font-medium transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Tên màu
                  </label>
                  <input
                    type="text"
                    value={newColor.name}
                    onChange={(e) => {
                      console.log("Color name changed to:", e.target.value);
                      setNewColor({ ...newColor, name: e.target.value });
                    }}
                    placeholder="VD: Đỏ, Xanh"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 outline-none transition-all duration-300 ${
                      themeMode === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        : "bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm mb-1 font-medium transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Chọn màu
                  </label>
                  <input
                    type="color"
                    value={newColor.hexCode}
                    onChange={(e) => {
                      console.log("Color hex changed to:", e.target.value);
                      setNewColor({ ...newColor, hexCode: e.target.value });
                    }}
                    className="w-14 h-10 rounded-lg border cursor-pointer transition-all hover:shadow-md"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm mb-1 font-medium transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Mã hex
                  </label>
                  <input
                    type="text"
                    value={newColor.hexCode}
                    onChange={(e) => {
                      console.log("Hex code changed to:", e.target.value);
                      setNewColor({ ...newColor, hexCode: e.target.value });
                    }}
                    placeholder="#000000"
                    className={`w-28 px-3 py-2 border rounded-lg text-sm placeholder-gray-400 outline-none transition-all duration-300 ${
                      themeMode === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        : "bg-white border-gray-200 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer font-medium whitespace-nowrap"
                >
                  <Plus size={18} /> Thêm
                </button>
              </div>

              {/* Color List */}
              <div className="space-y-2">
                {form.colors.length === 0 ? (
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Chưa có màu nào
                  </p>
                ) : (
                  form.colors.map((color, idx) => (
                    <div
                      key={`color-${idx}-${color.name}`}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color.hexCode }}
                      />
                      <span
                        className={`text-sm flex-1 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-200"
                            : "text-gray-700"
                        }`}
                      >
                        {color.name}
                      </span>
                      <span
                        className={`text-xs transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {color.hexCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Kích cỡ */}
          <div>
            <h3
              className={`text-sm font-semibold mb-4 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Kích cỡ
            </h3>
            <div className="space-y-3">
              {/* Add Size Form */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-2 items-end">
                <div>
                  <label
                    className={`block text-sm mb-1 font-medium transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Size
                  </label>
                  <select
                    value={newSize.name}
                    onChange={(e) =>
                      setNewSize({ ...newSize, name: e.target.value })
                    }
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm font-medium outline-none transition-all duration-300 cursor-pointer ${
                      themeMode === "dark"
                        ? "bg-gray-700 border-gray-600 text-white hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        : "bg-white border-gray-200 text-gray-900 hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  >
                    {commonSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm mb-1 font-medium transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Mô tả
                  </label>
                  <input
                    type="text"
                    value={newSize.description}
                    onChange={(e) =>
                      setNewSize({ ...newSize, description: e.target.value })
                    }
                    placeholder="VD: Small - 48-52kg"
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm placeholder-gray-400 outline-none transition-all duration-300 ${
                      themeMode === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        : "bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddSize}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer font-medium h-full"
                >
                  <Plus size={18} /> Thêm
                </button>
              </div>

              {/* Size List */}
              <div className="space-y-2">
                {form.sizes.length === 0 ? (
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Chưa có size nào
                  </p>
                ) : (
                  form.sizes.map((size, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span
                        className={`font-semibold w-12 text-center transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-blue-400"
                            : "text-blue-600"
                        }`}
                      >
                        {size.name}
                      </span>
                      <span
                        className={`text-sm flex-1 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}
                      >
                        {size.description || "—"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(idx)}
                        className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className={`px-5 py-2 rounded-lg border transition cursor-pointer ${
                themeMode === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer font-medium"
            >
              {isEdit ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
