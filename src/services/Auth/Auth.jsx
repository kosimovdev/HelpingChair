import api from "../axios.js";

const user = {
    login: (data) =>
        api
        .get("/api/users/", {params: data})
        .then((res) => {
            console.log("apidan kelgan malumot", res.data);
            return res;
        })
        .catch((err) => {
            console.error("API xatosi:", err);
            throw err;
        }),
    getHeartrate: (user_id) =>
        api
        .get(`/api/heartrate/${user_id}`)
        .then((res) => res.data) // Faqat data massivini qaytaradi
        .catch((err) => {
            console.error("API xatosi:", err);
            throw err;
        }),
    
};

export default user;
