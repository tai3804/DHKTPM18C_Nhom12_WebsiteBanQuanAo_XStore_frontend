export const Errors = {
  // Authentication errors
  AUTH_LOGIN_FAILED: "Đăng nhập thất bại",
  AUTH_REGISTER_FAILED: "Đăng ký thất bại",
  AUTH_LOGOUT_FAILED: "Đăng xuất thất bại",
  AUTH_INVALID_CREDENTIALS: "Tên đăng nhập hoặc mật khẩu không đúng",
  AUTH_USER_NOT_FOUND: "Không tìm thấy người dùng",
  AUTH_TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn",
  AUTH_UNAUTHORIZED: "Bạn không có quyền truy cập",

  // User errors
  USER_FETCH_FAILED: "Không thể lấy thông tin người dùng",
  USER_UPDATE_FAILED: "Không thể cập nhật thông tin",
  USER_DELETE_FAILED: "Không thể xóa người dùng",
  USER_CREATE_FAILED: "Không thể tạo người dùng",

  // Product errors
  PRODUCT_FETCH_FAILED: "Không thể lấy danh sách sản phẩm",
  PRODUCT_CREATE_FAILED: "Không thể tạo sản phẩm",
  PRODUCT_UPDATE_FAILED: "Không thể cập nhật sản phẩm",
  PRODUCT_DELETE_FAILED: "Không thể xóa sản phẩm",
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm",

  // Product Type errors
  PRODUCT_TYPE_FETCH_FAILED: "Không thể lấy danh sách loại sản phẩm",
  PRODUCT_TYPE_CREATE_FAILED: "Không thể tạo loại sản phẩm",
  PRODUCT_TYPE_UPDATE_FAILED: "Không thể cập nhật loại sản phẩm",
  PRODUCT_TYPE_DELETE_FAILED: "Không thể xóa loại sản phẩm",

  // Cart errors
  CART_FETCH_FAILED: "Không thể lấy giỏ hàng",
  CART_CREATE_FAILED: "Không thể tạo giỏ hàng",
  CART_ADD_FAILED: "Không thể thêm sản phẩm vào giỏ hàng",
  CART_UPDATE_FAILED: "Không thể cập nhật giỏ hàng",
  CART_REMOVE_FAILED: "Không thể xóa sản phẩm khỏi giỏ hàng",
  CART_CLEAR_FAILED: "Không thể xóa giỏ hàng",

  // Order errors
  ORDER_FETCH_FAILED: "Không thể lấy danh sách đơn hàng",
  ORDER_CREATE_FAILED: "Không thể tạo đơn hàng",
  ORDER_UPDATE_FAILED: "Không thể cập nhật đơn hàng",
  ORDER_CANCEL_FAILED: "Không thể hủy đơn hàng",

  // Stock errors
  STOCK_FETCH_FAILED: "Không thể lấy thông tin kho",
  STOCK_UPDATE_FAILED: "Không thể cập nhật kho",
  STOCK_INSUFFICIENT: "Số lượng trong kho không đủ",

  // Discount errors
  DISCOUNT_FETCH_FAILED: "Không thể lấy mã giảm giá",
  DISCOUNT_INVALID: "Mã giảm giá không hợp lệ",
  DISCOUNT_EXPIRED: "Mã giảm giá đã hết hạn",

  // Network errors
  NETWORK_ERROR: "Lỗi kết nối mạng",
  SERVER_ERROR: "Lỗi máy chủ",
  REQUEST_TIMEOUT: "Yêu cầu hết thời gian chờ",

  // Validation errors
  VALIDATION_ERROR: "Dữ liệu không hợp lệ",
  REQUIRED_FIELD: "Trường này là bắt buộc",
  INVALID_EMAIL: "Email không hợp lệ",
  INVALID_PHONE: "Số điện thoại không hợp lệ",
  PASSWORD_TOO_SHORT: "Mật khẩu phải có ít nhất 6 ký tự",
  PASSWORD_NOT_MATCH: "Mật khẩu không khớp",

  // Generic errors
  UNKNOWN_ERROR: "Đã có lỗi xảy ra",
  OPERATION_FAILED: "Thao tác thất bại",
};

// Export default để có thể dùng cả 2 cách import
export default Errors;