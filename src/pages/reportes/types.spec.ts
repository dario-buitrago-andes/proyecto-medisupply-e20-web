/**
 * Tests para types - Validación de tipos TypeScript
 * 
 * Estas pruebas verifican que los tipos TypeScript se compilen correctamente
 * y mantengan la consistencia de datos en el sistema de reportes.
 */

import "@testing-library/jest-dom";
import { 
  ReportFilters, 
  KPI, 
  DesempenoVendedorRow, 
  VentasPorRegionItem, 
  ProductosCategoriaItem, 
  ReportResponse 
} from "./types";

describe("Reportes Types", () => {
  test("ReportFilters debe tener la estructura correcta", () => {
    const mockFilters: ReportFilters = {
      vendedor_id: 1,
      pais: [1, 2, 3],
      zona_geografica: ["Norte", "Sur"],
      periodo_tiempo: "MES_ACTUAL",
      fecha_inicio: "2024-01-01",
      fecha_fin: "2024-01-31",
      categoria_producto: ["Protección Personal"],
      tipo_reporte: ["DESEMPENO_VENDEDOR"],
    };

    expect(mockFilters.vendedor_id).toBe(1);
    expect(mockFilters.pais).toEqual([1, 2, 3]);
    expect(mockFilters.zona_geografica).toEqual(["Norte", "Sur"]);
    expect(mockFilters.periodo_tiempo).toBe("MES_ACTUAL");
    expect(mockFilters.categoria_producto).toEqual(["Protección Personal"]);
    expect(mockFilters.tipo_reporte).toEqual(["DESEMPENO_VENDEDOR"]);
  });

  test("KPI debe tener la estructura correcta", () => {
    const mockKPI: KPI = {
      ventas_totales: 11037.5,
      pedidos_mes: 3,
      cumplimiento: 0.05,
      tiempo_entrega_promedio_h: 24.0,
    };

    expect(typeof mockKPI.ventas_totales).toBe("number");
    expect(typeof mockKPI.pedidos_mes).toBe("number");
    expect(typeof mockKPI.cumplimiento).toBe("number");
    expect(typeof mockKPI.tiempo_entrega_promedio_h).toBe("number");
  });

  test("DesempenoVendedorRow debe tener la estructura correcta", () => {
    const mockVendedor: DesempenoVendedorRow = {
      vendedor: "María Gómez",
      pais: "MEX",
      pedidos: 15,
      ventas_usd: 3150.0,
      estado: "LOW",
    };

    expect(typeof mockVendedor.vendedor).toBe("string");
    expect(typeof mockVendedor.pais).toBe("string");
    expect(typeof mockVendedor.pedidos).toBe("number");
    expect(typeof mockVendedor.ventas_usd).toBe("number");
    expect(["OK", "WARN", "HIGH", "LOW"]).toContain(mockVendedor.estado);
  });

  test("VentasPorRegionItem debe tener la estructura correcta", () => {
    const mockRegion: VentasPorRegionItem = {
      zona: "MEX",
      ventas_usd: 3150.0,
    };

    expect(typeof mockRegion.zona).toBe("string");
    expect(typeof mockRegion.ventas_usd).toBe("number");
  });

  test("ProductosCategoriaItem debe tener la estructura correcta", () => {
    const mockCategoria: ProductosCategoriaItem = {
      categoria: "Protección Personal",
      unidades: 600,
      ingresos_usd: 11037.5,
      porcentaje: 100.0,
    };

    expect(typeof mockCategoria.categoria).toBe("string");
    expect(typeof mockCategoria.unidades).toBe("number");
    expect(typeof mockCategoria.ingresos_usd).toBe("number");
    expect(typeof mockCategoria.porcentaje).toBe("number");
  });

  test("ReportResponse debe tener la estructura correcta", () => {
    const mockResponse: ReportResponse = {
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

    expect(mockResponse.kpis).toBeDefined();
    expect(Array.isArray(mockResponse.desempeno_vendedores)).toBe(true);
    expect(Array.isArray(mockResponse.ventas_por_region)).toBe(true);
    expect(Array.isArray(mockResponse.productos_por_categoria)).toBe(true);
    expect(typeof mockResponse.meta_objetivo_usd).toBe("number");
  });

  test("debe permitir valores null en campos opcionales", () => {
    const filtersWithNulls: ReportFilters = {
      vendedor_id: null,
      pais: [],
      zona_geografica: [],
      periodo_tiempo: "MES_ACTUAL",
      fecha_inicio: null,
      fecha_fin: null,
      categoria_producto: [],
      tipo_reporte: ["DESEMPENO_VENDEDOR"],
    };

    expect(filtersWithNulls.vendedor_id).toBeNull();
    expect(filtersWithNulls.fecha_inicio).toBeNull();
    expect(filtersWithNulls.fecha_fin).toBeNull();
  });

  test("debe validar tipos de período válidos", () => {
    const periodos: ReportFilters["periodo_tiempo"][] = [
      "MES_ACTUAL",
      "TRIMESTRE_ACTUAL", 
      "ANIO_ACTUAL",
      "PERSONALIZADO"
    ];

    periodos.forEach(periodo => {
      const filters: ReportFilters = {
        vendedor_id: null,
        pais: [1],
        zona_geografica: [],
        periodo_tiempo: periodo,
        fecha_inicio: null,
        fecha_fin: null,
        categoria_producto: [],
        tipo_reporte: ["DESEMPENO_VENDEDOR"],
      };

      expect(filters.periodo_tiempo).toBe(periodo);
    });
  });
});
