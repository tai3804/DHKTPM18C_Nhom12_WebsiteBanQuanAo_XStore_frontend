import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Trash2,
  Edit,
  Users,
  UserPlus,
  Calendar,
  ChevronDown,
} from "lucide-react";
import {
  getUsers,
  deleteUser,
  createUser,
  updateUser,
} from "../../slices/UserSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { Link } from "react-router-dom";
import AddUserForm from "../../components/admin/AddUserForm";
import EditUserForm from "../../components/admin/EditUserForm";
import FormInput from "../../components/admin/FormInput";
import SearchBar from "../../components/admin/SearchBar";

export default function ManageUsersPage() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const themeMode = useSelector(selectThemeMode);

  const [timeRange, setTimeRange] = useState("month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newCustomers: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    account: {
      username: "",
      password: "",
      role: "CUSTOMER",
    },
    email: "",
    firstName: "",
    lastName: "",
    dob: "",
    userType: "COPPER",
  });
  const [editFormData, setEditFormData] = useState({
    account: {
      role: "CUSTOMER",
    },
    point: 0,
    userType: "COPPER",
  });

  // ✅ Update các field bình thường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Update các field trong account
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        [name]: value,
      },
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    console.log("Form data being sent:", formData); // Debug log

    try {
      await dispatch(createUser(formData)).unwrap();
      toast.success("Tạo người dùng thành công!");
      setShowForm(false);
      setFormData({
        account: { username: "", password: "", role: "CUSTOMER" },
        email: "",
        firstName: "",
        lastName: "",
        dob: "",
        userType: "COPPER",
      });
      dispatch(getUsers());
    } catch (err) {
      console.error("Error creating user:", err); // Debug log
      toast.error(err);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      account: {
        role: user.account?.role || "CUSTOMER",
      },
      point: user.point || 0,
      userType: user.userType || "COPPER",
    });
    setShowEditForm(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("Xóa người dùng thành công!");
      dispatch(getUsers());
    } catch (err) {
      toast.error(err);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    console.log("Form data being sent for update:", editFormData); // Debug log

    try {
      await dispatch(
        updateUser({ id: editingUser.id, userData: editFormData })
      ).unwrap();
      toast.success("Cập nhật người dùng thành công!");
      setShowEditForm(false);
      dispatch(getUsers());
    } catch (err) {
      console.error("Error updating user:", err); // Debug log
      toast.error(err);
    }
  };

  // ✅ Update các field cho edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Update các field trong account cho edit form
  const handleEditAccountChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        [name]: value,
      },
    }));
  };

  // 🔍 Filter users dựa trên searchQuery
  const filteredUsers = users?.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.account?.username?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.firstName?.toLowerCase().includes(query) ||
      u.lastName?.toLowerCase().includes(query) ||
      u.phone?.toLowerCase().includes(query)
    );
  });

  const timeRangeOptions = [
    { value: "day", label: "Theo ngày" },
    { value: "month", label: "Theo tháng" },
    { value: "year", label: "Theo năm" },
  ];

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

    // Tính tổng số khách hàng
    const totalCustomers = users.length;

    // Tính khách hàng mới trong khoảng thời gian
    const newCustomers = users.filter((user) => {
      // Sử dụng createdAt nếu có, nếu không có thì user đó được tạo trước khi có createdAt
      if (!user.createdAt) {
        return false; // Bỏ qua user không có createdAt (user cũ)
      }
      const userCreated = new Date(user.createdAt);
      return userCreated >= startDate && userCreated < endDate;
    }).length;

    setStats({
      totalCustomers,
      newCustomers,
    });
  };

  useEffect(() => {
    if (users.length > 0) {
      calculateStats(timeRange);
    }
  }, [users, timeRange]);

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
          to="/admin/users"
          className={`hover:underline cursor-pointer transition-colors ${
            themeMode === "dark"
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Người dùng
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
            Quản lý người dùng
          </h1>
          <p
            className={`text-sm transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Tổng quan các khách hàng hiện có
          </p>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Tìm kiếm theo tên, email, username, SĐT..."
              onClear={() => setSearchQuery("")}
            />
          </div>
        </div>

        {/* Dropdown chọn khoảng thời gian */}
        <div className="flex items-center gap-4">
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

          <button
            onClick={() => setShowForm(true)}
            className={`px-4 py-2 text-white text-sm rounded-lg transition cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
              themeMode === "dark"
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            + Thêm người dùng
          </button>
        </div>
      </div>
      {/* Thống kê */}
      <div className="flex gap-6">
        <StatCard
          label="Tổng khách hàng"
          value={stats.totalCustomers}
          color="bg-blue-500"
          icon={<Users size={20} />}
        />
        <StatCard
          label={`Khách hàng mới ${timeRangeOptions
            .find((option) => option.value === timeRange)
            ?.label.toLowerCase()}`}
          value={stats.newCustomers}
          color="bg-green-500"
          icon={<UserPlus size={20} />}
        />
      </div>{" "}
      {/* Bảng danh sách người dùng */}
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
                Họ
              </th>
              <th
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Tên
              </th>

              <th
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Email
              </th>
              <th
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                SĐT
              </th>
              <th
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Điểm
              </th>
              <th
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Loại người dùng
              </th>
              <th
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Vai trò
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
                  colSpan="11"
                  className={`py-6 text-center transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Đang tải danh sách người dùng...
                </td>
              </tr>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
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
                    {u.id}
                  </td>
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {u.lastName}
                  </td>
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {u.firstName}
                  </td>
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {u.email || "Trống"}
                  </td>
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {u.phone || "Trống"}
                  </td>
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {u.point || 0}
                  </td>
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {u.userType === "COPPER"
                      ? "Đồng"
                      : u.userType === "SILVER"
                      ? "Bạc"
                      : u.userType === "GOLD"
                      ? "Vàng"
                      : u.userType === "PLATINUM"
                      ? "Bạch kim"
                      : u.userType || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        u.account?.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.account?.role || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {user?.id !== u.id && (
                      <>
                        <button
                          onClick={() => handleEditUser(u)}
                          className="text-blue-600 hover:text-blue-800 transition cursor-pointer mr-2"
                          title="Chỉnh sửa người dùng"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-600 hover:text-red-800 transition cursor-pointer"
                          title="Xóa người dùng"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className={`py-6 text-center transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {searchQuery
                    ? "Không tìm thấy người dùng nào khớp với tìm kiếm."
                    : "Không có người dùng nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal Form thêm người dùng */}
      {showForm && (
        <AddUserForm
          formData={formData}
          handleChange={handleChange}
          handleAccountChange={handleAccountChange}
          handleCreateUser={handleCreateUser}
          setShowForm={setShowForm}
        />
      )}
      {/* Modal Form chỉnh sửa người dùng */}
      {showEditForm && (
        <EditUserForm
          user={editingUser}
          formData={editFormData}
          handleChange={handleEditChange}
          handleAccountChange={handleEditAccountChange}
          handleUpdateUser={handleUpdateUser}
          setShowForm={setShowEditForm}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  const themeMode = useSelector(selectThemeMode);
  return (
    <div
      className={`w-80 p-4 rounded-xl shadow-sm border transition-colors duration-300 flex flex-col items-start ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <div className="text-white">{icon}</div>
        </div>
        <span
          className={`text-sm font-medium transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </span>
      </div>
      <span
        className={`text-2xl font-bold transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
