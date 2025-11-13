import React from "react";

export default function ProductImageGallery({
  images = [],
  productName,
  selectedImage,
  onImageSelect,
}) {
  const defaultImage = "/placeholder-image.jpg";
  const displayImages = images.length > 0 ? images : [defaultImage];

  return (
    <div className="space-y-4">
      {/* Ảnh chính */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-lg">
        <img
          src={displayImages[selectedImage] || defaultImage}
          alt={productName}
          className="w-full h-96 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>

      {/* Ảnh thumbnail */}
      {displayImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-blue-500 dark:border-blue-400 shadow-md"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
