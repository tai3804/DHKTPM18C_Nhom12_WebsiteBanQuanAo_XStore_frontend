import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../slices/ProductSlice";
import { getCommentsByProductId } from "../slices/CommentSlice";
import { selectThemeMode } from "../slices/ThemeSlice";
import ProductComments from "../components/product/ProductComments";
import CommentFilter from "../components/product/CommentFilter";

export default function CommentsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product } = useSelector((state) => state.product);
  const { commentsByProduct } = useSelector((state) => state.comment);
  const loading = useSelector((state) => state.loading.isLoading);
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  const [filters, setFilters] = useState({ ratings: [], media: "" });

  const comments = useMemo(
    () => commentsByProduct[productId] || [],
    [commentsByProduct, productId]
  );

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filter comments based on current filters
  const filteredComments = useMemo(() => {
    let filtered = [...comments];

    // Filter by ratings
    if (filters.ratings && filters.ratings.length > 0) {
      filtered = filtered.filter((comment) =>
        filters.ratings.includes(comment.rate.toString())
      );
    }

    // Filter by media
    if (filters.media === "with-media") {
      filtered = filtered.filter(
        (comment) => comment.attachments && comment.attachments.length > 0
      );
    } else if (filters.media === "without-media") {
      filtered = filtered.filter(
        (comment) => !comment.attachments || comment.attachments.length === 0
      );
    }

    return filtered;
  }, [comments, filters]);

  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId));
      dispatch(getCommentsByProductId(productId));
    }
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Không tìm thấy sản phẩm
            </h1>
            <button
              onClick={() => navigate("/products")}
              className={`px-6 py-2 rounded-lg text-white transition-colors ${
                isDark
                  ? "bg-blue-700 hover:bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Quay lại danh sách sản phẩm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className={`transition-colors ${
              isDark
                ? "text-gray-400 hover:text-blue-400"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Trang chủ
          </button>
          <span
            className={`mx-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            /
          </span>
          <button
            onClick={() => navigate("/products")}
            className={`transition-colors ${
              isDark
                ? "text-gray-400 hover:text-blue-400"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Sản phẩm
          </button>
          <span
            className={`mx-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            /
          </span>
          <button
            onClick={() => navigate(`/products/${productId}`)}
            className={`transition-colors ${
              isDark
                ? "text-gray-400 hover:text-blue-400"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {product.name}
          </button>
          <span
            className={`mx-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            /
          </span>
          <span
            className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}
          >
            Bình luận
          </span>
        </nav>

        {/* Product Info */}
        <div
          className={`rounded-lg p-6 shadow-sm mb-8 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <img
              src={
                product.image ||
                "https://via.placeholder.com/64x64?text=No+Image"
              }
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/64x64?text=No+Image";
              }}
            />
            <div>
              <h1
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {product.name}
              </h1>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {filteredComments.length} bình luận
              </p>
            </div>
          </div>
        </div>

        {/* Main Content with Filter Sidebar */}
        <div className="flex gap-6 mt-8">
          {/* Filter Sidebar - Left */}
          <div className="shrink-0">
            <CommentFilter
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
          </div>

          {/* Comments Section - Right */}
          <div className="flex-1 min-w-0">
            <ProductComments
              productId={productId}
              comments={filteredComments}
              showAllByDefault={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
