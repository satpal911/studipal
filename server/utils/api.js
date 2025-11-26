// src/api.js

// Dynamically set API base URL
export const API = import.meta.env.VITE_API_URL || 
  (window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://studipal-1.onrender.com");
