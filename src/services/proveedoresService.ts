import api from "./api";

export const ProveedorService = {
    listar: () => api.get("/proveedores"),
    crear: (data: any) => api.post("/proveedores", data),
};