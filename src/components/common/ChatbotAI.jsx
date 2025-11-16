import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { API_BASE_URL } from "../../config/api";
import { useSelector } from "react-redux";
import { selectAuthToken, selectAuthUser } from "../../slices/AuthSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";

const ChatbotAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const authUser = useSelector(selectAuthUser);
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

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      name: authUser
        ? `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() ||
          "Khách vãng lai"
        : "Khách vãng lai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    inputRef.current?.focus();
    setIsLoading(true);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

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
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Chat error:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Xin lỗi, có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.",
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
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-600 hover:bg-blue-700"
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
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <div>
                <h3 className="font-semibold">XStore AI</h3>
                <p className="text-sm opacity-90">Trợ lý thông minh</p>
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
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg transition-colors duration-300 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : themeMode === "dark"
                      ? "bg-gray-700 text-gray-100"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.sender === "user" && message.name && (
                    <p className="text-xs font-semibold mb-1">{message.name}</p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
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
                      Đang trả lời...
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
                placeholder="Nhập tin nhắn với AI..."
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                  themeMode === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
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

export default ChatbotAI;
