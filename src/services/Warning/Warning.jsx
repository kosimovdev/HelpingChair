import api from "../axios.js";

const getLatestObstacle = async (userId, walkerId) => {
    try {
        const response = await api.get(`/obstacle/latest?user_id=${userId}&walker_id=${walkerId}`);
        return response.data; // javobni qaytarish
    } catch (error) {
        console.error("API Error:", error);
        throw error; // xatolikni tashlash
    }
};

export {getLatestObstacle};
