import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import Errors from "../constants/errors";

const initialState = {
  discounts: [], // danh sách tất cả discount
  discount: null, // discount hiện tại (theo ID)
};

// ----------------- THUNKS -----------------

// GET ALL DISCOUNTS
export const getDiscounts = createAsyncThunk(
  "discount/getDiscounts",
  async (_, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch("/api/discounts", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(Errors.DISCOUNT_FETCH_FAILED);

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

// GET DISCOUNT BY ID
export const getDiscountById = createAsyncThunk(
  "discount/getDiscountById",
  async (id, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`/api/discounts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(Errors.DISCOUNT_FETCH_FAILED);

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

// CREATE DISCOUNT
export const createDiscount = createAsyncThunk(
  "discount/createDiscount",
  async (newDiscount, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch("/api/discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newDiscount),
      });
      if (!res.ok) throw new Error(Errors.DISCOUNT_CREATE_FAILED);

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

// UPDATE DISCOUNT
export const updateDiscount = createAsyncThunk(
  "discount/updateDiscount",
  async ({ id, discountData }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`/api/discounts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(discountData),
      });
      if (!res.ok) throw new Error(Errors.DISCOUNT_UPDATE_FAILED);

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

// DELETE DISCOUNT
export const deleteDiscount = createAsyncThunk(
  "discount/deleteDiscount",
  async (id, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;

      const res = await fetch(`/api/discounts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(Errors.DISCOUNT_DELETE_FAILED);

      let json;
      try {
        json = await res.json();
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
const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Lấy danh sách
      .addCase(getDiscounts.fulfilled, (state, action) => {
        state.discounts = action.payload;
      })

      // Lấy 1 discount
      .addCase(getDiscountById.fulfilled, (state, action) => {
        state.discount = action.payload;
      })

      // Tạo discount
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.discounts.push(action.payload);
      })

      // Cập nhật discount
      .addCase(updateDiscount.fulfilled, (state, action) => {
        const index = state.discounts.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) {
          state.discounts[index] = action.payload;
        }
      })

      // Xóa discount
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.discounts = state.discounts.filter(
          (d) => d.id !== action.payload
        );
      });
  },
});

export default discountSlice.reducer;
