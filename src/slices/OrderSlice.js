import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import { API_BASE_URL } from "../config/api";

// ----------------- INITIAL STATE -----------------
const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};

// ----------------- THUNKS -----------------

// FETCH ALL ORDERS
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Lấy danh sách đơn hàng thất bại");

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

// FETCH ORDER BY ID
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (id, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Lấy thông tin đơn hàng thất bại");

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

// ----------------- SLICE -----------------
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ALL ORDERS
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      // FETCH ORDER BY ID
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.order = action.payload;
      });
  },
});

export default orderSlice.reducer;
