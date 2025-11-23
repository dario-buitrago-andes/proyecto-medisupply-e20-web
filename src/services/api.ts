import axios from "axios";

// Lee API_DOMAIN desde variables de entorno (Create React App usa process.env)
const baseURL = process.env.REACT_APP_API_DOMAIN ||
  "https://medisupply-edge-proxy-n5jhaxtfma-uc.a.run.app"; // Fallback
  //"http://localhost:8080"; // Fallback

const api = axios.create({
  baseURL: baseURL + "/api/v1",
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