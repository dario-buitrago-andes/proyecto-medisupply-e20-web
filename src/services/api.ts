import axios from "axios";

// Lee API_DOMAIN desde variables de entorno (Vite o CRA)
const viteBase: string | undefined =
  typeof import.meta !== "undefined" && (import.meta as any)?.env
    ? ((import.meta as any).env.API_DOMAIN as string | undefined)
    : undefined;

const craBase: string | undefined =
  typeof process !== "undefined" ? ((process as any)?.env?.API_DOMAIN as string | undefined) : undefined;

const baseURL = viteBase || craBase ||
  "https://87b3e5ff-1f15-4d98-a5b4-17e9d950b246.mock.pstmn.io"; // Fallback

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default api;