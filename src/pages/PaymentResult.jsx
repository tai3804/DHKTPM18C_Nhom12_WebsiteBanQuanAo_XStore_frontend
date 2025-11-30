import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("processing");

    useEffect(() => {
        const statusParam = searchParams.get("status");
        if (statusParam === "success") {
            setStatus("success");
        } else {
            setStatus("failed");
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {status === "success" ? (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
                        <p className="text-gray-600 mb-6">Đơn hàng của bạn đã được thanh toán và đang được xử lý.</p>
                    </>
                ) : (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thất bại</h2>
                        <p className="text-gray-600 mb-6">Có lỗi xảy ra hoặc bạn đã hủy giao dịch.</p>
                    </>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => navigate("/orders")}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Xem đơn hàng
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;