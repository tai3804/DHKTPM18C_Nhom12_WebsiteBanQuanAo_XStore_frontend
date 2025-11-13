import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { API_BASE_URL } from "../../config/api";

export default function Dashboard() {
  const themeMode = useSelector(selectThemeMode);
  const [stats, setStats] = useState({
    users: 120,
    products: 58,
    orders: 34,
    revenue: 8450000,
  });

  const [chartData, setChartData] = useState([
    { month: "Jan", revenue: 2000000 },
    { month: "Feb", revenue: 1800000 },
    { month: "Mar", revenue: 2200000 },
    { month: "Apr", revenue: 2600000 },
    { month: "May", revenue: 2400000 },
  ]);

  useEffect(() => {
    // 🔸 Giả lập fetch dữ liệu từ API backend
    // fetch(`${API_BASE_URL}/api/admin/stats`).then(...).then(setStats)
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-bold transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Dashboard Overview
        </h1>
        <p
          className={`text-sm transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Tổng quan hệ thống của bạn hôm nay
        </p>
      </div>

      {/* 4 thẻ thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Người dùng" value={stats.users} color="bg-blue-500" />
        <StatCard
          label="Sản phẩm"
          value={stats.products}
          color="bg-green-500"
        />
        <StatCard label="Đơn hàng" value={stats.orders} color="bg-yellow-500" />
        <StatCard
          label="Doanh thu"
          value={stats.revenue.toLocaleString("vi-VN") + "₫"}
          color="bg-purple-500"
        />
      </div>

      {/* Biểu đồ doanh thu */}
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
          Doanh thu 5 tháng gần đây
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={themeMode === "dark" ? "#4b5563" : "#e5e7eb"}
            />
            <XAxis
              dataKey="month"
              stroke={themeMode === "dark" ? "#9ca3af" : "#9ca3af"}
            />
            <YAxis stroke={themeMode === "dark" ? "#9ca3af" : "#9ca3af"} />
            <Tooltip
              formatter={(value) => `${value.toLocaleString("vi-VN")}₫`}
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
    </div>
  );
}

function StatCard({ label, value, color }) {
  const themeMode = useSelector(selectThemeMode);
  return (
    <div
      className={`p-4 rounded-xl shadow-sm border transition-colors duration-300 flex flex-col items-start ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100"
      }`}
    >
      <span
        className={`text-sm transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-2xl font-bold mt-1 ${color} bg-clip-text text-transparent`}
      >
        {value}
      </span>
    </div>
  );
}
