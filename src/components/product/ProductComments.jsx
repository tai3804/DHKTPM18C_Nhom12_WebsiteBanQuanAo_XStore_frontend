import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectThemeMode } from "../../slices/ThemeSlice";
import {
  createComment,
  getCommentsByProductId,
} from "../../slices/CommentSlice";
import { API_BASE_URL } from "../../config/api";
import { Upload, X, FileVideo } from "lucide-react";

const ProductComments = ({
  productId,
  comments = [],
  showAllByDefault = false,
}) => {
  const [showAll, setShowAll] = useState(showAllByDefault);
  const [commentText, setCommentText] = useState("");
  const [commentRate, setCommentRate] = useState(5);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  const visibleComments = showAll ? comments : comments.slice(0, 3);

  useEffect(() => {
    // Revoke preview URLs on unmount
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const user = useSelector((state) => state.auth.user);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate each file
    const maxFiles = 5; // Maximum 5 files
    const maxFileSize = 10 * 1024 * 1024; // 10MB per file
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/webm",
    ];

    // Check total files
    if (selectedFiles.length + files.length > maxFiles) {
      alert(`Tối đa chỉ được đính kèm ${maxFiles} file`);
      return;
    }

    const validFiles = [];
    const validUrls = [];

    for (const file of files) {
      // Check file size
      if (file.size > maxFileSize) {
        alert(`File "${file.name}" quá lớn. Kích thước tối đa là 10MB`);
        continue;
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        alert(
          `Loại file "${file.name}" không được hỗ trợ. Chỉ chấp nhận ảnh và video`
        );
        continue;
      }

      validFiles.push(file);
      validUrls.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setPreviewUrls((prev) => [...prev, ...validUrls]);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const removedUrl = previewUrls[index];
    const newUrls = previewUrls.filter((_, i) => i !== index);

    // Revoke the removed URL
    URL.revokeObjectURL(removedUrl);

    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Bạn cần đăng nhập để bình luận");
    if (!commentText.trim()) return alert("Vui lòng nhập nội dung bình luận");

    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");

      if (selectedFiles.length > 0) {
        // Upload files first
        const formData = new FormData();
        formData.append(
          "productId",
          Number(productId) || Number(comments._productId) || undefined
        );
        formData.append("authorId", user.id);
        formData.append(
          "authorName",
          user.firstName + " " + user.lastName || "Ẩn danh"
        );
        formData.append("text", commentText);
        formData.append("rate", commentRate);

        // Add all files
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        const response = await fetch(
          `${API_BASE_URL}/api/comments/with-files`,
          {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Upload failed");
        }

        // Refresh comments list without page reload
        await dispatch(getCommentsByProductId(productId));
      } else {
        // Use regular API without files
        const payload = {
          productId:
            Number(productId) || Number(comments._productId) || undefined,
          authorId: user.id,
          authorName: user.firstName + " " + user.lastName || "Ẩn danh",
          text: commentText,
          rate: commentRate,
          imageUrls: [],
        };

        const result = await dispatch(createComment(payload)).unwrap();
      }

      // reset form
      setCommentText("");
      setCommentRate(5);
      setSelectedFiles([]);
      // Revoke all preview URLs
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      // show all so new comment is visible
      setShowAll(true);
    } catch (err) {
      console.error("Create comment error", err);
      alert("Không thể gửi bình luận: " + (err.message || err));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`rounded-lg p-6 shadow-sm mb-8 ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-4 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Bình luận sản phẩm ({comments.length})
      </h2>

      {/* Danh sách bình luận */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className={`${isDark ? "text-gray-300" : "text-gray-500"}`}>
            Chưa có bình luận nào.
          </p>
        ) : (
          visibleComments.map((c) => {
            // Component Avatar inline
            const CommentAvatar = () => {
              const [imageError, setImageError] = useState(false);

              // Debug
              console.log(
                "Comment:",
                c.id,
                "Author:",
                c.author,
                "AuthorId:",
                c.authorId
              );

              // Xác định URL avatar
              let avatarUrl = null;

              if (c.author?.avatar) {
                avatarUrl = c.author.avatar.startsWith("http")
                  ? c.author.avatar
                  : `${API_BASE_URL}${c.author.avatar}`;
              } else if (c.authorAvatar) {
                avatarUrl = c.authorAvatar.startsWith("http")
                  ? c.authorAvatar
                  : `${API_BASE_URL}${c.authorAvatar}`;
              } else if (
                c.authorId &&
                user?.id === c.authorId &&
                user?.avatar
              ) {
                avatarUrl = user.avatar.startsWith("http")
                  ? user.avatar
                  : `${API_BASE_URL}${user.avatar}`;
              }
            };

            return (
              <div
                key={c.id}
                className={`border-b pb-4 ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <CommentAvatar />

                  {/* Comment content */}
                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      <span
                        className={`${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {c.authorName || c.author?.username || "Ẩn danh"}
                      </span>
                      <span className="text-yellow-500">
                        {"★".repeat(c.rate)}
                        <span className="text-gray-300">
                          {"★".repeat(5 - c.rate)}
                        </span>
                      </span>
                    </div>
                    <div
                      className={`${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } mt-1`}
                    >
                      {c.text}
                    </div>
                    {c.attachments && c.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.attachments.map((attachment, index) => (
                          <div key={attachment.id || index}>
                            {attachment.fileType === "video" ? (
                              <video
                                src={`${API_BASE_URL}${attachment.imageUrl}`}
                                controls
                                className="max-w-xs max-h-48 rounded-lg object-cover"
                                onError={(e) => {
                                  console.error("Video load error:", e);
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <img
                                src={`${API_BASE_URL}${attachment.imageUrl}`}
                                alt={`comment-attachment-${
                                  attachment.id || index
                                }`}
                                className="max-w-xs max-h-48 rounded-lg object-cover"
                                onError={(e) => {
                                  console.error("Image load error:", e);
                                  e.target.style.display = "none";
                                }}
                              />
                            )}
                          </div>
                        ))}
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
                </div>
              </div>
            );
          })
        )}
      </div>
      {comments.length > 3 && !showAllByDefault && (
        <div className="mb-6 text-center">
          <button
            className={`${
              isDark ? "text-blue-400" : "text-blue-600"
            } hover:underline font-medium`}
            onClick={() => navigate(`/products/${productId}/comments`)}
          >
            Xem thêm ({comments.length - 3}) bình luận
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
        <div className="flex flex-col gap-4">
          {/* Textarea ăn hết chiều ngang */}
          <textarea
            className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark
                ? "bg-gray-800 text-gray-300 border-gray-700"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Nhập bình luận của bạn..."
          />

          {/* Preview files */}
          {previewUrls.length > 0 && (
            <div className="w-full flex flex-wrap gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  {selectedFiles[index].type.startsWith("video/") ? (
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <FileVideo className="w-6 h-6 text-blue-500" />
                      <span className="text-sm text-gray-600 truncate max-w-32">
                        {selectedFiles[index].name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={url}
                        alt={`preview-${index}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Controls bên phải */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mr-2`}
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

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors ${
                      isDark
                        ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">
                      Đính kèm file ({selectedFiles.length}/5)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!commentText.trim() || isUploading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isUploading ? "Đang gửi..." : "Gửi bình luận"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductComments;
