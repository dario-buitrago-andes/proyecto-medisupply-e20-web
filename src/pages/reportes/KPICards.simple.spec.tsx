/**
 * Tests simplificados para KPICards - Componente de tarjetas de KPIs
 * 
 * Estas pruebas verifican la funcionalidad básica del componente
 * sin depender de formatos específicos de moneda.
 */

import "@testing-library/jest-dom";
import { render, screen } from "../../test-utils/i18n-test-helper";
import KPICards from "./KPICards";
import { KPI } from "./types";

describe("KPICards - Pruebas Simplificadas", () => {
  const mockKPIs: KPI = {
    ventas_totales: 11037.5,
    pedidos_mes: 3,
    cumplimiento: 0.05,
    tiempo_entrega_promedio_h: 24.0,
  };

  test("debe renderizar todas las tarjetas de KPI", () => {
    render(<KPICards kpis={mockKPIs} />);

    expect(screen.getByText("Ventas Totales")).toBeInTheDocument();
    expect(screen.getByText("Pedidos del Mes")).toBeInTheDocument();
    expect(screen.getByText("Cumplimiento")).toBeInTheDocument();
    expect(screen.getByText("Tiempo Entrega Promedio")).toBeInTheDocument();
  });

  test("debe mostrar el número de pedidos correctamente", () => {
    render(<KPICards kpis={mockKPIs} />);

    expect(screen.getByText("3 pedidos")).toBeInTheDocument();
  });

  test("debe formatear correctamente el porcentaje de cumplimiento", () => {
    render(<KPICards kpis={mockKPIs} />);

    expect(screen.getByText("5.0%")).toBeInTheDocument();
  });

  test("debe mostrar el tiempo de entrega en horas", () => {
    render(<KPICards kpis={mockKPIs} />);

    expect(screen.getByText("24 horas")).toBeInTheDocument();
  });

  test("debe manejar valores cero", () => {
    const zeroKPIs: KPI = {
      ventas_totales: 0,
      pedidos_mes: 0,
      cumplimiento: 0,
      tiempo_entrega_promedio_h: 0,
    };

    render(<KPICards kpis={zeroKPIs} />);

    expect(screen.getByText("0 pedidos")).toBeInTheDocument();
    expect(screen.getByText("0.0%")).toBeInTheDocument();
    expect(screen.getByText("0 horas")).toBeInTheDocument();
  });

  test("debe renderizar 4 tarjetas", () => {
    const { container } = render(<KPICards kpis={mockKPIs} />);

    // Verificar que se renderizan 4 tarjetas
    const titles = ["Ventas Totales", "Pedidos del Mes", "Cumplimiento", "Tiempo Entrega Promedio"];
    titles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test("debe mostrar iconos para cada KPI", () => {
    const { container } = render(<KPICards kpis={mockKPIs} />);

    // Verificar que hay iconos SVG presentes
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(4);
  });
});
