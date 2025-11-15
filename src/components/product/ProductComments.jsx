import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { createComment } from "../../slices/CommentSlice";
import { API_BASE_URL } from "../../config/api";

const ProductComments = ({ productId, comments = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRate, setCommentRate] = useState(5);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [previewUrl, setPreviewUrl] = useState(null);
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  const visibleComments = showAll ? comments : comments.slice(0, 3);

  // useEffect(() => {
  //   // Revoke preview URL on unmount
  //   return () => {
  //     if (previewUrl) URL.revokeObjectURL(previewUrl);
  //   };
  // }, [previewUrl]);

  const user = useSelector((state) => state.auth.user);

  // const handleFileChange = (e) => {
  //   const f = e.target.files && e.target.files[0];
  //   if (f) {
  //     setSelectedFile(f);
  //     const url = URL.createObjectURL(f);
  //     setPreviewUrl(url);
  //   } else {
  //     setSelectedFile(null);
  //     if (previewUrl) URL.revokeObjectURL(previewUrl);
  //     setPreviewUrl(null);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Bạn cần đăng nhập để bình luận");
    if (!commentText.trim()) return alert("Vui lòng nhập nội dung bình luận");
    try {
      const payload = {
        productId:
          Number(productId) || Number(comments._productId) || undefined,
        authorId: user.id,
        text: commentText,
        rate: commentRate,
        // image: selectedFile || null,
      };

      const result = await dispatch(createComment(payload)).unwrap();
      // reset form
      setCommentText("");
      setCommentRate(5);
      // setSelectedFile(null);
      // if (previewUrl) {
      //   URL.revokeObjectURL(previewUrl);
      //   setPreviewUrl(null);
      // }
      // show all so new comment is visible
      setShowAll(true);
    } catch (err) {
      console.error("Create comment error", err);
      alert("Không thể gửi bình luận: " + (err.message || err));
    }
  };

  return (
    <div
      className={`rounded-lg p-6 shadow-sm mt-8 mb-8 ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-4 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Bình luận sản phẩm
      </h2>

      {/* Danh sách bình luận */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className={`${isDark ? "text-gray-300" : "text-gray-500"}`}>
            Chưa có bình luận nào.
          </p>
        ) : (
          visibleComments.map((c) => (
            <div
              key={c.id}
              className={`border-b pb-4 ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="font-semibold flex items-center gap-2">
                <span
                  className={`${isDark ? "text-blue-400" : "text-blue-600"}`}
                >
                  {c.author?.username || "Ẩn danh"}
                </span>
                <span className="text-yellow-500">
                  {"★".repeat(c.rate)}
                  <span className="text-gray-300">
                    {"★".repeat(5 - c.rate)}
                  </span>
                </span>
              </div>
              <div
                className={`${isDark ? "text-gray-300" : "text-gray-700"} mt-1`}
              >
                {c.text}
              </div>
              {c.imageUrl && (
                <div className="mt-2">
                  <img
                    src={`${API_BASE_URL}${c.imageUrl}`}
                    alt="comment-attachment"
                    className="max-w-xs max-h-48 rounded-lg object-cover"
                  />
                </div>
              )}
              <div
                className={`${
                  isDark ? "text-gray-500" : "text-gray-400"
                } text-xs mt-1`}
              >
                {new Date(c.commentAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
      {comments.length > 3 && (
        <div className="mb-6 text-center">
          <button
            className={`${
              isDark ? "text-blue-400" : "text-blue-600"
            } hover:underline font-medium`}
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Ẩn bớt" : `Xem thêm (${comments.length - 3}) bình luận`}
          </button>
        </div>
      )}

      {/* Khung nhập bình luận mới */}
      <form
        onSubmit={handleSubmit}
        className={`p-4 border rounded-lg shadow-md ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}
      >
        <textarea
          className={`w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? "bg-gray-800 text-gray-300 border-gray-700"
              : "bg-white text-gray-700 border-gray-300"
          }`}
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Nhập bình luận của bạn..."
        />

        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-3">
          <div className="flex items-center">
            <span
              className={`${isDark ? "text-gray-300" : "text-gray-700"} mr-2`}
            >
              Đánh giá:
            </span>
            <select
              value={commentRate}
              onChange={(e) => setCommentRate(Number(e.target.value))}
              className={`border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? "bg-gray-800 text-gray-300 border-gray-700"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {star} sao
                </option>
              ))}
            </select>
          </div>

          {/* <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span
                className={`px-3 py-1 rounded border ${
                  isDark
                    ? "border-gray-700 text-gray-300"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                Đính kèm ảnh
              </span>
            </label>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="h-16 w-16 object-cover rounded"
              />
            )}
          </div> */}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!commentText.trim()}
          >
            Gửi bình luận
          </button>
          {/* {selectedFile && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }
              }}
              className="text-sm text-gray-500 hover:underline"
            >
              Xoá ảnh
            </button>
          )} */}
        </div>
      </form>
    </div>
  );
};

export default ProductComments;
