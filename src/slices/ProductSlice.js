// src/slices/ProductSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";
import { API_BASE_URL } from "../config/api";

// Mở rộng đối tượng Errors để thêm các mã lỗi cho sản phẩm
const ProductErrors = {
  ...Errors,
  PRODUCT_FETCH_FAILED: "Không thể tải danh sách sản phẩm",
  PRODUCT_FETCH_BY_ID_FAILED: "Không thể tải thông tin sản phẩm",
  PRODUCT_CREATE_FAILED: "Không thể tạo sản phẩm mới",
  PRODUCT_UPDATE_FAILED: "Không thể cập nhật sản phẩm",
  PRODUCT_DELETE_FAILED: "Không thể xóa sản phẩm",
};


// let storedProducts = [];
// try {
//   const data = localStorage.getItem("products");
//   const parsed = JSON.parse(data);
//   storedProducts = Array.isArray(parsed) ? parsed : [];
// } catch (e) {
//   storedProducts = [];
// }

const initialState = {
  products:  [], // luôn là mảng
  product: null,
  productStocks: [], // stock items cho product hiện tại
  productColors: [], // colors cho product hiện tại
  productSizes: [], // sizes cho product hiện tại
};


// ----------------- THUNKS -----------------

// GET ALL PRODUCTS
export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);

      if (!res.ok) throw new Error(ProductErrors.PRODUCT_FETCH_FAILED);

      const json = await res.json();
      console.log("getProducts API response:", json);
      
      // Backend trả về ApiResponse với structure: { code, message, result }
      if (json.result !== undefined) {
        return json.result;
      }
      return json;
    } catch (error) {
      console.error("getProducts error:", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET PRODUCT BY ID
export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`);

      if (!res.ok) throw new Error(ProductErrors.PRODUCT_FETCH_BY_ID_FAILED);

      const json = await res.json();
      console.log("getProductById API response:", json);
      
      // Backend trả về ApiResponse với structure: { code, message, result }
      if (json.result !== undefined) {
        return json.result;
      }
      return json;
    } catch (error) {
      console.error("getProductById error:", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET PRODUCTS BY TYPE ID
export const getProductsByTypeId = createAsyncThunk(
  "product/getProductsByTypeId",
  async (typeId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/type/${typeId}`);

      if (!res.ok) throw new Error(ProductErrors.PRODUCT_FETCH_FAILED);

      const json = await res.json();
      return { typeId, products: json.result || json };
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// CREATE PRODUCT
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (newProduct, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Lấy token từ auth slice
      const token = getState().auth.token;
      
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      
      if (!res.ok) throw new Error(ProductErrors.PRODUCT_CREATE_FAILED);

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

// UPDATE PRODUCT
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, productData }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Lấy token từ auth slice
      const token = getState().auth.token;
      
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      
      if (!res.ok) throw new Error(ProductErrors.PRODUCT_UPDATE_FAILED);

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

// DELETE PRODUCT
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Lấy token từ auth slice
      const token = getState().auth.token;
      
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      
      if (!res.ok) throw new Error(ProductErrors.PRODUCT_DELETE_FAILED);

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

export const searchProductsByName = createAsyncThunk(
  "product/searchProductsByName",
  async (keyword, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Nếu keyword rỗng, trả về tất cả sản phẩm
      const url = keyword && keyword.trim() !== ""
        ? `/api/products/search?q=${encodeURIComponent(keyword.trim())}`
        : "/api/products";

      const res = await fetch(url);

      if (!res.ok) throw new Error(ProductErrors.PRODUCT_FETCH_FAILED);

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

// GET PRODUCT STOCKS
export const getProductStocks = createAsyncThunk(
  "product/getProductStocks",
  async (productId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/stocks`);

      if (!res.ok) throw new Error("Không thể tải thông tin kho hàng");

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

// GET PRODUCT COLORS
export const getProductColors = createAsyncThunk(
  "product/getProductColors",
  async (productId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/colors`);

      if (!res.ok) throw new Error("Không thể tải thông tin màu sắc");

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

// GET PRODUCT SIZES
export const getProductSizes = createAsyncThunk(
  "product/getProductSizes",
  async (productId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/sizes`);

      if (!res.ok) throw new Error("Không thể tải thông tin kích thước");

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
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.product = null;
      state.productStocks = [];
      state.productColors = [];
      state.productSizes = [];
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách sản phẩm
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        localStorage.setItem("products", JSON.stringify(action.payload));
      })

      // Lấy 1 sản phẩm
      .addCase(getProductById.fulfilled, (state, action) => {
        state.product = action.payload;
      })

      // Lấy stock items cho product
      .addCase(getProductStocks.fulfilled, (state, action) => {
        state.productStocks = action.payload;
      })

      // Lấy colors cho product
      .addCase(getProductColors.fulfilled, (state, action) => {
        state.productColors = action.payload;
      })

      // Lấy sizes cho product
      .addCase(getProductSizes.fulfilled, (state, action) => {
        state.productSizes = action.payload;
      })

      // Lấy sản phẩm theo loại
      .addCase(getProductsByTypeId.fulfilled, (state, action) => {
        const { typeId, products } = action.payload;
        state.productsByType[typeId] = products;
      })

      // Tạo sản phẩm
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.product = action.payload;
      })

      // Cập nhật sản phẩm
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.product = action.payload;
        
        // Cập nhật trong productsByType nếu có
        for (const typeId in state.productsByType) {
          const typeProducts = state.productsByType[typeId];
          const typeIndex = typeProducts.findIndex((p) => p.id === action.payload.id);
          if (typeIndex !== -1) {
            state.productsByType[typeId][typeIndex] = action.payload;
          }
        }
      })

      // Xóa sản phẩm
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        
        // Xóa khỏi productsByType nếu có
        for (const typeId in state.productsByType) {
          state.productsByType[typeId] = state.productsByType[typeId].filter(
            (p) => p.id !== action.payload
          );
        }
        
        // Nếu sản phẩm đang được chọn là sản phẩm vừa bị xóa
        if (state.product && state.product.id === action.payload) {
          state.product = null;
        }
      });
  },
});

export const { clearProducts, setProducts } = productSlice.actions;
export default productSlice.reducer;