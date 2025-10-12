import api from "./api";

export const ProductoService = {
    crear: (data: any) => api.post("/productos", data),
    cargaMasiva: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post("/productos/carga-masiva", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};