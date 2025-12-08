import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, MapPin } from "lucide-react";
import { getStocks } from "../../slices/StockSlice";
import { setSelectedStock } from "../../slices/StockSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function StockSelector() {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const { stocks, selectedStock } = useSelector((state) => state.stock);
  const [isOpen, setIsOpen] = useState(false);

  // Stocks are loaded in App.jsx on mount, no need to fetch again
  // useEffect(() => {
  //   if (!stocks || stocks.length === 0) {
  //     dispatch(getStocks());
  //   }
  // }, [dispatch, stocks]);

  // Set default stock from localStorage or TP.HCM when stocks are loaded
  useEffect(() => {
    if (stocks && stocks.length > 0 && !selectedStock) {
      // Check if there's a saved stock in localStorage
      const savedStockId = localStorage.getItem("selectedStockId");
      if (savedStockId) {
        const savedStock = stocks.find(
          (stock) => stock.id === parseInt(savedStockId)
        );
        if (savedStock) {
          dispatch(setSelectedStock(savedStock));
          return;
        }
      }

      // Fallback to TP.HCM stock or use first stock as fallback
      const tphcmStock = stocks.find(
        (stock) =>
          stock.name?.toLowerCase().includes("tp.hcm") ||
          stock.name?.toLowerCase().includes("hồ chí minh") ||
          stock.name?.toLowerCase().includes("miền nam")
      );
      const defaultStock = tphcmStock || stocks[0];
      dispatch(setSelectedStock(defaultStock));
    }
  }, [stocks, selectedStock, dispatch]);

  const handleStockSelect = (stock) => {
    dispatch(setSelectedStock(stock));
    // Save to localStorage
    localStorage.setItem("selectedStockId", stock.id.toString());
    setIsOpen(false);
    // Note: Removed page refresh - components should update automatically via Redux
  };

  if (!stocks || stocks.length === 0) {
    return null; // Don't render if no stocks available
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 p-2 rounded-md transition-all duration-200 ${
          themeMode === "dark"
            ? "text-gray-300 hover:text-white hover:bg-gray-700"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
        title={
          selectedStock?.name
            ? `Khu vực: ${selectedStock.name}`
            : "Chọn khu vực giao hàng"
        }
      >
        <MapPin className="h-5 w-5" />
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className={`absolute top-full right-0 mt-1 w-64 rounded-md shadow-lg z-40 border ${
              themeMode === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="py-1">
              <div
                className={`px-3 py-2 text-xs font-medium uppercase tracking-wide ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Chọn khu vực giao hàng
              </div>

              {stocks.map((stock) => (
                <button
                  key={stock.id}
                  onClick={() => handleStockSelect(stock)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    selectedStock?.id === stock.id
                      ? themeMode === "dark"
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-50 text-indigo-600"
                      : themeMode === "dark"
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <div>
                      <div className="font-medium">{stock.name}</div>
                      {stock.address && (
                        <div
                          className={`text-xs ${
                            selectedStock?.id === stock.id
                              ? "text-indigo-200"
                              : themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {stock.address.fullAddress || stock.address}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
