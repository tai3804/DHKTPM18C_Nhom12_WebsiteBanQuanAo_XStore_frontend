import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser, createUser } from "../../slices/UserSlice";
import { logoutUser } from "../../slices/AuthSlice";
import Header from "../../components/header/Header";
import { toast } from "react-toastify";
import AddUserForm from "./AddUserForm";

export default function ManageUsersPage() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  const { token, user } = useSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
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
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

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
      });
      dispatch(getUsers());
    } catch (err) {
      toast.error("Không thể tạo người dùng: " + err);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Customers Management
          </h1>
          <p className="text-gray-500 text-sm">Tổng quan Khách hàng hiện tại</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 hover:cursor-pointer transition"
        >
          + Add User
        </button>
      </div>

      {/* Danh sách users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                ID
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Last Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                First Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Date of Birth
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Phone
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Point
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                User Type
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                City
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Role
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="py-6 text-center text-gray-500">
                  Đang tải danh sách người dùng...
                </td>
              </tr>
            ) : users && users.length > 0 ? (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-700">{u.id}</td>
                  <td className="px-4 py-3 text-gray-700">{u.lastName}</td>
                  <td className="px-4 py-3 text-gray-700">{u.firstName}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {u.dob ? new Date(u.dob).toLocaleDateString() : "empty"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {u.email || "empty"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {u.phone || "empty"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.point || 0}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {u.userType || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {u.city || "empty"}
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
                      <button
                        onClick={() => dispatch(deleteUser(u.id))}
                        className="text-red-600 hover:text-red-800 text-sm hover:cursor-pointer"
                      >
                        Xóa
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="py-6 text-center text-gray-500">
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <AddUserForm
          formData={formData}
          handleChange={handleChange}
          handleAccountChange={handleAccountChange}
          handleCreateUser={handleCreateUser}
          setShowForm={setShowForm}
        />
      )}
    </div>
  );
}
