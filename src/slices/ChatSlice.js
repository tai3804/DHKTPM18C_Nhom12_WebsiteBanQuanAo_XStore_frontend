import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../config/api";
import { startLoading, stopLoading } from "./LoadingSlice";
import { setError, clearError } from "./ErrorSlice";

// Async thunks for Chat operations
export const getAllChatRooms = createAsyncThunk(
  "chat/getAllChatRooms",
  async (_, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState()?.auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/api/chat/admin/chat-rooms`, { headers });
      if (!res.ok) throw new Error("Không thể tải danh sách phòng chat");
      const json = await res.json();
      return json.result || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

export const getChatHistory = createAsyncThunk(
  "chat/getChatHistory",
  async (chatRoomId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState()?.auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/api/chat/history/${chatRoomId}`, { headers });
      if (!res.ok) throw new Error("Không thể tải lịch sử chat");
      const json = await res.json();
      return { chatRoomId, data: json.result || json };
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

export const sendAdminMessage = createAsyncThunk(
  "chat/sendAdminMessage",
  async ({ chatRoomId, message }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState()?.auth?.token;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${API_BASE_URL}/api/chat/admin/send/${chatRoomId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Không thể gửi tin nhắn");
      const json = await res.json();
      return json.result || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

export const markChatRoomAsRead = createAsyncThunk(
  "chat/markChatRoomAsRead",
  async (chatRoomId, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState()?.auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/api/chat/admin/mark-read/chat-room/${chatRoomId}`, {
        method: "PUT",
        headers,
      });
      if (!res.ok) throw new Error("Không thể đánh dấu đã đọc");
      return chatRoomId;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  "chat/getUnreadCount",
  async (_, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());
    dispatch(clearError());
    try {
      const token = getState()?.auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/api/chat/admin/unread-count`, { headers });
      if (!res.ok) throw new Error("Không thể tải số tin nhắn chưa đọc");
      const json = await res.json();
      return json.result || json;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  }
);

const initialState = {
  chatRooms: [],
  chatHistory: {}, // { chatRoomId: [messages] }
  selectedChatRoom: null,
  unreadCount: 0,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChatData: (state) => {
      state.chatRooms = [];
      state.chatHistory = {};
      state.selectedChatRoom = null;
      state.unreadCount = 0;
    },
    clearChatError: (state) => {
      state.error = null;
    },
    setSelectedChatRoom: (state, action) => {
      state.selectedChatRoom = action.payload;
    },
    addMessageToHistory: (state, action) => {
      const { chatRoomId, message } = action.payload;
      const key = String(chatRoomId);
      if (state.chatHistory[key]) {
        state.chatHistory[key].push(message);
      } else {
        state.chatHistory[key] = [message];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllChatRooms.fulfilled, (state, action) => {
        state.chatRooms = action.payload;
        state.error = null;
      })
      .addCase(getAllChatRooms.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        const { chatRoomId, data } = action.payload;
        const key = String(chatRoomId);
        state.chatHistory[key] = data;
        state.error = null;
      })
      .addCase(getChatHistory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(sendAdminMessage.fulfilled, (state, action) => {
        const newMessage = action.payload;
        const chatRoomId = action?.meta?.arg?.chatRoomId;
        const key = String(chatRoomId);
        if (state.chatHistory[key]) {
          state.chatHistory[key].push(newMessage);
        } else {
          state.chatHistory[key] = [newMessage];
        }
        // Update last message in chatRooms
        const roomIndex = state.chatRooms.findIndex(room => room.id === chatRoomId);
        if (roomIndex !== -1) {
          state.chatRooms[roomIndex].lastMessage = {
            message: newMessage.message,
            timestamp: newMessage.timestamp,
            sender: newMessage.sender,
            name: newMessage.name,
          };
        }
        state.error = null;
      })
      .addCase(sendAdminMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markChatRoomAsRead.fulfilled, (state, action) => {
        const chatRoomId = action.payload;
        const roomIndex = state.chatRooms.findIndex(room => room.id === chatRoomId);
        if (roomIndex !== -1) {
          state.chatRooms[roomIndex].unreadCount = 0;
        }
        state.error = null;
      })
      .addCase(markChatRoomAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
        state.error = null;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearChatData,
  clearChatError,
  setSelectedChatRoom,
  addMessageToHistory,
} = chatSlice.actions;

export default chatSlice.reducer;