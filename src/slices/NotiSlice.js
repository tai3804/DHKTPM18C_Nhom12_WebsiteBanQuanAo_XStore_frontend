import { createSlice } from "@reduxjs/toolkit";

let nextId = 1;

const notiSlice = createSlice({
  name: "noti",
  initialState: {
    list: [],
  },
  reducers: {
    addNoti: {
      reducer(state, action) {
        state.list.push(action.payload);
      },
      prepare(message, type = "info", duration = 3000) {
        return {
          payload: {
            id: nextId++,
            message,
            type,
            duration,
          },
        };
      },
    },
    removeNoti(state, action) {
      state.list = state.list.filter(n => n.id !== action.payload);
    },
  },
});

export const { addNoti, removeNoti } = notiSlice.actions;
export default notiSlice.reducer;
