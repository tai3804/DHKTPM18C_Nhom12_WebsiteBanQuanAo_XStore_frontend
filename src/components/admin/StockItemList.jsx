import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

import {
  getStockItems,
  setItemQuantity,
  deleteStockItem,
} from "../../slices/StockSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";
import SearchBar from "../../components/admin/SearchBar";

export default function StockItemList() {
  const { stockId } = useParams();
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const { stockItems, loading } = useSelector((state) => state.stock);

  const [searchQuery, setSearchQuery] = useState("");
  const [editQuantities, setEditQuantities] = useState({}); // Local state cho input

  useEffect(() => {
    if (stockId) {
      dispatch(getStockItems(stockId))
        .unwrap()
        .then((data) => {
          // Khởi tạo editQuantities
          const init = {};
          data.forEach((item) => {
            init[item.productId] = item.quantity;
          });
          setEditQuantities(init);
        })
        .catch((err) =>
          toast.error("Không thể tải sản phẩm: " + err.message)
        );
    }
  }, [stockId, dispatch]);

  const handleDelete = (productId) => {
    if (!stockId) return toast.error("Stock ID không hợp lệ!");
    if (!window.confirm("Xóa sản phẩm khỏi kho?")) return;

    dispatch(deleteStockItem({ stockId, productId }))
      .unwrap()
      .then(() => toast.success("Đã xóa sản phẩm!"))
      .catch((err) => toast.error(err.message || err));
  };

  const filteredItems = (Array.isArray(stockItems) ? stockItems : []).filter(
    (item) => {
      const q = searchQuery.toLowerCase();
      const product = item.product;
      return (
        product.name?.toLowerCase().includes(q) ||
        product.id?.toString().includes(q) ||
        product.brand?.toLowerCase().includes(q) ||
        product.type?.name?.toLowerCase().includes(q) ||
        product.fabric?.toLowerCase().includes(q) ||
        (product.colors || []).some((c) =>
          (typeof c === "object" ? c.name : c).toLowerCase().includes(q)
        ) ||
        (product.sizes || []).some((s) =>
          (typeof s === "object" ? s.name : s).toLowerCase().includes(q)
        )
      );
    }
  );

  if (!stockId)
    return <p className="p-4 text-red-500">Stock ID không hợp lệ.</p>;

  return (
    <div className="space-y-6 relative">
      {/* Breadcrumb */}
      <div
        className={`text-sm mb-2 flex items-center gap-1 ${
          themeMode === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <Link to="/admin/dashboard" className="hover:underline">
          Trang chủ
        </Link>
        <span>/</span>
        <Link to="/admin/stocks" className="hover:underline">
          Kho hàng
        </Link>
        <span>/</span>
        <span>{stockItems[0]?.stock?.name || `Kho #${stockId}`}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-bold ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Quản lý sản phẩm trong{" "}
            {stockItems[0]?.stock?.name || `Kho #${stockId}`}
          </h1>
          <p
            className={`text-sm ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Quản lý các sản phẩm hiện có trong kho
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-4">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Tìm kiếm sản phẩm theo tên, ID, thương hiệu, loại, màu, kích cỡ..."
          onClear={() => setSearchQuery("")}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div
          className={`text-center py-8 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Đang tải danh sách sản phẩm...
        </div>
      ) : filteredItems.length > 0 ? (
        <div
          className={`rounded-xl shadow-sm border overflow-x-auto ${
            themeMode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <table className="w-full text-left border-collapse min-w-max">
            <thead
              className={`border-b ${
                themeMode === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <tr>
                {[
                  "ID",
                  "Tên sản phẩm",
                  "Hình ảnh",
                  "Thương hiệu",
                  "Loại",
                  "Chất liệu",
                  "Màu sắc",
                  "Kích cỡ",
                  "Số lượng",
                  "Hành động",
                ].map((th) => (
                  <th
                    key={th}
                    className={`px-4 py-3 text-sm font-semibold ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                    } ${th === "Hành động" ? "text-right" : ""}`}
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const p = item.product;
                return (
                  <tr
                    key={p.id}
                    className={`border-b ${
                      themeMode === "dark"
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">{p.id}</td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">{p.brand || "N/A"}</td>
                    <td className="px-4 py-3">{p.type?.name || "N/A"}</td>
                    <td className="px-4 py-3">{p.fabric || "N/A"}</td>

                    {/* Màu sắc */}
                    <td className="px-4 py-3 align-middle">
                      {p.colors && p.colors.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {p.colors.map((c, idx) => (
                            <div
                              key={idx}
                              title={typeof c === "object" ? c.name : c}
                              className="w-5 h-5 rounded-full border"
                              style={{
                                backgroundColor: typeof c === "object" ? c.hexCode : c,
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    {/* Kích cỡ */}
                    <td className="px-4 py-3 align-middle">
                      {p.sizes && p.sizes.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {p.sizes.map((s, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                                themeMode === "dark"
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {typeof s === "object" ? s.name : s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    {/* Số lượng editable */}
                    <td className="px-4 py-3 flex items-center gap-2">
                    <input
                        type="number"
                        min="0"
                        value={
                        editQuantities[item.productId ?? item.product.id] ?? item.quantity
                        }
                        className="w-16 p-1 border rounded text-center"
                        onChange={(e) =>
                        setEditQuantities({
                            ...editQuantities,
                            [item.productId ?? item.product.id]: parseInt(e.target.value) || 0,
                        })
                        }
                    />
                    <button
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                        const key = item.productId ?? item.product.id;
                        const val = editQuantities[key];
                        if (val >= 0) {
                            dispatch(
                            setItemQuantity({
                                stockId,
                                productId: key,
                                quantity: val,
                            })
                            )
                            .unwrap()
                            .then(() => toast.success("Cập nhật số lượng thành công!"))
                            .catch((err) => toast.error(err.message || err));
                        }
                        }}
                    >
                        Cập nhật
                    </button>
                    </td>


                    {/* Hành động */}
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(p.id)}>
                        <Trash2 className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={`text-center py-8 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {searchQuery ? "Không tìm thấy sản phẩm nào." : "Kho chưa có sản phẩm."}
        </div>
      )}
    </div>
  );
}
