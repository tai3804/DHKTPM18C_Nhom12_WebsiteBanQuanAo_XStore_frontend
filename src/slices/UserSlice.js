import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";

const initialState = {
  users: [],
  user: null, // lưu user đang xem / chỉnh sửa
};

// GET ALL USERS
export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Không thể tải danh sách người dùng");

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
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET USER BY ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error("Không thể tải thông tin người dùng");

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
      if (!res.ok) throw new Error("Không thể tạo người dùng mới");

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
      if (!res.ok) throw new Error("Không thể cập nhật người dùng");

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

//  DELETE USER
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Không thể xóa người dùng");

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

//  SLICE
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
