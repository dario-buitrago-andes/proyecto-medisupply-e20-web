export interface ReportFilters {
  vendedor_id: number | null;
  pais: number[];
  zona_geografica: string[];
  periodo_tiempo: "MES_ACTUAL" | "TRIMESTRE_ACTUAL" | "ANIO_ACTUAL" | "PERSONALIZADO";
  fecha_inicio: string | null;
  fecha_fin: string | null;
  categoria_producto: string[];
  tipo_reporte: string[];
}

export interface KPI {
  ventas_totales: number;
  pedidos_mes: number;
  cumplimiento: number;
  tiempo_entrega_promedio_h: number;
}

export interface DesempenoVendedorRow {
  vendedor: string;
  pais: string;
  pedidos: number;
  ventas_usd: number;
  estado: "OK" | "WARN" | "HIGH" | "LOW";
}

export interface VentasPorRegionItem {
  zona: string;
  ventas_usd: number;
}

export interface ProductosCategoriaItem {
  categoria: string;
  unidades: number;
  ingresos_usd: number;
  porcentaje: number;
}

export interface ReportResponse {
  kpis: KPI;
  desempeno_vendedores: DesempenoVendedorRow[];
  ventas_por_region: VentasPorRegionItem[];
  productos_por_categoria: ProductosCategoriaItem[];
  meta_objetivo_usd: number;
}

export interface CountryOption {
  id: number;
  nombre: string;
}

export interface VendedorOption {
  id: number;
  nombre: string;
}
