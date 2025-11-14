import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

const PaymentMethod = ({ selectedMethod, onSelectMethod }) => {
  const themeMode = useSelector(selectThemeMode);

  const paymentMethods = [
    {
      id: "CASH",
      name: "Thanh toán khi nhận hàng (COD)",
      available: true,
    },
    {
      id: "VNPAY",
      name: "VNPay",
      available: false,
    },
  ];

  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-3 ${
          themeMode === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Phương thức thanh toán
      </h3>

      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`flex items-center gap-3 p-3 rounded border transition-colors ${
              !method.available
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            } ${
              selectedMethod === method.id
                ? themeMode === "dark"
                  ? "border-emerald-500 bg-emerald-900/20"
                  : "border-emerald-500 bg-emerald-50"
                : themeMode === "dark"
                ? "border-gray-600 hover:border-gray-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => method.available && onSelectMethod(method.id)}
          >
            <div className="flex items-center justify-center w-4 h-4">
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

            <span
              className={`${
                themeMode === "dark" ? "text-gray-200" : "text-gray-800"
              } ${!method.available ? "text-gray-400" : ""}`}
            >
              {method.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
