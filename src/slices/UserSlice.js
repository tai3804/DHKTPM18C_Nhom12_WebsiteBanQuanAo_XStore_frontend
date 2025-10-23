// src/slices/UserSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";

const initialState = {
  users: [], // danh sách tất cả user
  user: null, // user hiện tại (theo ID hoặc username)
};

// ----------------- THUNKS -----------------

// GET ALL USERS
export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch("/api/users");

      // cái này là báo lỗi ra console, user bình thường sẽ k bt cách xem
      if (!res.ok) throw new Error(Errors.USER_FETCH_FAILED); 

      const json = await res.json();
      /**
       * data nhận được từ server sẽ có dạng là: 
       * {
       *  code: ...,
       *  message: ...,
       *  result: {}
       * }
       * 
       * đúng như trong backend mình làm (là cái APIResponse ấy)
       * nhưng khi trả về bằng thunk thì nó sẽ có dạng là: 
       * {
       *  meta: {}
       *  payload: {
       *    code: ...,
       *    message: ...,
       *    result: ...,
       *  }
       *  type: ...
       * }
       * 
       * cái meta với type thì k cần quan tâm, dữ liệu của mình sẽ trả về trong payload
       * nên khi cần lấy dữ liệu thì phải lấy từ meta
       * và nhớ await để đợi fetch xong nếu k nó sẽ trả ra 1 Promise
       * 
       * ví dụ: để lất tất cả user:
       * 
       * const users = await getUsers()
       * user.payload.result
       * 
       * phải trỏ vào như vậy mới lồi cái data mình cần ra
       */
      return json.data || json; // phòng trường hợp backend không bọc data
    } catch (error) {
      dispatch(setError(error.message));
      // cái này là set lỗi lên slice toàn cục, mình sẽ check và ném lỗi ra giao diện cho người dùng xem
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET USER BY ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (id, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Lấy token từ auth slice
      const token = getState().auth.token;


      const res = await fetch(`/api/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // gắn token
        }
      });

      if (!res.ok) throw new Error(Errors.USER_FETCH_FAILED);

      const json = await res.json();
      return json.data || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET USER BY USERNAME
export const getUserByUsername = createAsyncThunk(
  "user/getUserByUsername",
  async (username, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Lấy token từ auth slice
      const token = getState().auth.token;

      console.log(token);
      
      const res = await fetch(`/api/users/username/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(Errors.USER_FETCH_FAILED);

      const json = await res.json();
      return json.data || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// CREATE USER
export const createUser = createAsyncThunk(
  "user/createUser",
  async (newUser, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error(Errors.USER_CREATE_FAILED);

      const json = await res.json();
      return json.data || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// UPDATE USER
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error(Errors.USER_UPDATE_FAILED);

      const json = await res.json();
      return json.data || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// DELETE USER
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(Errors.USER_DELETE_FAILED);

      let json;
      try {
        json = await res.json(); // có thể không có body
      } catch {
        json = { data: id };
      }

      return json.data || id;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ----------------- SLICE -----------------
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Lấy danh sách
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      // Lấy 1 user
      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getUserByUsername.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // Tạo user
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // Cập nhật user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // Xóa user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
