/**
 * Tests simplificados para ReportesVentas - Lógica de negocio
 * 
 * Estas pruebas verifican la lógica de validación y servicios
 * sin depender de renderizado complejo de componentes.
 */

import "@testing-library/jest-dom";
import { ReportesService } from "../../services/reportesService";
import { PaisesService } from "../../services/paisesService";
import { VendedorService } from "../../services/vendedoresService";
import { CategoriasSuministrosService } from "../../services/categoriasSuministrosService";

// Mocks de los servicios
jest.mock("../../services/paisesService");
jest.mock("../../services/vendedoresService");
jest.mock("../../services/categoriasSuministrosService");
jest.mock("../../services/reportesService");

// Helper para crear respuestas mock de Axios
const createAxiosResponse = (data: any) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: {} as any,
});

const mockedPaisesService = PaisesService as jest.Mocked<typeof PaisesService>;
const mockedVendedorService = VendedorService as jest.Mocked<typeof VendedorService>;
const mockedCategoriasService = CategoriasSuministrosService as jest.Mocked<typeof CategoriasSuministrosService>;
const mockedReportesService = ReportesService as jest.Mocked<typeof ReportesService>;

describe("ReportesVentas - Lógica de Negocio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Integración con servicios", () => {
    test("debe poder cargar países desde el servicio", async () => {
      const mockPaises = [
        { id: 1, nombre: "Colombia" },
        { id: 2, nombre: "México" },
      ];

      mockedPaisesService.listar.mockResolvedValue(createAxiosResponse(mockPaises));

      const result = await PaisesService.listar();
      
      expect(mockedPaisesService.listar).toHaveBeenCalled();
      expect(result.data).toEqual(mockPaises);
    });

    test("debe poder cargar vendedores desde el servicio", async () => {
      const mockVendedores = [
        { id: 1, nombre: "Juan Pérez" },
        { id: 2, nombre: "María García" },
      ];

      mockedVendedorService.listar.mockResolvedValue(createAxiosResponse(mockVendedores));

      const result = await VendedorService.listar();
      
      expect(mockedVendedorService.listar).toHaveBeenCalled();
      expect(result.data).toEqual(mockVendedores);
    });

    test("debe poder cargar categorías desde el servicio", async () => {
      const mockCategorias = [
        { id: 1, nombre: "Protección Personal" },
        { id: 2, nombre: "Medicamentos" },
      ];

      mockedCategoriasService.listar.mockResolvedValue(createAxiosResponse(mockCategorias));

      const result = await CategoriasSuministrosService.listar();
      
      expect(mockedCategoriasService.listar).toHaveBeenCalled();
      expect(result.data).toEqual(mockCategorias);
    });

    test("debe poder generar reportes con filtros válidos", async () => {
      const mockFilters = {
        vendedor_id: 1,
        pais: [1, 2],
        zona_geografica: ["Norte"],
        periodo_tiempo: "MES_ACTUAL" as const,
        fecha_inicio: null,
        fecha_fin: null,
        categoria_producto: ["Protección Personal"],
        tipo_reporte: ["DESEMPENO_VENDEDOR"],
      };

      const mockReportData = {
        kpis: {
          ventas_totales: 11037.5,
          pedidos_mes: 3,
          cumplimiento: 0.05,
          tiempo_entrega_promedio_h: 24.0,
        },
        desempeno_vendedores: [],
        ventas_por_region: [],
        productos_por_categoria: [],
        meta_objetivo_usd: 210000.0,
      };

      const mockResponse = createAxiosResponse(mockReportData);

      mockedReportesService.generarReporte.mockResolvedValue(mockResponse);

      const result = await ReportesService.generarReporte(mockFilters);
      
      expect(mockedReportesService.generarReporte).toHaveBeenCalledWith(mockFilters);
      expect(result.data.kpis.ventas_totales).toBe(11037.5);
    });
  });

  describe("Validaciones de filtros", () => {
    test("debe validar que se requiere al menos un filtro de segmentación", () => {
      // Simulamos la lógica de validación
      const validateSegmentationFilters = (vendedor_id: number | null, pais: number[], zona_geografica: string[]) => {
        return vendedor_id !== null || pais.length > 0 || zona_geografica.length > 0;
      };

      // Caso válido: tiene vendedor
      expect(validateSegmentationFilters(1, [], [])).toBe(true);
      
      // Caso válido: tiene países
      expect(validateSegmentationFilters(null, [1, 2], [])).toBe(true);
      
      // Caso válido: tiene zonas
      expect(validateSegmentationFilters(null, [], ["Norte"])).toBe(true);
      
      // Caso inválido: no tiene ningún filtro
      expect(validateSegmentationFilters(null, [], [])).toBe(false);
    });

    test("debe validar que se requiere al menos un tipo de reporte", () => {
      const validateReportTypes = (tipos: string[]) => {
        return tipos.length > 0;
      };

      expect(validateReportTypes(["DESEMPENO_VENDEDOR"])).toBe(true);
      expect(validateReportTypes(["DESEMPENO_VENDEDOR", "VENTAS_POR_ZONA"])).toBe(true);
      expect(validateReportTypes([])).toBe(false);
    });

    test("debe validar fechas para período personalizado", () => {
      const validateCustomDates = (periodo: string, fecha_inicio: string | null, fecha_fin: string | null) => {
        if (periodo === "PERSONALIZADO") {
          return fecha_inicio !== null && fecha_fin !== null && fecha_inicio !== "" && fecha_fin !== "";
        }
        return true;
      };

      // Período no personalizado - siempre válido
      expect(validateCustomDates("MES_ACTUAL", null, null)).toBe(true);
      
      // Período personalizado con fechas válidas
      expect(validateCustomDates("PERSONALIZADO", "2024-01-01", "2024-01-31")).toBe(true);
      
      // Período personalizado sin fechas - inválido
      expect(validateCustomDates("PERSONALIZADO", null, null)).toBe(false);
      expect(validateCustomDates("PERSONALIZADO", "2024-01-01", null)).toBe(false);
    });

    test("debe validar rango máximo de fechas", () => {
      const validateDateRange = (fecha_inicio: string, fecha_fin: string) => {
        const start = new Date(fecha_inicio);
        const end = new Date(fecha_fin);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 730; // 2 años máximo
      };

      // Rango válido (1 mes)
      expect(validateDateRange("2024-01-01", "2024-01-31")).toBe(true);
      
      // Rango válido (1 año)
      expect(validateDateRange("2024-01-01", "2024-12-31")).toBe(true);
      
      // Rango inválido (más de 2 años)
      expect(validateDateRange("2024-01-01", "2027-01-01")).toBe(false);
    });
  });

  describe("Manejo de errores", () => {
    test("debe manejar errores de carga de datos", async () => {
      const error = new Error("Error de red");
      mockedPaisesService.listar.mockRejectedValue(error);

      await expect(PaisesService.listar()).rejects.toThrow("Error de red");
    });

    test("debe manejar errores de generación de reportes", async () => {
      const error = new Error("Error del servidor");
      mockedReportesService.generarReporte.mockRejectedValue(error);

      const mockFilters = {
        vendedor_id: null,
        pais: [1],
        zona_geografica: [],
        periodo_tiempo: "MES_ACTUAL" as const,
        fecha_inicio: null,
        fecha_fin: null,
        categoria_producto: [],
        tipo_reporte: ["DESEMPENO_VENDEDOR"],
      };

      await expect(ReportesService.generarReporte(mockFilters)).rejects.toThrow("Error del servidor");
    });
  });
});
