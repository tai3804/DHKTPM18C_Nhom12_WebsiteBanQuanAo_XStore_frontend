// src/slice/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";
import Messages from "../constants/successes";
import { resetCart } from './CartSlice';
import { clearFavourites } from './FavouriteSlice';
import { API_BASE_URL } from "../config/api";


// ======== LẤY DỮ LIỆU TỪ LOCALSTORAGE (KHI APP RELOAD) =========
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

// ======== INITIAL STATE =========
const initialState = {
  user: storedUser || null,
  token: storedToken || null,
};
// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`http://localhost:8080/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"

        },
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
      toast.error("Server not ready")
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

// ===== REGISTER =====
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ firstName, lastName, dob, username, password, email }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`http://localhost:8080/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, dob, username, password, email: email || null }),
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
  'auth/logout',
  async (_, { dispatch }) => {
    // Clear token
    localStorage.removeItem('token');

    // ✅ Reset cart khi logout
    dispatch(resetCart());

    // ✅ Clear favourites khi logout
    dispatch(clearFavourites());

    return null;
  }
);

// ===== SEND REGISTER EMAIL OTP (POST) =====
export const sendRegisterEmailOtp = createAsyncThunk(
  "auth/sendRegisterEmailOtp",
  async (email, { dispatch,getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    const token = getState().auth.token;
     console.log("Token in sendRegisterEmailOtp:", token);
    try {
      const res = await fetch(`http://localhost:8080/api/otp/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
         },
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
      console.log(email);
      
      toast.error("Không thể gửi OTP, vui lòng thử lại sau!");
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ===== VERIFY OTP =====
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ contact, otp }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`http://localhost:8080/api/otp/verify-otp?contact=${encodeURIComponent(contact)}&otp=${otp}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

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
        const res = action.payload
        console.log(res);


        if (res.code == 200) { // thanh cong
          const token = res.result.token;
          const user = res.result.user
          state.token = token;
          state.user = user
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          toast.error(res.message)
        }

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.success = null;
      })

      // LOGOUT (new logout action)
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })

      // REGISTER
      .addCase(registerUser.fulfilled, (state, action) => {
        const res = action.payload;

        if (res.code == 200) {
          toast.success(res.message)

        }
        else {
          toast.error(res.message)
        }
      })
      .addCase(registerUser.rejected, (state) => {
        toast.error(Errors.REGISTER_FAILED)
      })

      // SEND REGISTER EMAIL OTP
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

      // VERIFY OTP
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

  },
});

export const { clearSuccess, setUser, clearUser, setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
