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
import { selectThemeMode } from "../../slices/ThemeSlice";
import ProductTypeForm from "../../components/admin/ProductTypeForm";
import SearchBar from "../../components/admin/SearchBar";

export default function ManageProductTypesPage() {
  const dispatch = useDispatch();
  const { productTypes, loading } = useSelector((state) => state.productType);
  const themeMode = useSelector(selectThemeMode);

  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTypes = async () => {
      const res = await dispatch(getProductTypes());
      dispatch(setProductTypes(res));
    };
    fetchTypes();
  }, [dispatch]);

  // Filter product types based on search query
  const filteredTypes =
    productTypes?.filter(
      (type) =>
        type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (type.description &&
          type.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

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
      <div
        className={`text-sm mb-2 flex items-center gap-1 transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-500" : "text-gray-500"
        }`}
      >
        <Link
          to="/admin/dashboard"
          className={`hover:underline cursor-pointer transition-colors ${
            themeMode === "dark"
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          to="/admin/product-types"
          className={`hover:underline cursor-pointer transition-colors ${
            themeMode === "dark"
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Loại sản phẩm
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="shrink-0">
          <h1
            className={`text-2xl font-bold transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Quản lý loại sản phẩm
          </h1>
          <p
            className={`text-sm transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Quản lý các loại sản phẩm hiện có
          </p>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Tìm kiếm theo tên, mô tả..."
              onClear={() => setSearchQuery("")}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer font-medium shrink-0"
        >
          + Thêm loại
        </button>
      </div>

      {/* Table */}
      <div
        className={`rounded-xl shadow-sm border overflow-x-auto transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <table className="w-full text-left border-collapse min-w-max">
          <thead
            className={`border-b transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <tr>
              <th
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                ID
              </th>
              <th
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Tên loại
              </th>
              <th
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Mô tả
              </th>
              <th
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 text-right ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className={`py-6 text-center transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Đang tải danh sách loại sản phẩm...
                </td>
              </tr>
            ) : filteredTypes && filteredTypes.length > 0 ? (
              filteredTypes.map((type) => (
                <tr
                  key={type.id}
                  className={`border-b hover:transition cursor-pointer transition-colors duration-300 ${
                    themeMode === "dark"
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {type.id}
                  </td>
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {type.name}
                  </td>
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
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
                <td
                  colSpan="4"
                  className={`py-6 text-center transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {searchQuery
                    ? "Không tìm thấy loại sản phẩm nào khớp với tìm kiếm."
                    : "Không có loại sản phẩm nào."}
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
