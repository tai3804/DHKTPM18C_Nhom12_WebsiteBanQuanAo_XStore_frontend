import { X } from "lucide-react";

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) {
    console.log("Modal không nhận order:", order);
    return null;
  }

  const {
    id,
    user,
    orderItems = [],
    discounts = [],
    subtotal = 0,
    discountAmount = 0,
    shippingFee = 0,
    total = 0,
    paymentMethod,
    shippingAddress,
    phoneNumber,
    notes,
    status,
    createdAt,
  } = order;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-[90%] max-w-4xl p-6 relative overflow-y-auto max-h-[90vh] shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Chi tiết đơn hàng #{id}
        </h2>

        {/* Customer info */}
        <div className="mb-4 text-gray-700 dark:text-gray-300 space-y-1">
          <p>
            <strong>Khách hàng:</strong> {user?.account?.username || "—"}
          </p>
          <p>
            <strong>SĐT:</strong> {phoneNumber || "—"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {shippingAddress || "—"}
          </p>
          <p>
            <strong>Trạng thái:</strong> {status || "—"}
          </p>
          <p>
            <strong>Ngày tạo:</strong> {createdAt || "—"}
          </p>
          <p>
            <strong>Phương thức thanh toán:</strong> {paymentMethod || "—"}
          </p>
          {notes && (
            <p>
              <strong>Ghi chú:</strong> {notes}
            </p>
          )}
        </div>

        {/* Order Items */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {[
                  "Sản phẩm",
                  "Màu",
                  "Size",
                  "SL",
                  "Giá đơn vị",
                  "Subtotal",
                ].map((title, idx) => (
                  <th key={idx} className="px-4 py-2 text-sm font-semibold">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b dark:border-gray-600 text-gray-700 dark:text-gray-200"
                >
                  <td className="px-4 py-2">{item.product?.name || "—"}</td>
                  <td className="px-4 py-2">{item.color || "—"}</td>
                  <td className="px-4 py-2">{item.size || "—"}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">
                    {item.unitPrice?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-2">
                    {item.subTotal?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Discounts */}
        {discounts.length > 0 && (
          <div className="mt-4 text-gray-700 dark:text-gray-300">
            <h3 className="font-semibold mb-2">Giảm giá áp dụng:</h3>
            <ul className="list-disc list-inside">
              {discounts.map((d) => (
                <li key={d.id || d._id}>
                  {d.code} -{" "}
                  {d.type === "PERCENT"
                    ? `${d.discountPercent}%`
                    : d.discountAmount.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary */}
        <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4 text-gray-800 dark:text-gray-100 space-y-1">
          <p>
            <strong>Subtotal:</strong> {subtotal.toLocaleString()}
          </p>
          <p>
            <strong>Giảm giá:</strong> -{discountAmount.toLocaleString()}
          </p>
          <p>
            <strong>Phí vận chuyển:</strong> {shippingFee.toLocaleString()}
          </p>
          <p className="text-lg font-bold">
            <strong>Tổng cộng:</strong> {total.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
