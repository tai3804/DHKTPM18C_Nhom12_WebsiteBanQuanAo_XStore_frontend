import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";
import { API_BASE_URL } from "../config/api";

const initialState = {
  stocks: [], // Danh sách tất cả kho
  stock:  null, // Kho hiện tại (chi tiết)
  stockItems: [], // Danh sách sản phẩm trong kho hiện tại
  productStocks: [], // Danh sách stock items của một sản phẩm
  selectedStock: null, // Kho được chọn trong header
  // ✅ CACHE cho stock quantities - tránh fetch lại nhiều lần
  allStockQuantities: {}, // Cache: { stockId: { [productInfoId]: quantity } }
  totalStockQuantities: {}, // Cache: { productId: { [productInfoId]: totalQuantity } }
  lastFetchTime: {}, // Track thời gian fetch để tránh fetch quá thường xuyên
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
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`${API_BASE_URL}/api/stocks`, {
        method: "GET",
        headers,
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

// LẤY STOCK ITEMS THEO PRODUCT ID
export const getProductStocks = createAsyncThunk(
  "stock/getProductStocks",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/stocks`, {
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

// ✅ MỚI: Fetch total quantities cho tất cả products (gọi 1 lần duy nhất)
export const fetchAllTotalQuantities = createAsyncThunk(
  "stock/fetchAllTotalQuantities",
  async (productIds, { dispatch, getState, rejectWithValue }) => {
    // Không dùng loading global để tránh block UI
    try {
      const token = getState().auth.token;
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      // Fetch song song cho tất cả products
      const promises = productIds.map((productId) =>
        fetch(`${API_BASE_URL}/api/stocks/products/${productId}/total-quantities`, {
          headers,
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => ({
            productId,
            quantities: data?.result || {},
          }))
          .catch(() => ({ productId, quantities: {} }))
      );

      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error("Error fetching all total quantities:", error);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ MỚI: Fetch selected stock quantities (gọi 1 lần cho cả stock)
export const fetchStockQuantities = createAsyncThunk(
  "stock/fetchStockQuantities",
  async (stockId, { dispatch, getState, rejectWithValue }) => {
    // Check cache trước - nếu đã fetch trong vòng 5 phút thì skip
    const state = getState().stock;
    const lastFetch = state.lastFetchTime[stockId];
    const now = Date.now();
    if (lastFetch && now - lastFetch < 5 * 60 * 1000) {
      console.log(`Using cached data for stock ${stockId}`);
      return { stockId, cached: true };
    }

    try {
      const token = getState().auth.token;
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(
        `${API_BASE_URL}/api/stocks/${stockId}/items`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        const quantities = {};
        (data.result || []).forEach((product) => {
          (product.variants || []).forEach((variant) => {
            if (variant.id) {
              quantities[variant.id] = variant.quantity;
            }
          });
        });
        console.log(`Fetched stock ${stockId} quantities:`, quantities);
        return { stockId, quantities, timestamp: now };
      }
      return { stockId, quantities: {}, timestamp: now };
    } catch (error) {
      console.error("Error fetching stock quantities:", error);
      return rejectWithValue(error.message);
    }
  }
);

//SLICE

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setSelectedStock: (state, action) => {
      state.selectedStock = action.payload;
    },
    clearSelectedStock: (state) => {
      state.selectedStock = null;
    },
    // ✅ Reset cache khi cần
    clearStockCache: (state) => {
      state.allStockQuantities = {};
      state.totalStockQuantities = {};
      state.lastFetchTime = {};
    },
  },
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
      })
      // Lấy stock items theo product ID
      .addCase(getProductStocks.fulfilled, (state, action) => {
        state.productStocks = action.payload;
      })
      // ✅ Cache total quantities cho tất cả products
      .addCase(fetchAllTotalQuantities.fulfilled, (state, action) => {
        action.payload.forEach(({ productId, quantities }) => {
          state.totalStockQuantities[productId] = quantities;
        });
      })
      // ✅ Cache stock quantities
      .addCase(fetchStockQuantities.fulfilled, (state, action) => {
        const { stockId, quantities, timestamp, cached } = action.payload;
        if (!cached && quantities) {
          state.allStockQuantities[stockId] = quantities;
          state.lastFetchTime[stockId] = timestamp;
        }
      });
  },
});

export const { setSelectedStock, clearSelectedStock, clearStockCache } = stockSlice.actions;
export default stockSlice.reducer;
