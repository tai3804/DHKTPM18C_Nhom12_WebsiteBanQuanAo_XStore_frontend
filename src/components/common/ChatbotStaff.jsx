import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User as UserIcon } from "lucide-react";
import { API_BASE_URL } from "../../config/api";
import { useSelector } from "react-redux";
import { selectAuthUser, selectAuthToken } from "../../slices/AuthSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";

const ChatbotStaff = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const authUser = useSelector(selectAuthUser);
  const authToken = useSelector(selectAuthToken);
  const themeMode = useSelector(selectThemeMode);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Focus input when loading finishes
  useEffect(() => {
    if (!isLoading && isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isOpen]);

  // Load chat history when opening if user is logged in
  useEffect(() => {
    if (isOpen && authUser) {
      loadChatHistory();
    } else if (isOpen && !authUser) {
      // Add welcome message for guest users
      setMessages([
        {
          id: 1,
          text: "Xin chào! Tôi là trợ lý chăm sóc khách hàng. Bạn có thể gửi tin nhắn để được hỗ trợ.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, authUser]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/user/history`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const history = await response.json();
        const formattedMessages = history.map((chat) => ({
          id: chat.id,
          text: chat.message,
          sender: chat.sender === 0 ? "bot" : chat.sender.toString(),
          name: chat.name,
          timestamp: new Date(chat.timestamp),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Sử dụng userId nếu đã đăng nhập, nếu không thì dùng "anonymous"
    const senderId = authUser?.id || "anonymous";

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: senderId,
      name: authUser
        ? `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() ||
          "Khách vãng lai"
        : "Khách vãng lai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    setIsLoading(true);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      // Thêm token nếu có
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/user`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          sessionId: sessionId,
          message: inputMessage,
          userId: authUser?.id || null,
          userName:
            `${authUser?.firstName || ""} ${authUser?.lastName || ""}`.trim() ||
            "",
          userEmail: authUser?.email || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể gửi tin nhắn");
      }

      // Tin nhắn đã được gửi thành công, không cần thông báo thêm
    } catch (error) {
      console.error("Staff Chat error:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Xin lỗi, có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Keep focus on input after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <div
          className={`fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
            themeMode === "dark"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white`}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={24} />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-96 h-[500px] rounded-lg shadow-2xl z-50 flex flex-col transition-colors duration-300 ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border`}
        >
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserIcon size={24} />
              <div>
                <h3 className="font-semibold">Chăm sóc khách hàng</h3>
                <p className="text-sm opacity-90">Hỗ trợ 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender !== "bot" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg transition-colors duration-300 ${
                    message.sender !== "bot"
                      ? "bg-green-600 text-white"
                      : themeMode === "dark"
                      ? "bg-gray-700 text-gray-100"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.sender !== "bot" && message.name && (
                    <p className="text-xs font-semibold mb-1">{message.name}</p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender !== "bot"
                        ? "text-green-100"
                        : themeMode === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={`p-3 rounded-lg transition-colors duration-300 ${
                    themeMode === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          themeMode === "dark" ? "bg-gray-400" : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          themeMode === "dark" ? "bg-gray-400" : "bg-gray-400"
                        }`}
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${
                          themeMode === "dark" ? "bg-gray-400" : "bg-gray-400"
                        }`}
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span
                      className={`text-sm ${
                        themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Đang gửi...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className={`p-4 border-t transition-colors duration-300 ${
              themeMode === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn cho nhân viên..."
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300 ${
                  themeMode === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-green-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotStaff;
