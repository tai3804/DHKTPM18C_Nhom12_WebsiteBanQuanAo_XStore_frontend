import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  User,
  Clock,
  CheckCircle,
  Search,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../slices/AuthSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";

const ChatManagement = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const authToken = useSelector(selectAuthToken);
  const themeMode = useSelector(selectThemeMode);
  const textareaRef = useRef(null);
  const messagesRef = useRef(null);

  // Filter chatRooms based on search term
  const filteredChatRooms = chatRooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function để tạo headers với JWT token
  const getHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    return headers;
  };

  // Load danh sách chatRooms
  useEffect(() => {
    loadChatRooms();
    loadUnreadCount();
  }, []);

  // Load lịch sử chat khi chọn chatRoom
  useEffect(() => {
    if (selectedChatRoomId) {
      loadChatHistory(selectedChatRoomId);
      // Tự động đánh dấu đã đọc khi chọn conversation
      markChatRoomAsRead(selectedChatRoomId);
    }
  }, [selectedChatRoomId]);

  // Scroll to bottom when chatHistory changes
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const loadChatRooms = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/admin/chat-rooms`,
        {
          headers: getHeaders(),
        }
      );
      if (response.ok) {
        const rooms = await response.json();
        setChatRooms(rooms);
        // Calculate total unread count from all rooms
        const totalUnread = rooms.reduce(
          (sum, room) => sum + (room.unreadCount || 0),
          0
        );
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error("Error loading chat rooms:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/admin/unread-count`,
        {
          headers: getHeaders(),
        }
      );
      if (response.ok) {
        const count = await response.json();
        setUnreadCount(count);
      }
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const loadChatHistory = async (chatRoomId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/history/${chatRoomId}`,
        {
          headers: getHeaders(),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const sendResponse = async (chatRoomId) => {
    if (!responseMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/admin/send/${chatRoomId}`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            message: responseMessage,
          }),
        }
      );

      if (response.ok) {
        setResponseMessage("");
        textareaRef.current?.focus();
        // Reload chat history
        if (selectedChatRoomId) {
          loadChatHistory(selectedChatRoomId);
          loadChatRooms(); // Reload để cập nhật
        }
        loadUnreadCount();
      }
    } catch (error) {
      console.error("Error sending response:", error);
    } finally {
      setLoading(false);
    }
  };

  const markChatRoomAsRead = async (chatRoomId) => {
    try {
      await fetch(
        `${API_BASE_URL}/api/chat/admin/mark-read/chat-room/${chatRoomId}`,
        {
          method: "PUT",
          headers: getHeaders(),
        }
      );
      loadUnreadCount();
      loadChatRooms(); // Reload để cập nhật unread count
      if (selectedChatRoomId) {
        loadChatHistory(selectedChatRoomId);
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <div
      className={`flex h-full min-h-full ${
        themeMode === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar - Danh sách sessions */}
      <div
        className={`w-80 ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border-r flex flex-col rounded-lg shadow-sm h-full`}
      >
        <div
          className={`p-4 ${
            themeMode === "dark" ? "border-gray-700" : "border-gray-200"
          } border-b`}
        >
          <h2
            className={`text-lg font-semibold ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            } flex items-center gap-2`}
          >
            <MessageCircle size={20} />
            Quản lý Chat
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>

        {/* Search input - moved to top */}
        <div
          className={`p-4 ${
            themeMode === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          } border-b`}
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm khách hàng..."
              className={`w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                themeMode === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  : "border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className={`h-5 w-5 ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChatRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedChatRoomId(room.id)}
              className={`p-4 ${
                themeMode === "dark"
                  ? "border-gray-700 hover:bg-gray-700"
                  : "border-gray-100 hover:bg-gray-50"
              } border-b cursor-pointer ${
                selectedChatRoomId === room.id
                  ? `${
                      themeMode === "dark"
                        ? "bg-gray-700 border-r-blue-500"
                        : "bg-blue-50 border-r-blue-500"
                    } border-r-2`
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User
                    size={16}
                    className={
                      themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                    }
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-800"
                        }`}
                      >
                        {room.name}
                      </span>
                      {room.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs ${
                        themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                      } truncate max-w-40`}
                    >
                      {room.lastMessage?.message ||
                        (room.userId
                          ? `User ${room.userId}`
                          : `Session ${room.sessionId}`)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {room.unreadCount > 0 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-red-500 font-medium">
                        Chưa xem
                      </span>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs ${
                          themeMode === "dark"
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        Đã xem
                      </span>
                      <CheckCircle size={12} className="text-green-500" />
                    </div>
                  )}
                  <Clock
                    size={14}
                    className={
                      themeMode === "dark" ? "text-gray-500" : "text-gray-400"
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content - Chat history */}
      <div className="flex-1 flex flex-col h-full min-h-full">
        {selectedChatRoomId ? (
          <>
            {/* Chat header */}
            <div
              className={`p-4 ${
                themeMode === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border-b`}
            >
              <h3
                className={`text-lg font-semibold ${
                  themeMode === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Chat với khách hàng -{" "}
                {chatRooms.find((r) => r.id === selectedChatRoomId)?.name ||
                  `Chat Room ${selectedChatRoomId}`}
              </h3>
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 max-h-screen"
            >
              {chatHistory.map((chat) => (
                <div key={chat.id} className="space-y-2">
                  {/* Message */}
                  <div
                    className={`flex ${
                      chat.sender === 0 ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-lg ${
                        chat.sender === 0
                          ? themeMode === "dark"
                            ? "bg-green-900 text-green-100"
                            : "bg-green-100 text-gray-800"
                          : themeMode === "dark"
                          ? "bg-blue-900 text-blue-100"
                          : "bg-blue-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {chat.sender === 0 ? (
                          <CheckCircle
                            size={14}
                            className={
                              themeMode === "dark"
                                ? "text-green-300"
                                : "text-green-600"
                            }
                          />
                        ) : (
                          <User
                            size={14}
                            className={
                              themeMode === "dark"
                                ? "text-blue-300"
                                : "text-blue-600"
                            }
                          />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            chat.sender === 0
                              ? themeMode === "dark"
                                ? "text-green-300"
                                : "text-green-600"
                              : themeMode === "dark"
                              ? "text-blue-300"
                              : "text-blue-600"
                          }`}
                        >
                          {chat.sender === 0
                            ? "Admin"
                            : chat.name || "Khách hàng"}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-800"
                        }`}
                      >
                        {chat.message}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(chat.timestamp).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Response input */}
            <div
              className={`p-4 ${
                themeMode === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border-t`}
            >
              <div className="flex gap-2">
                <textarea
                  ref={textareaRef}
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendResponse(selectedChatRoomId);
                    }
                  }}
                  placeholder="Nhập phản hồi..."
                  className={`flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    themeMode === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  rows={1}
                />
                <button
                  onClick={() => sendResponse(selectedChatRoomId)}
                  disabled={!responseMessage.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1 self-end"
                >
                  <Send size={14} />
                  {loading ? "Đang gửi..." : "Gửi"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div
              className={`text-center ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>Chọn một cuộc trò chuyện để xem chi tiết</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatManagement;
