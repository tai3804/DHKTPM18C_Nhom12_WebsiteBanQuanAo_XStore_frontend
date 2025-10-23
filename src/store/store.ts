import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from '../slices/LoadingSlice'
import errorReducer from '../slices/ErrorSlice'
import userReducer from '../slices/UserSlice'

export const store = configureStore({
  reducer: {
    error: errorReducer,
    loading: loadingReducer,
    user: userReducer,
  },
})
