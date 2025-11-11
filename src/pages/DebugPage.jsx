import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../slices/ProductSlice";
import { API_BASE_URL } from "../config/api";

export default function DebugPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Redux state
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const productState = useSelector((state) => state.product);

  const testBackend = async () => {
    setLoading(true);
    try {
      // Test simple endpoint first
      const testRes = await fetch(`${API_BASE_URL}/api/products/test`);
      const testText = await testRes.text();
      console.log("Test endpoint:", testText);

      // Test products endpoint
      const res = await fetch(`${API_BASE_URL}/api/products`);
      console.log("Products response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Products data:", data);

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error:", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRedux = async () => {
    console.log("Testing Redux dispatch...");
    const result = await dispatch(getProducts());
    console.log("Redux dispatch result:", result);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug API Test</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={testBackend}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Testing..." : "Test Backend API"}
        </button>

        <button
          onClick={testRedux}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test Redux Dispatch
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">API Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {result || "Click 'Test Backend API' button"}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Redux State:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(productState, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Products Array (Redux):</h2>
        <div className="bg-yellow-50 p-4 rounded">
          <p>
            <strong>Type:</strong> {typeof products}
          </p>
          <p>
            <strong>Is Array:</strong> {Array.isArray(products) ? "Yes" : "No"}
          </p>
          <p>
            <strong>Length:</strong> {products?.length || 0}
          </p>
          <p>
            <strong>Products:</strong>
          </p>
          <pre className="mt-2 bg-white p-2 rounded text-sm max-h-48 overflow-auto">
            {JSON.stringify(products, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Expected URLs:</h2>
        <ul className="list-disc list-inside">
          <li>Test: http://localhost:8080/api/products/test</li>
          <li>Products: http://localhost:8080/api/products</li>
        </ul>
      </div>
    </div>
  );
}
