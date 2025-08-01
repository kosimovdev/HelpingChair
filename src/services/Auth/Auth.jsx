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
        getWarning: (user_id, walkerId) =>
       api
       .get(`/api/fall-alert/dashboard?user_id=${user_id}&walker_id=${walkerId}`)
       .then((res) => res.data) // bu yerda data = true yoki false
       .catch((err) => {
          console.error("API xatosi:", err);
          return false; // xatolik bo‘lsa false qaytaradi
    })


};

export default user;
