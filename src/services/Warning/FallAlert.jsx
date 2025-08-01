// import axios from "../axios";

// export const checkFallAlert = async (userId, walkerId) => {
//     try {
//         const res = await axios.get(`/api/fall-alert/dashboard?user_id=${userId}&walker_id=${walkerId}`);
//         console.log("Fall alert check response:", res.data);
        
//         return res.data; // { fall_detected: true, timestamp: "..." }
//     } catch (err) {
//         console.error("Fall alert check error:", err);
//         return null;
//     }
// };

// export const sendFallAlert = async (data) => {
//     try {
//         await axios.post("/api/fall-alert/dashboard-response", data);
//     } catch (err) {
//         console.error("Fall alert POST error:", err);
//     }
// };
