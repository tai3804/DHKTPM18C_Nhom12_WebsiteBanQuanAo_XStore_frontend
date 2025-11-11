// src/slices/FavouriteSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api";

const initialState = {
  favourites: [], // Danh sách sản phẩm yêu thích của user
  loading: false,
};

// GET ALL FAVOURITES BY USER ID
export const getFavouritesByUser = createAsyncThunk(
  "favourite/getFavouritesByUser",
  async (userId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      
      const res = await fetch(`${API_BASE_URL}/api/favourites/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không thể tải danh sách yêu thích");

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

// ADD TO FAVOURITES
export const addToFavourites = createAsyncThunk(
  "favourite/addToFavourites",
  async ({ userId, productId }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      
      const res = await fetch(`${API_BASE_URL}/api/favourites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Không thể thêm vào yêu thích");
      }

      const json = await res.json();
      toast.success("Đã thêm vào danh sách yêu thích");
      return json.result || json;
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message);
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// REMOVE FROM FAVOURITES
export const removeFromFavourites = createAsyncThunk(
  "favourite/removeFromFavourites",
  async ({ userId, productId }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState().auth.token;
      
      const res = await fetch(`${API_BASE_URL}/api/favourites/${userId}/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không thể xóa khỏi yêu thích");

      const json = await res.json();
      toast.success("Đã xóa khỏi danh sách yêu thích");
      return { userId, productId };
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message);
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

// TOGGLE FAVOURITE (ADD or REMOVE)
export const toggleFavourite = createAsyncThunk(
  "favourite/toggleFavourite",
  async ({ userId, productId }, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState();
      const isFavourite = state.favourite.favourites.some(
        (fav) => fav.product?.id === productId
      );

      if (isFavourite) {
        // Remove from favourites
        const result = await dispatch(removeFromFavourites({ userId, productId }));
        return { action: "remove", result: result.payload };
      } else {
        // Add to favourites
        const result = await dispatch(addToFavourites({ userId, productId }));
        return { action: "add", result: result.payload };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    clearFavourites: (state) => {
      state.favourites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get favourites by user
      .addCase(getFavouritesByUser.fulfilled, (state, action) => {
        state.favourites = action.payload;
      })

      // Add to favourites
      .addCase(addToFavourites.fulfilled, (state, action) => {
        state.favourites.push(action.payload);
      })

      // Remove from favourites
      .addCase(removeFromFavourites.fulfilled, (state, action) => {
        const { userId, productId } = action.payload;
        state.favourites = state.favourites.filter(
          (fav) => fav.product?.id !== productId
        );
      });
  },
});

export const { clearFavourites } = favouriteSlice.actions;
export default favouriteSlice.reducer;
