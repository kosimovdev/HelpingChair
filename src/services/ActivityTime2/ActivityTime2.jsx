// services/ActivityTime/AccelerometerService.js
import axios from "../axios";

const getLatestAccelerometer = async (user_id, walker_id) => {
    try {
        const response = await axios.get("/api/accelerometer/latest", {
            params: {user_id, walker_id},
        });
        console.log("Moving id --->", response.data.is_moving);
        return response.data;
    } catch (err) {
        console.error("❌ GET accelerometer xato:", err.response || err);
        return null;
    }
};

export default {
    getLatestAccelerometer,
};
