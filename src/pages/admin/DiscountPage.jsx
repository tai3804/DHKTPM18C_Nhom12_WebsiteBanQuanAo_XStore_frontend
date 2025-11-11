import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getDiscounts, deleteDiscount, createDiscount, updateDiscount } from "../../slices/DiscountSlice";
import DiscountForm from "../../components/admin/DiscountForm";
// ===== DiscountItem =====
function DiscountItem({ discount, onEdit, onDelete }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <div>
        <h3 className="font-bold">{discount.name} - {discount.title}</h3>
        <p className="text-sm text-gray-500">{discount.description}</p>
        <p className="text-sm text-gray-500">Giá trị: {discount.value} {discount.unit}</p>
        <p className="text-sm text-gray-500">Loại: {discount.type}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500">Sửa</button>
        <button onClick={onDelete} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Xóa</button>
      </div>
    </div>
  );
}

// ===== DiscountForm =====
// ===== DiscountForm =====

// ===== ManageDiscountPage =====
export default function DiscountPage() {
  const dispatch = useDispatch();
  const { discounts, loading } = useSelector((state) => state.discount);
  const [showForm, setShowForm] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  useEffect(() => {
    dispatch(getDiscounts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khuyến mãi này?")) {
      try {
        await dispatch(deleteDiscount(id)).unwrap();
        toast.success("Đã xóa khuyến mãi!");
        dispatch(getDiscounts());
      } catch (err) {
        toast.error("Không thể xóa khuyến mãi: " + err);
      }
    }
  };

  const handleAdd = () => {
    setSelectedDiscount(null);
    setShowForm(true);
  };

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDiscount(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    dispatch(getDiscounts());
  };

  return (
    <div className="space-y-8 relative">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
        <Link to="/admin/dashboard" className="hover:underline text-gray-600 cursor-pointer transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link to="/admin/discount" className="hover:underline text-gray-600 cursor-pointer transition-colors">Khuyến mãi</Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý khuyến mãi</h1>
          <p className="text-gray-500 text-sm">Quản lý danh sách chương trình khuyến mãi</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition cursor-pointer flex items-center gap-1">+ Thêm khuyến mãi</button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Đang tải danh sách khuyến mãi...</div>
      ) : discounts && discounts.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {discounts.map((d) => (
            <DiscountItem key={d.id} discount={d} onEdit={() => handleEdit(d)} onDelete={() => handleDelete(d.id)} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">Không có khuyến mãi nào.</div>
      )}

      {/* Modal Form */}
      {showForm && <DiscountForm discount={selectedDiscount} onCancel={handleCloseForm} onSuccess={handleSuccess} />}
    </div>
  );
}
