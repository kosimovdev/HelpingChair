import axios from "axios";

const api = axios.create({
    baseURL: "https://1a20-14-42-86-124.ngrok-free.app",
    headers: { "Content-Type": "application/json" }
});

export default api;