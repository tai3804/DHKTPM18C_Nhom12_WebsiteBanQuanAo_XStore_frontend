# HƯỚNG DẪN SỬ DỤNG FILE .ENV

## Cài đặt Development (Localhost)

File `.env` hiện tại đã được cấu hình cho development:

```
VITE_API_URL=http://localhost:8080
```

## Khi Deploy Production

Khi deploy lên server thực tế, thay đổi `.env` thành:

```
VITE_API_URL=https://your-backend-domain.com
```

Ví dụ:

```
VITE_API_URL=https://x-store-api.onrender.com
VITE_API_URL=https://api.xstore.com
```

## Cách sử dụng trong code (Optional - nếu cần fetch trực tiếp)

Nếu bạn muốn fetch trực tiếp không qua proxy, import và sử dụng:

```javascript
import { getApiUrl } from "../config/api";

// Trong createAsyncThunk hoặc fetch
const response = await fetch(getApiUrl("/api/products"));
```

## LƯU Ý QUAN TRỌNG

1. **File .env không nên commit lên Git**

   - Đã được thêm vào .gitignore
   - Chỉ commit file .env.example

2. **Restart dev server sau khi thay đổi .env**

   ```bash
   # Dừng server (Ctrl + C)
   # Chạy lại
   npm run dev
   ```

3. **Environment variables trong Vite phải bắt đầu với `VITE_`**

   - ✅ Đúng: `VITE_API_URL`
   - ❌ Sai: `API_URL`, `REACT_APP_API_URL`

4. **Truy cập trong code**
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

## Cấu trúc hiện tại

- **Development**: Vite proxy `/api` → `http://localhost:8080`
- **Production**: Có thể dùng biến môi trường từ hosting platform
- Code hiện tại dùng `/api/...` sẽ tự động được proxy đến backend

## Deploy lên Vercel/Netlify

Thêm environment variable trong dashboard:

- Variable name: `VITE_API_URL`
- Value: `https://your-backend-url.com`
