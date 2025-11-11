import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";
import { API_BASE_URL } from "../config/api";

const initialState = {
  accounts: [],
  account: null, // lưu account đang xem / chỉnh sửa
};

// GET ALL ACCOUNTS
export const getAccounts = createAsyncThunk(
  "account/getAccounts",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/accounts`);
      if (!res.ok) throw new Error(Errors.ACCOUNT_FETCH_FAILED);

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

// GET ACCOUNT BY ID
export const getAccountById = createAsyncThunk(
  "account/getAccountById",
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/accounts/${id}`);
      if (!res.ok) throw new Error(Errors.ACCOUNT_FETCH_FAILED);

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

// CREATE ACCOUNT
export const createAccount = createAsyncThunk(
  "account/createAccount",
  async (newAccount, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });
      if (!res.ok) throw new Error(Errors.ACCOUNT_CREATE_FAILED);

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

// UPDATE ACCOUNT
export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async ({ id, accountData }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/accounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountData),
      });
      if (!res.ok) throw new Error(Errors.ACCOUNT_UPDATE_FAILED);

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

// DELETE ACCOUNT
export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(Errors.ACCOUNT_DELETE_FAILED);

      let json;
      try {
        json = await res.json();
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

// SLICE
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload;
      })
      .addCase(getAccountById.fulfilled, (state, action) => {
        state.account = action.payload;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.accounts[index] = action.payload;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((a) => a.id !== action.payload);
      });
  },
});

export default accountSlice.reducer;
