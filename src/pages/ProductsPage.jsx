import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCartByUser } from "../slices/CartSlice";
import { getProductTypes } from "../slices/ProductTypeSlice";
import { selectThemeMode } from "../slices/ThemeSlice";
import ProductList from "../components/product/ProductList";
import ProductFilter from "../components/product/ProductFilter";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  const themeMode = useSelector(selectThemeMode);

  const allProducts = useSelector((state) => state.product.products) || [];
  const productTypes =
    useSelector((state) => state.productType.productTypes) || [];
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    type: category || "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Number of products per page

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Update filters when URL category changes
  useEffect(() => {
    if (category) {
      setFilters((prev) => ({ ...prev, type: category }));
    }
  }, [category]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      return [];
    }

    let result = [...allProducts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
      );
    }

    // Filter by type/category
    if (filters.type) {
      result = result.filter(
        (product) =>
          product.type?.name === filters.type ||
          product.productType?.name === filters.type
      );
    }

    // Filter by price range
    if (filters.minPrice) {
      result = result.filter(
        (product) => product.price >= Number(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      result = result.filter(
        (product) => product.price <= Number(filters.maxPrice)
      );
    }

    // Sort products
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "newest":
          result.sort((a, b) => b.id - a.id);
          break;
        default:
          break;
      }
    }

    return result;
  }, [allProducts, filters, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    // Update URL if category filter changes
    if (newFilters.type && newFilters.type !== category) {
      setSearchParams({ category: newFilters.type });
    } else if (!newFilters.type && category) {
      setSearchParams({});
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <main className="grow container mx-auto px-4 py-8">
        {/* Page Header */}
        <div
          className={`mb-6 mx-20 px-4 transition-all duration-300 ease-in-out ${
            isHeaderVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform -translate-y-full pointer-events-none"
          }`}
        >
          <h1
            className={`text-3xl font-bold mb-2 transition-colors ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {searchQuery
              ? `Kết quả tìm kiếm: "${searchQuery}"`
              : filters.type || "Tất cả sản phẩm"}
          </h1>
          <p
            className={`transition-colors ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Tìm thấy{" "}
            <span className="font-semibold">{filteredProducts.length}</span> sản
            phẩm
          </p>
        </div>

        {/* Filter and Products Layout - Filter returns both sidebar and content wrapper */}
        <ProductFilter
          productTypes={productTypes}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        >
          {/* No Results Message */}
          {filteredProducts.length === 0 && allProducts.length > 0 && (
            <div
              className={`border rounded-lg p-6 mb-6 text-center transition-colors ${
                themeMode === "dark"
                  ? "bg-yellow-900/30 border-yellow-800"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <p
                className={`mb-2 transition-colors ${
                  themeMode === "dark" ? "text-yellow-300" : "text-yellow-800"
                }`}
              >
                Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn.
              </p>
              <button
                onClick={() => handleFilterChange({})}
                className={`font-medium hover:underline transition-colors ${
                  themeMode === "dark"
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Product List */}
          <ProductList products={currentProducts} />

          {/* Pagination */}
          {totalPages > 1 && (
            <>
              <div className="mt-12 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg border font-medium transition-all ${
                    currentPage === 1
                      ? themeMode === "dark"
                        ? "border-gray-700 text-gray-500 cursor-not-allowed"
                        : "border-gray-200 text-gray-400 cursor-not-allowed"
                      : themeMode === "dark"
                      ? "border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-500 hover:text-blue-400"
                      : "border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Trước</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className={`px-3 py-2 transition-colors ${
                            themeMode === "dark"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`min-w-10 h-10 rounded-lg border font-medium transition-all ${
                          currentPage === page
                            ? "bg-blue-600 border-blue-600 text-white shadow-md"
                            : themeMode === "dark"
                            ? "border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-500 hover:text-blue-400"
                            : "border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg border font-medium transition-all ${
                    currentPage === totalPages
                      ? themeMode === "dark"
                        ? "border-gray-700 text-gray-500 cursor-not-allowed"
                        : "border-gray-200 text-gray-400 cursor-not-allowed"
                      : themeMode === "dark"
                      ? "border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-500 hover:text-blue-400"
                      : "border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Page Info */}
              <div
                className={`mt-4 text-center text-sm transition-colors ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Trang {currentPage} / {totalPages} (Hiển thị {startIndex + 1} -{" "}
                {Math.min(endIndex, filteredProducts.length)} trong{" "}
                {filteredProducts.length} sản phẩm)
              </div>
            </>
          )}
        </ProductFilter>
      </main>
    </div>
  );
}
