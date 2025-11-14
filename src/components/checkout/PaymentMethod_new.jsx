import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

const PaymentMethod = ({ selectedMethod, onSelectMethod }) => {
  const themeMode = useSelector(selectThemeMode);

  const paymentMethods = [
    {
      id: "CASH",
      name: "Thanh toán khi nhận hàng (COD)",
      icon: "💵",
      available: true,
      recommended: true,
    },
    {
      id: "VNPAY",
      name: "Thanh toán online qua VNPay",
      icon: "💳",
      available: false,
      comingSoon: true,
    },
    {
      id: "PAYPAL",
      name: "Thanh toán qua PayPal",
      icon: "🌐",
      available: false,
      comingSoon: true,
    },
  ];

  return (
    <div
      className={`p-6 rounded-lg border transition-colors ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-4 flex items-center gap-2 ${
          themeMode === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        <span className="text-2xl">💳</span>
        Phương thức thanh toán
      </h3>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              !method.available
                ? "cursor-not-allowed opacity-60"
                : selectedMethod === method.id
                ? themeMode === "dark"
                  ? "border-emerald-500 bg-emerald-900/20 cursor-pointer"
                  : "border-emerald-500 bg-emerald-50 cursor-pointer"
                : themeMode === "dark"
                ? "border-gray-600 hover:border-gray-500 bg-gray-800/50 cursor-pointer"
                : "border-gray-200 hover:border-gray-300 bg-gray-50 cursor-pointer"
            }`}
            onClick={() => method.available && onSelectMethod(method.id)}
          >
            <div className="flex items-center justify-between">
              {/* Payment Method Name */}
              <div className="flex items-center gap-3">
                <span className="text-xl">{method.icon}</span>
                <span
                  className={`font-semibold ${
                    themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {method.name}
                </span>

                {method.recommended && (
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-bold">
                    Khuyến nghị
                  </span>
                )}

                {method.comingSoon && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-bold">
                    Sắp có
                  </span>
                )}
              </div>

              {/* Selection Radio Button */}
              <div className="flex items-center justify-center w-5 h-5">
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    selectedMethod === method.id
                      ? themeMode === "dark"
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-emerald-600 bg-emerald-600"
                      : themeMode === "dark"
                      ? "border-gray-500"
                      : "border-gray-400"
                  }`}
                >
                  {selectedMethod === method.id && (
                    <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
