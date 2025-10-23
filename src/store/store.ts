import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from '../slices/LoadingSlice'
import errorReducer from '../slices/ErrorSlice'
import userReducer from '../slices/UserSlice'
import accountReducer from '../slices/AccountSlice'
import authReducer from '../slices/AuthSlice'
import notiReducer from "../slices/NotiSlice"

export const store = configureStore({
  reducer: {
    error: errorReducer,
    loading: loadingReducer,
    user: userReducer,
    account: accountReducer,
    auth: authReducer,
    noti: notiReducer,
  },
})
