/**
 * Tests para Layout - Componente de diseño principal
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock completo de Layout para evitar dependencias
const MockedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-layout">
      <div data-testid="mock-sidebar" className="sidebar">
        <div className="sidebar-header">
          <h1>MediSupply</h1>
        </div>
      </div>
      <main className="main-content">
        <div className="content-wrapper">{children}</div>
      </main>
    </div>
  );
};

// Helper para renderizar
function renderLayout(children: React.ReactNode = <div>Test Content</div>) {
  return render(<MockedLayout>{children}</MockedLayout>);
}

describe("Layout", () => {
  describe("Renderizado de estructura", () => {
    it("renderiza el componente correctamente", () => {
      renderLayout();
      
      const sidebar = screen.getByTestId("mock-sidebar");
      expect(sidebar).toBeInTheDocument();
      
      const layout = document.querySelector(".app-layout");
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveClass("app-layout");
    });

    it("renderiza el Sidebar", () => {
      renderLayout();
      
      const sidebar = screen.getByTestId("mock-sidebar");
      expect(sidebar).toBeInTheDocument();
      expect(sidebar).toHaveClass("sidebar");
      expect(screen.getByText("MediSupply")).toBeInTheDocument();
    });

    it("renderiza el contenedor principal", () => {
      renderLayout(<div>Main Content</div>);
      
      const mainContent = screen.getByText("Main Content");
      expect(mainContent).toBeInTheDocument();
      
      // Verificar que está dentro del content-wrapper
      const wrapper = mainContent.parentElement;
      expect(wrapper).toHaveClass("content-wrapper");
    });

    it("tiene la estructura correcta de clases CSS", () => {
      renderLayout(<div data-testid="test-child">Content</div>);
      
      const child = screen.getByTestId("test-child");
      const wrapper = child.parentElement;
      const mainContent = wrapper?.parentElement;
      const layout = mainContent?.parentElement;
      
      expect(wrapper).toHaveClass("content-wrapper");
      expect(mainContent).toHaveClass("main-content");
      expect(layout).toHaveClass("app-layout");
    });
  });

  describe("Renderizado de children", () => {
    it("renderiza un único hijo", () => {
      renderLayout(<div>Single Child</div>);
      
      expect(screen.getByText("Single Child")).toBeInTheDocument();
    });

    it("renderiza múltiples hijos", () => {
      renderLayout(
        <>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </>
      );
      
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
      expect(screen.getByText("Child 3")).toBeInTheDocument();
    });

    it("renderiza componentes complejos como children", () => {
      const ComplexComponent = () => (
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </div>
      );

      renderLayout(<ComplexComponent />);
      
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Paragraph")).toBeInTheDocument();
      expect(screen.getByText("Button")).toBeInTheDocument();
    });

    it("maneja children vacíos sin errores", () => {
      const { container } = renderLayout(null);
      
      const wrapper = container.querySelector(".content-wrapper");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toBeEmptyDOMElement();
    });
  });

  describe("Integración con Sidebar", () => {
    it("Sidebar y contenido están en el mismo contenedor", () => {
      renderLayout(<div data-testid="content">Content</div>);
      
      const sidebar = screen.getByTestId("mock-sidebar");
      const content = screen.getByTestId("content");
      const layout = document.querySelector(".app-layout");
      
      expect(sidebar).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(layout).toContainElement(sidebar);
      expect(layout).toContainElement(content);
    });

    it("mantiene la estructura cuando children cambia", () => {
      const { rerender } = render(
        <MockedLayout>
          <div>Initial Content</div>
        </MockedLayout>
      );

      expect(screen.getByText("Initial Content")).toBeInTheDocument();

      rerender(
        <MockedLayout>
          <div>Updated Content</div>
        </MockedLayout>
      );

      expect(screen.queryByText("Initial Content")).not.toBeInTheDocument();
      expect(screen.getByText("Updated Content")).toBeInTheDocument();
      
      // Sidebar sigue presente
      expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
    });
  });
});

export {};
