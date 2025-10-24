import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Dashboard() {
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
    // fetch("/api/admin/stats").then(...).then(setStats)
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Tổng quan hệ thống của bạn hôm nay</p>
      </div>

      {/* 4 thẻ thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Người dùng" value={stats.users} color="bg-blue-500" />
        <StatCard label="Sản phẩm" value={stats.products} color="bg-green-500" />
        <StatCard label="Đơn hàng" value={stats.orders} color="bg-yellow-500" />
        <StatCard
          label="Doanh thu"
          value={stats.revenue.toLocaleString("vi-VN") + "₫"}
          color="bg-purple-500"
        />
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Doanh thu 5 tháng gần đây</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString("vi-VN")}₫`} />
            <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-2xl font-bold mt-1 ${color} bg-clip-text text-transparent`}>
        {value}
      </span>
    </div>
  );
}
