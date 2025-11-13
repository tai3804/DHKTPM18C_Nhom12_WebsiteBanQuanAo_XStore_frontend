// src/slices/AuthSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";
import Messages from "../constants/successes";
import { resetCart } from "./CartSlice";
import { clearFavourites } from "./FavouriteSlice";
import { API_BASE_URL } from "../config/api";

const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const initialState = {
  user: storedUser || null,
  token: storedToken || null,
};

// (Giữ nguyên loginUser, logoutUser, registerUser, logout)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
      toast.error("Server not ready");
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      toast.success(Messages.LOGOUT_SUCCESS);
      return true;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { firstName, lastName, dob, username, password, email },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          dob,
          username,
          password,
          email: email || null,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Register failed");
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
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("token");
    dispatch(resetCart());
    dispatch(clearFavourites());
    return null;
  }
);


// (Giữ nguyên sendRegisterEmailOtp)
export const sendRegisterEmailOtp = createAsyncThunk(
  "auth/sendRegisterEmailOtp",
  async (email, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/otp/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      });
      const data = await res.json();
      if (res.ok && data.code === 200) {
        toast.success(data.message || "OTP đã được gửi đến email của bạn!");
        return data;
      } else {
        toast.error(data.message || "Gửi OTP thất bại!");
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      dispatch(setError(error.message));
      toast.error("Không thể gửi OTP, vui lòng thử lại sau!");
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// (Giữ nguyên sendResetPasswordOtp - Dùng cho Email)
export const sendResetPasswordOtp = createAsyncThunk(
  "auth/sendResetPasswordOtp",
  async (email, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/otp/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      });
      const data = await res.json();
      if (res.ok && data.code === 200) {
        return data;
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message || "Không thể gửi OTP, vui lòng thử lại sau!");
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// === THUNK MỚI: DÙNG CHO SĐT ===
export const sendResetPasswordPhoneOtp = createAsyncThunk(
  "auth/sendResetPasswordPhoneOtp",
  async (phone, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/otp/reset-password-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phone),
      });
      const data = await res.json();
      if (res.ok && data.code === 200) {
        return data;
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message || "Không thể gửi OTP, vui lòng thử lại sau!");
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// (Giữ nguyên verifyOtp)
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ contact, otp }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/otp/verify-otp?contact=${encodeURIComponent(
          contact
        )}&otp=${otp}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (res.ok && data.code === 200) {
        return data;
      } else {
        throw new Error(data.message || "Xác thực OTP thất bại");
      }
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// (Giữ nguyên resetPassword)
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ username, newPassword }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Reset password failed");
      }
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
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // (Giữ nguyên các case cũ)
      .addCase(loginUser.pending, (state) => {
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const res = action.payload;
        if (res.code == 200) {
          const token = res.result.token;
          const user = res.result.user;
          state.token = token;
          state.user = user;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          toast.error(res.message);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const res = action.payload;
        if (res.code == 200) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      })
      .addCase(registerUser.rejected, (state) => {
        toast.error(Errors.REGISTER_FAILED);
      })
      .addCase(sendRegisterEmailOtp.fulfilled, (state, action) => {
        const res = action.payload;
        if (res && res.code === 200) {
          toast.success(res.message || "OTP đã được gửi tới email!");
        } else {
          toast.error(res?.message || "Gửi OTP thất bại!");
        }
      })
      .addCase(sendRegisterEmailOtp.rejected, (state, action) => {
        toast.error("Không thể gửi OTP, vui lòng thử lại sau!");
      })
      .addCase(sendResetPasswordOtp.fulfilled, (state, action) => {
        const res = action.payload;
        if (res && res.code === 200) {
          toast.success(res.message || "OTP đã được gửi tới email!");
        }
      })
      // === THÊM CASE CHO SĐT ===
      .addCase(sendResetPasswordPhoneOtp.fulfilled, (state, action) => {
        const res = action.payload;
        if (res && res.code === 200) {
          toast.success("OTP đã được gửi (mô phỏng)!");
        }
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        const res = action.payload;
        if (res && res.code === 200) {
          toast.success(res.message || "Xác thực OTP thành công!");
        } else {
          toast.error(res?.message || "Xác thực OTP thất bại!");
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        toast.error("Xác thực OTP thất bại!");
      })
      .addCase(resetPassword.fulfilled, (state, action) => {})
      .addCase(resetPassword.rejected, (state, action) => {});
  },
});

export const { clearSuccess, setUser, clearUser, setToken, clearToken } =
  authSlice.actions;
export default authSlice.reducer;