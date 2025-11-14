import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { API_BASE_URL } from "../../config/api";
import { toast } from "react-toastify";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
  getWardsByProvinceCode,
} from "../../services/vnRegionAPI";

const DeliveryInfo = ({
  shipInfos = [],
  selectedShipInfoId,
  onSelectShipInfo,
  onShipInfosUpdate,
  loading,
}) => {
  const themeMode = useSelector(selectThemeMode);
  const { user } = useSelector((state) => state.auth);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingShipInfo, setEditingShipInfo] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // API data states
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Selected location codes for API calls
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [newShipInfo, setNewShipInfo] = useState({
    recipientName: "",
    recipientPhone: "",
    streetNumber: "",
    streetName: "",
    ward: "",
    district: "",
    city: "",
  });

  // Load provinces when component mounts
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const provincesData = await getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        toast.error("Lỗi tải danh sách tỉnh/thành phố");
      }
      setLoadingProvinces(false);
    };

    loadProvinces();
  }, []);

  // Load wards when province changes
  // Load districts when province is selected
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedProvinceCode) {
        console.log("Province code changed to:", selectedProvinceCode);

        // Find and log province details
        const selectedProvince = provinces.find(
          (p) => p.code === selectedProvinceCode
        );
        console.log("Selected province details:", selectedProvince);

        setLoadingDistricts(true);
        setDistricts([]); // Clear existing districts
        setWards([]); // Clear existing wards
        setSelectedDistrictCode(""); // Clear district selection

        try {
          const districtsData = await getDistrictsByProvinceCode(
            selectedProvinceCode
          );
          console.log("Districts data received:", districtsData);
          console.log("Number of districts found:", districtsData.length);

          setDistricts(districtsData);
          if (districtsData.length === 0) {
            toast.warn(
              `Không tìm thấy quận/huyện cho ${
                selectedProvince?.name || "tỉnh này"
              }`
            );
          }
        } catch (error) {
          console.error("Error loading districts:", error);
          toast.error("Lỗi tải danh sách quận/huyện");
        }
        setLoadingDistricts(false);
      } else {
        setDistricts([]);
        setWards([]);
        setSelectedDistrictCode("");
      }
    };

    loadDistricts();
  }, [selectedProvinceCode, provinces]);

  // Load wards when district is selected
  useEffect(() => {
    const loadWards = async () => {
      if (selectedDistrictCode) {
        console.log("District code changed to:", selectedDistrictCode);

        const selectedDistrict = districts.find(
          (d) => d.code === selectedDistrictCode
        );
        console.log("Selected district details:", selectedDistrict);

        setLoadingWards(true);
        setWards([]);

        try {
          const wardsData = await getWardsByDistrictCode(selectedDistrictCode);
          console.log("Wards data received:", wardsData);
          console.log("Number of wards found:", wardsData.length);

          setWards(wardsData);
          if (wardsData.length === 0) {
            toast.warn(
              `Không tìm thấy xã/phường cho ${
                selectedDistrict?.name || "quận/huyện này"
              }`
            );
          }
        } catch (error) {
          console.error("Error loading wards:", error);
          toast.error("Lỗi tải danh sách xã/phường");
        }
        setLoadingWards(false);
      } else {
        setWards([]);
      }
    };

    loadWards();
  }, [selectedDistrictCode, districts]);

  const handleCreateShipInfo = async () => {
    if (
      !newShipInfo.recipientName ||
      !newShipInfo.recipientPhone ||
      !newShipInfo.ward ||
      !newShipInfo.district ||
      !newShipInfo.city
    ) {
      toast.error(
        "Vui lòng điền đầy đủ thông tin bắt buộc (Tên, SĐT, Tỉnh/Thành phố, Quận/Huyện, Xã/Phường)"
      );
      return;
    }

    if (!/^0\d{9}$/.test(newShipInfo.recipientPhone)) {
      toast.error("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)");
      return;
    }

    setCreating(true);
    try {
      const isUpdate = editingShipInfo !== null;
      const url = isUpdate
        ? `${API_BASE_URL}/api/ship-infos/${editingShipInfo.id}`
        : `${API_BASE_URL}/api/ship-infos?userId=${user.id}`;

      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...newShipInfo,
          isDefault: !isUpdate && shipInfos.length === 0,
        }),
      });

      const data = await response.json();
      if (data.code === (isUpdate ? 200 : 201) || response.ok) {
        toast.success(
          isUpdate
            ? "Cập nhật địa chỉ thành công!"
            : "Thêm địa chỉ giao hàng thành công!"
        );
        setShowCreateForm(false);
        setEditingShipInfo(null);
        setNewShipInfo({
          recipientName: "",
          recipientPhone: "",
          streetNumber: "",
          streetName: "",
          ward: "",
          district: "",
          city: "",
        });
        onShipInfosUpdate();
      } else {
        toast.error(
          data.message ||
            (isUpdate ? "Lỗi cập nhật địa chỉ" : "Lỗi tạo địa chỉ giao hàng")
        );
      }
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteShipInfo = async (shipInfoId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      return;
    }

    setDeleting(shipInfoId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ship-infos/${shipInfoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Xóa địa chỉ thành công!");
        onShipInfosUpdate();
        // If the deleted address was selected, clear selection
        if (selectedShipInfoId === shipInfoId) {
          onSelectShipInfo(null);
        }
      } else {
        const data = await response.json();
        toast.error(data.message || "Lỗi xóa địa chỉ");
      }
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div
      className={`p-6 rounded-lg border transition-colors ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-4 ${
          themeMode === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Địa chỉ giao hàng
      </h3>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p
            className={themeMode === "dark" ? "text-gray-400" : "text-gray-500"}
          >
            Đang tải địa chỉ...
          </p>
        </div>
      ) : (
        <>
          {/* Existing Ship Infos */}
          {shipInfos.length > 0 ? (
            <div className="space-y-3 mb-4">
              {shipInfos.map((shipInfo) => (
                <div
                  key={shipInfo.id}
                  onClick={() => onSelectShipInfo(shipInfo.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedShipInfoId === shipInfo.id
                      ? themeMode === "dark"
                        ? "border-emerald-500 bg-emerald-900/20"
                        : "border-emerald-500 bg-emerald-50"
                      : themeMode === "dark"
                      ? "border-gray-600 hover:border-gray-500 bg-gray-700/30"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">
                          {shipInfo.recipientName}
                        </span>
                        {shipInfo.isDefault && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm mb-1 ${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {shipInfo.recipientPhone}
                      </p>
                      <p
                        className={`text-sm ${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {shipInfo.streetNumber && `${shipInfo.streetNumber} `}
                        {shipInfo.streetName && `${shipInfo.streetName}, `}
                        {shipInfo.ward && `${shipInfo.ward}, `}
                        {shipInfo.district}, {shipInfo.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Edit Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingShipInfo(shipInfo);
                          setNewShipInfo({
                            recipientName: shipInfo.recipientName,
                            recipientPhone: shipInfo.recipientPhone,
                            streetNumber: shipInfo.streetNumber || "",
                            streetName: shipInfo.streetName || "",
                            ward: shipInfo.ward || "",
                            district: shipInfo.district,
                            city: shipInfo.city,
                          });
                          setShowCreateForm(true);
                        }}
                        className={`p-1.5 rounded-full transition-colors ${
                          themeMode === "dark"
                            ? "hover:bg-blue-600/20 text-blue-400"
                            : "hover:bg-blue-50 text-blue-500"
                        }`}
                        title="Chỉnh sửa địa chỉ"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>

                      {/* Delete Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteShipInfo(shipInfo.id);
                        }}
                        disabled={deleting === shipInfo.id}
                        className={`p-1.5 rounded-full transition-colors ${
                          deleting === shipInfo.id
                            ? "opacity-50 cursor-not-allowed"
                            : themeMode === "dark"
                            ? "hover:bg-red-600/20 text-red-400"
                            : "hover:bg-red-50 text-red-500"
                        }`}
                        title="Xóa địa chỉ"
                      >
                        {deleting === shipInfo.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c-1 0-2 1-2 2v2"></path>
                            <line x1="10" x2="10" y1="11" y2="17"></line>
                            <line x1="14" x2="14" y1="11" y2="17"></line>
                          </svg>
                        )}
                      </button>

                      {selectedShipInfoId === shipInfo.id && (
                        <div className="text-emerald-500 text-sm font-bold ml-2">
                          Đã chọn
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-6 mb-4 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Chưa có địa chỉ giao hàng nào
            </div>
          )}

          {/* Add New Address Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-3 border-2 border-dashed border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            Thêm địa chỉ giao hàng mới
          </button>
        </>
      )}

      {/* Modal Overlay */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className={`relative w-full max-w-3xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl border ${
              themeMode === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Header */}
            <div
              className={`sticky top-0 px-8 py-6 border-b backdrop-blur-sm ${
                themeMode === "dark"
                  ? "bg-gray-800/95 border-gray-700"
                  : "bg-white/95 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      themeMode === "dark"
                        ? "bg-emerald-600/20 text-emerald-400"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {editingShipInfo
                        ? "Chỉnh sửa địa chỉ giao hàng"
                        : "Thêm địa chỉ giao hàng mới"}
                    </h3>
                    <p
                      className={`text-sm ${
                        themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {editingShipInfo
                        ? "Cập nhật thông tin giao hàng"
                        : "Điền thông tin để thêm địa chỉ mới"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingShipInfo(null);
                    setNewShipInfo({
                      recipientName: "",
                      recipientPhone: "",
                      streetNumber: "",
                      streetName: "",
                      ward: "",
                      district: "",
                      city: "",
                    });
                    setSelectedProvinceCode("");
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    themeMode === "dark"
                      ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="px-8 py-6">
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h4
                      className={`text-lg font-semibold mb-4 ${
                        themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Thông tin người nhận
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          className={`text-sm font-medium ${
                            themeMode === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Tên người nhận <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newShipInfo.recipientName}
                          onChange={(e) =>
                            setNewShipInfo((prev) => ({
                              ...prev,
                              recipientName: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            themeMode === "dark"
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                          placeholder="Nhập tên người nhận"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className={`text-sm font-medium ${
                            themeMode === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={newShipInfo.recipientPhone}
                          onChange={(e) =>
                            setNewShipInfo((prev) => ({
                              ...prev,
                              recipientPhone: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            themeMode === "dark"
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          }`}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h4
                      className={`text-lg font-semibold mb-4 ${
                        themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Địa chỉ giao hàng
                    </h4>
                    <div className="space-y-4">
                      {/* Province Selection */}
                      <div className="space-y-2">
                        <label
                          className={`text-sm font-medium ${
                            themeMode === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedProvinceCode}
                          onChange={(e) => {
                            const selectedCode = e.target.value;
                            setSelectedProvinceCode(selectedCode);
                            setSelectedDistrictCode(""); // Clear district selection
                            setNewShipInfo((prev) => ({
                              ...prev,
                              city:
                                provinces.find((p) => p.code === selectedCode)
                                  ?.name || "",
                              district: "",
                              ward: "",
                            }));
                          }}
                          disabled={loadingProvinces}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 ${
                            themeMode === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        >
                          <option
                            value=""
                            disabled={selectedProvinceCode !== ""}
                          >
                            {loadingProvinces
                              ? "Đang tải..."
                              : "Chọn Tỉnh/Thành phố"}
                          </option>
                          {provinces.map((province) => {
                            return (
                              <option key={province.code} value={province.code}>
                                {province.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* District Selection */}
                      <div className="space-y-2">
                        <label
                          className={`text-sm font-medium ${
                            themeMode === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Quận/Huyện <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedDistrictCode}
                          onChange={(e) => {
                            const selectedCode = e.target.value;
                            setSelectedDistrictCode(selectedCode);
                            setNewShipInfo((prev) => ({
                              ...prev,
                              district:
                                districts.find((d) => d.code === selectedCode)
                                  ?.name || "",
                              ward: "",
                            }));
                          }}
                          disabled={!selectedProvinceCode || loadingDistricts}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 ${
                            themeMode === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        >
                          <option
                            value=""
                            disabled={selectedDistrictCode !== ""}
                          >
                            {loadingDistricts
                              ? "Đang tải..."
                              : "Chọn Quận/Huyện"}
                          </option>
                          {districts.map((district) => (
                            <option key={district.code} value={district.code}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Ward Selection */}
                      <div className="space-y-2">
                        <label
                          className={`text-sm font-medium ${
                            themeMode === "dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Xã/Phường <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={newShipInfo.ward}
                          onChange={(e) => {
                            setNewShipInfo((prev) => ({
                              ...prev,
                              ward: e.target.value,
                            }));
                          }}
                          disabled={!selectedDistrictCode || loadingWards}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                            themeMode === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        >
                          <option value="" disabled={newShipInfo.ward !== ""}>
                            {loadingWards ? "Đang tải..." : "Chọn Xã/Phường"}
                          </option>
                          {wards.map((ward) => (
                            <option key={ward.code} value={ward.name}>
                              {ward.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Street Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            className={`text-sm font-medium ${
                              themeMode === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            Số nhà
                          </label>
                          <input
                            type="text"
                            value={newShipInfo.streetNumber}
                            onChange={(e) =>
                              setNewShipInfo((prev) => ({
                                ...prev,
                                streetNumber: e.target.value,
                              }))
                            }
                            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                              themeMode === "dark"
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            }`}
                            placeholder="Nhập số nhà"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            className={`text-sm font-medium ${
                              themeMode === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            Tên đường
                          </label>
                          <input
                            type="text"
                            value={newShipInfo.streetName}
                            onChange={(e) =>
                              setNewShipInfo((prev) => ({
                                ...prev,
                                streetName: e.target.value,
                              }))
                            }
                            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                              themeMode === "dark"
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            }`}
                            placeholder="Nhập tên đường"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`sticky bottom-0 px-8 py-6 border-t backdrop-blur-sm ${
                themeMode === "dark"
                  ? "bg-gray-800/95 border-gray-700"
                  : "bg-white/95 border-gray-200"
              }`}
            >
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingShipInfo(null);
                    setNewShipInfo({
                      recipientName: "",
                      recipientPhone: "",
                      streetNumber: "",
                      streetName: "",
                      ward: "",
                      district: "",
                      city: "",
                    });
                    setSelectedProvinceCode("");
                    setSelectedDistrictCode("");
                    setDistricts([]);
                    setWards([]);
                  }}
                  className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                    themeMode === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCreateShipInfo}
                  disabled={creating}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                >
                  {creating && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {creating
                    ? "Đang lưu..."
                    : editingShipInfo
                    ? "Cập nhật địa chỉ"
                    : "Lưu địa chỉ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryInfo;
