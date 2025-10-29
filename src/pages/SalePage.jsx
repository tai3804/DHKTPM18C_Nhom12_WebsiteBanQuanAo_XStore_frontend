import { useSelector } from "react-redux";
import Header from "../components/header/Header";
import FeaturedProducts from "../components/home/FeaturedProducts";

export default function SalePage() {
  const products = useSelector((state) => state.product.products); // Lấy sản phẩm từ store

  return (
    <div className="bg-[#FFF7F0] min-h-screen">
      <Header />
      {/* Banner & Countdown */}
      <section className="mt-24 flex flex-col items-center py-8 bg-[#FFF7F0]">
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-xs font-semibold mb-2">
          MEGA SALE EVENT
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-400 to-yellow-400 mb-2">
          MASSIVE SAVINGS
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
          Up to 70% Off!
        </h2>
        <p className="text-gray-500 text-center max-w-xl mb-6 text-sm md:text-base">
          Don’t miss out on our biggest sale of the year! Transform your closet
          for less with incredible discounts on premium organization solutions.
        </p>
        {/* Countdown Timer */}
        <div className="bg-white shadow-md rounded-lg px-6 py-4 flex flex-col items-center mb-4">
          <span className="text-xs text-gray-500 mb-2 font-medium">
            Sale Ends In:
          </span>
          <div className="flex space-x-2 mb-2">
            <div className="flex flex-col items-center">
              <span className="bg-red-500 text-white font-bold text-lg md:text-xl px-3 py-1 rounded">
                02
              </span>
              <span className="text-xs text-gray-500 mt-1">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-red-500 text-white font-bold text-lg md:text-xl px-3 py-1 rounded">
                14
              </span>
              <span className="text-xs text-gray-500 mt-1">Hours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-red-500 text-white font-bold text-lg md:text-xl px-3 py-1 rounded">
                32
              </span>
              <span className="text-xs text-gray-500 mt-1">Min</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-red-500 text-white font-bold text-lg md:text-xl px-3 py-1 rounded">
                25
              </span>
              <span className="text-xs text-gray-500 mt-1">Sec</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-semibold text-sm">
              Shop Best Picks
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-1 rounded font-semibold text-sm">
              View All Deals
            </button>
          </div>
        </div>
      </section>

      {/* Deal Categories */}
      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-center text-lg md:text-xl font-bold mb-1">
            Deal Categories
          </h3>
          <p className="text-center text-gray-500 text-sm mb-8">
            Explore different types of amazing deals across our entire catalog.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Flash Sale */}
            <div className="flex flex-col items-center bg-[#FFF7F0] rounded-lg p-6 shadow-sm">
              <div className="bg-pink-100 text-pink-500 rounded-full p-3 mb-2">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800 mb-1">
                Flash Sale
              </span>
              <span className="text-xs text-pink-500 font-bold mb-1">
                Up to 65% OFF
              </span>
              <span className="text-xs text-gray-400 text-center">
                Limited time, limited stock
              </span>
            </div>
            {/* Clearance */}
            <div className="flex flex-col items-center bg-[#FFF7F0] rounded-lg p-6 shadow-sm">
              <div className="bg-orange-100 text-orange-500 rounded-full p-3 mb-2">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l2 2 4-4" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800 mb-1">
                Clearance
              </span>
              <span className="text-xs text-orange-500 font-bold mb-1">
                Up to 75% OFF
              </span>
              <span className="text-xs text-gray-400 text-center">
                Deep discounts on last-chance items
              </span>
            </div>
            {/* Bundle Deal */}
            <div className="flex flex-col items-center bg-[#FFF7F0] rounded-lg p-6 shadow-sm">
              <div className="bg-green-100 text-green-500 rounded-full p-3 mb-2">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M16 3v4M8 3v4" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800 mb-1">
                Bundle Deal
              </span>
              <span className="text-xs text-green-500 font-bold mb-1">
                Buy 2 Get 1 FREE
              </span>
              <span className="text-xs text-gray-400 text-center">
                Perfect for complete organization
              </span>
            </div>
            {/* Daily Deals */}
            <div className="flex flex-col items-center bg-[#FFF7F0] rounded-lg p-6 shadow-sm">
              <div className="bg-purple-100 text-purple-500 rounded-full p-3 mb-2">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800 mb-1">
                Daily Deals
              </span>
              <span className="text-xs text-purple-500 font-bold mb-1">
                24-hour specials
              </span>
              <span className="text-xs text-gray-400 text-center">
                New deals every day
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Impact */}
      <section className="bg-[#FFF7F0] py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-center text-lg md:text-xl font-bold mb-1">
            Sale Impact
          </h3>
          <p className="text-center text-gray-500 text-sm mb-8">
            See how much you can save.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Savings */}
            <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
              <span className="text-3xl font-bold text-red-500 mb-1">45%</span>
              <span className="text-xs text-gray-500 mb-2">on avg prices</span>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-red-400 w-[45%]"></div>
              </div>
              <span className="text-xs text-gray-400 mt-2">
                Average Savings
              </span>
            </div>
            {/* Maximum Discount */}
            <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
              <span className="text-3xl font-bold text-orange-500 mb-1">
                70%
              </span>
              <span className="text-xs text-gray-500 mb-2">
                On clearance items
              </span>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-orange-400 w-[70%]"></div>
              </div>
              <span className="text-xs text-gray-400 mt-2">
                Maximum Discount
              </span>
            </div>
            {/* Bundle Savings */}
            <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
              <span className="text-3xl font-bold text-yellow-500 mb-1">
                60%
              </span>
              <span className="text-xs text-gray-500 mb-2">
                With combo deals
              </span>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-yellow-400 w-[60%]"></div>
              </div>
              <span className="text-xs text-gray-400 mt-2">Bundle Savings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Time Bundle Deal */}
      <section className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 py-8">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center">
          <h4 className="text-white text-lg md:text-xl font-bold mb-2 text-center">
            Limited Time Bundle Deal!
          </h4>
          <p className="text-white text-base md:text-lg mb-4 text-center">
            Buy any Complete System + Get 2 Organizers{" "}
            <span className="font-bold">FREE</span>
          </p>
          <button className="bg-white text-orange-500 font-bold px-6 py-2 rounded shadow hover:bg-orange-100">
            Shop Bundle
          </button>
        </div>
      </section>
      <FeaturedProducts products={products} />
    </div>
  );
}
