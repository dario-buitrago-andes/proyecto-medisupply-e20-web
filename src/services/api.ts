import axios from "axios";

// Lee API_DOMAIN desde variables de entorno (Create React App usa process.env)
const baseURL = process.env.REACT_APP_API_DOMAIN ||
  "https://87b3e5ff-1f15-4d98-a5b4-17e9d950b246.mock.pstmn.io"; // Fallback

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado, limpiar localStorage
      localStorage.removeItem("access_token");
      // Recargar la página para mostrar el login
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;