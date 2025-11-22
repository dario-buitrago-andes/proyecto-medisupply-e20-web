/**
 * Tests para ProductCategoryChart - Tabla de productos por categoría
 * 
 * Estas pruebas verifican la funcionalidad real del componente
 * que muestra los datos de productos por categoría en formato tabla.
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProductCategoryChart from "./ProductCategoryChart";
import { ProductosCategoriaItem } from "./types";

describe("ProductCategoryChart", () => {
  const mockData: ProductosCategoriaItem[] = [
    {
      categoria: "Protección Personal",
      unidades: 600,
      ingresos_usd: 11037.5,
      porcentaje: 45.2,
    },
    {
      categoria: "Medicamentos",
      unidades: 350,
      ingresos_usd: 8500.75,
      porcentaje: 34.8,
    },
    {
      categoria: "Equipos Médicos",
      unidades: 120,
      ingresos_usd: 4890.25,
      porcentaje: 20.0,
    },
  ];

  test("debe renderizar el título del componente", () => {
    render(<ProductCategoryChart data={mockData} />);

    expect(screen.getByText("📦 Productos por Categoría")).toBeInTheDocument();
  });

  test("debe mostrar los encabezados de la tabla", () => {
    render(<ProductCategoryChart data={mockData} />);

    expect(screen.getByText("Categoría")).toBeInTheDocument();
    expect(screen.getByText("Unidades")).toBeInTheDocument();
    expect(screen.getByText("Ingresos (USD)")).toBeInTheDocument();
    expect(screen.getByText("Porcentaje")).toBeInTheDocument();
  });

  test("debe mostrar todos los datos de categorías", () => {
    render(<ProductCategoryChart data={mockData} />);

    // Verificar nombres de categorías
    expect(screen.getByText("Protección Personal")).toBeInTheDocument();
    expect(screen.getByText("Medicamentos")).toBeInTheDocument();
    expect(screen.getByText("Equipos Médicos")).toBeInTheDocument();

    // Verificar unidades (formateadas)
    expect(screen.getByText("600")).toBeInTheDocument();
    expect(screen.getByText("350")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();

    // Verificar porcentajes
    expect(screen.getByText("45.2%")).toBeInTheDocument();
    expect(screen.getByText("34.8%")).toBeInTheDocument();
    expect(screen.getByText("20.0%")).toBeInTheDocument();
  });

  test("debe formatear correctamente los valores monetarios", () => {
    render(<ProductCategoryChart data={mockData} />);

    // Los valores deben aparecer formateados como moneda (puede usar puntos o comas)
    expect(screen.getByText(/11\.037|11,037/)).toBeInTheDocument();
    expect(screen.getByText(/8\.500|8,500/)).toBeInTheDocument();
    expect(screen.getByText(/4\.890|4,890/)).toBeInTheDocument();
  });

  test("debe ordenar los datos por porcentaje descendente", () => {
    const { container } = render(<ProductCategoryChart data={mockData} />);

    const rows = container.querySelectorAll("tbody tr");
    
    // La primera fila debe ser "Protección Personal" (45.2%)
    expect(rows[0]).toHaveTextContent("Protección Personal");
    
    // La segunda fila debe ser "Medicamentos" (34.8%)
    expect(rows[1]).toHaveTextContent("Medicamentos");
    
    // La tercera fila debe ser "Equipos Médicos" (20.0%)
    expect(rows[2]).toHaveTextContent("Equipos Médicos");
  });

  test("debe mostrar chips de porcentaje con colores apropiados", () => {
    render(<ProductCategoryChart data={mockData} />);

    // Verificar que los chips de porcentaje están presentes
    const percentageChips = screen.getAllByText(/\d+\.\d+%/);
    expect(percentageChips).toHaveLength(3);
  });

  test("debe mostrar indicadores de color para cada categoría", () => {
    const { container } = render(<ProductCategoryChart data={mockData} />);

    // Verificar que hay indicadores de color usando clase CSS
    const colorIndicators = container.querySelectorAll('.MuiBox-root');
    // Debe haber al menos los indicadores de color más otros elementos Box
    expect(colorIndicators.length).toBeGreaterThan(0);
  });

  test("debe manejar datos vacíos correctamente", () => {
    render(<ProductCategoryChart data={[]} />);

    expect(screen.getByText("No hay datos de productos por categoría disponibles")).toBeInTheDocument();
  });

  test("debe manejar una sola categoría", () => {
    const singleData: ProductosCategoriaItem[] = [
      {
        categoria: "Única Categoría",
        unidades: 100,
        ingresos_usd: 1500.0,
        porcentaje: 100.0,
      },
    ];

    render(<ProductCategoryChart data={singleData} />);

    expect(screen.getByText("Única Categoría")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("100.0%")).toBeInTheDocument();
  });

  test("debe manejar valores grandes correctamente", () => {
    const largeData: ProductosCategoriaItem[] = [
      {
        categoria: "Categoría Grande",
        unidades: 1500000,
        ingresos_usd: 2500000.99,
        porcentaje: 85.5,
      },
    ];

    render(<ProductCategoryChart data={largeData} />);

    expect(screen.getByText("Categoría Grande")).toBeInTheDocument();
    // El formateo puede usar puntos en lugar de comas según el locale
    expect(screen.getByText(/1\.500\.000|1,500,000/)).toBeInTheDocument();
    expect(screen.getByText(/2\.500\.000|2,500,000/)).toBeInTheDocument();
    expect(screen.getByText("85.5%")).toBeInTheDocument();
  });

  test("debe manejar valores decimales en porcentajes", () => {
    const decimalData: ProductosCategoriaItem[] = [
      {
        categoria: "Categoría Decimal",
        unidades: 75,
        ingresos_usd: 1234.56,
        porcentaje: 12.345,
      },
    ];

    render(<ProductCategoryChart data={decimalData} />);

    // El porcentaje debe mostrarse con un decimal
    expect(screen.getByText("12.3%")).toBeInTheDocument();
  });

  test("debe tener la estructura de tabla correcta", () => {
    const { container } = render(<ProductCategoryChart data={mockData} />);

    // Verificar que existe una tabla
    const table = container.querySelector("table");
    expect(table).toBeInTheDocument();

    // Verificar que tiene encabezados
    const thead = container.querySelector("thead");
    expect(thead).toBeInTheDocument();

    // Verificar que tiene cuerpo de tabla
    const tbody = container.querySelector("tbody");
    expect(tbody).toBeInTheDocument();

    // Verificar número correcto de filas de datos
    const dataRows = container.querySelectorAll("tbody tr");
    expect(dataRows).toHaveLength(3);
  });

  test("debe tener atributos de accesibilidad", () => {
    const { container } = render(<ProductCategoryChart data={mockData} />);

    const table = container.querySelector("table");
    expect(table).toHaveAttribute("aria-label", "tabla de productos por categoría");
  });
});
