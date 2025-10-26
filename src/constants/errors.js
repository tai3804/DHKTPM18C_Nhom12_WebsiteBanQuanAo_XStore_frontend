const Errors = {
  // user
  USER_FETCH_FAILED: "Không thể tải danh sách người dùng",
  USER_FETCH_BY_ID_FAILED: "Không thể tải thông tin người dùng",
  USER_CREATE_FAILED: "Không thể tạo người dùng mới",
  USER_UPDATE_FAILED: "Không thể cập nhật người dùng",
  USER_DELETE_FAILED: "Không thể xóa người dùng",
  USER_ALREADY_EXISTS: "Người dùng đã tồn tại",

  // CART
  CART_FETCH_FAILED: "Failed to fetch cart.",
  CART_CREATE_FAILED: "Failed to create cart.",
  CART_DELETE_FAILED: "Failed to delete cart.",

  // CART ITEM
  CARTITEM_CREATE_FAILED: "Failed to add item to cart.",
  CARTITEM_UPDATE_FAILED: "Failed to update cart item.",
  CARTITEM_DELETE_FAILED: "Failed to remove cart item.",

  // STOCK 
  STOCK_FETCH_FAILED: "Lấy thông tin kho thất bại",
  STOCK_ITEM_FETCH_FAILED: "Lấy sản phẩm trong kho thất bại",
  STOCK_ITEM_UPDATE_FAILED: "Cập nhật số lượng sản phẩm thất bại",
  STOCK_ITEM_INCREASE_FAILED: "Tăng số lượng sản phẩm thất bại",
  STOCK_ITEM_DECREASE_FAILED: "Giảm số lượng sản phẩm thất bại",
  STOCK_ITEM_DELETE_FAILED: "Xóa sản phẩm khỏi kho thất bại",
  STOCK_CREATE_FAILED: "Tạo mới kho thất bại",
  STOCK_UPDATE_FAILED: "Cập nhật kho thất bại",
  STOCK_DELETE_FAILED: "Xóa kho thất bại",

  // product
  PRODUCT_FETCH_FAILED: "Không thể tải danh sách sản phẩm",
  PRODUCT_FETCH_BY_ID_FAILED: "Không thể tải thông tin sản phẩm",
  PRODUCT_CREATE_FAILED: "Không thể tạo sản phẩm mới",
  PRODUCT_UPDATE_FAILED: "Không thể cập nhật sản phẩm",
  PRODUCT_DELETE_FAILED: "Không thể xóa sản phẩm",
  
  // product type
  PRODUCT_TYPE_FETCH_FAILED: "Không thể tải danh sách loại sản phẩm",
  PRODUCT_TYPE_FETCH_BY_ID_FAILED: "Không thể tải thông tin loại sản phẩm",
  PRODUCT_TYPE_CREATE_FAILED: "Không thể tạo loại sản phẩm mới",
  PRODUCT_TYPE_UPDATE_FAILED: "Không thể cập nhật loại sản phẩm",
  PRODUCT_TYPE_DELETE_FAILED: "Không thể xóa loại sản phẩm",
}

export default Errors
