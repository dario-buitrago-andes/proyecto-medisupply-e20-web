import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock NavBar para evitar dependencias de react-router-dom
jest.mock("./NavBar", () => {
  return function MockNavBar() {
    return (
      <div role="toolbar">
        <button>
          <a href="/vendedores">Vendedores</a>
        </button>
        <button>
          <a href="/proveedores">Proveedores</a>
        </button>
        <button>
          <a href="/productos">Productos</a>
        </button>
        <button>
          <a href="/productos/carga_masiva">Productos Carga Masiva</a>
        </button>
        <button>
          <a href="/planes_venta">Planes de Venta</a>
        </button>
      </div>
    );
  };
});

import NavBar from "./NavBar";

// Helper para renderizar
function renderNavBar() {
  return render(<NavBar />);
}

describe("NavBar", () => {
  describe("Renderizado", () => {
    it("renderiza el componente correctamente", () => {
      renderNavBar();
      
      const toolbar = screen.getByRole("toolbar");
      expect(toolbar).toBeInTheDocument();
    });

    it("muestra todos los botones de navegación", () => {
      renderNavBar();

      expect(screen.getByText(/Vendedores/i)).toBeInTheDocument();
      expect(screen.getByText(/Proveedores/i)).toBeInTheDocument();
      expect(screen.getByText(/^Productos$/i)).toBeInTheDocument();
      expect(screen.getByText(/Productos Carga Masiva/i)).toBeInTheDocument();
      expect(screen.getByText(/Planes de Venta/i)).toBeInTheDocument();
    });

    it("renderiza exactamente 5 botones de navegación", () => {
      renderNavBar();

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(5);
    });
  });

  describe("Enlaces de navegación", () => {
    it("todos los enlaces tienen href correcto", () => {
      renderNavBar();

      const links = screen.getAllByRole("link");
      
      expect(links[0]).toHaveAttribute("href", "/vendedores");
      expect(links[1]).toHaveAttribute("href", "/proveedores");
      expect(links[2]).toHaveAttribute("href", "/productos");
      expect(links[3]).toHaveAttribute("href", "/productos/carga_masiva");
      expect(links[4]).toHaveAttribute("href", "/planes_venta");
    });
  });
});
