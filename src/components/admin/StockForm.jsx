import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStock, updateStock } from "../../slices/StockSlice";
import { toast } from "react-toastify";
import { selectThemeMode } from "../../slices/ThemeSlice";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "../../services/vnRegionAPI";

const StockForm = ({ stock, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      streetNumber: "",
      streetName: "",
      ward: "",
      district: "",
      city: "",
    },
  });

  // Address selection states
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const modalRef = useRef(null);
  const isEditMode = !!stock;

  // Set data khi mở form
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: stock.name || "",
        email: stock.email || "",
        phone: stock.phone || "",
        address: {
          streetNumber: stock.address?.streetNumber || "",
          streetName: stock.address?.streetName || "",
          ward: stock.address?.ward || "",
          district: stock.address?.district || "",
          city: stock.address?.city || "",
        },
      });
      // Set selected values for address dropdowns
      setSelectedProvince(stock.address?.provinceCode || "");
      setSelectedDistrict(stock.address?.districtCode || "");
      setSelectedWard(stock.address?.wardCode || "");
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: {
          streetNumber: "",
          streetName: "",
          ward: "",
          district: "",
          city: "",
        },
      });
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [stock, isEditMode]);

  // Click ngoài modal đóng
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  // Load provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const provincesData = await getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error("Error loading provinces:", error);
        toast.error("Không thể tải danh sách tỉnh/thành phố");
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const loadDistricts = async () => {
        setLoadingDistricts(true);
        setDistricts([]);
        setWards([]);
        setSelectedDistrict("");
        setSelectedWard("");
        try {
          const districtsData = await getDistrictsByProvinceCode(
            selectedProvince
          );
          setDistricts(districtsData);
        } catch (error) {
          console.error("Error loading districts:", error);
          toast.error("Không thể tải danh sách quận/huyện");
        } finally {
          setLoadingDistricts(false);
        }
      };
      loadDistricts();
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince]);

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const loadWards = async () => {
        setLoadingWards(true);
        setWards([]);
        setSelectedWard("");
        try {
          const wardsData = await getWardsByDistrictCode(selectedDistrict);
          setWards(wardsData);
        } catch (error) {
          console.error("Error loading wards:", error);
          toast.error("Không thể tải danh sách phường/xã");
        } finally {
          setLoadingWards(false);
        }
      };
      loadWards();
    } else {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "streetName") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          streetName: value,
        },
      }));
    } else if (name === "streetNumber") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          streetNumber: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    const provinceName =
      provinces.find((p) => p.code === provinceCode)?.name || "";
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city: provinceName,
      },
    }));
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    const districtName =
      districts.find((d) => d.code === districtCode)?.name || "";
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        district: districtName,
      },
    }));
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    setSelectedWard(wardCode);
    const wardName = wards.find((w) => w.code === wardCode)?.name || "";
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        ward: wardName,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Tên kho không được để trống!");
      return;
    }

    const action = isEditMode
      ? updateStock({ id: stock.id, stockData: formData })
      : createStock(formData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          `Kho đã được ${isEditMode ? "cập nhật" : "tạo"} thành công!`
        );
        onSuccess();
      })
      .catch((err) => {
        toast.error(
          `Lỗi khi ${isEditMode ? "cập nhật" : "tạo"} kho: ${err.message}`
        );
      });
  };

  const inputClass = `w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
    themeMode === "dark"
      ? "border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-gray-400"
      : "border-gray-300 bg-white text-gray-900 focus:ring-gray-800"
  }`;

  const buttonCancelClass = `px-5 py-2 rounded-lg border transition cursor-pointer ${
    themeMode === "dark"
      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
      : "border-gray-200 text-gray-600 hover:bg-gray-100"
  }`;

  const buttonSubmitClass = `px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer font-medium`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className={`rounded-2xl p-8 w-full max-w-md shadow-xl border animate-fadeIn transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <h2
          className={`text-2xl font-bold text-center pb-4 mb-6 border-b transition-colors duration-300 ${
            themeMode === "dark"
              ? "text-gray-100 border-gray-700"
              : "text-gray-800 border-gray-200"
          }`}
        >
          {isEditMode ? "Chỉnh sửa thông tin kho" : "Thêm kho mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`text-sm mb-1 block transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Tên kho
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên kho..."
              className={inputClass}
              required
            />
          </div>
          <div>
            <label
              className={`text-sm mb-1 block transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email kho..."
              className={inputClass}
              required
            />
          </div>
          <div>
            <label
              className={`text-sm mb-1 block transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
              className={inputClass}
              required
            />
          </div>
          <div>
            <label
              className={`text-sm mb-1 block transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Tỉnh/Thành phố
            </label>
            <select
              name="province"
              value={selectedProvince}
              onChange={handleProvinceChange}
              className={inputClass}
              required
              disabled={loadingProvinces}
            >
              <option value="">
                {loadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"}
              </option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`text-sm mb-1 block transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Quận/Huyện
            </label>
            <select
              name="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className={inputClass}
              required
              disabled={!selectedProvince || loadingDistricts}
            >
              <option value="">
                {loadingDistricts
                  ? "Đang tải..."
                  : selectedProvince
                  ? "Chọn quận/huyện"
                  : "Chọn tỉnh/thành phố trước"}
              </option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`text-sm mb-1 block transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Phường/Xã
            </label>
            <select
              name="ward"
              value={selectedWard}
              onChange={handleWardChange}
              className={inputClass}
              required
              disabled={!selectedDistrict || loadingWards}
            >
              <option value="">
                {loadingWards
                  ? "Đang tải..."
                  : selectedDistrict
                  ? "Chọn phường/xã"
                  : "Chọn quận/huyện trước"}
              </option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`text-sm mb-1 block transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Số nhà
            </label>
            <input
              type="text"
              name="streetNumber"
              value={formData.address.streetNumber}
              onChange={handleChange}
              placeholder="Nhập số nhà..."
              className={inputClass}
              required
            />
          </div>
          <div>
            <label
              className={`text-sm mb-1 block transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Địa chỉ chi tiết
            </label>
            <textarea
              name="streetName"
              value={formData.address.streetName}
              onChange={handleChange}
              placeholder="Nhập tên đường, khu vực..."
              rows={2}
              className={`${inputClass} resize-none`}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className={buttonCancelClass}
            >
              Hủy
            </button>
            <button type="submit" className={buttonSubmitClass}>
              {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockForm;
