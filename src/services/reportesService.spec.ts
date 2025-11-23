/**
 * Tests para ReportesService - Servicio de reportes de ventas
 * 
 * Estas pruebas verifican la funcionalidad real del servicio de reportes
 * incluyendo llamadas a la API y manejo de datos.
 */

import "@testing-library/jest-dom";
import { ReportesService } from "./reportesService";
import { ReportFilters } from "../pages/reportes/types";

// Mock del módulo api
jest.mock("./api", () => ({
  post: jest.fn(),
}));

import api from "./api";
const mockedApi = api as jest.Mocked<typeof api>;

describe("ReportesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generarReporte", () => {
    const mockFilters: ReportFilters = {
      vendedor_id: 1,
      pais: [1, 2],
      zona_geografica: ["Norte"],
      periodo_tiempo: "MES_ACTUAL",
      fecha_inicio: null,
      fecha_fin: null,
      categoria_producto: ["Protección Personal"],
      tipo_reporte: ["DESEMPENO_VENDEDOR"],
    };

    const mockResponse = {
      data: {
        kpis: {
          ventas_totales: 11037.5,
          pedidos_mes: 3,
          cumplimiento: 0.05,
          tiempo_entrega_promedio_h: 24.0,
        },
        desempeno_vendedores: [
          {
            vendedor: "María Gómez",
            pais: "MEX",
            pedidos: 1,
            ventas_usd: 3150.0,
            estado: "LOW" as const,
          },
        ],
        ventas_por_region: [
          {
            zona: "MEX",
            ventas_usd: 3150.0,
          },
        ],
        productos_por_categoria: [
          {
            categoria: "Otros",
            unidades: 600,
            ingresos_usd: 11037.5,
            porcentaje: 100.0,
          },
        ],
        meta_objetivo_usd: 210000.0,
      },
    };

    test("debe llamar a la API con los filtros correctos", async () => {
      mockedApi.post.mockResolvedValue(mockResponse);

      await ReportesService.generarReporte(mockFilters);

      expect(mockedApi.post).toHaveBeenCalledWith("/reportes/", mockFilters);
      expect(mockedApi.post).toHaveBeenCalledTimes(1);
    });

    test("debe retornar los datos de la respuesta", async () => {
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await ReportesService.generarReporte(mockFilters);

      expect(result).toEqual(mockResponse);
      expect(result.data.kpis.ventas_totales).toBe(11037.5);
      expect(result.data.desempeno_vendedores).toHaveLength(1);
    });

    test("debe manejar errores de la API", async () => {
      const mockError = new Error("Error de red");
      mockedApi.post.mockRejectedValue(mockError);

      await expect(ReportesService.generarReporte(mockFilters)).rejects.toThrow("Error de red");
    });

    test("debe funcionar con filtros mínimos", async () => {
      const minimalFilters: ReportFilters = {
        vendedor_id: null,
        pais: [1],
        zona_geografica: [],
        periodo_tiempo: "MES_ACTUAL",
        fecha_inicio: null,
        fecha_fin: null,
        categoria_producto: [],
        tipo_reporte: ["DESEMPENO_VENDEDOR"],
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      await ReportesService.generarReporte(minimalFilters);

      expect(mockedApi.post).toHaveBeenCalledWith("/reportes/", minimalFilters);
    });

    test("debe funcionar con período personalizado", async () => {
      const customFilters: ReportFilters = {
        ...mockFilters,
        periodo_tiempo: "PERSONALIZADO",
        fecha_inicio: "2024-01-01",
        fecha_fin: "2024-01-31",
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      await ReportesService.generarReporte(customFilters);

      expect(mockedApi.post).toHaveBeenCalledWith("/reportes/", customFilters);
    });
  });
});
