import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Calendar, ChevronDown } from "lucide-react";
import { fetchAllOrders, updateOrderStatus } from "../../slices/OrderSlice"; // Thunk mới
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import SearchBar from "../../components/admin/SearchBar";
import StatsSection from "../../components/admin/StatsSection";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ManageOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.order);
  const themeMode = useSelector(selectThemeMode);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProfit: 0,
    cancelledOrders: 0,
  });

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Tính toán thống kê theo khoảng thời gian
  useEffect(() => {
    if (orders.length > 0) {
      calculateStats(timeRange);
    }
  }, [orders, timeRange]);

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

    // Lọc đơn hàng trong khoảng thời gian
    const filteredOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt || o.orderDate);
      return orderDate >= startDate && orderDate < endDate;
    });

    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders
      .filter((o) => o.status === "DELIVERED")
      .reduce((sum, o) => sum + (o.total || 0), 0);
    // Giả sử lợi nhuận là 20% của doanh thu (có thể điều chỉnh)
    const totalProfit = Math.round(totalRevenue * 0.2);
    const cancelledOrders = filteredOrders.filter(
      (o) => o.status === "CANCELLED"
    ).length;

    setStats({
      totalOrders,
      totalRevenue,
      totalProfit,
      cancelledOrders,
    });
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    setShowDetail(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus })
      ).unwrap();
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại: " + error);
    }
  };

  const statusOptions = [
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "AWAITING_PAYMENT", label: "Chờ thanh toán" },
    { value: "CONFIRMED", label: "Đã xác nhận" },
    { value: "IN_TRANSIT", label: "Đang giao hàng" },
    { value: "DELIVERED", label: "Đã giao" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  // Filter theo search query và ẩn đơn đã giao
  const filteredOrders = orders.filter((o) => {
    // Ẩn đơn hàng đã giao
    if (o.status === "DELIVERED") return false;

    const q = (searchQuery || "").trim().toLowerCase();
    return (
      o.user?.account?.username?.toLowerCase().includes(q) ||
      o.phoneNumber?.toLowerCase().includes(q) ||
      o.shippingAddress?.toLowerCase().includes(q) ||
      o.paymentMethod?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q)
    );
  });

  // Classes Tailwind cho theme
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
        <Link to="/admin/orders" className="hover:underline">
          Đơn hàng
        </Link>
      </div>

      {/* Header + Search */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className={headerTextClass}>Quản lý đơn hàng</h1>
          <p className={subTextClass}>Xem chi tiết tất cả đơn hàng</p>
          <div className="mt-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Tìm kiếm theo tên khách, địa chỉ, số điện thoại..."
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
        </div>
      </div>

      {/* Statistics Section */}
      <StatsSection
        stats={[
          {
            label: "Tổng đơn hàng",
            value: stats.totalOrders,
            color: "bg-blue-500",
            icon: <Eye size={20} />,
          },
          {
            label: "Tổng doanh thu",
            value: `${stats.totalRevenue.toLocaleString("vi-VN")}₫`,
            color: "bg-green-500",
            icon: <Eye size={20} />,
          },
          {
            label: "Tổng lợi nhuận",
            value: `${stats.totalProfit.toLocaleString("vi-VN")}₫`,
            color: "bg-purple-500",
            icon: <Eye size={20} />,
          },
          {
            label: "Đã hủy",
            value: stats.cancelledOrders,
            color: "bg-red-500",
            icon: <Eye size={20} />,
          },
        ]}
      />

      {/* Table */}
      {loading ? (
        <div className={`text-center py-8 transition-colors ${noDataClass}`}>
          Đang tải danh sách đơn hàng...
        </div>
      ) : filteredOrders.length > 0 ? (
        <div
          className={`rounded-xl shadow-sm border overflow-x-auto transition-colors ${tableBgClass}`}
        >
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr>
                {[
                  "ID",
                  "Khách hàng",
                  "SĐT",
                  "Địa chỉ",
                  "Tổng tiền",
                  "Trạng thái",
                  "Ngày tạo",
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
              {filteredOrders.map((o) => (
                <tr
                  key={o.id}
                  className={`border-b transition-colors duration-300 ${rowHoverClass}`}
                >
                  <td className="px-4 py-3">{o.id}</td>
                  <td className="px-4 py-3">
                    {o.user?.firstName && o.user?.lastName
                      ? `${o.user.firstName} ${o.user.lastName}`
                      : o.user?.account?.username || "—"}
                  </td>
                  <td className="px-4 py-3">{o.phoneNumber || "—"}</td>
                  <td className="px-4 py-3">{o.shippingAddress || "—"}</td>
                  <td className="px-4 py-3">
                    {o.total?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status || "PENDING"}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`px-2 py-1 text-sm rounded border transition-colors ${
                        themeMode === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-200 focus:bg-gray-600"
                          : "bg-white border-gray-300 text-gray-700 focus:bg-gray-50"
                      }`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">{o.createdAt || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleViewDetail(o)}
                      className={`inline-flex transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      <Eye size={18} />
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
            ? "Không tìm thấy đơn hàng nào khớp với tìm kiếm"
            : "Không có đơn hàng nào"}
        </div>
      )}

      {/* Modal */}
      {showDetail && (
        <OrderDetailModal order={selectedOrder} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default ManageOrdersPage;
