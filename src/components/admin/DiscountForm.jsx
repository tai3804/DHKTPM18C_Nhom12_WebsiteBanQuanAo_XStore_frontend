import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createDiscount, updateDiscount } from "../../slices/DiscountSlice";

export default function DiscountForm({ discount, onCancel, onSuccess }) {
  const dispatch = useDispatch();
  const isEdit = !!discount;
  const modalRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    title: "",
    value: 0,
    description: "",
    type: "",
    unit: "",
  });

  useEffect(() => {
    if (discount) {
      setForm({
        name: discount.name || "",
        title: discount.title || "",
        value: discount.value || 0,
        description: discount.description || "",
        type: discount.type || "",
        unit: discount.unit || "",
      });
    }
  }, [discount]);

  const discountTypes = [
    { value: "percentage", label: "Theo phần trăm" },
    { value: "fixed", label: "Theo giá cố định" },
    { value: "free_shipping", label: "Miễn phí vận chuyển" },
  ];

  const unitOptions = [
    { value: "PERCENT", label: "Phần trăm (%)" },
    { value: "MONEY", label: "Tiền (VNĐ)" },
  ];

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

    if (!form.name.trim() || !form.type || !form.unit) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const discountData = {
      ...form,
      value: parseFloat(form.value),
    };

    try {
      if (isEdit) {
        await dispatch(updateDiscount({ id: discount.id, discountData })).unwrap();
        toast.success("Cập nhật khuyến mãi thành công!");
      } else {
        await dispatch(createDiscount(discountData)).unwrap();
        toast.success("Tạo khuyến mãi thành công!");
      }
      onSuccess?.();
    } catch (err) {
      toast.error("Lỗi khi lưu khuyến mãi: " + err);
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
          {isEdit ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Tên</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tên khuyến mãi"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-gray-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Tiêu đề</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Tiêu đề"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-gray-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Giá trị</label>
              <input
                type="number"
                name="value"
                value={form.value}
                onChange={handleChange}
                placeholder="Giá trị"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-gray-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Đơn vị</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-gray-300 outline-none"
              >
                <option value="">Chọn đơn vị</option>
                {unitOptions.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Loại khuyến mãi</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-gray-300 outline-none"
            >
              <option value="">Chọn loại khuyến mãi</option>
              {discountTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả khuyến mãi"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-gray-300 outline-none"
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
            >
              {isEdit ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
