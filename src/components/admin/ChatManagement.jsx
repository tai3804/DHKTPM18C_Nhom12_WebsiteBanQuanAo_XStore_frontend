import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllChatRooms,
  getChatHistory,
  sendAdminMessage,
  markChatRoomAsRead,
  setSelectedChatRoom,
  getUnreadCount,
} from "../../slices/ChatSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { Send, MessageCircle, User } from "lucide-react";

const ChatManagement = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const { chatRooms, chatHistory, selectedChatRoom, unreadCount } = useSelector(
    (state) => state.chat
  );
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Preload chat data
    const preloadChatData = async () => {
      try {
        await dispatch(getAllChatRooms());
        await dispatch(getUnreadCount());
      } catch (err) {
        console.error("Lỗi khi preload dữ liệu chat:", err);
      }
    };

    preloadChatData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedChatRoom) {
      dispatch(getChatHistory(selectedChatRoom.id));
      dispatch(markChatRoomAsRead(selectedChatRoom.id));
    }
  }, [dispatch, selectedChatRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, selectedChatRoom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChatRoom) return;

    try {
      await dispatch(
        sendAdminMessage({
          chatRoomId: selectedChatRoom.id,
          message: message.trim(),
        })
      );
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  const currentHistory = selectedChatRoom
    ? chatHistory[selectedChatRoom.id] || []
    : [];

  return (
    <div
      className={`flex h-full overflow-hidden ${
        themeMode === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Chat Rooms List */}
      <div
        className={`w-1/3 border-r flex flex-col h-full ${
          themeMode === "dark"
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        }`}
      >
        <div
          className={`p-4 border-b ${
            themeMode === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle size={20} />
            Phòng Chat ({chatRooms.length})
          </h2>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          {chatRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Chưa có phòng chat nào
            </div>
          ) : (
            chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => dispatch(setSelectedChatRoom(room))}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  selectedChatRoom?.id === room.id
                    ? themeMode === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-blue-50 border-blue-200"
                    : themeMode === "dark"
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span className="font-medium truncate">{room.name}</span>
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
                {room.lastMessage && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {room.lastMessage.message}
                  </div>
                )}
                {room.lastMessage && (
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(room.lastMessage.timestamp)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedChatRoom ? (
          <>
            {/* Chat Header */}
            <div
              className={`p-4 border-b ${
                themeMode === "dark"
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={20} />
                <h3 className="text-lg font-semibold">
                  {selectedChatRoom.name}
                </h3>
              </div>
            </div>

            {/* Messages */}
            <div
              className={`flex-1 max-h-[calc(100vh-13rem)] overflow-y-scroll p-4 space-y-4 min-h-0 ${
                themeMode === "dark" ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              {currentHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Chưa có tin nhắn nào
                </div>
              ) : (
                currentHistory.map((msg, index) => {
                  const isAdmin = msg.sender === 0;
                  const showDate =
                    index === 0 ||
                    formatDate(msg.timestamp) !==
                      formatDate(currentHistory[index - 1].timestamp);

                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="text-center text-xs text-gray-500 my-4">
                          {formatDate(msg.timestamp)}
                        </div>
                      )}
                      <div
                        className={`flex ${
                          isAdmin ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isAdmin
                              ? themeMode === "dark"
                                ? "bg-blue-600 text-white"
                                : "bg-blue-500 text-white"
                              : themeMode === "dark"
                              ? "bg-gray-700 text-gray-100"
                              : "bg-white text-gray-900 border"
                          }`}
                        >
                          <div className="text-sm">{msg.message}</div>
                          <div
                            className={`text-xs mt-1 ${
                              isAdmin ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div
              className={`p-4 border-t ${
                themeMode === "dark"
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    themeMode === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={16} />
                  Gửi
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>Chọn một phòng chat để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatManagement;
