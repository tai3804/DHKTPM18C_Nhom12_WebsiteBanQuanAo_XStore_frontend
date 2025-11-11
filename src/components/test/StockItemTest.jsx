// Test component để kiểm tra ProductDetailPage với stock items
import React from "react";

const StockItemTest = () => {
  const sampleProduct = {
    id: 1,
    name: "Áo thun cổ tròn",
    description: "Áo thun cổ tròn basic thoải mái",
    image: "https://via.placeholder.com/400",
    price: 200000,
    originalPrice: 250000,
    type: { name: "Áo thun" },
    productType: { name: "Áo thun" },
  };

  const sampleStocks = [
    {
      stockId: 1,
      stockName: "Kho Hà Nội",
      quantity: 50,
    },
    {
      stockId: 2,
      stockName: "Kho Hồ Chí Minh",
      quantity: 30,
    },
    {
      stockId: 3,
      stockName: "Kho Đà Nẵng",
      quantity: 20,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Test Stock Items Data Structure
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Sample Product:</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm">
          {JSON.stringify(sampleProduct, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Sample Stock Items:</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm">
          {JSON.stringify(sampleStocks, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">API Endpoint Test:</h3>
        <p className="text-sm text-gray-600">
          GET /api/products/1/stocks should return stock items array
        </p>
        <p className="text-sm text-gray-600">
          Backend endpoint: ProductController.getProductStocks()
        </p>
        <p className="text-sm text-gray-600">
          Service method: ProductService.getProductStocks()
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Frontend Integration:</h3>
        <ul className="text-sm text-gray-600 list-disc list-inside">
          <li>ProductSlice.getProductStocks() thunk</li>
          <li>ProductDetailPage uses productStocks from Redux state</li>
          <li>User selects stock (warehouse) instead of size</li>
          <li>Quantity validation based on selected stock</li>
          <li>Display total stock from all warehouses</li>
        </ul>
      </div>

      <div className="border border-gray-300 rounded p-4">
        <h4 className="font-semibold mb-2">Expected Flow:</h4>
        <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
          <li>Load product by ID: dispatch(getProductById(id))</li>
          <li>Load stock items: dispatch(getProductStocks(id))</li>
          <li>Display warehouses as selection buttons</li>
          <li>Show quantity available in selected warehouse</li>
          <li>Validate quantity when adding to cart</li>
          <li>Submit cart with stockId reference</li>
        </ol>
      </div>
    </div>
  );
};

export default StockItemTest;
