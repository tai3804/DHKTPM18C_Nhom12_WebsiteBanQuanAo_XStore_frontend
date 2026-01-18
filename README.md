# XStore Frontend - Ứng dụng mua sắm thời trang trực tuyến

Giao diện người dùng cho ứng dụng XStore - Hệ thống thương mại điện tử bán quần áo với trải nghiệm mua sắm hiện đại và thân thiện.

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [Cấu hình](#cấu-hình)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Tính năng chính](#tính-năng-chính)
- [Pages và Routes](#pages-và-routes)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Build và Deploy](#build-và-deploy)
- [Development Guidelines](#development-guidelines)

## Giới thiệu

XStore Frontend là ứng dụng Single Page Application (SPA) được xây dựng với React và Vite, cung cấp giao diện mua sắm trực tuyến cho khách hàng và công cụ quản trị cho admin.

### Tính năng nổi bật

- Giao diện responsive, tương thích mọi thiết bị
- Tìm kiếm và lọc sản phẩm nâng cao
- Giỏ hàng thời gian thực
- Thanh toán tích hợp VNPay
- Quản lý đơn hàng và theo dõi trạng thái
- Xác thực với Google OAuth
- Dashboard quản trị cho admin
- Tối ưu hiệu suất với lazy loading

## Công nghệ sử dụng

### Core Technologies
- **React 19.1.1** - UI Library
- **Vite 7.1.7** - Build tool & Dev server
- **React Router DOM 7.9.4** - Routing
- **Redux Toolkit 2.9.1** - State management
- **Axios 1.13.2** - HTTP client

### UI & Styling
- **Tailwind CSS 4.1.15** - Utility-first CSS framework
- **Framer Motion 12.23.24** - Animation library
- **Lucide React** - Icon library
- **Radix UI** - Accessible UI components
- **React Toastify** - Toast notifications

### Authentication & Security
- **@react-oauth/google** - Google OAuth integration
- **jwt-decode** - JWT token decoding

### Charts & Visualization
- **Recharts 3.3.0** - Chart library cho admin dashboard

### Development Tools
- **ESLint 9.36.0** - Code linting
- **PostCSS & Autoprefixer** - CSS processing

## Yêu cầu hệ thống

- Node.js 18.0 hoặc cao hơn
- npm 9.0+ hoặc yarn 1.22+
- RAM tối thiểu 4GB
- Disk space: 1GB

## Cài đặt và chạy

### 1. Clone repository

```bash
git clone https://github.com/tai3804/XStore_frontend.git
cd XStore_frontend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` trong thư mục root:

```env
# Backend API URL
VITE_API_URL=http://localhost:8080/api

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=20028934029-urn06qotve6ot72vc537v1voujlm2h9g.apps.googleusercontent.com

```

### 4. Chạy development server

```bash
npm run dev
```

Ứng dụng chạy tại: `http://localhost:3000`

### 5. Build cho production

```bash
npm run build
```

Output tại thư mục `dist/`

### 6. Preview production build

```bash
npm run preview
```

## Cấu hình

### vite.config.js

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### tailwind.config.js

Cấu hình Tailwind CSS với custom colors, typography và responsive breakpoints.

### ESLint Configuration

ESLint đã được cấu hình với:
- React hooks rules
- React refresh plugin
- Modern ES6+ syntax

## Cấu trúc dự án

```
XStore_frontend/
├── public/                      # Static assets
│   └── images/
├── src/
│   ├── assets/                  # Images, fonts, static files
│   │   └── HeroSection.jsx      # Hero banner component
│   ├── components/              # Reusable components
│   │   ├── admin/              # Admin-only components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AddUserForm.jsx
│   │   │   ├── ChatManagement.jsx
│   │   │   ├── DiscountForm.jsx
│   │   │   ├── OrderManagement.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   └── ...
│   │   ├── checkout/           # Checkout flow components
│   │   ├── common/             # Shared components
│   │   ├── header/             # Header & navigation
│   │   ├── home/               # Homepage components
│   │   └── product/            # Product display components
│   ├── config/
│   │   └── api.js              # API configuration
│   ├── constants/
│   │   ├── errors.js           # Error messages
│   │   └── successes.js        # Success messages
│   ├── pages/                  # Page components
│   │   ├── admin/              # Admin pages
│   │   │   ├── ManageUsersPage.jsx
│   │   │   ├── ManageProductsPage.jsx
│   │   │   ├── ManageOrdersPage.jsx
│   │   │   └── ...
│   │   ├── AboutPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ProductsPage.jsx
│   │   └── ...
│   ├── services/
│   │   └── vnRegionAPI.js      # Vietnam region data API
│   ├── slices/                 # Redux slices
│   │   ├── AuthSlice.js
│   │   ├── CartSlice.js
│   │   ├── ProductSlice.js
│   │   ├── OrderSlice.js
│   │   └── ...
│   ├── store/
│   │   └── store.ts            # Redux store configuration
│   ├── utils/
│   │   └── imageUrl.js         # Image URL helpers
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables
├── .gitignore
├── eslint.config.js
├── index.html                  # HTML template
├── package.json
├── tailwind.config.js
├── vercel.json                 # Vercel deployment config
└── vite.config.js
```

## Tính năng chính

### 1. Authentication & Authorization

**Đăng ký và đăng nhập:**
- Form đăng ký với validation
- Đăng nhập email/password
- Google OAuth 2.0 integration
- JWT token management
- Auto-refresh token

**Quên mật khẩu:**
- Gửi OTP qua email
- Xác thực OTP
- Đặt lại mật khẩu

**Phân quyền:**
- Protected routes cho authenticated users
- Admin-only routes với role check
- Redirect dựa trên role (ADMIN/CUSTOMER)

### 2. Product Catalog

**Danh sách sản phẩm:**
- Grid layout responsive
- Lazy loading với pagination
- Filter theo loại sản phẩm
- Filter theo giá (min/max)
- Sắp xếp (giá, tên, mới nhất)
- Tìm kiếm real-time

**Chi tiết sản phẩm:**
- Image gallery với zoom
- Chọn màu sắc và kích thước
- Hiển thị tồn kho
- Thêm vào giỏ hàng
- Sản phẩm liên quan

**Sản phẩm đặc biệt:**
- Hot products (bán chạy nhất)
- Sale products (đang giảm giá)
- New arrivals

### 3. Shopping Cart

**Quản lý giỏ hàng:**
- Thêm/xóa sản phẩm
- Cập nhật số lượng
- Tính tổng tiền tự động
- Badge counter trên icon giỏ hàng
- Lưu cart trong Redux và localStorage

**Cart persistence:**
- Sync giỏ hàng với backend
- Khôi phục giỏ hàng khi đăng nhập

### 4. Checkout & Payment

**Checkout flow:**
- Form thông tin giao hàng
- Chọn địa chỉ (Tỉnh/Thành, Quận/Huyện, Phường/Xã)
- Áp dụng mã giảm giá
- Chọn phương thức thanh toán
- Review đơn hàng trước khi thanh toán

**Payment methods:**
- COD (Cash on Delivery)
- VNPay gateway integration
- Xử lý callback từ VNPay
- Cập nhật trạng thái thanh toán

### 5. Order Management

**Cho khách hàng:**
- Xem danh sách đơn hàng
- Chi tiết đơn hàng
- Theo dõi trạng thái
- Hủy đơn hàng
- Yêu cầu trả hàng/hoàn tiền
- Tải PDF hóa đơn

**Trạng thái đơn hàng:**
- Pending (Chờ xác nhận)
- Confirmed (Đã xác nhận)
- Shipping (Đang giao)
- Delivered (Đã giao)
- Cancelled (Đã hủy)

### 6. Admin Dashboard

**Quản lý sản phẩm:**
- CRUD operations
- Upload ảnh sản phẩm
- Quản lý biến thể (màu, size)
- Import/export CSV

**Quản lý đơn hàng:**
- Xem tất cả đơn hàng
- Cập nhật trạng thái
- Xử lý hủy đơn
- Thống kê doanh thu

**Quản lý người dùng:**
- Xem danh sách users
- Tạo/sửa/xóa users
- Cập nhật role (ADMIN/CUSTOMER)
- Tìm kiếm users

**Quản lý kho:**
- Xem danh sách kho
- Tạo/sửa/xóa kho
- Quản lý tồn kho theo biến thể
- Import/export inventory

**Quản lý giảm giá:**
- Tạo mã giảm giá
- Thiết lập phần trăm/số tiền giảm
- Giới hạn thời gian và số lượng
- Kích hoạt/vô hiệu hóa

**Analytics:**
- Biểu đồ doanh thu
- Top selling products
- User growth
- Order statistics

### 7. User Profile

**Thông tin cá nhân:**
- Xem và cập nhật thông tin
- Đổi mật khẩu
- Quản lý địa chỉ giao hàng

**Wishlist/Favorites:**
- Thêm sản phẩm yêu thích
- Quản lý danh sách favorites

### 8. Additional Features

**Responsive Design:**
- Mobile-first approach
- Tablet và desktop optimized
- Touch-friendly UI

**Performance:**
- Code splitting
- Lazy loading routes
- Image optimization
- Caching strategies

**SEO:**
- Meta tags
- Semantic HTML
- Structured data

## Pages và Routes

### Public Routes

```
/                           - Homepage
/products                   - Danh sách sản phẩm
/products/:id               - Chi tiết sản phẩm
/hot                        - Sản phẩm hot
/sale                       - Sản phẩm sale
/about                      - Về chúng tôi
/contact                    - Liên hệ
/faq                        - Câu hỏi thường gặp
/terms                      - Điều khoản dịch vụ
/privacy                    - Chính sách bảo mật
/refund                     - Chính sách hoàn tiền
/shopping-guide             - Hướng dẫn mua hàng
/login                      - Đăng nhập
/register                   - Đăng ký
/forgot-password            - Quên mật khẩu
/send-otp                   - Gửi OTP
/verify-otp                 - Xác thực OTP
/reset-password             - Đặt lại mật khẩu
```

### Protected Routes (Authenticated)

```
/cart                       - Giỏ hàng
/checkout                   - Thanh toán
/orders                     - Danh sách đơn hàng
/orders/:id                 - Chi tiết đơn hàng
/order-tracking             - Theo dõi đơn hàng
/user                       - Trang cá nhân
/favourite                  - Sản phẩm yêu thích
/payment/return             - VNPay return URL
/order-confirmation         - Xác nhận đơn hàng
```

### Admin Routes (ADMIN role)

```
/admin/dashboard            - Dashboard
/admin/users                - Quản lý users
/admin/products             - Quản lý sản phẩm
/admin/orders               - Quản lý đơn hàng
/admin/discounts            - Quản lý giảm giá
/admin/stocks               - Quản lý kho
/admin/product-types        - Quản lý loại sản phẩm
/admin/chat                 - Quản lý chat
/admin/comments             - Quản lý bình luận
```

## State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: {},
    token: '',
    isAuthenticated: false
  },
  products: {
    items: [],
    loading: false,
    error: null
  },
  cart: {
    items: [],
    total: 0
  },
  orders: {
    items: [],
    currentOrder: null
  },
  // ... other slices
}
```

### Key Slices

**AuthSlice.js**
- Login/logout
- Register
- Google OAuth
- Token management
- User profile

**ProductSlice.js**
- Fetch products
- Filter & search
- Product details
- CRUD operations

**CartSlice.js**
- Add/remove items
- Update quantity
- Calculate total
- Sync with backend

**OrderSlice.js**
- Create order
- Fetch orders
- Update status
- Cancel order

## API Integration

### API Configuration (config/api.js)

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Async Thunks Pattern

```javascript
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products');
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
```

## Build và Deploy

### Build cho production

```bash
npm run build
```

Output: `dist/` folder

### Tối ưu build

- Code splitting automatic
- Tree shaking
- CSS minification
- Image optimization
- Gzip compression

### Deploy lên Vercel

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

**vercel.json:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Deploy lên Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables cho Production

```env
VITE_API_URL=https://api.xstore.com/api
VITE_GOOGLE_CLIENT_ID=production-client-id
```

## Development Guidelines

### Code Style

- Use functional components với hooks
- Follow React best practices
- Consistent naming conventions
- Component composition over inheritance

### Component Structure

```javascript
// Imports
import { useState, useEffect } from 'react';

// Component
const MyComponent = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState(null);
  
  // Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // Handlers
  const handleClick = () => {
    // handler logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### Redux Best Practices

- Use Redux Toolkit
- Create async thunks for API calls
- Normalize state shape
- Use selectors for derived data

### CSS/Styling Guidelines

- Use Tailwind utility classes
- Create custom classes cho repeated patterns
- Follow mobile-first approach
- Maintain consistent spacing

### Performance Tips

- Use React.memo cho expensive components
- Implement lazy loading
- Optimize images
- Minimize re-renders
- Use production build

### Testing (Recommended)

```bash
# Add testing dependencies
npm install -D vitest @testing-library/react

# Run tests
npm run test
```

## Troubleshooting

### Port đã được sử dụng

```bash
# Change port in vite.config.js
server: {
  port: 3001
}
```

### API connection failed

- Check backend server đang chạy
- Verify VITE_API_URL trong .env
- Check CORS configuration

### Build errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Google OAuth not working

- Verify VITE_GOOGLE_CLIENT_ID
- Check authorized redirect URIs
- Ensure domain is whitelisted

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

Copyright 2026 XStore Team
