import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // 🔥 .env dan olib ishlaydi
//   baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
//   headers: {
//     "Content-Type": "application/json",
//     "ngrok-skip-browser-warning": "true",
//   },
// });

// export default api;
