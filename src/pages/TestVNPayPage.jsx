import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function TestVNPayPage() {
  const [formData, setFormData] = useState({
    vnp_OrderInfo: "Test payment",
    amount: 100000, // VND
    ordertype: "billpayment",
    bankcode: "",
    language: "vn",
    txt_billing_fullname: "Nguyen Van A",
    txt_billing_mobile: "0123456789",
    txt_billing_email: "test@example.com",
  });

  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Bạn cần đăng nhập để thực hiện thanh toán");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.code === "00") {
        toast.success("Payment URL created successfully!");
        // Open VNPay in new tab to avoid potential script errors affecting the app
        window.open(result.data, "_blank");
      } else {
        toast.error(result.message || "Failed to create payment");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating payment: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Test VNPay Payment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Info
            </label>
            <input
              type="text"
              name="vnp_OrderInfo"
              value={formData.vnp_OrderInfo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (VND)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Type
            </label>
            <input
              type="text"
              name="ordertype"
              value={formData.ordertype}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Code (optional)
            </label>
            <input
              type="text"
              name="bankcode"
              value={formData.bankcode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., VNPAYQR, VNBANK, INTCARD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="vn">Vietnamese</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="txt_billing_fullname"
              value={formData.txt_billing_fullname}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile
            </label>
            <input
              type="text"
              name="txt_billing_mobile"
              value={formData.txt_billing_mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="txt_billing_email"
              value={formData.txt_billing_email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Payment
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Fill in the form with test data</li>
            <li>Click "Create Payment" to generate VNPay URL</li>
            <li>You will be redirected to VNPay sandbox</li>
            <li>Use test card numbers from VNPay documentation</li>
            <li>After payment, you will be redirected back</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
