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
  productInfo: [], // thông tin biến thể (color + size + quantity) cho product hiện tại
  productColors: [], // danh sách màu unique từ productInfo
  productSizes: [], // danh sách size unique từ productInfo
  allProductVariants: {}, // { productId: { colors: [], sizes: [] } } - lưu tất cả variants
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
      
      // Nếu newProduct là FormData, gọi endpoint /api/products/upload
      const isFormData = newProduct instanceof FormData;
      const endpoint = isFormData ? "/api/products/upload" : "/api/products";
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: isFormData 
          ? { "Authorization": `Bearer ${token}` }
          : { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
        body: isFormData ? newProduct : JSON.stringify(newProduct),
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
      
      // Nếu productData là FormData, gọi endpoint /api/products/{id}/upload
      const isFormData = productData instanceof FormData;
      const endpoint = isFormData ? `/api/products/${id}/upload` : `/api/products/${id}`;
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: isFormData 
          ? { "Authorization": `Bearer ${token}` }
          : { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
        body: isFormData ? productData : JSON.stringify(productData),
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

// GET ALL PRODUCT VARIANTS (colors and sizes for all products)
export const getAllProductVariants = createAsyncThunk(
  "product/getAllProductVariants",
  async (_, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      // Lấy danh sách sản phẩm hiện tại từ state
      const products = getState().product.products;
      
      if (!products || products.length === 0) {
        return {};
      }

      const variants = {};
      
      // Load variants cho từng sản phẩm
      for (const product of products) {
        try {
          const data = await fetch(`${API_BASE_URL}/api/products/${product.id}/info`);
          if (data.ok) {
            const infoData = await data.json();
            const infos = infoData.result || infoData;

            if (infos && infos.length > 0) {
              const uniqueColors = [];
              const uniqueSizes = new Set();

              infos.forEach((info) => {
                if (!uniqueColors.find((c) => c.name === info.colorName)) {
                  uniqueColors.push({
                    name: info.colorName,
                    hexCode: info.colorHexCode,
                  });
                }
                uniqueSizes.add(info.sizeName);
              });

              variants[product.id] = {
                colors: uniqueColors.slice(0, 3), // tối đa 3 màu
                sizes: Array.from(uniqueSizes).slice(0, 3), // tối đa 3 kích thước
              };
            } else {
              variants[product.id] = { colors: [], sizes: [] };
            }
          } else {
            variants[product.id] = { colors: [], sizes: [] };
          }
        } catch (error) {
          console.warn(`Error loading variants for product ${product.id}:`, error);
          variants[product.id] = { colors: [], sizes: [] };
        }
      }

      return variants;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET PRODUCT INFO (biến thể: color + size + quantity)
export const getProductInfo = createAsyncThunk(
  "product/getProductInfo",
  async (productId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/info`);

      if (!res.ok) throw new Error("Không thể tải thông tin biến thể sản phẩm");

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

// GET PRODUCT COLORS (từ product info)
export const getProductColors = createAsyncThunk(
  "product/getProductColors",
  async (productId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/colors`);

      if (!res.ok) throw new Error("Không thể tải thông tin màu sắc");

      const json = await res.json();
      const colorsData = json.result || json;
      
      // Transform data to match frontend expectations
      const transformedColors = colorsData.map((color, index) => ({
        id: index + 1, // Generate fake id
        name: color.name,
        hexCode: color.hexCode
      }));
      
      return transformedColors;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// GET PRODUCT SIZES (từ product info)
export const getProductSizes = createAsyncThunk(
  "product/getProductSizes",
  async (productId, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/sizes`);

      if (!res.ok) throw new Error("Không thể tải thông tin kích thước");

      const json = await res.json();
      const sizesData = json.result || json;
      
      // Transform data to match frontend expectations
      const transformedSizes = sizesData.map((sizeName, index) => ({
        id: index + 1, // Generate fake id
        name: sizeName,
        description: sizeName // Use name as description for now
      }));
      
      return transformedSizes;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// CREATE PRODUCT INFO
export const createProductInfo = createAsyncThunk(
  "product/createProductInfo",
  async ({ productId, productInfo }, { dispatch, getState, rejectWithValue }) => {
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
        body: JSON.stringify(productInfo),
      });

      if (!res.ok) throw new Error("Không thể tạo biến thể sản phẩm");

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

// CREATE MULTIPLE PRODUCT INFO
export const createMultipleProductInfo = createAsyncThunk(
  "product/createMultipleProductInfo",
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
      return json.result || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// UPDATE PRODUCT INFO
export const updateProductInfo = createAsyncThunk(
  "product/updateProductInfo",
  async ({ id, productInfo }, { dispatch, getState, rejectWithValue }) => {
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
        body: JSON.stringify(productInfo),
      });

      if (!res.ok) throw new Error("Không thể cập nhật biến thể sản phẩm");

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

// UPDATE PRODUCT INFO QUANTITY
export const updateProductInfoQuantity = createAsyncThunk(
  "product/updateProductInfoQuantity",
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
      return json.result || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// DELETE PRODUCT INFO
export const deleteProductInfo = createAsyncThunk(
  "product/deleteProductInfo",
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

      return id;
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
    clearProductDetail: (state) => {
      state.product = null;
      state.productInfo = [];
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

      // Lấy tất cả product variants
      .addCase(getAllProductVariants.fulfilled, (state, action) => {
        state.allProductVariants = action.payload;
      })

      // Lấy colors cho product
      .addCase(getProductColors.fulfilled, (state, action) => {
        state.productColors = action.payload;
      })

      // Lấy sizes cho product
      .addCase(getProductSizes.fulfilled, (state, action) => {
        state.productSizes = action.payload;
      })

      // Tạo product info
      .addCase(createProductInfo.fulfilled, (state, action) => {
        state.productInfo.push(action.payload);
      })

      // Tạo nhiều product info
      .addCase(createMultipleProductInfo.fulfilled, (state, action) => {
        state.productInfo = action.payload;
      })

      // Cập nhật product info
      .addCase(updateProductInfo.fulfilled, (state, action) => {
        const index = state.productInfo.findIndex((info) => info.id === action.payload.id);
        if (index !== -1) {
          state.productInfo[index] = action.payload;
        }
      })

      // Cập nhật quantity của product info
      .addCase(updateProductInfoQuantity.fulfilled, (state, action) => {
        const index = state.productInfo.findIndex((info) => info.id === action.payload.id);
        if (index !== -1) {
          state.productInfo[index] = action.payload;
        }
      })

      // Xóa product info
      .addCase(deleteProductInfo.fulfilled, (state, action) => {
        state.productInfo = state.productInfo.filter((info) => info.id !== action.payload);
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
        // Thêm variant rỗng cho sản phẩm mới
        state.allProductVariants[action.payload.id] = { colors: [], sizes: [] };
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

        // Cập nhật allProductVariants - tạm thời để trống, sẽ được load lại từ ManageProductsPage
        state.allProductVariants[action.payload.id] = { colors: [], sizes: [] };
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
        
        // Xóa khỏi allProductVariants
        delete state.allProductVariants[action.payload];
        
        // Nếu sản phẩm đang được chọn là sản phẩm vừa bị xóa
        if (state.product && state.product.id === action.payload) {
          state.product = null;
        }
      });
  },
});

export const { clearProducts, setProducts } = productSlice.actions;
export default productSlice.reducer;