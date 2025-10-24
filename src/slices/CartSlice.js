import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";

const initialState = {
  carts: [],
  cart: null,
};

// GET CART BY USER
export const getCartByUser = createAsyncThunk(
  "cart/getCartByUser",
  async (userId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`/api/carts/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(Errors.CART_FETCH_FAILED);

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

// CREATE CART
export const createCart = createAsyncThunk(
  "cart/createCart",
  async (userId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ user: userId }),
      });

      if (!res.ok) throw new Error(Errors.CART_CREATE_FAILED);

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

// DELETE CART
export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (cartId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`/api/carts/${cartId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(Errors.CART_DELETE_FAILED);

      let json;
      try {
        json = await res.json();
      } catch {
        json = { data: cartId };
      }

      return json.data || cartId;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ----------------- SLICE -----------------
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartByUser.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.carts.push(action.payload);
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.carts = state.carts.filter((c) => c._id !== action.payload);
        if (state.cart?._id === action.payload) {
          state.cart = null;
        }
      });
  },
});

export default cartSlice.reducer;
