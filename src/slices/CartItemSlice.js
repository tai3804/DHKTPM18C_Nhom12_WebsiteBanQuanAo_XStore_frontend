import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";
import { API_BASE_URL } from "../config/api";

const initialState = {
  items: [],
};


// ADD ITEM TO CART
export const addItemToCart = createAsyncThunk(
  "cartItem/addItemToCart",
  async ({ cartId, itemData }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/carts/${cartId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });

      if (!res.ok) throw new Error(Errors.CARTITEM_CREATE_FAILED);

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

// UPDATE ITEM
export const updateCartItem = createAsyncThunk(
  "cartItem/updateCartItem",
  async ({ cartId, itemId, updatedData }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/carts/${cartId}/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error(Errors.CARTITEM_UPDATE_FAILED);

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

// REMOVE ITEM
export const removeCartItem = createAsyncThunk(
  "cartItem/removeCartItem",
  async ({ cartId, itemId }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_BASE_URL}/api/carts/${cartId}/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(Errors.CARTITEM_DELETE_FAILED);

      let json;
      try {
        json = await res.json();
      } catch {
        json = { data: itemId };
      }

      return json.data || itemId;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// ----------------- SLICE -----------------
const cartItemSlice = createSlice({
  name: "cartItem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      });
  },
});

export default cartItemSlice.reducer;
