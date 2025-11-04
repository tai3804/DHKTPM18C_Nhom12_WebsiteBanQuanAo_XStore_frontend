import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCartByUser } from "../slices/CartSlice";
import { getProductTypes } from "../slices/ProductTypeSlice";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import ProductList from "../components/product/ProductList";
import ProductFilter from "../components/product/ProductFilter";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");

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
  const productsPerPage = 20; // 4 sản phẩm x 5 dòng = 20 sản phẩm

  // Load product types
  useEffect(() => {
    dispatch(getProductTypes());
  }, [dispatch]);

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery
              ? `Kết quả tìm kiếm: "${searchQuery}"`
              : filters.type || "Tất cả sản phẩm"}
          </h1>
          <p className="text-gray-600">
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-center">
              <p className="text-yellow-800 mb-2">
                Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn.
              </p>
              <button
                onClick={() => handleFilterChange({})}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
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
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
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
                          className="px-3 py-2 text-gray-400"
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
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Page Info */}
              <div className="mt-4 text-center text-sm text-gray-600">
                Trang {currentPage} / {totalPages} (Hiển thị {startIndex + 1} -{" "}
                {Math.min(endIndex, filteredProducts.length)} trong{" "}
                {filteredProducts.length} sản phẩm)
              </div>
            </>
          )}
        </ProductFilter>
      </main>
      <Footer />
    </div>
  );
}
