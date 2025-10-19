import api from "./api";

export interface Pais {
    id: number;
    nombre: string;
}

export const PaisesService = {
    listar: (): Promise<{ data: Pais[] }> => api.get("/paises"),
};
