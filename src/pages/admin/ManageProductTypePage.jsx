// ManageProductTypesPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit3, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import {
  getProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
  setProductTypes,
} from "../../slices/ProductTypeSlice";
import ProductTypeForm from "../../components/admin/ProductTypeForm";

export default function ManageProductTypesPage() {
  const dispatch = useDispatch();
  const { productTypes, loading } = useSelector((state) => state.productType);

  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchTypes = async () => {
      const res = await dispatch(getProductTypes());
      dispatch(setProductTypes(res));
    };
    fetchTypes();
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedType(null);
    setFormData({ name: "", description: "" });
    setShowForm(true);
  };

  const handleEdit = (type) => {
    setSelectedType(type);
    setFormData({ name: type.name, description: type.description });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa loại sản phẩm này?")) {
      try {
        await dispatch(deleteProductType(id)).unwrap();
        toast.success("Đã xóa loại sản phẩm!");
        dispatch(getProductTypes());
      } catch {
        toast.error("Không thể xóa loại sản phẩm!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Tên loại sản phẩm không được để trống!");
      return;
    }

    try {
      if (selectedType) {
        await dispatch(
          updateProductType({
            id: selectedType.id,
            productTypeData: {
              name: formData.name,
              description: formData.description,
            },
          })
        ).unwrap();
        toast.success("Đã cập nhật loại sản phẩm!");
      } else {
        await dispatch(
          createProductType({
            name: formData.name,
            description: formData.description,
          })
        ).unwrap();
        toast.success("Đã thêm loại sản phẩm!");
      }
      setShowForm(false);
      dispatch(getProductTypes());
    } catch {
      toast.error("Lỗi khi lưu loại sản phẩm!");
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
        <Link
          to="/admin/dashboard"
          className="hover:underline text-gray-600 cursor-pointer transition-colors"
        >
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          to="/admin/product-types"
          className="hover:underline text-gray-600 cursor-pointer transition-colors"
        >
          Loại sản phẩm
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý loại sản phẩm
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý các loại sản phẩm hiện có
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition flex items-center gap-1 cursor-pointer"
        >
          + Thêm loại
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                ID
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Tên loại
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Mô tả
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-500">
                  Đang tải danh sách loại sản phẩm...
                </td>
              </tr>
            ) : productTypes && productTypes.length > 0 ? (
              productTypes.map((type) => (
                <tr
                  key={type.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3 text-gray-700">{type.id}</td>
                  <td className="px-4 py-3 text-gray-700">{type.name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {type.description}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(type)}
                      className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="text-red-600 hover:text-red-800 transition cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-500">
                  Không có loại sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <ProductTypeForm
        showForm={showForm}
        setShowForm={setShowForm}
        selectedType={selectedType}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
