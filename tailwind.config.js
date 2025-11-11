/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Sử dụng class strategy cho dark mode
  theme: {
    extend: {
      colors: {
        // Có thể thêm custom colors nếu cần
      },
    },
  },
  plugins: [],
}
