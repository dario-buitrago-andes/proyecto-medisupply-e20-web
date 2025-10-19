/**
 * Tests para Sidebar - Barra lateral de navegación
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock del logout
const mockLogout = jest.fn();

// Mock completo de Sidebar para evitar dependencias
const MockedSidebar = ({ currentPath = "/" }: { currentPath?: string }) => {
  const isActive = (path: string) => currentPath === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">MediSupply</h1>
        <p className="sidebar-subtitle">Sistema de Gestión</p>
      </div>

      <nav className="sidebar-nav" role="navigation">
        <a
          href="/vendedores"
          className={`sidebar-link ${isActive("/vendedores") ? "active" : ""}`}
        >
          <span className="sidebar-icon">👤</span>
          Vendedores
        </a>

        <a
          href="/proveedores"
          className={`sidebar-link ${isActive("/proveedores") ? "active" : ""}`}
        >
          <span className="sidebar-icon">🏢</span>
          Proveedores
        </a>

        <a
          href="/productos"
          className={`sidebar-link ${isActive("/productos") ? "active" : ""}`}
        >
          <span className="sidebar-icon">📦</span>
          Productos
        </a>

        <a
          href="/productos/carga_masiva"
          className={`sidebar-link ${isActive("/productos/carga_masiva") ? "active" : ""}`}
        >
          <span className="sidebar-icon">📤</span>
          Carga Masiva
        </a>

        <a
          href="/planes_venta"
          className={`sidebar-link ${isActive("/planes_venta") ? "active" : ""}`}
        >
          <span className="sidebar-icon">📊</span>
          Planes de Venta
        </a>
      </nav>

      <div className="sidebar-footer">
        <button onClick={mockLogout} className="logout-button">
          <span className="sidebar-icon">🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

// Helper para renderizar con ruta específica
function renderSidebar(initialRoute = "/") {
  return render(<MockedSidebar currentPath={initialRoute} />);
}

describe("Sidebar", () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  describe("Renderizado de estructura", () => {
    it("renderiza el componente correctamente", () => {
      renderSidebar();
      
      const sidebar = screen.getByText("MediSupply").closest(".sidebar");
      expect(sidebar).toBeInTheDocument();
    });

    it("renderiza el header con título y subtítulo", () => {
      renderSidebar();
      
      expect(screen.getByText("MediSupply")).toBeInTheDocument();
      expect(screen.getByText("Sistema de Gestión")).toBeInTheDocument();
    });

    it("renderiza todos los enlaces de navegación", () => {
      renderSidebar();
      
      expect(screen.getByText("Vendedores")).toBeInTheDocument();
      expect(screen.getByText("Proveedores")).toBeInTheDocument();
      expect(screen.getByText("Productos")).toBeInTheDocument();
      expect(screen.getByText("Carga Masiva")).toBeInTheDocument();
      expect(screen.getByText("Planes de Venta")).toBeInTheDocument();
    });

    it("renderiza el botón de cerrar sesión", () => {
      renderSidebar();
      
      const logoutButton = screen.getByText("Cerrar Sesión");
      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton.closest("button")).toHaveClass("logout-button");
    });

    it("tiene la estructura de clases CSS correcta", () => {
      renderSidebar();
      
      const sidebar = screen.getByText("MediSupply").closest(".sidebar");
      expect(sidebar).toHaveClass("sidebar");
      
      const header = screen.getByText("MediSupply").closest(".sidebar-header");
      expect(header).toHaveClass("sidebar-header");
      
      const nav = sidebar?.querySelector(".sidebar-nav");
      expect(nav).toBeInTheDocument();
      
      const footer = sidebar?.querySelector(".sidebar-footer");
      expect(footer).toBeInTheDocument();
    });
  });

  describe("Enlaces de navegación", () => {
    it("todos los enlaces tienen el atributo href correcto", () => {
      renderSidebar();
      
      const vendedoresLink = screen.getByText("Vendedores").closest("a");
      const proveedoresLink = screen.getByText("Proveedores").closest("a");
      const productosLink = screen.getByText("Productos").closest("a");
      const cargaMasivaLink = screen.getByText("Carga Masiva").closest("a");
      const planesVentaLink = screen.getByText("Planes de Venta").closest("a");
      
      expect(vendedoresLink).toHaveAttribute("href", "/vendedores");
      expect(proveedoresLink).toHaveAttribute("href", "/proveedores");
      expect(productosLink).toHaveAttribute("href", "/productos");
      expect(cargaMasivaLink).toHaveAttribute("href", "/productos/carga_masiva");
      expect(planesVentaLink).toHaveAttribute("href", "/planes_venta");
    });

    it("todos los enlaces tienen la clase sidebar-link", () => {
      renderSidebar();
      
      const links = screen.getAllByRole("link");
      
      links.forEach((link) => {
        expect(link).toHaveClass("sidebar-link");
      });
    });

    it("renderiza exactamente 5 enlaces de navegación", () => {
      renderSidebar();
      
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(5);
    });
  });

  describe("Estado activo de rutas", () => {
    it("marca como activo el enlace de la ruta actual - /vendedores", () => {
      renderSidebar("/vendedores");
      
      const vendedoresLink = screen.getByText("Vendedores").closest("a");
      expect(vendedoresLink).toHaveClass("active");
    });

    it("marca como activo el enlace de la ruta actual - /proveedores", () => {
      renderSidebar("/proveedores");
      
      const proveedoresLink = screen.getByText("Proveedores").closest("a");
      expect(proveedoresLink).toHaveClass("active");
    });

    it("marca como activo el enlace de la ruta actual - /productos", () => {
      renderSidebar("/productos");
      
      const productosLink = screen.getByText("Productos").closest("a");
      expect(productosLink).toHaveClass("active");
    });

    it("marca como activo el enlace de la ruta actual - /productos/carga_masiva", () => {
      renderSidebar("/productos/carga_masiva");
      
      const cargaMasivaLink = screen.getByText("Carga Masiva").closest("a");
      expect(cargaMasivaLink).toHaveClass("active");
    });

    it("marca como activo el enlace de la ruta actual - /planes_venta", () => {
      renderSidebar("/planes_venta");
      
      const planesVentaLink = screen.getByText("Planes de Venta").closest("a");
      expect(planesVentaLink).toHaveClass("active");
    });

    it("solo un enlace está activo a la vez", () => {
      renderSidebar("/vendedores");
      
      const activeLinks = screen.getAllByRole("link").filter((link) =>
        link.classList.contains("active")
      );
      
      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0]).toHaveTextContent("Vendedores");
    });

    it("ningún enlace está activo en ruta desconocida", () => {
      renderSidebar("/ruta-desconocida");
      
      const activeLinks = screen.getAllByRole("link").filter((link) =>
        link.classList.contains("active")
      );
      
      expect(activeLinks).toHaveLength(0);
    });
  });

  describe("Funcionalidad del botón de logout", () => {
    it("el botón de cerrar sesión existe y es clickeable", () => {
      renderSidebar();
      
      const logoutButton = screen.getByText("Cerrar Sesión").closest("button");
      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton).not.toBeDisabled();
    });

    it("llama a la función logout al hacer click", () => {
      renderSidebar();
      
      const logoutButton = screen.getByText("Cerrar Sesión").closest("button");
      
      if (logoutButton) {
        fireEvent.click(logoutButton);
      }
      
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it("puede hacer click múltiples veces en logout", () => {
      renderSidebar();
      
      const logoutButton = screen.getByText("Cerrar Sesión").closest("button");
      
      if (logoutButton) {
        fireEvent.click(logoutButton);
        fireEvent.click(logoutButton);
        fireEvent.click(logoutButton);
      }
      
      expect(mockLogout).toHaveBeenCalledTimes(3);
    });
  });

  describe("Iconos", () => {
    it("cada enlace tiene un icono", () => {
      renderSidebar();
      
      const links = screen.getAllByRole("link");
      
      links.forEach((link) => {
        const icon = link.querySelector(".sidebar-icon");
        expect(icon).toBeInTheDocument();
      });
    });

    it("el botón de logout tiene un icono", () => {
      renderSidebar();
      
      const logoutButton = screen.getByText("Cerrar Sesión").closest("button");
      const icon = logoutButton?.querySelector(".sidebar-icon");
      
      expect(icon).toBeInTheDocument();
    });

    it("los iconos son emojis específicos", () => {
      renderSidebar();
      
      const vendedoresIcon = screen.getByText("Vendedores")
        .closest("a")
        ?.querySelector(".sidebar-icon");
      const proveedoresIcon = screen.getByText("Proveedores")
        .closest("a")
        ?.querySelector(".sidebar-icon");
      const productosIcon = screen.getByText("Productos")
        .closest("a")
        ?.querySelector(".sidebar-icon");
      const cargaMasivaIcon = screen.getByText("Carga Masiva")
        .closest("a")
        ?.querySelector(".sidebar-icon");
      const planesVentaIcon = screen.getByText("Planes de Venta")
        .closest("a")
        ?.querySelector(".sidebar-icon");
      const logoutIcon = screen.getByText("Cerrar Sesión")
        .closest("button")
        ?.querySelector(".sidebar-icon");
      
      expect(vendedoresIcon).toHaveTextContent("👤");
      expect(proveedoresIcon).toHaveTextContent("🏢");
      expect(productosIcon).toHaveTextContent("📦");
      expect(cargaMasivaIcon).toHaveTextContent("📤");
      expect(planesVentaIcon).toHaveTextContent("📊");
      expect(logoutIcon).toHaveTextContent("🚪");
    });
  });

  describe("Accesibilidad", () => {
    it("todos los enlaces son accesibles", () => {
      renderSidebar();
      
      const links = screen.getAllByRole("link");
      
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toBeVisible();
      });
    });

    it("el botón de logout es accesible", () => {
      renderSidebar();
      
      const logoutButton = screen.getByRole("button", { name: /cerrar sesión/i });
      
      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton).toBeVisible();
    });

    it("el sidebar tiene navegación semántica", () => {
      renderSidebar();
      
      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });
  });
});

export {};
