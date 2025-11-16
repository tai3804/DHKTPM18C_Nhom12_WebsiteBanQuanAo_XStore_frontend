import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../config/api";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";

// Async thunks for Comment operations
export const getCommentsByProductId = createAsyncThunk(
  "comment/getCommentsByProductId",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState()?.auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/api/comments/product/${productId}`, { headers });
      if (!res.ok) throw new Error("Không thể tải bình luận");
      const json = await res.json();
      return { productId, data: json.result || [] };
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ productId, authorId, authorName, text, rate, imageUrls }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const requestBody = {
        productId: parseInt(productId),
        authorId: parseInt(authorId),
        authorName: authorName,
        text: text,
        rate: parseInt(rate),
        imageUrls: imageUrls || [],
      };
      const token = getState()?.auth?.token;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${API_BASE_URL}/api/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) throw new Error("Không thể tạo bình luận");
      const json = await res.json();
      return json.result || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ id, text, rate }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const requestBody = {
        text: text,
        rate: parseInt(rate),
      };
      const token = getState()?.auth?.token;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${API_BASE_URL}/api/comments/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) throw new Error("Không thể cập nhật bình luận");
      const json = await res.json();
      return json.result || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (id, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState()?.auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/api/comments/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Không thể xóa bình luận");
      return id;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

export const getCommentStats = createAsyncThunk(
  "comment/getCommentStats",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState()?.auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/api/comments/product/${productId}/stats`, { headers });
      if (!res.ok) throw new Error("Không thể tải thống kê bình luận");
      const json = await res.json();
      return { productId, data: json.result || {} };
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

const initialState = {
  commentsByProduct: {}, // { productId: [comments] }
  commentStats: {}, // { productId: { totalComments, averageRating } }
  currentComment: null,
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.commentsByProduct = {};
      state.commentStats = {};
    },
    clearCommentError: (state) => {
      state.error = null;
    },
    setCurrentComment: (state, action) => {
      state.currentComment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCommentsByProductId.fulfilled, (state, action) => {
        const { productId, data } = action.payload;
        const key = String(productId);
        state.commentsByProduct[key] = data;
        state.error = null;
      })
      .addCase(getCommentsByProductId.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const newComment = action.payload;
        const sentProductId = action?.meta?.arg?.productId || newComment.product?.id || newComment.productId;
        const key = String(sentProductId);
        if (state.commentsByProduct[key]) {
          state.commentsByProduct[key].unshift(newComment);
        } else {
          state.commentsByProduct[key] = [newComment];
        }
        state.currentComment = newComment;
        state.error = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        for (const productId in state.commentsByProduct) {
          const comments = state.commentsByProduct[productId];
          const index = comments.findIndex(comment => comment.id === updatedComment.id);
          if (index !== -1) {
            comments[index] = updatedComment;
            break;
          }
        }
        state.currentComment = updatedComment;
        state.error = null;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deletedId = action.payload;
        for (const productId in state.commentsByProduct) {
          state.commentsByProduct[productId] = state.commentsByProduct[productId].filter(
            comment => comment.id !== deletedId
          );
        }
        state.currentComment = null;
        state.error = null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getCommentStats.fulfilled, (state, action) => {
        const { productId, data } = action.payload;
        const key = String(productId);
        state.commentStats[key] = data;
        state.error = null;
      })
      .addCase(getCommentStats.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearComments,
  clearCommentError,
  setCurrentComment,
} = commentSlice.actions;

export default commentSlice.reducer;