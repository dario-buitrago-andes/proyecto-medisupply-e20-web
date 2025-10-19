import api from "./api";

export const PlanVentaService = {
    crear: (data: any) => api.post("/planes-venta", data),
};
