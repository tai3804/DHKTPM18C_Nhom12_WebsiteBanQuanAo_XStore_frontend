// ProductForm.jsx
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createProduct,
  updateProduct,
  getAllProductVariants,
} from "../../slices/ProductSlice";
import {
  createMultipleProductInfos,
  deleteProductInfo,
  updateProductInfo,
  getProductInfosByProductId,
} from "../../slices/ProductInfoSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { API_BASE_URL } from "../../config/api";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { Trash2, Plus } from "lucide-react";

export default function ProductForm({
  product,
  onCancel,
  onSuccess,
  types = [],
}) {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const { allProductVariants } = useSelector((state) => state.product);
  const isEdit = !!product;
  const modalRef = useRef(null);

  const commonSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const [form, setForm] = useState({
    name: "",
    brand: "",
    fabric: "",
    description: "",
    image: null,
    imagePreview: "",
    costPrice: 0,
    sellingPrice: 0,
    type: "",
  });

  const [productInfos, setProductInfos] = useState([]);
  const [newProductInfo, setNewProductInfo] = useState({
    image: null,
    imagePreview: "",
    colorName: "",
    colorHexCode: "#000000",
    sizeName: "",
  });
  const fileInputRef = useRef(null);
  const variantFileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        brand: product.brand || "",
        fabric: product.fabric || "",
        description: product.description || "",
        image: null,
        imagePreview: product.image || "",
        costPrice: product.price || 0,
        sellingPrice: product.priceInStock || 0,
        type: product.type?.id || "",
      });

      // Load existing product infos
      if (product.id) {
        dispatch(getProductInfosByProductId(product.id))
          .unwrap()
          .then(({ data: infos }) => {
            console.log("Loaded product infos:", infos);
            // Set imagePreview for existing images
            const processedInfos = (infos || []).map((info) => {
              const imagePreview = info.image
                ? info.image.startsWith("http")
                  ? info.image
                  : `${API_BASE_URL}${info.image}`
                : "";
              console.log(
                "Processing info:",
                info.id,
                "image:",
                info.image,
                "imagePreview:",
                imagePreview
              );
              return {
                ...info,
                imagePreview,
              };
            });
            console.log("Processed infos:", processedInfos);
            setProductInfos(processedInfos);
          })
          .catch((err) => {
            console.error("Error loading product infos:", err);
            setProductInfos([]);
          });
      }
    } else {
      // Reset form for new product
      setForm({
        name: "",
        brand: "",
        fabric: "",
        description: "",
        image: null,
        imagePreview: "",
        costPrice: 0,
        sellingPrice: 0,
        type: "",
      });
      setProductInfos([]);
    }
  }, [product, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVariantImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductInfo((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveVariantImage = () => {
    setNewProductInfo((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
    }));
    if (variantFileInputRef.current) {
      variantFileInputRef.current.value = "";
    }
  };

  const handleAddProductInfo = () => {
    if (!newProductInfo.colorName.trim()) {
      toast.error("Vui lòng nhập tên màu!");
      return;
    }

    if (!newProductInfo.sizeName.trim()) {
      toast.error("Vui lòng nhập kích cỡ!");
      return;
    }

    // Check for duplicate color + size combination
    const duplicate = productInfos.find(
      (info) =>
        info.colorName.toLowerCase() ===
          newProductInfo.colorName.toLowerCase().trim() &&
        info.sizeName.toLowerCase() ===
          newProductInfo.sizeName.toLowerCase().trim()
    );

    if (duplicate) {
      toast.error("Biến thể này đã tồn tại!");
      return;
    }

    const infoToAdd = {
      ...newProductInfo,
      colorName: newProductInfo.colorName.trim(),
      sizeName: newProductInfo.sizeName.trim(),
    };

    setProductInfos([...productInfos, infoToAdd]);
    setNewProductInfo({
      image: null,
      imagePreview: "",
      colorName: "",
      colorHexCode: "#000000",
      sizeName: "",
    });
    toast.success("Thêm biến thể thành công!");
  };

  const handleRemoveProductInfo = (index) => {
    setProductInfos(productInfos.filter((_, i) => i !== index));
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onCancel();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.type) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    // Chỉ yêu cầu ảnh khi thêm mới, không yêu cầu khi chỉnh sửa nếu đã có ảnh cũ
    if (!isEdit && !form.image) {
      toast.error("Vui lòng chọn ảnh sản phẩm!");
      return;
    }

    if (productInfos.length === 0) {
      toast.error("Vui lòng thêm ít nhất một biến thể sản phẩm!");
      return;
    }

    // Tạo FormData để gửi file (product base)
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("fabric", form.fabric);
    formData.append("description", form.description);
    formData.append("price", form.costPrice);
    formData.append("priceInStock", form.sellingPrice);
    formData.append("typeId", form.type ? parseInt(form.type) : 0);

    // Append file nếu có
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      let productId;

      if (isEdit) {
        await dispatch(
          updateProduct({ id: product.id, productData: formData })
        ).unwrap();
        productId = product.id;
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        const result = await dispatch(createProduct(formData)).unwrap();
        productId = result.id;
        toast.success("Thêm sản phẩm thành công!");
      }

      // Handle ProductInfo variants
      if (productInfos.length > 0) {
        if (isEdit) {
          // For edit mode: update existing, create new, delete removed
          const { data: existingInfos } = await dispatch(
            getProductInfosByProductId(productId)
          ).unwrap();

          const existingIds = new Set(existingInfos.map((info) => info.id));
          const currentIds = new Set(
            productInfos.filter((info) => info.id).map((info) => info.id)
          );

          // Delete removed infos
          const toDelete = existingInfos.filter(
            (info) => !currentIds.has(info.id)
          );
          for (const info of toDelete) {
            await dispatch(deleteProductInfo(info.id)).unwrap();
          }

          // Update existing infos
          const toUpdate = productInfos.filter((info) => info.id);
          for (const info of toUpdate) {
            const updateData = new FormData();
            updateData.append("colorName", info.colorName);
            updateData.append("colorHexCode", info.colorHexCode);
            updateData.append("sizeName", info.sizeName);

            // Include image if it's a new file (File object)
            if (info.image && info.image instanceof File) {
              updateData.append("image", info.image);
            }

            await dispatch(
              updateProductInfo({ id: info.id, productInfo: updateData })
            ).unwrap();
          }

          // Create new infos
          const toCreate = productInfos.filter((info) => !info.id);
          if (toCreate.length > 0) {
            for (const info of toCreate) {
              const infoFormData = new FormData();
              infoFormData.append("colorName", info.colorName);
              infoFormData.append("colorHexCode", info.colorHexCode);
              infoFormData.append("sizeName", info.sizeName);

              if (info.image) {
                infoFormData.append("image", info.image);
              }

              await dispatch(
                createProductInfo({
                  productId,
                  productInfoData: infoFormData,
                })
              ).unwrap();
            }
          }
        } else {
          // For create mode: create all new infos
          const productInfoPromises = productInfos.map(async (info) => {
            const infoFormData = new FormData();
            infoFormData.append("colorName", info.colorName);
            infoFormData.append("colorHexCode", info.colorHexCode);
            infoFormData.append("sizeName", info.sizeName);

            if (info.image) {
              infoFormData.append("image", info.image);
            }

            return infoFormData;
          });

          const productInfoFormDatas = await Promise.all(productInfoPromises);

          await dispatch(
            createMultipleProductInfos({
              productId,
              productInfoList: productInfoFormDatas,
            })
          ).unwrap();
        }
      }

      onSuccess?.();
    } catch (err) {
      console.error("Error submitting product:", err);
      toast.error("Lỗi: " + (err.message || err));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className={`rounded-2xl p-8 w-full max-w-2xl shadow-xl animate-fadeIn transition-colors duration-300 max-h-[90vh] overflow-y-auto ${
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
          {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h3
              className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Tên sản phẩm"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Tên sản phẩm"
              />
              <FormInput
                label="Thương hiệu"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Thương hiệu"
              />
              <FormInput
                label="Chất liệu"
                name="fabric"
                value={form.fabric}
                onChange={handleChange}
                placeholder="Chất liệu"
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-2">
              <label
                className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Hình ảnh
              </label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      themeMode === "dark"
                        ? "border-gray-600 bg-gray-700 hover:border-indigo-500 hover:bg-gray-600"
                        : "border-gray-300 bg-gray-50 hover:border-indigo-500 hover:bg-indigo-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      📷 Chọn file ảnh
                    </span>
                  </label>
                </div>

                {/* Preview ảnh */}
                {form.imagePreview && (
                  <div className="relative w-20 h-20">
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border-2 border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Mô tả
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-300 ${
                themeMode === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  : "bg-white border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
              }`}
              rows="3"
            />
          </div>

          {/* Loại sản phẩm & Giá */}
          <div className="grid grid-cols-3 gap-4">
            <FormSelect
              label="Loại sản phẩm"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={types.map((t) => ({ value: t.id, label: t.name }))}
              required
            />
            <FormInput
              label="Giá nhập"
              name="costPrice"
              type="number"
              value={form.costPrice}
              onChange={handleChange}
            />
            <FormInput
              label="Giá bán"
              name="sellingPrice"
              type="number"
              value={form.sellingPrice}
              onChange={handleChange}
            />
          </div>

          {/* Biến thể sản phẩm */}
          <div>
            <h3
              className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Chi tiết sản phẩm
            </h3>
            <div className="space-y-4">
              {/* Add Product Info Form */}
              <div
                className={`p-4 rounded-lg ${
                  themeMode === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <h4
                  className={`text-sm font-medium mb-3 ${
                    themeMode === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Thêm chi tiết mới
                </h4>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {/* Variant Image */}
                  <div>
                    <label
                      className={`block text-sm mb-2 font-medium ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Hình ảnh biến thể
                    </label>
                    <div className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          ref={variantFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleVariantImageChange}
                          className="hidden"
                          id="variant-image-upload"
                        />
                        <label
                          htmlFor="variant-image-upload"
                          className={`flex items-center justify-center w-full px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            themeMode === "dark"
                              ? "border-gray-600 bg-gray-600 hover:border-indigo-500 hover:bg-gray-500"
                              : "border-gray-300 bg-gray-50 hover:border-indigo-500 hover:bg-indigo-50"
                          }`}
                        >
                          <span
                            className={`text-xs font-medium ${
                              themeMode === "dark"
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            📷 Chọn ảnh
                          </span>
                        </label>
                      </div>

                      {/* Preview ảnh */}
                      {newProductInfo.imagePreview && (
                        <div className="relative w-12 h-12">
                          <img
                            src={newProductInfo.imagePreview}
                            alt="Variant Preview"
                            className="w-full h-full object-cover rounded border-2 border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveVariantImage}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 transition text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label
                      className={`block text-sm mb-2 font-medium ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Màu sắc
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newProductInfo.colorName}
                        onChange={(e) =>
                          setNewProductInfo({
                            ...newProductInfo,
                            colorName: e.target.value,
                          })
                        }
                        placeholder="Tên màu"
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm outline-none transition-all duration-300 ${
                          themeMode === "dark"
                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            : "bg-white border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                        }`}
                      />
                      <input
                        type="color"
                        value={newProductInfo.colorHexCode}
                        onChange={(e) =>
                          setNewProductInfo({
                            ...newProductInfo,
                            colorHexCode: e.target.value,
                          })
                        }
                        className="w-12 h-10 rounded-lg border cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label
                      className={`block text-sm mb-2 font-medium ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Kích cỡ
                    </label>
                    <input
                      type="text"
                      value={newProductInfo.sizeName}
                      onChange={(e) =>
                        setNewProductInfo({
                          ...newProductInfo,
                          sizeName: e.target.value,
                        })
                      }
                      placeholder="VD: S, M, L, XL"
                      className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all duration-300 ${
                        themeMode === "dark"
                          ? "bg-gray-600 border-gray-500 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                          : "bg-white border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddProductInfo}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Plus size={18} /> Thêm chi tiết
                </button>
              </div>

              {/* Product Info List */}
              <div className="space-y-4">
                {productInfos.length === 0 ? (
                  <p
                    className={`text-sm ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Chưa có chi tiết nào
                  </p>
                ) : (
                  // Group by color
                  Object.entries(
                    productInfos.reduce((groups, info, infoIndex) => {
                      const colorKey = `${info.colorName}-${info.colorHexCode}`;
                      if (!groups[colorKey]) {
                        groups[colorKey] = {
                          colorName: info.colorName,
                          colorHexCode: info.colorHexCode,
                          imagePreview: info.imagePreview,
                          image: info.image,
                          sizes: [],
                          groupId: colorKey, // Add groupId for stable reference
                        };
                      } else {
                        // Update imagePreview if this info has a more recent one
                        if (
                          info.imagePreview &&
                          (!groups[colorKey].imagePreview ||
                            info.imagePreview !== groups[colorKey].imagePreview)
                        ) {
                          groups[colorKey].imagePreview = info.imagePreview;
                          groups[colorKey].image = info.image;
                        }
                      }
                      groups[colorKey].sizes.push({
                        id: info.id,
                        sizeName: info.sizeName,
                        index: infoIndex, // Add index for stable reference
                      });
                      return groups;
                    }, {})
                  ).map(([colorKey, colorGroup], colorIndex) => (
                    <div
                      key={colorIndex}
                      className={`p-4 rounded-lg ${
                        themeMode === "dark" ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Color Header */}
                        <div className="flex items-start justify-between">
                          {/* Color Info */}
                          <div className="flex items-center gap-3">
                            {/* Color Image */}
                            <div className="relative w-12 h-12 shrink-0">
                              {colorGroup.imagePreview ? (
                                <img
                                  src={colorGroup.imagePreview}
                                  alt={colorGroup.colorName}
                                  className="w-full h-full object-cover rounded border-2 border-indigo-500"
                                />
                              ) : (
                                <div className="w-full h-full rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                                  <span
                                    className={`text-xs ${
                                      themeMode === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    N/A
                                  </span>
                                </div>
                              )}
                              {/* Edit image button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.createElement("input");
                                  input.type = "file";
                                  input.accept = "image/*";
                                  input.onchange = (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        console.log(
                                          "Updating image for color group:",
                                          colorGroup.groupId
                                        );
                                        // Update all infos that belong to this color group
                                        const updatedInfos = productInfos.map(
                                          (info) => {
                                            const infoColorKey = `${info.colorName}-${info.colorHexCode}`;
                                            if (
                                              infoColorKey ===
                                              colorGroup.groupId
                                            ) {
                                              console.log(
                                                "Updating info:",
                                                info.id,
                                                "with new image"
                                              );
                                              return {
                                                ...info,
                                                image: file,
                                                imagePreview: reader.result,
                                              };
                                            }
                                            return info;
                                          }
                                        );
                                        console.log(
                                          "Updated infos count:",
                                          updatedInfos.length
                                        );
                                        setProductInfos(updatedInfos);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  };
                                  input.click();
                                }}
                                className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-blue-600 text-xs"
                              >
                                ✏️
                              </button>
                            </div>

                            {/* Color Details */}
                            <div>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-5 h-5 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor: colorGroup.colorHexCode,
                                  }}
                                />
                                <input
                                  type="text"
                                  value={colorGroup.colorName}
                                  onChange={(e) => {
                                    const newColorName = e.target.value;
                                    const updatedInfos = productInfos.map(
                                      (info) => {
                                        const infoColorKey = `${info.colorName}-${info.colorHexCode}`;
                                        if (
                                          infoColorKey === colorGroup.groupId
                                        ) {
                                          return {
                                            ...info,
                                            colorName: newColorName,
                                          };
                                        }
                                        return info;
                                      }
                                    );
                                    setProductInfos(updatedInfos);
                                  }}
                                  className={`font-medium px-2 py-1 border rounded text-sm ${
                                    themeMode === "dark"
                                      ? "bg-gray-600 border-gray-500 text-white"
                                      : "bg-white border-gray-300 text-gray-900"
                                  }`}
                                  placeholder="Tên màu"
                                />
                                <input
                                  type="color"
                                  value={colorGroup.colorHexCode}
                                  onChange={(e) => {
                                    const newColorHex = e.target.value;
                                    const updatedInfos = productInfos.map(
                                      (info) => {
                                        const infoColorKey = `${info.colorName}-${info.colorHexCode}`;
                                        if (
                                          infoColorKey === colorGroup.groupId
                                        ) {
                                          return {
                                            ...info,
                                            colorHexCode: newColorHex,
                                          };
                                        }
                                        return info;
                                      }
                                    );
                                    setProductInfos(updatedInfos);
                                  }}
                                  className="w-8 h-8 rounded border cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Remove Color Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedInfos = productInfos.filter(
                                (info) => {
                                  const infoColorKey = `${info.colorName}-${info.colorHexCode}`;
                                  return infoColorKey !== colorGroup.groupId;
                                }
                              );
                              setProductInfos(updatedInfos);
                            }}
                            className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Sizes for this color */}
                        <div>
                          <h5
                            className={`text-sm font-medium mb-2 ${
                              themeMode === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            Kích cỡ:
                          </h5>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {colorGroup.sizes.map((sizeInfo, sizeIndex) => (
                                <div
                                  key={sizeIndex}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={sizeInfo.sizeName}
                                    onChange={(e) => {
                                      const newSizeName = e.target.value;
                                      const updatedInfos = productInfos.map(
                                        (info) => {
                                          if (info.id === sizeInfo.id) {
                                            return {
                                              ...info,
                                              sizeName: newSizeName,
                                            };
                                          }
                                          return info;
                                        }
                                      );
                                      setProductInfos(updatedInfos);
                                    }}
                                    className={`px-2 py-1 border rounded text-sm w-16 ${
                                      themeMode === "dark"
                                        ? "bg-gray-500 border-gray-400 text-white"
                                        : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                    placeholder="Size"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedInfos = productInfos.filter(
                                        (info) => info.id !== sizeInfo.id
                                      );
                                      setProductInfos(updatedInfos);
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                            {/* Add Size Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const newInfo = {
                                  id: null,
                                  colorName: colorGroup.colorName,
                                  colorHexCode: colorGroup.colorHexCode,
                                  sizeName: "",
                                  image: colorGroup.image,
                                  imagePreview: colorGroup.imagePreview,
                                };
                                setProductInfos([...productInfos, newInfo]);
                              }}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm ml-4"
                            >
                              <Plus size={14} /> Thêm size
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className={`px-5 py-2 rounded-lg border transition-colors ${
                themeMode === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              {isEdit ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
