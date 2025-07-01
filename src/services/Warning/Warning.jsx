import api from "../axios.js";

const getLatestObstacle = async (userId, walkerId) => {
    try {
        const response = await api.get(`/api/obstacle/latest?user_id=${userId}&walker_id=${walkerId}`);

        // Konsolga to‘liq javobni chiqarish (tekshirish uchun)
        console.log("API javobi:", response.data);

        // is_detected mavjudligini tekshiramiz
        if (response.data && typeof response.data.is_detected !== "undefined") {
            console.log("장애물 감지:", response.data.is_detected);
            return response.data;
        } else {
            console.warn("장애물 감지 데이터 없음:", response.data.message || "알 수 없는 응답입니다.");
            return {is_detected: null, message: response.data.message || "No data available"};
        }
    } catch (error) {
        console.error("API Error:", error);
        throw error; // xatoni tashlab yuboramiz (kerakli joyda ushlash uchun)
    }
};

export {getLatestObstacle};
