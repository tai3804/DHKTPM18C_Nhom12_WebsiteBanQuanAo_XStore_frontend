import React from 'react';

// Component giả lập cho ProductCard
const ProductCard = ({ product, onAddToCart, onToggleFavorite, onProductClick }) => (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center">
            {/* Thay bằng ảnh sản phẩm */}
            <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
        </div>
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-600">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
        <div className="mt-2 flex gap-2">
            <button onClick={() => onAddToCart(product)} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Thêm</button>
            <button onClick={() => onToggleFavorite(product.id)} className="text-xs border px-2 py-1 rounded">{product.isFavorite ? '❤️' : '🤍'}</button>
            <button onClick={() => onProductClick(product)} className="text-xs border px-2 py-1 rounded">Xem</button>
        </div>
    </div>
);

// Component giả lập cho ProductGrid
const ProductGrid = ({ products, onAddToCart, onToggleFavorite, onProductClick }) => (
    <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-gray-900">Sản Phẩm Nổi Bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
                Những sản phẩm được yêu thích nhất tuần qua.
            </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onToggleFavorite={onToggleFavorite}
                    onProductClick={onProductClick}
                />
            ))}
        </div>
    </section>
);
// Kết thúc component giả lập

export default function FeaturedProducts({ products, onAddToCart, onToggleFavorite, onProductClick }) {
    // Lấy một số sản phẩm để hiển thị (ví dụ 8 sản phẩm đầu)
    const featured = products.slice(0, 8);

    // Nếu bạn đã có ProductGrid component riêng, hãy dùng nó ở đây
    return (
        <ProductGrid
            products={featured}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
            onProductClick={onProductClick}
        />
    );
}