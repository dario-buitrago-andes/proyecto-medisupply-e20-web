import api from "./api";

export interface CategoriaSuministro {
  id: number;
  nombre: string;
}

export const CategoriasSuministrosService = {
  listar: (): Promise<{ data: CategoriaSuministro[] }> => api.get("/categorias-suministros"),
};
