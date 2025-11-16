import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductSales,
  updateProductSales,
  getProductSales,
} from "../../slices/ProductSalesSlice";
import { getProducts } from "../../slices/ProductSlice";
import { toast } from "react-toastify";
import { selectThemeMode } from "../../slices/ThemeSlice";

const ProductSalesForm = ({ productSales = null, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const products = useSelector((state) => state.product.products) || [];
  const existingProductSales =
    useSelector((state) => state.productSales.productSales) || [];
  const modalRef = useRef(null);
  const isEditMode = !!productSales;

  const [formData, setFormData] = useState({
    productId: "",
    discountPercent: 0,
    discountedPrice: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProducts());
    }
    // Load product sales để kiểm tra sản phẩm nào đã có giảm giá
    if (!existingProductSales || existingProductSales.length === 0) {
      dispatch(getProductSales());
    }
  }, [dispatch, products, existingProductSales]);

  // Filter sản phẩm có thể tạo giảm giá
  const availableProducts = products.filter((product) => {
    // Kiểm tra sản phẩm có giá hợp lệ
    if (!product.price || product.price <= 0) {
      return false;
    }

    // Kiểm tra sản phẩm đã có giảm giá đang hoạt động chưa
    const hasActiveSale = existingProductSales.some((sale) => {
      if (sale.product?.id !== product.id) return false;

      const now = new Date();
      const start = sale.startDate ? new Date(sale.startDate) : null;
      const end = sale.endDate ? new Date(sale.endDate) : null;

      // Nếu đang edit sản phẩm hiện tại, cho phép
      if (isEditMode && productSales?.product?.id === product.id) {
        return false;
      }

      // Kiểm tra giảm giá có đang active không
      return (!start || now >= start) && (!end || now <= end);
    });

    return !hasActiveSale;
  });

  useEffect(() => {
    if (isEditMode && productSales) {
      setFormData({
        productId: productSales.product?.id || "",
        discountPercent: productSales.discountPercent || 0,
        discountedPrice: productSales.discountedPrice || 0,
        startDate: productSales.startDate
          ? new Date(productSales.startDate).toISOString().slice(0, 16)
          : "",
        endDate: productSales.endDate
          ? new Date(productSales.endDate).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setFormData({
        productId: "",
        discountPercent: 0,
        discountedPrice: 0,
        startDate: "",
        endDate: "",
      });
    }
  }, [productSales, isEditMode]);

  // Click outside modal để đóng
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onCancel();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const selectedProduct = availableProducts.find((p) => p.id == productId);
    if (selectedProduct) {
      // Tự động tính discountedPrice dựa trên discountPercent và price
      const discountPercent = formData.discountPercent;
      const originalPrice = selectedProduct.price;
      const discountedPrice = originalPrice * (1 - discountPercent / 100);

      setFormData((prev) => ({
        ...prev,
        productId,
        discountedPrice: Math.round(discountedPrice),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        productId,
      }));
    }
  };

  const handleDiscountPercentChange = (e) => {
    const discountPercent = parseFloat(e.target.value) || 0;
    const selectedProduct = availableProducts.find(
      (p) => p.id == formData.productId
    );
    if (selectedProduct) {
      const originalPrice = selectedProduct.price;
      const discountedPrice = originalPrice * (1 - discountPercent / 100);

      setFormData((prev) => ({
        ...prev,
        discountPercent,
        discountedPrice: Math.round(discountedPrice),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        discountPercent,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra có sản phẩm nào available không
    if (availableProducts.length === 0 && !isEditMode) {
      toast.error("Không có sản phẩm nào có thể tạo giảm giá!");
      return;
    }

    if (!formData.productId) {
      toast.error("Vui lòng chọn sản phẩm!");
      return;
    }
    if (formData.discountPercent <= 0 || formData.discountPercent > 100) {
      toast.error("Phần trăm giảm giá phải từ 1 đến 100!");
      return;
    }
    if (formData.discountedPrice <= 0) {
      toast.error("Giá sau giảm phải lớn hơn 0!");
      return;
    }

    const submitData = {
      productId: parseInt(formData.productId),
      discountPercent: formData.discountPercent,
      discountedPrice: formData.discountedPrice,
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : null,
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : null,
    };

    console.log("📤 Submitting product sales data:", submitData);

    const action = isEditMode
      ? updateProductSales({
          productId: submitData.productId,
          productSalesData: submitData,
        })
      : createProductSales(submitData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          `Giảm giá sản phẩm đã được ${
            isEditMode ? "cập nhật" : "tạo"
          } thành công!`
        );
        onSuccess();
      })
      .catch((err) => {
        toast.error(
          `Lỗi khi ${isEditMode ? "cập nhật" : "tạo"} giảm giá sản phẩm: ${
            err.message
          }`
        );
      });
  };

  const inputClass = `w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
    themeMode === "dark"
      ? "bg-gray-700 text-gray-100 border-gray-600"
      : "bg-white text-gray-900 border-gray-300"
  }`;
  const labelClass = `text-sm mb-1 block transition-colors ${
    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
  }`;
  const modalBg = `rounded-2xl p-8 w-full max-w-2xl shadow-xl border animate-fadeIn transition-colors duration-300 max-h-[90vh] overflow-y-auto ${
    themeMode === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-100"
  }`;
  const btnCancelClass = `px-5 py-2 rounded-lg border transition cursor-pointer ${
    themeMode === "dark"
      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
      : "border-gray-200 text-gray-600 hover:bg-gray-100"
  }`;
  const btnSubmitClass = `px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer font-medium`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className={modalBg}>
        <h2
          className={`text-2xl font-bold text-center pb-4 mb-6 border-b transition-colors duration-300 ${
            themeMode === "dark"
              ? "text-gray-100 border-gray-700"
              : "text-gray-800 border-gray-200"
          }`}
        >
          {isEditMode
            ? "Chỉnh sửa giảm giá sản phẩm"
            : "Thêm giảm giá sản phẩm mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditMode && availableProducts.length === 0 && (
            <div
              className={`p-4 rounded-lg border transition-colors ${
                themeMode === "dark"
                  ? "bg-yellow-900/20 border-yellow-700 text-yellow-200"
                  : "bg-yellow-50 border-yellow-200 text-yellow-800"
              }`}
            >
              <p className="text-sm">
                ⚠️ Không có sản phẩm nào có thể tạo giảm giá. Tất cả sản phẩm đã
                có giảm giá đang hoạt động hoặc không có giá hợp lệ.
              </p>
            </div>
          )}

          <div>
            <label className={labelClass}>Sản phẩm</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleProductChange}
              className={inputClass}
              required
              disabled={isEditMode} // Không cho đổi sản phẩm khi edit
            >
              <option value="">
                {availableProducts.length === 0
                  ? "Không có sản phẩm nào có thể tạo giảm giá"
                  : "Chọn sản phẩm"}
              </option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.price?.toLocaleString()} đ
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phần trăm giảm (%)</label>
              <input
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleDiscountPercentChange}
                min="1"
                max="100"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Giá sau giảm (đ)</label>
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                min="0"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bắt đầu</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kết thúc</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className={btnCancelClass}>
              Hủy
            </button>
            <button
              type="submit"
              className={`${btnSubmitClass} ${
                availableProducts.length === 0 && !isEditMode
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={availableProducts.length === 0 && !isEditMode}
            >
              {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductSalesForm;
