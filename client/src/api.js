const BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://studipal-1.onrender.com");

export const API = BASE_URL.replace(/\/$/, "");

