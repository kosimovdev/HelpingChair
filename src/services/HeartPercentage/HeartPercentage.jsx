import api from "../axios.js";

const user = {
    getHeartrate: async (userId) => {
        const response = await api.get(`/heartrate/${userId}`);
        return response.data; // Faqat data ni qaytaramiz
    },
};

export default user;
