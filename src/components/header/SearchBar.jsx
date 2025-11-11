import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchProductsByName } from "../../slices/ProductSlice";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!keyword.trim()) {
      navigate("/products");
      return;
    }

    // Dispatch search action
    await dispatch(searchProductsByName(keyword));

    // Navigate to products page with search query
    navigate(`/products?search=${encodeURIComponent(keyword.trim())}`);
  };

  const handleClear = () => {
    setKeyword("");
    dispatch(searchProductsByName("")); // Reset search
  };

  return (
    <form
      onSubmit={handleSearch}
      className="hidden lg:flex flex-1 max-w-md mx-8"
    >
      <div className="relative w-full">
        {/* Icon search */}
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
            isFocused ? "text-gray-800" : "text-gray-900"
          }`}
        />

        {/* Input */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pl-10 pr-24 py-2 rounded-full border shadow-sm transition-all duration-200 focus:outline-none text-gray-900 ${
            isFocused ? "border-gray-500" : "border-gray-300"
          }`}
        />

        {/* Clear button */}
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Button search */}
        <button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-full shadow-sm transition-colors duration-200 font-medium"
        >
          Tìm
        </button>
      </div>
    </form>
  );
}
