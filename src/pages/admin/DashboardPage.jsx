import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { getUsers } from "../../slices/UserSlice";
import { getProducts } from "../../slices/ProductSlice";
import { fetchAllOrders } from "../../slices/OrderSlice";
import { getProductTypes } from "../../slices/ProductTypeSlice";
import { API_BASE_URL } from "../../config/api";
import StatsSection from "../../components/admin/StatsSection";
import SearchBar from "../../components/admin/SearchBar";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  ChevronDown,
} from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const users = useSelector((state) => state.user.users) || [];
  const products = useSelector((state) => state.product.products) || [];
  const orders = useSelector((state) => state.order.orders) || [];
  const productTypes =
    useSelector((state) => state.productType.productTypes) || [];

  const [timeRange, setTimeRange] = useState("month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    newCustomers: 0,
    totalOrders: 0,
    revenue: 0,
    profit: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tính toán thống kê theo khoảng thời gian
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

    // Tính khách hàng mới
    const newCustomers = users.filter((user) => {
      const userCreated = new Date(user.createdAt || user.dob);
      return userCreated >= startDate && userCreated < endDate;
    }).length;

    // Tính đơn hàng trong khoảng thời gian
    const periodOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.orderDate);
      return orderDate >= startDate && orderDate < endDate;
    });

    const totalOrders = periodOrders.length;

    // Tính doanh thu
    const revenue = periodOrders.reduce((sum, order) => {
      return sum + (order.totalAmount || 0);
    }, 0);

    // Tính lợi nhuận (giả sử lợi nhuận = doanh thu * 0.3)
    const profit = revenue * 0.3;

    setStats({
      newCustomers,
      totalOrders,
      revenue,
      profit,
    });
  };

  // Tạo dữ liệu cho biểu đồ
  const generateChartData = (range) => {
    const now = new Date();
    const data = [];

    if (range === "day") {
      // Hiển thị 7 ngày gần nhất
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt || order.orderDate);
          return orderDate.toDateString() === date.toDateString();
        });
        const dayRevenue = dayOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        data.push({
          label: date.toLocaleDateString("vi-VN", {
            weekday: "short",
            day: "numeric",
          }),
          revenue: dayRevenue,
          orders: dayOrders.length,
        });
      }
    } else if (range === "month") {
      // Hiển thị 12 tháng gần nhất
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt || order.orderDate);
          return (
            orderDate.getFullYear() === date.getFullYear() &&
            orderDate.getMonth() === date.getMonth()
          );
        });
        const monthRevenue = monthOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        data.push({
          label: date.toLocaleDateString("vi-VN", {
            month: "short",
            year: "numeric",
          }),
          revenue: monthRevenue,
          orders: monthOrders.length,
        });
      }
    } else if (range === "year") {
      // Hiển thị 5 năm gần nhất
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const yearOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt || order.orderDate);
          return orderDate.getFullYear() === year;
        });
        const yearRevenue = yearOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        data.push({
          label: year.toString(),
          revenue: yearRevenue,
          orders: yearOrders.length,
        });
      }
    }

    setChartData(data);
  };

  // Tạo dữ liệu cho biểu đồ tròn
  const generatePieData = () => {
    const categoryStats = {};
    const revenueStats = {};

    // Duyệt qua tất cả orders để tính toán
    orders.forEach((order) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            const categoryId =
              product.productTypeId || product.typeId || product.categoryId;
            const category = productTypes.find((pt) => pt.id === categoryId);
            const categoryName = category ? category.name : "Khác";

            // Tính số lượng sản phẩm bán được
            if (!categoryStats[categoryName]) {
              categoryStats[categoryName] = 0;
            }
            categoryStats[categoryName] += item.quantity || 1;

            // Tính doanh thu theo danh mục
            if (!revenueStats[categoryName]) {
              revenueStats[categoryName] = 0;
            }
            revenueStats[categoryName] +=
              (item.price || 0) * (item.quantity || 1);
          }
        });
      }
    });

    // Chuyển đổi thành format cho pie chart
    const pieData = Object.keys(categoryStats).map((categoryName) => ({
      name: categoryName,
      value: categoryStats[categoryName],
      revenue: revenueStats[categoryName] || 0,
    }));

    setPieData(pieData);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load dữ liệu từ Redux store
        if (users.length === 0) await dispatch(getUsers());
        if (products.length === 0) await dispatch(getProducts());
        if (orders.length === 0) await dispatch(fetchAllOrders());
        if (productTypes.length === 0) await dispatch(getProductTypes());

        // Tính toán thống kê và biểu đồ
        calculateStats(timeRange);
        generateChartData(timeRange);
        generatePieData();
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    dispatch,
    timeRange,
    users.length,
    products.length,
    orders.length,
    productTypes.length,
  ]);

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

  const timeRangeOptions = [
    { value: "day", label: "Theo ngày" },
    { value: "month", label: "Theo tháng" },
    { value: "year", label: "Theo năm" },
  ];

  // Màu sắc cho pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF7C7C",
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div
        className={`text-sm mb-2 flex items-center gap-1 transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-500" : "text-gray-500"
        }`}
      >
        <span
          className={`transition-colors ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Trang chủ
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
        <div className="flex-1">
          <h1
            className={`text-2xl font-bold transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Tổng quan hệ thống
          </h1>
          <p
            className={`text-sm transition-colors duration-300 mt-1 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Tổng quan hệ thống theo thời gian
          </p>

          {/* Search Bar */}
          <div className="mt-4 max-w-md">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Tìm kiếm sản phẩm, danh mục..."
              onClear={() => setSearchQuery("")}
            />
          </div>
        </div>

        {/* Dropdown chọn khoảng thời gian */}
        <div className="shrink-0">
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

      {/* 4 thẻ thống kê */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border animate-pulse ${
                themeMode === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <StatsSection
          stats={[
            {
              label: "Khách hàng mới",
              value: stats.newCustomers,
              color: "bg-blue-500",
              icon: <Users size={20} />,
            },
            {
              label: "Đơn hàng",
              value: stats.totalOrders,
              color: "bg-green-500",
              icon: <ShoppingCart size={20} />,
            },
            {
              label: "Doanh thu",
              value: `${stats.revenue.toLocaleString("vi-VN")}₫`,
              color: "bg-purple-500",
              icon: <DollarSign size={20} />,
            },
            {
              label: "Lợi nhuận",
              value: `${stats.profit.toLocaleString("vi-VN")}₫`,
              color: "bg-orange-500",
              icon: <TrendingUp size={20} />,
            },
          ]}
        />
      )}

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ cột - Doanh thu */}
        <div
          className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h2
            className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-white" : "text-gray-700"
            }`}
          >
            Doanh thu theo{" "}
            {timeRangeOptions
              .find((option) => option.value === timeRange)
              ?.label.toLowerCase()}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeMode === "dark" ? "#4b5563" : "#e5e7eb"}
              />
              <XAxis
                dataKey="label"
                stroke={themeMode === "dark" ? "#9ca3af" : "#6b7280"}
                fontSize={12}
              />
              <YAxis
                stroke={themeMode === "dark" ? "#9ca3af" : "#6b7280"}
                fontSize={12}
              />
              <Tooltip
                formatter={(value) => [
                  `${value.toLocaleString("vi-VN")}₫`,
                  "Doanh thu",
                ]}
                contentStyle={{
                  backgroundColor: themeMode === "dark" ? "#1f2937" : "#ffffff",
                  borderColor: themeMode === "dark" ? "#4b5563" : "#e5e7eb",
                  color: themeMode === "dark" ? "#fff" : "#000",
                }}
              />
              <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ đường - Đơn hàng */}
        <div
          className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h2
            className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-white" : "text-gray-700"
            }`}
          >
            Số đơn hàng theo{" "}
            {timeRangeOptions
              .find((option) => option.value === timeRange)
              ?.label.toLowerCase()}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeMode === "dark" ? "#4b5563" : "#e5e7eb"}
              />
              <XAxis
                dataKey="label"
                stroke={themeMode === "dark" ? "#9ca3af" : "#6b7280"}
                fontSize={12}
              />
              <YAxis
                stroke={themeMode === "dark" ? "#9ca3af" : "#6b7280"}
                fontSize={12}
              />
              <Tooltip
                formatter={(value) => [value, "Đơn hàng"]}
                contentStyle={{
                  backgroundColor: themeMode === "dark" ? "#1f2937" : "#ffffff",
                  borderColor: themeMode === "dark" ? "#4b5563" : "#e5e7eb",
                  color: themeMode === "dark" ? "#fff" : "#000",
                }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ tròn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ tròn - Sản phẩm bán được theo danh mục */}
        <div
          className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h2
            className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-white" : "text-gray-700"
            }`}
          >
            Sản phẩm bán được theo danh mục
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [value, "Sản phẩm"]}
                contentStyle={{
                  backgroundColor: themeMode === "dark" ? "#1f2937" : "#ffffff",
                  borderColor: themeMode === "dark" ? "#4b5563" : "#e5e7eb",
                  color: themeMode === "dark" ? "#fff" : "#000",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ tròn - Doanh thu theo danh mục */}
        <div
          className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h2
            className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-white" : "text-gray-700"
            }`}
          >
            Doanh thu theo danh mục
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `${value.toLocaleString("vi-VN")}₫`,
                  "Doanh thu",
                ]}
                contentStyle={{
                  backgroundColor: themeMode === "dark" ? "#1f2937" : "#ffffff",
                  borderColor: themeMode === "dark" ? "#4b5563" : "#e5e7eb",
                  color: themeMode === "dark" ? "#fff" : "#000",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
