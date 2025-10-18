import axios from "axios";

// Lee API_DOMAIN desde variables de entorno (Create React App usa process.env)
const baseURL = process.env.REACT_APP_API_DOMAIN ||
  "https://87b3e5ff-1f15-4d98-a5b4-17e9d950b246.mock.pstmn.io"; // Fallback

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default api;