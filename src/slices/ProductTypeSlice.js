// src/slices/ProductTypeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";

// Mở rộng đối tượng Errors để thêm các mã lỗi cho loại sản phẩm
const initialState = {
  productTypes: [], // danh sách tất cả loại sản phẩm
  productType: null, // loại sản phẩm hiện tại (theo ID)
};

// ----------------- THUNKS -----------------

// GET ALL PRODUCT TYPES
export const getProductTypes = createAsyncThunk(
  "productType/getProductTypes",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch("/api/product-types");

      if (!res.ok) throw new Error(Errors.PRODUCT_TYPE_FETCH_FAILED);

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

// GET PRODUCT TYPE BY ID
export const getProductTypeById = createAsyncThunk(
  "productType/getProductTypeById",
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`/api/product-types/${id}`);

      if (!res.ok) throw new Error(Errors.PRODUCT_TYPE_FETCH_BY_ID_FAILED);

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

// CREATE PRODUCT TYPE
export const createProductType = createAsyncThunk(
  "productType/createProductType",
  async (newProductType, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Lấy token từ auth slice
      const token = getState().auth.token;
      
      const res = await fetch("/api/product-types", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newProductType),
      });
      
      if (!res.ok) throw new Error(Errors.PRODUCT_TYPE_CREATE_FAILED);

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

// UPDATE PRODUCT TYPE
export const updateProductType = createAsyncThunk(
  "productType/updateProductType",
  async ({ id, productTypeData }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Lấy token từ auth slice
      const token = getState().auth.token;
      
      const res = await fetch(`/api/product-types/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(productTypeData),
      });
      
      if (!res.ok) throw new Error(Errors.PRODUCT_TYPE_UPDATE_FAILED);

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

// DELETE PRODUCT TYPE
export const deleteProductType = createAsyncThunk(
  "productType/deleteProductType",
  async (id, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Lấy token từ auth slice
      const token = getState().auth.token;
      
      const res = await fetch(`/api/product-types/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      
      if (!res.ok) throw new Error(Errors.PRODUCT_TYPE_DELETE_FAILED);

      let json;
      try {
        json = await res.json(); // có thể không có body
      } catch {
        json = { result: id };
      }

      return json.result || id;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ----------------- SLICE -----------------
const productTypeSlice = createSlice({
  name: "productType",
  initialState,
  reducers: {
    setProductTypes: (state, action) => {
      state.productType = action.payload;
    },
    clearProductTypes: (state) => {
      state.productType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách loại sản phẩm
      .addCase(getProductTypes.fulfilled, (state, action) => {
        state.productTypes = action.payload;
      })

      // Lấy 1 loại sản phẩm
      .addCase(getProductTypeById.fulfilled, (state, action) => {
        state.productType = action.payload;
      })

      // Tạo loại sản phẩm
      .addCase(createProductType.fulfilled, (state, action) => {
        state.productTypes.push(action.payload);
        state.productType = action.payload;
      })

      // Cập nhật loại sản phẩm
      .addCase(updateProductType.fulfilled, (state, action) => {
        const index = state.productTypes.findIndex((pt) => pt.id === action.payload.id);
        if (index !== -1) {
          state.productTypes[index] = action.payload;
        }
        state.productType = action.payload;
      })

      // Xóa loại sản phẩm
      .addCase(deleteProductType.fulfilled, (state, action) => {
        state.productTypes = state.productTypes.filter((pt) => pt.id !== action.payload);
        
        // Nếu loại sản phẩm đang được chọn là loại sản phẩm vừa bị xóa
        if (state.productType && state.productType.id === action.payload) {
          state.productType = null;
        }
      });
  },
});

export const { clearProductTypes, setProductTypes } = productTypeSlice.actions;
export default productTypeSlice.reducer;