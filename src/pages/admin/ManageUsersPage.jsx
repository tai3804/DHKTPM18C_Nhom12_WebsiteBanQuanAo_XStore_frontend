import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../../slices/UserSlice";

export default function ManageUsersPage() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.loading);
  const { token } = useSelector((state) => state.auth.user?.account || {});

  // Fetch danh sách users khi component mount
  useEffect(() => {
    dispatch(getUsers(token));
  }, [dispatch, token]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
          <p className="text-gray-500 text-sm">Xem, chỉnh sửa và quản lý tài khoản người dùng</p>
        </div>

        <button
          onClick={() => alert("Form tạo user sẽ được thêm sau 😎")}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          + Thêm user
        </button>
      </div>

      {/* Danh sách users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Username</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">First Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Last Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Phone</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Point</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">User Type</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">City</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Role</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right">Hành động</th>
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
                  <td className="px-4 py-3 text-gray-700 font-medium">{u.account.username}</td>
                  <td className="px-4 py-3 text-gray-700">{u.firstName}</td>
                  <td className="px-4 py-3 text-gray-700">{u.lastName}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email || "empty"}</td>
                  <td className="px-4 py-3 text-gray-600">{u.phone || "empty"}</td>
                  <td className="px-4 py-3 text-gray-600">{u.point || 0}</td>
                  <td className="px-4 py-3 text-gray-600">{u.userType || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-600">{u.city || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        u.account.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.account.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => dispatch(deleteUser({ id: u.id, token }))}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Xóa
                    </button>
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
    </div>
  );
}
