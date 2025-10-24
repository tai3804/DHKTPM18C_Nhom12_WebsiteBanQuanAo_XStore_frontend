import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from '../slices/LoadingSlice'
import errorReducer from '../slices/ErrorSlice'
import userReducer from '../slices/UserSlice'
import accountReducer from '../slices/AccountSlice'
import authReducer from '../slices/AuthSlice'
import cartReduce from '../slices/CartSlice'
import cartitemReduce from '../slices/CartItemSlice'
import stockReducer from '../slices/StockSlice'
import productReducer from "../slices/ProductSlice"
import productTypeReducer from "../slices/ProductTypeSlice"
import discountReducer from '../slices/DiscountSlice'

export const store = configureStore({


  reducer: {
    error: errorReducer,
    loading: loadingReducer,
    user: userReducer,
    account: accountReducer,
    auth: authReducer,
    cart: cartReduce,
    cartitem: cartitemReduce,
    stock: stockReducer,
    product: productReducer,
    productType: productTypeReducer,
    discount: discountReducer,
  },
})
