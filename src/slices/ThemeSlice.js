import { createSlice } from "@reduxjs/toolkit";

// Initialize from localStorage if available, default to light
const initialMode = (() => {
  try {
    const saved = localStorage.getItem("theme");
    // If nothing saved, default to "light"
    if (!saved) {
      localStorage.setItem("theme", "light");
      return "light";
    }
    return saved === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
})();

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: initialMode },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", state.mode);
        // Also update document.documentElement immediately for instant feedback
        if (state.mode === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch {}
    },
    setTheme: (state, action) => {
      const mode = action.payload === "dark" ? "dark" : "light";
      state.mode = mode;
      try {
        localStorage.setItem("theme", state.mode);
        // Also update document.documentElement immediately
        if (mode === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch {}
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const selectThemeMode = (state) => state.theme?.mode || "light";
export default themeSlice.reducer;
