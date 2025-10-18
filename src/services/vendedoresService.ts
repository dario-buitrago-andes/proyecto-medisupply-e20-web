import api from "./api";

export const VendedorService = {
    crear: (data: any) => api.post("/vendedores", data),
};