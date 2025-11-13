import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import { createOrder } from "../slices/OrderSlice";

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cart } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.order);

    // Nếu giỏ hàng trống, quay về trang sản phẩm
    useEffect(() => {
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            toast.info("Giỏ hàng của bạn đang trống!");
            navigate("/products");
        }
    }, [cart, navigate]);

    const handleConfirmOrder = async () => {
        try {
            // Gọi thunk createOrder
            await dispatch(createOrder()).unwrap();

            // Nếu thành công (toast đã xử lý trong slice), chuyển về trang chủ
            navigate("/");

        } catch (err) {
            // Lỗi đã được toast trong slice, không cần toast lại
            console.error("Failed to create order:", err);
        }
    };

    if (!cart || cart.cartItems.length === 0) {
        return null; // Đang chuyển hướng
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Xác nhận Thanh toán
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Thông tin đơn hàng */}
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">
                            Thông tin người nhận
                        </h2>
                        <div className="space-y-2">
                            <p><strong>Tên:</strong> {user.firstName} {user.lastName}</p>
                            <p><strong>Email:</strong> {user.email || "Chưa cập nhật"}</p>
                            <p><strong>SĐT:</strong> {user.phone || "Chưa cập nhật"}</p>
                            <p><strong>Địa chỉ:</strong> (Bạn cần thêm form nhập địa chỉ ở đây)</p>
                        </div>

                        <hr className="my-6" />

                        <h2 className="text-xl font-semibold mb-4">
                            Sản phẩm
                        </h2>
                        <div className="space-y-4">
                            {cart.cartItems.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <img src={item.product?.image} alt={item.product?.name} className="w-16 h-16 rounded object-cover" />
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product?.name}</p>
                                        <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">{item.subTotal?.toLocaleString("vi-VN")}đ</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tóm tắt */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                            <h2 className="text-xl font-semibold mb-4">
                                Tổng cộng
                            </h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Tạm tính:</span>
                                    <span>{cart.total?.toLocaleString("vi-VN")}đ</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>
                                <hr />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Tổng tiền:</span>
                                    <span className="text-blue-600">
                                        {cart.total?.toLocaleString("vi-VN")}đ
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleConfirmOrder}
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                {loading ? "Đang xử lý..." : "Xác nhận Đặt hàng"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}