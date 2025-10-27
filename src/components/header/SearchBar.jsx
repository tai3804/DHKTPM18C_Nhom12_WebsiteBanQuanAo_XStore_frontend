import { useState } from "react";
import { useDispatch } from "react-redux";
import { Search } from "lucide-react";
import { searchProductsByName, setProducts } from "../../slices/ProductSlice";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(keyword);

    const temp = await dispatch(searchProductsByName(keyword));
    if (temp.payload !== undefined && temp.payload.length > 0) {
      dispatch(setProducts(temp.payload));
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="hidden lg:flex flex-1 max-w-md mx-8"
    >
      <div className="relative w-full">
        {/* Icon search */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

        {/* Input */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
        />

        {/* Button search */}
        <button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full shadow-md transition-colors duration-200"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}
