// src/slice/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";
import Messages from "../constants/successes";


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

  },
});

export const { clearSuccess, setUser, clearUser, setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
