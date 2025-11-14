// src/slices/ProductInfoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import { API_BASE_URL } from "../config/api";

// Initial state
const initialState = {
  productInfos: [], // Danh sách tất cả product info
  productInfo: null, // Product info hiện tại
  productInfosByProduct: {}, // { productId: [productInfos] }
  loading: false,
  error: null,
};

// Async thunks

// GET ALL PRODUCT INFOS
export const getAllProductInfos = createAsyncThunk(
  "productInfo/getAllProductInfos",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/info`);

      if (!res.ok) throw new Error("Không thể tải danh sách biến thể sản phẩm");

      const json = await res.json();
      console.log("getAllProductInfos API response:", json);
      return json.result || json;
    } catch (error) {
      console.error("getAllProductInfos error:", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET PRODUCT INFOS BY PRODUCT ID
export const getProductInfosByProductId = createAsyncThunk(
  "productInfo/getProductInfosByProductId",
  async (productId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/info`);

      if (!res.ok) throw new Error("Không thể tải thông tin biến thể sản phẩm");

      const json = await res.json();
      console.log("getProductInfosByProductId API response for product", productId, ":", json);
      return { productId, data: json.result || json };
    } catch (error) {
      console.error("getProductInfosByProductId error for product", productId, ":", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET PRODUCT INFO BY ID
export const getProductInfoById = createAsyncThunk(
  "productInfo/getProductInfoById",
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/info/${id}`);

      if (!res.ok) throw new Error("Không thể tải thông tin biến thể sản phẩm");

      const json = await res.json();
      console.log("getProductInfoById API response for id", id, ":", json);
      return json.result || json;
    } catch (error) {
      console.error("getProductInfoById error for id", id, ":", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// CREATE PRODUCT INFO
export const createProductInfo = createAsyncThunk(
  "productInfo/createProductInfo",
  async ({ productId, productInfoData }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productInfoData),
      });

      if (!res.ok) throw new Error("Không thể tạo biến thể sản phẩm");

      const json = await res.json();
      console.log("createProductInfo API response:", json);
      return { productId, data: json.result || json };
    } catch (error) {
      console.error("createProductInfo error:", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// CREATE MULTIPLE PRODUCT INFOS
export const createMultipleProductInfos = createAsyncThunk(
  "productInfo/createMultipleProductInfos",
  async ({ productId, productInfoList }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/info/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productInfoList),
      });

      if (!res.ok) throw new Error("Không thể tạo biến thể sản phẩm");

      const json = await res.json();
      console.log("createMultipleProductInfos API response:", json);
      return { productId, data: json.result || json };
    } catch (error) {
      console.error("createMultipleProductInfos error:", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// UPDATE PRODUCT INFO
export const updateProductInfo = createAsyncThunk(
  "productInfo/updateProductInfo",
  async ({ id, productInfoData }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/products/info/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productInfoData),
      });

      if (!res.ok) throw new Error("Không thể cập nhật biến thể sản phẩm");

      const json = await res.json();
      console.log("updateProductInfo API response for id", id, ":", json);
      return json.result || json;
    } catch (error) {
      console.error("updateProductInfo error for id", id, ":", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// UPDATE PRODUCT INFO QUANTITY
export const updateProductInfoQuantity = createAsyncThunk(
  "productInfo/updateProductInfoQuantity",
  async ({ id, quantity }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(
        `${API_BASE_URL}/api/products/info/${id}/quantity?quantity=${quantity}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Không thể cập nhật số lượng");

      const json = await res.json();
      console.log("updateProductInfoQuantity API response for id", id, ":", json);
      return json.result || json;
    } catch (error) {
      console.error("updateProductInfoQuantity error for id", id, ":", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// DELETE PRODUCT INFO
export const deleteProductInfo = createAsyncThunk(
  "productInfo/deleteProductInfo",
  async (id, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const res = await fetch(`${API_BASE_URL}/api/products/info/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không thể xóa biến thể sản phẩm");

      console.log("deleteProductInfo API response for id", id, ": deleted");
      return id;
    } catch (error) {
      console.error("deleteProductInfo error for id", id, ":", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET PRODUCT COLORS
export const getProductColors = createAsyncThunk(
  "productInfo/getProductColors",
  async (productId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/colors`);

      if (!res.ok) throw new Error("Không thể tải thông tin màu sắc");

      const json = await res.json();
      console.log("getProductColors API response for product", productId, ":", json);
      return json.result || json;
    } catch (error) {
      console.error("getProductColors error for product", productId, ":", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET PRODUCT SIZES
export const getProductSizes = createAsyncThunk(
  "productInfo/getProductSizes",
  async (productId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/sizes`);

      if (!res.ok) throw new Error("Không thể tải thông tin kích thước");

      const json = await res.json();
      console.log("getProductSizes API response for product", productId, ":", json);
      return json.result || json;
    } catch (error) {
      console.error("getProductSizes error for product", productId, ":", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// Slice
const productInfoSlice = createSlice({
  name: "productInfo",
  initialState,
  reducers: {
    clearProductInfo: (state) => {
      state.productInfo = null;
    },
    clearProductInfosByProduct: (state, action) => {
      const productId = action.payload;
      if (state.productInfosByProduct[productId]) {
        delete state.productInfosByProduct[productId];
      }
    },
    setProductInfosForProduct: (state, action) => {
      const { productId, productInfos } = action.payload;
      state.productInfosByProduct[productId] = productInfos;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL PRODUCT INFOS
      .addCase(getAllProductInfos.fulfilled, (state, action) => {
        state.productInfos = action.payload;
        state.error = null;
      })
      .addCase(getAllProductInfos.rejected, (state, action) => {
        state.error = action.payload;
      })

      // GET PRODUCT INFOS BY PRODUCT ID
      .addCase(getProductInfosByProductId.fulfilled, (state, action) => {
        const { productId, data } = action.payload;
        state.productInfosByProduct[productId] = data;
        state.error = null;
      })
      .addCase(getProductInfosByProductId.rejected, (state, action) => {
        state.error = action.payload;
      })

      // GET PRODUCT INFO BY ID
      .addCase(getProductInfoById.fulfilled, (state, action) => {
        state.productInfo = action.payload;
        state.error = null;
      })
      .addCase(getProductInfoById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // CREATE PRODUCT INFO
      .addCase(createProductInfo.fulfilled, (state, action) => {
        const { productId, data } = action.payload;
        if (state.productInfosByProduct[productId]) {
          state.productInfosByProduct[productId].push(data);
        } else {
          state.productInfosByProduct[productId] = [data];
        }
        state.productInfo = data;
        state.error = null;
      })
      .addCase(createProductInfo.rejected, (state, action) => {
        state.error = action.payload;
      })

      // CREATE MULTIPLE PRODUCT INFOS
      .addCase(createMultipleProductInfos.fulfilled, (state, action) => {
        const { productId, data } = action.payload;
        state.productInfosByProduct[productId] = data;
        state.error = null;
      })
      .addCase(createMultipleProductInfos.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE PRODUCT INFO
      .addCase(updateProductInfo.fulfilled, (state, action) => {
        const updatedInfo = action.payload;
        state.productInfo = updatedInfo;

        // Update in productInfosByProduct
        for (const productId in state.productInfosByProduct) {
          const infos = state.productInfosByProduct[productId];
          const index = infos.findIndex(info => info.id === updatedInfo.id);
          if (index !== -1) {
            infos[index] = updatedInfo;
            break;
          }
        }

        // Update in productInfos
        const index = state.productInfos.findIndex(info => info.id === updatedInfo.id);
        if (index !== -1) {
          state.productInfos[index] = updatedInfo;
        }

        state.error = null;
      })
      .addCase(updateProductInfo.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE PRODUCT INFO QUANTITY
      .addCase(updateProductInfoQuantity.fulfilled, (state, action) => {
        const updatedInfo = action.payload;
        state.productInfo = updatedInfo;

        // Update in productInfosByProduct
        for (const productId in state.productInfosByProduct) {
          const infos = state.productInfosByProduct[productId];
          const index = infos.findIndex(info => info.id === updatedInfo.id);
          if (index !== -1) {
            infos[index] = updatedInfo;
            break;
          }
        }

        // Update in productInfos
        const index = state.productInfos.findIndex(info => info.id === updatedInfo.id);
        if (index !== -1) {
          state.productInfos[index] = updatedInfo;
        }

        state.error = null;
      })
      .addCase(updateProductInfoQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })

      // DELETE PRODUCT INFO
      .addCase(deleteProductInfo.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.productInfo = null;

        // Remove from productInfosByProduct
        for (const productId in state.productInfosByProduct) {
          state.productInfosByProduct[productId] = state.productInfosByProduct[productId].filter(
            info => info.id !== deletedId
          );
        }

        // Remove from productInfos
        state.productInfos = state.productInfos.filter(info => info.id !== deletedId);

        state.error = null;
      })
      .addCase(deleteProductInfo.rejected, (state, action) => {
        state.error = action.payload;
      })

      // GET PRODUCT COLORS
      .addCase(getProductColors.fulfilled, (state, action) => {
        // Colors are handled separately, no state update needed
        state.error = null;
      })
      .addCase(getProductColors.rejected, (state, action) => {
        state.error = action.payload;
      })

      // GET PRODUCT SIZES
      .addCase(getProductSizes.fulfilled, (state, action) => {
        // Sizes are handled separately, no state update needed
        state.error = null;
      })
      .addCase(getProductSizes.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearProductInfo,
  clearProductInfosByProduct,
  setProductInfosForProduct
} = productInfoSlice.actions;

export default productInfoSlice.reducer;