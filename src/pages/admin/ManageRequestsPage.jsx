import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { API_BASE_URL } from "../../config/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Edit,
} from "lucide-react";
import SearchBar from "../../components/admin/SearchBar";

export default function ManageRequestsPage() {
  const themeMode = useSelector(selectThemeMode);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [showAdminNoteModal, setShowAdminNoteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNoteAction, setAdminNoteAction] = useState(""); // "approve" or "reject"
  const [adminNote, setAdminNote] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteValue, setEditNoteValue] = useState("");

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, []);

  useEffect(() => {
    let filtered = requests;

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let startDate;

      switch (dateFilter) {
        case "today":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered.filter(
          (request) => new Date(request.createdAt) >= startDate
        );
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (request) =>
          request.id.toString().includes(searchQuery.toLowerCase()) ||
          (request.order?.id &&
            request.order.id.toString().includes(searchQuery.toLowerCase())) ||
          getTypeText(request.type)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          getStatusText(request.status)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [requests, searchQuery, dateFilter]);

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

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data.result || []);
      } else {
        toast.error("Lỗi khi tải danh sách yêu cầu");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách yêu cầu");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/requests/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.result || {});
      } else {
        toast.error("Lỗi khi tải thống kê");
      }
    } catch (error) {
      toast.error("Lỗi khi tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Search is now handled in useEffect
  };

  const openAdminNoteModal = (request, action) => {
    setSelectedRequest(request);
    setAdminNoteAction(action);
    setAdminNote("");
    setShowAdminNoteModal(true);
  };

  const handleAdminNoteSubmit = () => {
    if (!selectedRequest) return;

    const status = adminNoteAction === "approve" ? "APPROVED" : "REJECTED";
    updateRequestStatus(selectedRequest.id, status, adminNote);
    setShowAdminNoteModal(false);
    setSelectedRequest(null);
    setAdminNoteAction("");
    setAdminNote("");
  };

  const updateRequestStatus = async (id, status, adminNote = "") => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/requests/${id}/status?status=${status}&adminNote=${encodeURIComponent(
          adminNote
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Cập nhật yêu cầu thành công");
        fetchRequests();
        fetchStats();
      } else {
        toast.error("Lỗi khi cập nhật yêu cầu");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật yêu cầu");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "APPROVED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "APPROVED":
        return "Đã chấp nhận";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "CANCEL":
        return "Hủy đơn";
      case "RETURN":
        return "Đổi/trả";
      default:
        return type;
    }
  };

  const timeRangeOptions = [
    { value: "all", label: "Tất cả thời gian" },
    { value: "today", label: "Hôm nay" },
    { value: "week", label: "Tuần này" },
    { value: "month", label: "Tháng này" },
    { value: "year", label: "Năm nay" },
  ];

  const toggleRowExpansion = (requestId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(requestId)) {
      newExpandedRows.delete(requestId);
    } else {
      newExpandedRows.add(requestId);
    }
    setExpandedRows(newExpandedRows);
  };

  const startEditingNote = (request) => {
    setEditingNote(request.id);
    setEditNoteValue(request.adminNote || "");
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setEditNoteValue("");
  };

  const saveNote = async (requestId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/requests/${requestId}/status?status=${null}&adminNote=${encodeURIComponent(
          editNoteValue
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Cập nhật ghi chú thành công");
        fetchRequests();
        setEditingNote(null);
        setEditNoteValue("");
      } else {
        toast.error("Lỗi khi cập nhật ghi chú");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật ghi chú");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
          to="/admin/requests"
          className={`hover:underline cursor-pointer transition-colors ${
            themeMode === "dark"
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Yêu cầu khách hàng
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
            Quản lý yêu cầu khách hàng
          </h1>
          <p
            className={`text-sm transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Tổng quan các yêu cầu hủy/đổi trả từ khách hàng
          </p>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Tìm kiếm theo ID, đơn hàng, loại hoặc trạng thái..."
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
                timeRangeOptions.find((option) => option.value === dateFilter)
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
                      setDateFilter(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "text-gray-100 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                    } ${
                      dateFilter === option.value
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

      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tổng yêu cầu"
          value={stats.totalRequests || 0}
          color="bg-blue-500"
          icon={<BarChart3 size={20} />}
        />
        <StatCard
          label="Yêu cầu mới"
          value={stats.pendingRequests || 0}
          color="bg-yellow-500"
          icon={<Clock size={20} />}
        />
        <StatCard
          label="Đã chấp nhận"
          value={stats.approvedRequests || 0}
          color="bg-green-500"
          icon={<CheckCircle size={20} />}
        />
        <StatCard
          label="Đã từ chối"
          value={stats.rejectedRequests || 0}
          color="bg-red-500"
          icon={<XCircle size={20} />}
        />
      </div>

      {/* Bảng danh sách yêu cầu */}
      <div
        className={`rounded-xl shadow-sm border overflow-x-auto transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <table className="w-full text-left border-collapse">
          <thead
            className={`border-b transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <tr>
              <th className="px-2 py-3 w-10"></th>
              <th
                className={`px-2 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                ID
              </th>
              <th
                className={`px-2 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Đơn hàng
              </th>
              <th
                className={`px-2 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Ngày tạo
              </th>
              <th
                className={`px-2 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Loại
              </th>
              <th
                className={`px-2 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Trạng thái
              </th>
              <th
                className={`px-2 py-3 text-sm font-semibold transition-colors duration-300 text-right ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className={`py-6 text-center transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Đang tải danh sách yêu cầu...
                </td>
              </tr>
            ) : filteredRequests && filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <tr
                    className={`border-b hover:transition cursor-pointer transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleRowExpansion(request.id)}
                  >
                    <td className="px-2 py-3">
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedRows.has(request.id) ? "rotate-90" : ""
                        }`}
                      />
                    </td>
                    <td
                      className={`px-2 py-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {request.id}
                    </td>
                    <td
                      className={`px-2 py-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      #{request.order?.id}
                    </td>
                    <td
                      className={`px-2 py-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td
                      className={`px-2 py-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {getTypeText(request.type)}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span
                          className={`transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right space-x-2">
                      {request.status === "PENDING" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openAdminNoteModal(request, "approve");
                            }}
                            className="text-green-600 hover:text-green-800 transition cursor-pointer mr-2"
                            title="Chấp nhận yêu cầu"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openAdminNoteModal(request, "reject");
                            }}
                            className="text-red-600 hover:text-red-800 transition cursor-pointer"
                            title="Từ chối yêu cầu"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      {request.status !== "PENDING" && (
                        <span
                          className={`transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-500"
                              : "text-gray-500"
                          }`}
                        >
                          Đã xử lý
                        </span>
                      )}
                    </td>
                  </tr>
                  {expandedRows.has(request.id) && (
                    <tr
                      className={`transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "bg-gray-750 border-gray-700"
                          : "bg-gray-25 border-gray-100"
                      }`}
                    >
                      <td colSpan="7" className="px-2 py-4">
                        <div className="pl-6 space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Tên khách hàng:
                              </span>
                              <p
                                className={`mt-1 transition-colors duration-300 ${
                                  themeMode === "dark"
                                    ? "text-gray-200"
                                    : "text-gray-800"
                                }`}
                              >
                                {request.order?.user?.firstName &&
                                request.order?.user?.lastName
                                  ? `${request.order.user.firstName} ${request.order.user.lastName}`
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Số điện thoại:
                              </span>
                              <p
                                className={`mt-1 transition-colors duration-300 ${
                                  themeMode === "dark"
                                    ? "text-gray-200"
                                    : "text-gray-800"
                                }`}
                              >
                                {request.order?.user?.phone || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Lý do:
                            </span>
                            <p
                              className={`mt-1 transition-colors duration-300 ${
                                themeMode === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-700"
                              }`}
                            >
                              {request.reason || "Không có lý do"}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Ghi chú admin:
                              </span>
                              {editingNote === request.id ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => saveNote(request.id)}
                                    className="text-green-600 hover:text-green-800 transition cursor-pointer"
                                    title="Lưu"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button
                                    onClick={cancelEditingNote}
                                    className="text-red-600 hover:text-red-800 transition cursor-pointer"
                                    title="Hủy"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditingNote(request)}
                                  className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                                  title="Chỉnh sửa ghi chú"
                                >
                                  <Edit size={16} />
                                </button>
                              )}
                            </div>
                            {editingNote === request.id ? (
                              <textarea
                                value={editNoteValue}
                                onChange={(e) =>
                                  setEditNoteValue(e.target.value)
                                }
                                className={`mt-1 w-full px-3 py-2 border rounded-lg resize-none transition-colors duration-300 ${
                                  themeMode === "dark"
                                    ? "border-gray-600 bg-gray-700 text-gray-100"
                                    : "border-gray-300 bg-white text-gray-900"
                                }`}
                                rows={2}
                                placeholder="Nhập ghi chú..."
                              />
                            ) : (
                              <p
                                className={`mt-1 transition-colors duration-300 ${
                                  themeMode === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-700"
                                }`}
                              >
                                {request.adminNote || "Chưa có ghi chú"}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className={`py-6 text-center transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {searchQuery
                    ? "Không tìm thấy yêu cầu nào khớp với tìm kiếm."
                    : "Không có yêu cầu nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Note Modal */}
      {showAdminNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg border max-w-md w-full mx-4 ${
              themeMode === "dark"
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">
              {adminNoteAction === "approve"
                ? "Xác nhận chấp nhận yêu cầu"
                : "Xác nhận từ chối yêu cầu"}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {adminNoteAction === "approve"
                  ? "Ghi chú admin (tùy chọn):"
                  : "Lý do từ chối:"}
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder={
                  adminNoteAction === "approve"
                    ? "Nhập ghi chú cho việc chấp nhận..."
                    : "Nhập lý do từ chối..."
                }
                className={`w-full px-3 py-2 border rounded-lg resize-none ${
                  themeMode === "dark"
                    ? "border-gray-600 bg-gray-700 text-gray-100"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
                rows={4}
                required={adminNoteAction === "reject"}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAdminNoteModal(false)}
                className={`px-4 py-2 border rounded-lg ${
                  themeMode === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Hủy
              </button>
              <button
                onClick={handleAdminNoteSubmit}
                disabled={adminNoteAction === "reject" && !adminNote.trim()}
                className={`px-4 py-2 rounded-lg text-white ${
                  adminNoteAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {adminNoteAction === "approve" ? "Chấp nhận" : "Từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  const themeMode = useSelector(selectThemeMode);
  return (
    <div
      className={`p-4 rounded-xl shadow-sm border transition-colors duration-300 flex flex-col items-start flex-1 ${
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
