import api from "./api";

export const PlanVentaService = {
    listar: () => api.get("/planes-venta"),
    crear: (data: any) => api.post("/planes-venta", data),
};
