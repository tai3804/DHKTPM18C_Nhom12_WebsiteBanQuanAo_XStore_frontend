import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Edit2,
  Trash2,
  Calendar,
  ChevronDown,
  Tag,
  DollarSign,
  Users,
} from "lucide-react";
import { getDiscounts, deleteDiscount } from "../../slices/DiscountSlice";
import { fetchAllOrders } from "../../slices/OrderSlice";
import DiscountForm from "../../components/admin/DiscountForm";
import SearchBar from "../../components/admin/SearchBar";
import StatsSection from "../../components/admin/StatsSection";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { Link } from "react-router-dom";

const ManageDiscountsPage = () => {
  const dispatch = useDispatch();
  const { discounts = [] } = useSelector((state) => state.discount || {});
  const orders = useSelector((state) => state.order.orders) || [];
  const loading = useSelector((state) => state.loading.active);
  const themeMode = useSelector(selectThemeMode);

  const [showForm, setShowForm] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalDiscounts: 0,
    totalDiscountAmount: 0,
    totalApplications: 0,
    activeDiscounts: 0,
  });

  useEffect(() => {
    dispatch(getDiscounts());
    if (orders.length === 0) {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, orders.length]);

  // Tính toán thống kê theo khoảng thời gian
  useEffect(() => {
    if (discounts.length > 0) {
      calculateStats(timeRange);
    }
  }, [discounts, orders, timeRange]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const calculateStats = (range) => {
    const now = new Date();
    let startDate, endDate;

    switch (range) {
      case "day":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    // Tổng số mã giảm giá
    const totalDiscounts = discounts.length;

    // Tính tổng tiền đã giảm và số lượng áp dụng trong khoảng thời gian
    let totalDiscountAmount = 0;
    let totalApplications = 0;
    let activeDiscounts = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt || order.orderDate);
      if (orderDate >= startDate && orderDate < endDate) {
        if (order.discountCode || order.discountId) {
          totalApplications += 1;
          // Giả sử discountAmount được lưu trong order
          if (order.discountAmount) {
            totalDiscountAmount += order.discountAmount;
          }
        }
      }
    });

    // Tính số mã giảm giá đang hoạt động
    discounts.forEach((d) => {
      if (d.isActive) {
        const now = new Date();
        const start = d.startDate ? new Date(d.startDate) : null;
        const end = d.endDate ? new Date(d.endDate) : null;
        if ((!start || now >= start) && (!end || now <= end)) {
          activeDiscounts += 1;
        }
      }
    });

    setStats({
      totalDiscounts,
      totalDiscountAmount,
      totalApplications,
      activeDiscounts,
    });
  };

  const handleAdd = () => {
    setSelectedDiscount(null);
    setShowForm(true);
  };

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa giảm giá này?")) return;
    try {
      await dispatch(deleteDiscount(id)).unwrap();
      toast.success("Xóa giảm giá thành công!");
      dispatch(getDiscounts());
    } catch (err) {
      toast.error("Lỗi khi xóa: " + err.message);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDiscount(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    dispatch(getDiscounts());
  };

  const filtered = discounts.filter((d) => {
    const q = (searchQuery || "").trim().toLowerCase();
    return (
      d.code?.toLowerCase().includes(q) ||
      d.name?.toLowerCase().includes(q) ||
      d.title?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  });

  const headerTextClass = `text-2xl font-bold transition-colors duration-300 ${
    themeMode === "dark" ? "text-gray-100" : "text-gray-800"
  }`;
  const subTextClass = `text-sm transition-colors duration-300 ${
    themeMode === "dark" ? "text-gray-400" : "text-gray-500"
  }`;
  const tableBgClass =
    themeMode === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-100";
  const tableHeaderClass =
    themeMode === "dark"
      ? "bg-gray-700 border-gray-600 text-gray-300"
      : "bg-gray-50 border-gray-200 text-gray-600";
  const rowHoverClass =
    themeMode === "dark"
      ? "border-gray-700 hover:bg-gray-700"
      : "border-gray-100 hover:bg-gray-50";
  const noDataClass = themeMode === "dark" ? "text-gray-400" : "text-gray-500";
  const buttonAddClass = `px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
    themeMode === "dark"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white"
  }`;
  const timeRangeOptions = [
    { value: "day", label: "Theo ngày" },
    { value: "month", label: "Theo tháng" },
    { value: "year", label: "Theo năm" },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Breadcrumb */}
      <div
        className={`text-sm mb-2 flex items-center gap-1 transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <Link to="/admin/dashboard" className="hover:underline">
          Trang chủ
        </Link>
        <span>/</span>
        <Link to="/admin/discounts" className="hover:underline">
          Giảm giá
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className={headerTextClass}>Quản lý giảm giá</h1>
          <p className={subTextClass}>Tạo, chỉnh sửa, xóa mã giảm giá</p>

          <div className="mt-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Tìm kiếm theo mã, tên, tiêu đề, mô tả..."
              onClear={() => setSearchQuery("")}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Dropdown chọn khoảng thời gian */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-300 ${
                themeMode === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Calendar size={18} />
              {
                timeRangeOptions.find((option) => option.value === timeRange)
                  ?.label
              }
              <ChevronDown size={16} />
            </button>

            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-10 transition-colors duration-300 ${
                  themeMode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {timeRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeRange(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "text-gray-100 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                    } ${
                      timeRange === option.value
                        ? themeMode === "dark"
                          ? "bg-gray-700"
                          : "bg-gray-100"
                        : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleAdd} className={buttonAddClass}>
            + Thêm giảm giá
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <StatsSection
        stats={[
          {
            label: "Tổng mã giảm giá",
            value: stats.totalDiscounts,
            color: "bg-blue-500",
            icon: <Tag size={20} />,
          },
          {
            label: "Đang hoạt động",
            value: stats.activeDiscounts,
            color: "bg-orange-500",
            icon: <Calendar size={20} />,
          },
          {
            label: "Tổng tiền đã giảm",
            value: `${stats.totalDiscountAmount.toLocaleString("vi-VN")}₫`,
            color: "bg-green-500",
            icon: <DollarSign size={20} />,
          },
          {
            label: "Số lần áp dụng",
            value: stats.totalApplications,
            color: "bg-purple-500",
            icon: <Users size={20} />,
          },
        ]}
      />

      {/* Table */}
      {loading ? (
        <div className={`text-center py-8 transition-colors ${noDataClass}`}>
          Đang tải danh sách giảm giá...
        </div>
      ) : filtered.length > 0 ? (
        <div
          className={`rounded-xl shadow-sm border overflow-x-auto transition-colors ${tableBgClass}`}
        >
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr>
                {[
                  "ID",
                  "Tên / Tiêu đề",
                  "Mô tả",
                  "Loại",
                  "Giảm",
                  "Trạng thái",
                  "Thời gian",
                  "Hành động",
                ].map((title, idx) => (
                  <th
                    key={idx}
                    className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${tableHeaderClass} ${
                      title === "Hành động" ? "text-right" : ""
                    }`}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr
                  key={d.id || d._id}
                  className={`border-b transition-colors duration-300 ${rowHoverClass}`}
                >
                  <td className="px-4 py-3">{d.id || d._id}</td>
                  <td className="px-4 py-3">
                    {d.name || "—"}
                    <br />
                    <span className="text-gray-500 text-sm">
                      {d.title || ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">{d.description || "—"}</td>
                  <td className="px-4 py-3">
                    {d.type === "PERCENT" ? "Phần trăm" : "Cố định"}
                  </td>
                  <td className="px-4 py-3">
                    {d.type === "PERCENT"
                      ? `${d.discountPercent}%`
                      : d.discountAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        d.isActive
                          ? themeMode === "dark"
                            ? "bg-green-900 text-green-300"
                            : "bg-green-100 text-green-800"
                          : themeMode === "dark"
                          ? "bg-red-900 text-red-300"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          d.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      {d.isActive ? "Hoạt động" : "Vô hiệu"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {d.startDate ? d.startDate.slice(0, 10) : "—"} —{" "}
                    {d.endDate ? d.endDate.slice(0, 10) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(d)}
                      className={`inline-flex transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className={`inline-flex transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-600 hover:text-red-800"
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`text-center py-8 transition-colors ${noDataClass}`}>
          {searchQuery
            ? "Không tìm thấy giảm giá nào khớp với tìm kiếm"
            : "Không có giảm giá nào"}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <DiscountForm
          discount={selectedDiscount}
          onCancel={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ManageDiscountsPage;
