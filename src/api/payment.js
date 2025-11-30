import { API_BASE_URL } from "../config/api";

export const createPaymentUrl = async (paymentData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/payment/create_payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(paymentData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating payment:", error);
        throw error;
    }
};