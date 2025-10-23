// src/slice/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";

const initialState = {
  user: null,       // thông tin user hiện tại
  token: null,      // token JWT
};

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || Errors.LOGIN_FAILED);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Nếu API logout có thể gọi ở đây
      return true;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ===== REGISTER =====
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ firstName, lastName, dob, username, password }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, dob, username, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || Errors.REGISTER_FAILED);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.success = null;
    },
    // Set trực tiếp user vào state
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // Xóa user khỏi state
    clearUser: (state) => {
      state.user = null;
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.result; // token trả về từ backend
        // user vẫn null, bạn cần fetch thêm từ username decoded nếu muốn lưu user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.success = null;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.success = null;
      })
      
      // REGISTER
      .addCase(registerUser.fulfilled, (state, action) => {
        state.success = "REGISTER_SUCCESS";
      })
      .addCase(registerUser.rejected, (state) => {
        state.success = null;
      })

  },
});

export const { clearSuccess, setUser, clearUser, setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
