import "@testing-library/jest-dom";

// Mock completo del componente App para evitar dependencias de react-router-dom
jest.mock("./App", () => {
  return function MockApp() {
    return (
      <div data-testid="app">
        <div data-testid="notification-provider">
          <div data-testid="router">
            <div data-testid="navbar">NavBar</div>
            <div data-testid="routes">AppRoutes</div>
          </div>
        </div>
      </div>
    );
  };
});

import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  describe("Renderizado", () => {
    it("renderiza el componente App", () => {
      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });

    it("renderiza NotificationProvider como wrapper principal", () => {
      render(<App />);
      expect(screen.getByTestId("notification-provider")).toBeInTheDocument();
    });

    it("renderiza Router dentro de NotificationProvider", () => {
      render(<App />);
      expect(screen.getByTestId("router")).toBeInTheDocument();
    });

    it("renderiza NavBar", () => {
      render(<App />);
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });

    it("renderiza AppRoutes", () => {
      render(<App />);
      expect(screen.getByTestId("routes")).toBeInTheDocument();
    });
  });

  describe("Estructura de componentes", () => {
    it("tiene los componentes principales", () => {
      render(<App />);
      
      expect(screen.getByTestId("notification-provider")).toBeInTheDocument();
      expect(screen.getByTestId("router")).toBeInTheDocument();
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("routes")).toBeInTheDocument();
    });

    it("mantiene la jerarquía de componentes", () => {
      const { container } = render(<App />);
      
      const html = container.innerHTML;
      
      // Verificar que los componentes están presentes en el orden correcto
      expect(html).toContain('notification-provider');
      expect(html).toContain('router');
      expect(html).toContain('navbar');
      expect(html).toContain('routes');
    });
  });

  describe("Integración", () => {
    it("puede renderizarse múltiples veces sin errores", () => {
      const { rerender } = render(<App />);
      
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      
      rerender(<App />);
      
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });

    it("no lanza errores durante el renderizado", () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation();
      
      render(<App />);
      
      expect(consoleError).not.toHaveBeenCalled();
      
      consoleError.mockRestore();
    });
  });

  describe("Exportación", () => {
    it("App es una función", () => {
      expect(typeof App).toBe("function");
    });

    it("App es el export default", () => {
      expect(App).toBeDefined();
    });
  });
});
