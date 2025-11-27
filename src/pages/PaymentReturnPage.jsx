import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../slices/AuthSlice";
import { getApiUrl } from "../config/api";

export default function PaymentReturnPage() {
  const [status, setStatus] = useState("processing");
  const [params, setParams] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();
  const token = useSelector(selectAuthToken);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramObj = {};
    for (let [key, value] of urlParams) {
      paramObj[key] = value;
    }
    setParams(paramObj);

    // Check initial status
    if (paramObj.vnp_ResponseCode === "00") {
      setStatus("success");
    } else {
      setStatus("failed");
    }
  }, []);

  useEffect(() => {
    if (status === "confirmed") {
      const timer = setTimeout(() => {
        navigate("/orders");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const handleConfirm = async () => {
    if (status === "success") {
      setIsConfirming(true);
      try {
        const orderId = params.vnp_OrderInfo
          ? params.vnp_OrderInfo.match(/\d+$/)?.[0] || null
          : null;

        console.log("vnp_OrderInfo:", params.vnp_OrderInfo);
        console.log("orderId:", orderId);

        if (!token) {
          toast.error("Bạn cần đăng nhập để cập nhật đơn hàng!");
          setStatus("error");
          return;
        }

        const headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${getApiUrl("/api/orders")}/${orderId}/status`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify("PENDING"),
          }
        );

        let data;
        try {
          data = await response.json();
        } catch (error) {
          data = { message: "Invalid response from server" };
        }

        if (response.ok) {
          toast.success("Thanh toán thành công!");
          setStatus("confirmed");
        } else {
          toast.error(
            "Có lỗi khi cập nhật đơn hàng: " + (data.message || "Unknown error")
          );
          setStatus("error");
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
        toast.error("Lỗi kết nối server!");
        setStatus("error");
      } finally {
        setIsConfirming(false);
      }
    } else {
      // For failed or error, just navigate
      navigate("/orders");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center mx-4">
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold mb-2">
              Đang xử lý thanh toán...
            </h1>
            <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-xl font-semibold mb-2 text-green-600">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600 mb-4">
              Nhấn OK để cập nhật trạng thái đơn hàng.
            </p>
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {isConfirming ? "Đang cập nhật..." : "OK"}
            </button>
          </>
        )}

        {status === "confirmed" && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-xl font-semibold mb-2 text-green-600">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600 mb-4">
              Bạn sẽ được chuyển hướng về trang danh sách đơn hàng trong vài
              giây.
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h1 className="text-xl font-semibold mb-2 text-red-600">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-600 mb-4">
              Mã lỗi: {params.vnp_ResponseCode}
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              OK
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-yellow-500 text-6xl mb-4">⚠</div>
            <h1 className="text-xl font-semibold mb-2 text-yellow-600">
              Lỗi xử lý
            </h1>
            <p className="text-gray-600 mb-4">
              Có lỗi xảy ra khi cập nhật đơn hàng.
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
            >
              OK
            </button>
          </>
        )}
      </div>
    </div>
  );
}
