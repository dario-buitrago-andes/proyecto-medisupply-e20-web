import api from "./api";

export interface Certificacion {
    id: number;
    codigo: string;
    nombre: string;
}

export const CertificacionesService = {
    listar: (): Promise<{ data: Certificacion[] }> => api.get("/certificaciones"),
};
