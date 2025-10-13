import axios from "axios";

const api = axios.create({
    baseURL: "https://api.miempresa.com", // Cambia esta URL por la real
    headers: { "Content-Type": "application/json" },
});

export default api;