import api from "../axios.js";

const user = {
    getHeartrate: (userId) => api.get(`/api/heartrate/${userId}`),
};

export default user;
