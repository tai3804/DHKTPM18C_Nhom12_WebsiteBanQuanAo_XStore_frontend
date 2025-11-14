import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Errors } from "../constants/errors";
import { Successes } from "../constants/successes";
import { clearError, setError } from "./ErrorSlice";
import { startLoading, stopLoading } from "./LoadingSlice";
import { API_BASE_URL } from "../config/api";

// ✅ GET CART BY USER ID
export const getCartByUser = createAsyncThunk(
  "cart/getCartByUser",
  async (userId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/carts/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        // Nếu user chưa có cart, trả về null thay vì throw error
        if (res.status === 404) {
          return null;
        }
        throw new Error(json.message || Errors.CART_FETCH_FAILED);
      }

      return json.result;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ✅ CREATE CART
export const createCart = createAsyncThunk(
  "cart/createCart",
  async (userId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || Errors.CART_CREATE_FAILED);
      }

      toast.success("Đã tạo giỏ hàng mới");
      return json.result;
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message);
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ✅ ADD TO CART
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ cartId, productId, quantity = 1, stockId, color, size }, { dispatch, getState, rejectWithValue }) => { // <-- Thêm stockId
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      // KIỂM TRA STOCKID
      if (!stockId) {
        throw new Error("Vui lòng chọn kho hàng");
      }

      const res = await fetch(`${API_BASE_URL}/api/cart-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartId, productId, stockId, quantity, color, size }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || Errors.CART_ADD_FAILED);
      }

      // Xóa toast từ đây để tránh duplicate với ProductDetailPage
      // toast.success(Successes.CART_ADD_SUCCESS);

      // Lấy lại cart sau khi thêm sản phẩm
      const userId = getState().auth.user?.id;
      if (userId) {
        dispatch(getCartByUser(userId));
      }

      return json.result;
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message);
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ✅ UPDATE CART ITEM QUANTITY
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ cartItemId, quantity }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/cart-items/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || Errors.CART_UPDATE_FAILED);
      }

      toast.success("Cập nhật số lượng thành công");

      // Lấy lại cart sau khi cập nhật
      const userId = getState().auth.user?.id;
      if (userId) {
        dispatch(getCartByUser(userId));
      }

      return json.result;
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message);
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ✅ REMOVE FROM CART
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/cart-items/${cartItemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || Errors.CART_REMOVE_FAILED);
      }

      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");

      // Lấy lại cart sau khi xóa
      const userId = getState().auth.user?.id;
      if (userId) {
        dispatch(getCartByUser(userId));
      }

      return cartItemId;
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message);
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ✅ CLEAR CART
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (cartId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      const cart = getState().cart.cart;

      if (!cart?.cartItems || cart.cartItems.length === 0) {
        return;
      }

      // Xóa từng cart item
      const deletePromises = cart.cartItems.map((item) =>
        fetch(`${API_BASE_URL}/api/cart-items/${item.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      );

      await Promise.all(deletePromises);

      toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");

      // Lấy lại cart
      const userId = getState().auth.user?.id;
      if (userId) {
        dispatch(getCartByUser(userId));
      }

      return null;
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message);
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET CART BY USER
      .addCase(getCartByUser.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(getCartByUser.rejected, (state, action) => {
        state.error = action.payload;
        state.cart = null;
      })
      // CREATE CART
      .addCase(createCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(createCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      // ADD TO CART
      .addCase(addToCart.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      // UPDATE CART ITEM
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })
      // REMOVE FROM CART
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      // CLEAR CART
      .addCase(clearCart.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;