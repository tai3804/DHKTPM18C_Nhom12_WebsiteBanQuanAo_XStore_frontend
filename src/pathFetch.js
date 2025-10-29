if (import.meta.env.PROD) {
  const originalFetch = window.fetch;
  const BASE = "https://x-store-6in2.onrender.com";

  window.fetch = async (input, init) => {
    if (typeof input === "string" && input.startsWith("/api/")) {
      input = BASE + input.replace(/^\/api/, "");
    }
    return originalFetch(input, init);
  };
}
