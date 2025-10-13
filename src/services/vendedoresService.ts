import api from "./api";

export const VendedorService = {
    listar: () => api.get("/vendedores"),
    crear: (data: any) => api.post("/vendedores", data),
    eliminar: (id: number) => api.delete(`/vendedores/${id}`),
};