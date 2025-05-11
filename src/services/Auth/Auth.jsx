import api from "../axios.js";

const user = {
    login: (data) => api.get("/users/", {params: data})
        .then(res => {
            console.log("apidan kelgan malumot" , res.data);
            return res;
        })
        .catch(err => {
            console.error("API xatosi:", err);
            throw err;
        }),
    getHeartrate: (user_id) => api.get(`/heartrate/${user_id}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            console.error("API xatosi:", err);
            throw err;
        }),


};

export default user;
