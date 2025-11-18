import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from '../slices/LoadingSlice'
import errorReducer from '../slices/ErrorSlice'
import successReducer from '../slices/SuccessSlice'
import userReducer from '../slices/UserSlice'
import accountReducer from '../slices/AccountSlice'
import authReducer from '../slices/AuthSlice'
import cartReduce from '../slices/CartSlice'
import cartitemReduce from '../slices/CartItemSlice'
import stockReducer from '../slices/StockSlice'
import productReducer from "../slices/ProductSlice"
import productInfoReducer from "../slices/ProductInfoSlice"
import productTypeReducer from "../slices/ProductTypeSlice"
import discountReducer from '../slices/DiscountSlice'
import favouriteReducer from '../slices/FavouriteSlice'
import themeReducer from '../slices/ThemeSlice'
import orderReducer from '../slices/OrderSlice'
import commentReducer from '../slices/CommentSlice'
import productSalesReducer from '../slices/ProductSalesSlice'
import chatReducer from '../slices/ChatSlice'

export const store = configureStore({


  reducer: {
    error: errorReducer,
    success: successReducer,
    loading: loadingReducer,
    user: userReducer,
    account: accountReducer,
    auth: authReducer,
    cart: cartReduce,
    cartitem: cartitemReduce,
    stock: stockReducer,
    product: productReducer,
    productInfo: productInfoReducer,
    productType: productTypeReducer,
    discount: discountReducer,
    favourite: favouriteReducer,
    theme: themeReducer,
    order: orderReducer,
    comment: commentReducer,
    productSales: productSalesReducer,
    chat: chatReducer,
  },
})
