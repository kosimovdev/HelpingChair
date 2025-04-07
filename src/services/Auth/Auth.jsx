import api from "../axios.js"

const user = {
    login: (data) => api.get("/users/", data),
}

export default user
