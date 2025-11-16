import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";
import { API_BASE_URL } from "../config/api";

const initialState = {
  productSales: [], // danh sách tất cả product sales
  productSale: null, // product sale hiện tại (theo productId)
};

// ----------------- THUNKS -----------------

// GET ALL PRODUCT SALES
export const getProductSales = createAsyncThunk(
  "productSales/getProductSales",
  async (_, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/product-sales`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(Errors.PRODUCT_SALES_FETCH_FAILED || "Lỗi khi lấy danh sách giảm giá sản phẩm");

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

// GET PRODUCT SALES BY PRODUCT ID
export const getProductSalesById = createAsyncThunk(
  "productSales/getProductSalesById",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/product-sales/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(Errors.PRODUCT_SALES_FETCH_FAILED || "Lỗi khi lấy giảm giá sản phẩm");

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

// CREATE PRODUCT SALES
export const createProductSales = createAsyncThunk(
  "productSales/createProductSales",
  async (newProductSales, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/product-sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newProductSales),
      });
      if (!res.ok) throw new Error(Errors.PRODUCT_SALES_CREATE_FAILED || "Lỗi khi tạo giảm giá sản phẩm");

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

// UPDATE PRODUCT SALES
export const updateProductSales = createAsyncThunk(
  "productSales/updateProductSales",
  async ({ productId, productSalesData }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/product-sales/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(productSalesData),
      });
      if (!res.ok) throw new Error(Errors.PRODUCT_SALES_UPDATE_FAILED || "Lỗi khi cập nhật giảm giá sản phẩm");

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

// DELETE PRODUCT SALES
export const deleteProductSales = createAsyncThunk(
  "productSales/deleteProductSales",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/product-sales/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(Errors.PRODUCT_SALES_DELETE_FAILED || "Lỗi khi xóa giảm giá sản phẩm");

      let json;
      try {
        json = await res.json();
      } catch {
        json = { result: productId };
      }

      return json.result || productId;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ----------------- SLICE -----------------
const productSalesSlice = createSlice({
  name: "productSales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Lấy danh sách
      .addCase(getProductSales.fulfilled, (state, action) => {
        state.productSales = action.payload;
      })

      // Lấy 1 product sales
      .addCase(getProductSalesById.fulfilled, (state, action) => {
        state.productSale = action.payload;
      })

      // Tạo product sales
      .addCase(createProductSales.fulfilled, (state, action) => {
        state.productSales.push(action.payload);
      })

      // Cập nhật product sales
      .addCase(updateProductSales.fulfilled, (state, action) => {
        const index = state.productSales.findIndex(
          (ps) => ps.product.id === action.payload.product.id
        );
        if (index !== -1) {
          state.productSales[index] = action.payload;
        }
      })

      // Xóa product sales
      .addCase(deleteProductSales.fulfilled, (state, action) => {
        state.productSales = state.productSales.filter(
          (ps) => ps.product.id !== action.payload
        );
      });
  },
});

export default productSalesSlice.reducer;