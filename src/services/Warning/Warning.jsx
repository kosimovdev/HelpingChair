import api from "../axios.js";

const getLatestObstacle = async (userId, walkerId) => {
    try {
        const response = await api.get(`/api/obstacle/latest?user_id=${userId}&walker_id=${walkerId}`);
        console.log("장애물 감지", response.data.is_detected);
        // console.log("data", response.data);
        return response.data; // javobni qaytarish
    } catch (error) {
        console.error("API Error:", error);
        throw error; // xatolikni tashlash
    }
};

export {getLatestObstacle};
