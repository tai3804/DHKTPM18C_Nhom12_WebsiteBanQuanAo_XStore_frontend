import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Calendar, ChevronDown, ArrowUpDown } from "lucide-react";
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
  const [timeRange, setTimeRange] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = mới-cũ, asc = cũ-mới
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProfit: 0,
    cancelledOrders: 0,
  });

  // ✅ Không cần fetch nữa - đã được preload trong AdminLayout
  // useEffect(() => {
  //   dispatch(fetchAllOrders());
  // }, [dispatch]);

  // Tính toán thống kê theo khoảng thời gian
  useEffect(() => {
    if (orders.length > 0) {
      calculateStats(timeRange);
    }
  }, [orders, timeRange]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".time-dropdown-container")) {
        setIsDropdownOpen(false);
      }
      if (
        isStatusDropdownOpen &&
        !event.target.closest(".status-dropdown-container")
      ) {
        setIsStatusDropdownOpen(false);
      }
      if (
        isSortDropdownOpen &&
        !event.target.closest(".sort-dropdown-container")
      ) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, isStatusDropdownOpen, isSortDropdownOpen]);

  const calculateStats = (range) => {
    const now = new Date();
    let startDate, endDate;

    switch (range) {
      case "all":
        startDate = null;
        endDate = null;
        break;
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
        startDate = null;
        endDate = null;
    }

    // Lọc đơn hàng trong khoảng thời gian
    const filteredOrders =
      startDate && endDate
        ? orders.filter((o) => {
            const orderDate = new Date(o.createdAt || o.orderDate);
            return orderDate >= startDate && orderDate < endDate;
          })
        : orders; // Nếu là "all" thì lấy tất cả đơn hàng

    const totalOrders = filteredOrders.length;

    // Log chi tiết để debug
    console.log("=== ManageOrdersPage - calculateStats ===");
    console.log("Time range:", range);
    console.log("Date range:", { startDate, endDate });
    console.log("Filtered orders count:", filteredOrders.length);
    console.log(
      "Sample orders:",
      filteredOrders.slice(0, 3).map((o) => ({
        id: o.id,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
      }))
    );

    const deliveredOrders = filteredOrders.filter(
      (o) => o.status === "DELIVERED"
    );
    console.log("Delivered orders count:", deliveredOrders.length);

    const totalRevenue = deliveredOrders.reduce((sum, o) => {
      const orderTotal = o.total || 0;
      console.log(`  Order ${o.id}: ${orderTotal}₫ (status: ${o.status})`);
      return sum + orderTotal;
    }, 0);

    console.log("Total revenue:", totalRevenue);

    // Giả sử lợi nhuận là 20% của doanh thu (có thể điều chỉnh)
    const totalProfit = Math.round(totalRevenue * 0.2);
    const cancelledOrders = filteredOrders.filter(
      (o) => o.status === "CANCELLED"
    ).length;

    console.log("=== Stats Summary ===", {
      totalOrders,
      totalRevenue,
      totalProfit,
      cancelledOrders,
    });

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

  // Các trạng thái admin được phép chỉnh sửa (loại bỏ AWAITING_PAYMENT, CANCELLED và RETURN_REQUESTED)
  const statusOptions = [
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "CONFIRMED", label: "Đã xác nhận" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "IN_TRANSIT", label: "Đang giao hàng" },
    { value: "PENDING_RECEIPT", label: "Chờ nhận hàng" },
    { value: "DELIVERED", label: "Đã giao hàng" },
  ];

  // Tất cả các trạng thái để hiển thị label (bao gồm CANCELLED và RETURN_REQUESTED)
  const allStatusLabels = {
    PENDING: "Chờ xác nhận",
    AWAITING_PAYMENT: "Chờ thanh toán",
    CONFIRMED: "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    IN_TRANSIT: "Đang giao hàng",
    PENDING_RECEIPT: "Chờ nhận hàng",
    DELIVERED: "Đã giao hàng",
    CANCELLED: "Đã hủy",
    RETURN_REQUESTED: "Yêu cầu đổi/trả",
  };

  // Các tùy chọn lọc theo trạng thái
  const statusFilterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "AWAITING_PAYMENT", label: "Chờ thanh toán" },
    { value: "CONFIRMED", label: "Đã xác nhận" },
    { value: "IN_TRANSIT", label: "Đang giao hàng" },
    { value: "DELIVERED", label: "Đã giao hàng" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  // Filter theo search query, status filter và time range
  const filteredOrders = orders.filter((o) => {
    // Ẩn các đơn hàng có trạng thái RETURN_REQUESTED (đã có trang riêng)
    if (o.status === "RETURN_REQUESTED") {
      return false;
    }

    // Lọc theo thời gian (nếu không phải "all")
    if (timeRange !== "all") {
      const now = new Date();
      let startDate, endDate;

      switch (timeRange) {
        case "day":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
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
          startDate = null;
          endDate = null;
      }

      if (startDate && endDate) {
        const orderDate = new Date(o.createdAt || o.orderDate);
        if (orderDate < startDate || orderDate >= endDate) {
          return false;
        }
      }
    }

    // Lọc theo trạng thái
    if (statusFilter !== "all" && o.status !== statusFilter) {
      return false;
    }

    // Lọc theo search query
    const q = (searchQuery || "").trim().toLowerCase();
    if (q) {
      return (
        o.user?.account?.username?.toLowerCase().includes(q) ||
        o.phoneNumber?.toLowerCase().includes(q) ||
        o.shippingAddress?.toLowerCase().includes(q) ||
        o.paymentMethod?.toLowerCase().includes(q) ||
        o.status?.toLowerCase().includes(q)
      );
    }

    return true;
  });

  // Sắp xếp đơn hàng sau khi lọc
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.createdAt || a.orderDate);
      const dateB = new Date(b.createdAt || b.orderDate);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    } else if (sortBy === "status") {
      // Sắp xếp theo thứ tự trạng thái
      const statusOrder = {
        PENDING: 1,
        AWAITING_PAYMENT: 2,
        CONFIRMED: 3,
        PROCESSING: 4,
        IN_TRANSIT: 5,
        PENDING_RECEIPT: 6,
        DELIVERED: 7,
        CANCELLED: 8,
        RETURN_REQUESTED: 9,
      };
      const orderA = statusOrder[a.status] || 999;
      const orderB = statusOrder[b.status] || 999;
      return sortOrder === "asc" ? orderA - orderB : orderB - orderA;
    }
    return 0;
  });

  // Tùy chọn sắp xếp
  const sortOptions = [
    { value: "date-desc", label: "Ngày: Mới → Cũ" },
    { value: "date-asc", label: "Ngày: Cũ → Mới" },
    { value: "status-asc", label: "Trạng thái: Tăng dần" },
    { value: "status-desc", label: "Trạng thái: Giảm dần" },
  ];

  const handleSortChange = (value) => {
    const [sortByValue, sortOrderValue] = value.split("-");
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setIsSortDropdownOpen(false);
  };

  const getCurrentSortLabel = () => {
    const currentValue = `${sortBy}-${sortOrder}`;
    return (
      sortOptions.find((opt) => opt.value === currentValue)?.label || "Sắp xếp"
    );
  };

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
    { value: "all", label: "Tất cả" },
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
          {/* Dropdown lọc theo trạng thái */}
          <div className="relative status-dropdown-container">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-300 ${
                themeMode === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-sm">
                {
                  statusFilterOptions.find(
                    (option) => option.value === statusFilter
                  )?.label
                }
              </span>
              <ChevronDown size={16} />
            </button>

            {isStatusDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-lg border shadow-lg z-10 max-h-80 overflow-y-auto transition-colors duration-300 ${
                  themeMode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {statusFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "text-gray-100 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                    } ${
                      statusFilter === option.value
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

          {/* Dropdown sắp xếp */}
          <div className="relative sort-dropdown-container">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-300 ${
                themeMode === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ArrowUpDown size={18} />
              <span className="text-sm">{getCurrentSortLabel()}</span>
              <ChevronDown size={16} />
            </button>

            {isSortDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-lg border shadow-lg z-10 transition-colors duration-300 ${
                  themeMode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "text-gray-100 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                    } ${
                      `${sortBy}-${sortOrder}` === option.value
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

          {/* Dropdown chọn khoảng thời gian */}
          <div className="relative time-dropdown-container">
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
      ) : sortedOrders.length > 0 ? (
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
              {sortedOrders.map((o) => (
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
                    {o.status === "CANCELLED" ||
                    o.status === "RETURN_REQUESTED" ||
                    o.status === "AWAITING_PAYMENT" ||
                    o.status === "DELIVERED" ? (
                      // Nếu là đơn đã hủy, yêu cầu đổi/trả, chờ thanh toán hoặc đã giao hàng -> chỉ hiển thị label không cho chỉnh sửa
                      <span
                        className={`px-2 py-1 text-sm rounded ${
                          o.status === "CANCELLED"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : o.status === "RETURN_REQUESTED"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : o.status === "AWAITING_PAYMENT"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {allStatusLabels[o.status]}
                      </span>
                    ) : (
                      // Đơn hàng khác cho phép chỉnh sửa
                      <select
                        value={o.status || "PENDING"}
                        onChange={(e) =>
                          handleStatusChange(o.id, e.target.value)
                        }
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
                    )}
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
