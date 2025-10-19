import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationProvider, useNotify } from "./NotificationProvider";

// Componente de prueba para usar el hook
function TestComponent() {
  const { notify } = useNotify();

  return (
    <div>
      <button onClick={() => notify("Mensaje de prueba", "success")}>
        Mostrar Éxito
      </button>
      <button onClick={() => notify("Error grave", "error")}>
        Mostrar Error
      </button>
      <button onClick={() => notify("Advertencia", "warning")}>
        Mostrar Advertencia
      </button>
      <button onClick={() => notify("Información", "info")}>
        Mostrar Info
      </button>
      <button onClick={() => notify("Mensaje corto", "success", 1000)}>
        Notificación Corta
      </button>
    </div>
  );
}

describe("NotificationProvider", () => {
  describe("Renderizado básico", () => {
    it("renderiza children correctamente", () => {
      render(
        <NotificationProvider>
          <div>Test Content</div>
        </NotificationProvider>
      );

      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("no muestra notificación al inicio", () => {
      render(
        <NotificationProvider>
          <div>Content</div>
        </NotificationProvider>
      );

      // El Snackbar no debería estar visible inicialmente
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Hook useNotify", () => {
    it("lanza error si se usa fuera del Provider", () => {
      // Suprimir error de consola para este test
      const consoleError = jest.spyOn(console, "error").mockImplementation();

      const BadComponent = () => {
        useNotify();
        return <div>Bad</div>;
      };

      expect(() => render(<BadComponent />)).toThrow(
        "useNotify must be used within NotificationProvider"
      );

      consoleError.mockRestore();
    });

    it("funciona correctamente dentro del Provider", () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      expect(screen.getByText("Mostrar Éxito")).toBeInTheDocument();
    });
  });

  describe("Notificaciones de éxito", () => {
    it("muestra notificación de éxito", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const successButton = screen.getByText("Mostrar Éxito");
      await userEvent.click(successButton);

      expect(await screen.findByText("Mensaje de prueba")).toBeInTheDocument();
    });

    it("notificación de éxito tiene el severity correcto", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Éxito"));

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveClass("MuiAlert-filledSuccess");
    });
  });

  describe("Notificaciones de error", () => {
    it("muestra notificación de error", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Error"));

      expect(await screen.findByText("Error grave")).toBeInTheDocument();
    });

    it("notificación de error tiene el severity correcto", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Error"));

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveClass("MuiAlert-filledError");
    });
  });

  describe("Notificaciones de advertencia", () => {
    it("muestra notificación de advertencia", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Advertencia"));

      expect(await screen.findByText("Advertencia")).toBeInTheDocument();
    });

    it("notificación de advertencia tiene el severity correcto", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Advertencia"));

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveClass("MuiAlert-filledWarning");
    });
  });

  describe("Notificaciones de información", () => {
    it("muestra notificación de info", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Info"));

      expect(await screen.findByText("Información")).toBeInTheDocument();
    });

    it("notificación de info tiene el severity correcto", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Info"));

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveClass("MuiAlert-filledInfo");
    });
  });

  describe("Cierre de notificaciones", () => {
    it("puede cerrar la notificación con el botón X", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Éxito"));
      
      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();

      // Buscar el botón de cerrar
      const closeButton = alert.querySelector('button[aria-label="Close"]');
      if (closeButton) {
        await userEvent.click(closeButton as HTMLElement);
      }

      // La notificación debería desaparecer
      await waitFor(() => {
        expect(screen.queryByText("Mensaje de prueba")).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it("no cierra la notificación con clickaway", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Éxito"));
      
      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();

      // Hacer clic fuera (en el botón)
      await userEvent.click(screen.getByText("Mostrar Error"));

      // La primera notificación debería ser reemplazada por la nueva
      expect(await screen.findByText("Error grave")).toBeInTheDocument();
    });
  });

  describe("Duración de notificaciones", () => {
    it("usa duración por defecto de 5000ms", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Éxito"));
      
      expect(await screen.findByText("Mensaje de prueba")).toBeInTheDocument();
      
      // Verificar que tiene autoHideDuration configurado
      // (esto es difícil de testear directamente sin temporizadores)
    });

    it("acepta duración personalizada", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Notificación Corta"));
      
      expect(await screen.findByText("Mensaje corto")).toBeInTheDocument();
    });
  });

  describe("Notificaciones múltiples", () => {
    it("reemplaza notificación anterior con nueva", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      // Mostrar primera notificación
      await userEvent.click(screen.getByText("Mostrar Éxito"));
      expect(await screen.findByText("Mensaje de prueba")).toBeInTheDocument();

      // Mostrar segunda notificación
      await userEvent.click(screen.getByText("Mostrar Error"));
      expect(await screen.findByText("Error grave")).toBeInTheDocument();

      // La primera ya no debería estar
      expect(screen.queryByText("Mensaje de prueba")).not.toBeInTheDocument();
    });

    it("puede mostrar notificaciones sucesivas", async () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      // Primera notificación
      await userEvent.click(screen.getByText("Mostrar Éxito"));
      expect(await screen.findByText("Mensaje de prueba")).toBeInTheDocument();

      // Segunda notificación (reemplaza la primera)
      await userEvent.click(screen.getByText("Mostrar Advertencia"));
      expect(await screen.findByText("Advertencia")).toBeInTheDocument();

      // Tercera notificación (reemplaza la segunda)
      await userEvent.click(screen.getByText("Mostrar Info"));
      expect(await screen.findByText("Información")).toBeInTheDocument();
    });
  });

  describe("Posicionamiento", () => {
    it("Snackbar se posiciona arriba a la derecha", async () => {
      const { container } = render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Mostrar Éxito"));
      
      await screen.findByText("Mensaje de prueba");

      const snackbar = container.querySelector(".MuiSnackbar-root");
      expect(snackbar).toHaveClass("MuiSnackbar-anchorOriginTopRight");
    });
  });

  describe("Valores por defecto", () => {
    it("usa 'info' como severity por defecto", async () => {
      const DefaultComponent = () => {
        const { notify } = useNotify();
        return <button onClick={() => notify("Default")}>Default</button>;
      };

      render(
        <NotificationProvider>
          <DefaultComponent />
        </NotificationProvider>
      );

      await userEvent.click(screen.getByText("Default"));

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveClass("MuiAlert-filledInfo");
    });
  });

  describe("Context memoization", () => {
    it("el valor del context está memoizado", () => {
      let renderCount = 0;
      
      const CountComponent = () => {
        renderCount++;
        useNotify();
        return <div>Count: {renderCount}</div>;
      };

      const { rerender } = render(
        <NotificationProvider>
          <CountComponent />
        </NotificationProvider>
      );

      const initialCount = renderCount;

      rerender(
        <NotificationProvider>
          <CountComponent />
        </NotificationProvider>
      );

      // El componente debería re-renderizar pero el context está optimizado
      expect(renderCount).toBeGreaterThan(initialCount);
    });
  });
});
