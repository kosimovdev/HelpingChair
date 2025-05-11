import api from "../axios.js";

const activityService = {
    startActivity: (data) => api.post("/activity/start", data),
    stopActivity: (data) => api.post("/activity/stop", data),
};

export default activityService;