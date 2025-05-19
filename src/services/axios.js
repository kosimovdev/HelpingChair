import axios from "axios";

const api = axios.create({
  //   baseURL: import.meta.env.VITE_API_URL,
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;
