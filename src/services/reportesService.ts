import api from "./api";
import { ReportFilters, ReportResponse } from "../pages/reportes/types";

export const ReportesService = {
  generarReporte: (filters: ReportFilters): Promise<{ data: ReportResponse }> => 
    api.post("/reportes/", filters),
};
