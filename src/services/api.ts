import axios from "axios";

const api = axios.create({
    baseURL: "https://87b3e5ff-1f15-4d98-a5b4-17e9d950b246.mock.pstmn.io", // Cambia esta URL por la real
    headers: { "Content-Type": "application/json" },
});

export default api;