import api from "../axios.js";

const activityService = {
    // Aktivlik boshlanganda backendga yuborish
    startActivity: (data) => api.post("/api/accelerometer/", data),

    // Aktivlik tugaganda backendga yuborish
    stopActivity: (data) => api.post("/api/accelerometer/", data),

    // Yoki umumiy saveActivity funksiyasi (종료 tugmasi uchun)
    saveActivity: (data) => api.post("/api/accelerometer/", data),
};

export default activityService;
