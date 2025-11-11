import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";
import { API_BASE_URL } from "../config/api";

const initialState = {
  stocks: [], // Danh sách tất cả kho
  stock: null, // Kho hiện tại (chi tiết)
  stockItems: [], // Danh sách sản phẩm trong kho hiện tại
};

//THUNKS
//STOCK CRUD
///GET ALL STOCK
export const getStocks = createAsyncThunk(
  "stock/getStocks",
  async (_, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/stocks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(Errors.STOCK_FETCH_FAILED);
      const json = await res.json();
      console.log("getStocks - fetched stocks:", json);
      return json.result || json;
    } catch (error) {
      console.log("getStocks - error:", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

//CREATE STOCK
export const createStock = createAsyncThunk(
  "stock/createStock",
  async (newStock, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/stocks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStock),
      });
      if (!res.ok) throw new Error(Errors.STOCK_CREATE_FAILED);
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
//UPDATE STOCK
export const updateStock = createAsyncThunk(
  "stock/updateStock",
  async ({ id, stockData }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/stocks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(stockData),
      });
      if (!res.ok) throw new Error(Errors.STOCK_UPDATE_FAILED);
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

//DELETE STOCK
export const deleteStock = createAsyncThunk(
  "stock/deleteStock",
  async (id, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/stocks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(Errors.STOCK_DELETE_FAILED);
      return id; // Chỉ trả về ID để xóa khỏi state
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET /stocks/{id}

export const getStockById = createAsyncThunk(
  "stock/getStockById",
  async (id, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/stocks/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(Errors.STOCK_FETCH_FAILED);
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

//STOCK ITEM CRUD

//LẤY DANH SÁCH SẢN PHẨM TRONG KHO

export const getStockItems = createAsyncThunk(
  "stock/getStockItems",
  async (stockId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/stocks/${stockId}/items`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(Errors.STOCK_ITEM_FETCH_FAILED);
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

//CẬP NHẬT SỐ LƯỢNG (SET TRỰC TIẾP)

export const setItemQuantity = createAsyncThunk(
  "stock/setItemQuantity",
  async (
    { stockId, productId, quantity },
    { dispatch, getState, rejectWithValue }
  ) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(
        `${API_BASE_URL}/api/stocks/${stockId}/items?productId=${productId}&quantity=${quantity}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(Errors.STOCK_ITEM_UPDATE_FAILED);
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

//TĂNG SỐ LƯỢNG
export const increaseItem = createAsyncThunk(
  "stock/increaseItem",
  async (
    { stockId, productId, amount },
    { dispatch, getState, rejectWithValue }
  ) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(
        `${API_BASE_URL}/api/stocks/${stockId}/items/increase?productId=${productId}&amount=${amount}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(Errors.STOCK_ITEM_INCREASE_FAILED);
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

///GIẢM SỐ LƯỢNG
export const decreaseItem = createAsyncThunk(
  "stock/decreaseItem",
  async (
    { stockId, productId, amount },
    { dispatch, getState, rejectWithValue }
  ) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(
        `${API_BASE_URL}/api/stocks/${stockId}/items/decrease?productId=${productId}&amount=${amount}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(Errors.STOCK_ITEM_DECREASE_FAILED);
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

//XÓA SẢN PHẨM KHỎI KHO

export const deleteStockItem = createAsyncThunk(
  "stock/deleteStockItem",
  async ({ stockId, productId }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(
        `${API_BASE_URL}/api/stocks/${stockId}/items?productId=${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(Errors.STOCK_ITEM_DELETE_FAILED);
      return { stockId, productId };
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

//SLICE

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ----------------- STOCK -----------------
      //lấy danh sách tất cả các kho
      .addCase(getStocks.fulfilled, (state, action) => {
        state.stocks = action.payload;
      })
      //lấy thông tin kho theo ID
      .addCase(getStockById.fulfilled, (state, action) => {
        state.stock = action.payload;
      })
      // tạo kho
      .addCase(createStock.fulfilled, (state, action) => {
        state.stocks.push(action.payload);
      })
      // cập nhật
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.stocks.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.stocks[index] = action.payload;
        if (state.stock?.id === action.payload.id) state.stock = action.payload;
      })
      //Xóa kho
      .addCase(deleteStock.fulfilled, (state, action) => {
        state.stocks = state.stocks.filter((s) => s.id !== action.payload);
        if (state.stock?.id === action.payload) {
          state.stock = null;
          state.stockItems = [];
        }
      })

      // ----------------- STOCK ITEM -----------------
      //lấy danh sách sản phẩm trong kho
      .addCase(getStockItems.fulfilled, (state, action) => {
        state.stockItems = action.payload;
      })
      //cập nhật số lượng sản phẩm
      .addCase(setItemQuantity.fulfilled, (state, action) => {
        const index = state.stockItems.findIndex(
          (i) => i.productId === action.payload.productId
        );
        if (index !== -1) {
          state.stockItems[index] = action.payload; // Cập nhật sản phẩm trong kho
        } else {
          state.stockItems.push(action.payload); //// Thêm sản phẩm mới vào kho
        }
      })
      // Tăng số lượng
      .addCase(increaseItem.fulfilled, (state, action) => {
        const index = state.stockItems.findIndex(
          (i) => i.productId === action.payload.productId
        );
        if (index !== -1) state.stockItems[index] = action.payload; // Cập nhật sản phẩm với số lượng tăng
      })
      // Giảm số lượng
      .addCase(decreaseItem.fulfilled, (state, action) => {
        const index = state.stockItems.findIndex(
          (i) => i.productId === action.payload.productId
        );
        if (index !== -1) state.stockItems[index] = action.payload; // Cập nhật sản phẩm với số lượng giảm
      })
      // Xóa sản phẩm trong kho
      .addCase(deleteStockItem.fulfilled, (state, action) => {
        state.stockItems = state.stockItems.filter(
          (i) => i.productId !== action.payload.productId // Xóa sản phẩm khỏi kho
        );
      });
  },
});

export default stockSlice.reducer;
