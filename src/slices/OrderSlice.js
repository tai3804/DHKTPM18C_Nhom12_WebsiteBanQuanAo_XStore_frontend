import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";
import { clearCart } from "./CartSlice"; // Import clearCart

// --- Thunk để tạo Order ---
export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (_, { dispatch, getState, rejectWithValue }) => {
        dispatch(startLoading());
        dispatch(clearError());

        try {
            const { auth, cart } = getState();
            const token = auth.token;
            const user = auth.user;
            const currentCart = cart.cart;

            // 1. Kiểm tra
            if (!token || !user) {
                throw new Error("Bạn phải đăng nhập để đặt hàng");
            }
            if (!currentCart || currentCart.cartItems.length === 0) {
                throw new Error("Giỏ hàng của bạn đang trống");
            }

            // 2. Chuyển đổi CartItems thành OrderItems
            // Cấu trúc OrderItem.java cần: { product, quantity, subTotal }
            const orderItems = currentCart.cartItems.map(item => ({
                product: item.product,
                quantity: item.quantity,
                subTotal: item.subTotal,
                stock: item.stock
            }));

            // 3. Tạo payload cho Order (dựa theo Order.java)
            const orderPayload = {
                user: user, // Gửi đối tượng User
                orderItems: orderItems, // Gửi danh sách OrderItem
                status: "PENDING_RECEIPT", // Đặt trạng thái ban đầu
                createdAt: new Date().toISOString().split('T')[0], // Ngày tạo
                total: currentCart.total // Backend cũng sẽ tự tính lại
            };

            // 4. Gọi API
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(orderPayload),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Tạo đơn hàng thất bại");
            }

            // 5. Thành công
            toast.success("Đặt hàng thành công!");

            // 6. Xóa giỏ hàng sau khi đặt hàng thành công
            dispatch(clearCart(currentCart.id));

            return json.result; // Trả về order đã tạo

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(error.message);
            return rejectWithValue(error.message);
        } finally {
            dispatch(stopLoading());
        }
    }
);

// --- Slice ---
const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;