import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User as UserIcon } from "lucide-react";
import { API_BASE_URL } from "../../config/api";
import { useSelector } from "react-redux";
import { selectAuthUser, selectAuthToken } from "../../slices/AuthSlice";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState("ai"); // 'ai' or 'staff'
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const authUser = useSelector(selectAuthUser);
  const authToken = useSelector(selectAuthToken);
  const [messages, setMessages] = useState({
    ai: [],
    staff: [],
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Lấy token từ Redux store
  const token = useSelector(selectAuthToken);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMode]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, chatMode]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Sử dụng userId nếu đã đăng nhập, nếu không thì dùng "anonymous"
    const senderId = authUser?.id || "anonymous";

    const userMessage = {
      id: messages[chatMode].length + 1,
      text: inputMessage,
      sender: chatMode === "staff" ? senderId : "user",
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [chatMode]: [...prev[chatMode], userMessage],
    }));
    setInputMessage("");
    inputRef.current?.focus();
    setIsLoading(true);

    if (chatMode === "ai") {
      // Chat with AI
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        // Thêm token nếu có
        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            message: inputMessage,
            sessionId: sessionId,
          }),
        });

        if (!response.ok) {
          throw new Error("Không thể kết nối với AI");
        }

        const botResponse = await response.text();

        const botMessage = {
          id: messages.ai.length + 2,
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => ({
          ...prev,
          ai: [...prev.ai, botMessage],
        }));
      } catch (error) {
        console.error("AI Chat error:", error);
        const errorMessage = {
          id: messages.ai.length + 2,
          text: "Xin lỗi, có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => ({
          ...prev,
          ai: [...prev.ai, errorMessage],
        }));
      }
    } else {
      // Chat with staff - send message to backend
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
              `${authUser?.firstName || ""} ${
                authUser?.lastName || ""
              }`.trim() || "", // Có thể thêm form để nhập tên
            userEmail: authUser?.email || "", // Có thể thêm form để nhập email
          }),
        });

        if (!response.ok) {
          throw new Error("Không thể gửi tin nhắn");
        }

        const staffMessage = {
          id: messages.staff.length + 2,
          text: "Cảm ơn bạn đã liên hệ! Tin nhắn của bạn đã được gửi đến bộ phận chăm sóc khách hàng. Chúng tôi sẽ phản hồi trong vòng 24 giờ qua email hoặc hệ thống chat này.",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => ({
          ...prev,
          staff: [...prev.staff, staffMessage],
        }));
      } catch (error) {
        console.error("Staff Chat error:", error);
        const errorMessage = {
          id: messages.staff.length + 2,
          text: "Xin lỗi, có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => ({
          ...prev,
          staff: [...prev.staff, errorMessage],
        }));
      }
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const switchChatMode = (mode) => {
    setChatMode(mode);
  };

  const currentMessages = messages[chatMode];

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <div
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={24} />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              {chatMode === "ai" ? <Bot size={24} /> : <UserIcon size={24} />}
              <div>
                <h3 className="font-semibold">
                  {chatMode === "ai" ? "XStore AI" : "Chăm sóc khách hàng"}
                </h3>
                <p className="text-sm opacity-90">
                  {chatMode === "ai" ? "Trợ lý thông minh" : "Hỗ trợ 24/7"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Mode Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => switchChatMode("ai")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                chatMode === "ai"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Bot size={16} className="inline mr-2" />
              Chat AI
            </button>
            <button
              onClick={() => switchChatMode("staff")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                chatMode === "staff"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <UserIcon size={16} className="inline mr-2" />
              Nhân viên
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
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
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {chatMode === "ai" ? "Đang trả lời..." : "Đang gửi..."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Nhập tin nhắn ${
                  chatMode === "ai" ? "với AI" : "cho nhân viên"
                }...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
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

export default Chatbot;
