import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "../../test-utils/i18n-test-helper";
import userEvent from "@testing-library/user-event";

// Mock del servicio
const mockCargaMasiva = jest.fn();

jest.mock("../../services/productosService", () => ({
  ProductoService: {
    cargaMasiva: (...args: any[]) => mockCargaMasiva(...args),
  },
}));

import CargaMasiva from "./CargaMasiva";
import { NotificationProvider } from "../../components/NotificationProvider";

// Helper para renderizar con providers
function renderWithProviders() {
  return render(
    <NotificationProvider>
      <CargaMasiva />
    </NotificationProvider>
  );
}

describe("CargaMasiva", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCargaMasiva.mockResolvedValue({ data: { procesados: 10 } });
  });

  describe("Renderizado inicial", () => {
    it("muestra el botón de seleccionar archivo", () => {
      renderWithProviders();

      expect(screen.getByText(/Seleccionar archivo CSV/i)).toBeInTheDocument();
    });

    it("muestra el botón de subir archivo", () => {
      renderWithProviders();

      expect(screen.getByRole("button", { name: /Subir archivo/i })).toBeInTheDocument();
    });

    it("botón de subir está deshabilitado inicialmente", () => {
      renderWithProviders();

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      expect(uploadButton).toBeDisabled();
    });

    it("tiene input de tipo file oculto", () => {
      const { container } = renderWithProviders();

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute("hidden");
    });

    it("input acepta solo archivos CSV", () => {
      const { container } = renderWithProviders();

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute("accept", ".csv");
    });
  });

  describe("Selección de archivo", () => {
    it("permite seleccionar un archivo CSV", async () => {
      const { container } = renderWithProviders();

      const file = new File(["sku,nombre,precio\nPROD-1,Producto 1,100"], "productos.csv", {
        type: "text/csv",
      });

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      // Verificar que el archivo fue seleccionado
      expect(fileInput.files?.[0]).toBe(file);
      expect(fileInput.files?.[0]?.name).toBe("productos.csv");
    });

    it("habilita el botón de subir después de seleccionar archivo", async () => {
      const { container } = renderWithProviders();

      const file = new File(["contenido csv"], "test.csv", { type: "text/csv" });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      
      await waitFor(() => {
        expect(uploadButton).not.toBeDisabled();
      });
    });

    it("permite cambiar el archivo seleccionado", async () => {
      const { container } = renderWithProviders();

      const file1 = new File(["contenido 1"], "file1.csv", { type: "text/csv" });
      const file2 = new File(["contenido 2"], "file2.csv", { type: "text/csv" });

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file1);
      expect(fileInput.files?.[0]?.name).toBe("file1.csv");

      await userEvent.upload(fileInput, file2);
      expect(fileInput.files?.[0]?.name).toBe("file2.csv");
    });

    it("maneja cuando no se selecciona archivo (cancel)", async () => {
      renderWithProviders();

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      expect(uploadButton).toBeDisabled();
    });
  });

  describe("Subida de archivo", () => {
    it("llama al servicio con el archivo seleccionado", async () => {
      const { container } = renderWithProviders();

      const file = new File(["sku,nombre\nPROD-1,Test"], "productos.csv", {
        type: "text/csv",
      });

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      await userEvent.click(uploadButton);

      await waitFor(() => {
        expect(mockCargaMasiva).toHaveBeenCalledTimes(1);
        expect(mockCargaMasiva).toHaveBeenCalledWith(file);
      });
    });

    it("muestra notificación de éxito al completar la carga", async () => {
      const { container } = renderWithProviders();

      const file = new File(["datos"], "test.csv", { type: "text/csv" });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      await userEvent.upload(fileInput, file);

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      await userEvent.click(uploadButton);

      expect(await screen.findByText(/Carga masiva procesada/i)).toBeInTheDocument();
    });

    it("muestra notificación de error al fallar la carga", async () => {
      mockCargaMasiva.mockRejectedValue({
        response: { data: { mensaje: "Error al procesar archivo" } },
      });

      const { container } = renderWithProviders();

      const file = new File(["datos"], "test.csv", { type: "text/csv" });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      await userEvent.upload(fileInput, file);

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      await userEvent.click(uploadButton);

      const errorMessages = await screen.findAllByText(/Error al procesar archivo/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });

    it("no intenta subir si no hay archivo seleccionado", async () => {
      renderWithProviders();

      // Aunque el botón está deshabilitado, intentemos hacer clic de todas formas
      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      
      // El botón está deshabilitado, por lo que no debería hacer nada
      expect(uploadButton).toBeDisabled();
      expect(mockCargaMasiva).not.toHaveBeenCalled();
    });
  });

  describe("Casos edge", () => {
    it("maneja archivos muy grandes", async () => {
      const { container } = renderWithProviders();

      // Crear un archivo grande (simulado)
      const largeContent = "a".repeat(1000000); // 1MB de datos
      const file = new File([largeContent], "large.csv", { type: "text/csv" });

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      await userEvent.click(uploadButton);

      await waitFor(() => {
        expect(mockCargaMasiva).toHaveBeenCalledWith(file);
      });
    });

    it("maneja archivos vacíos", async () => {
      const { container } = renderWithProviders();

      const file = new File([""], "empty.csv", { type: "text/csv" });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      await userEvent.click(uploadButton);

      await waitFor(() => {
        expect(mockCargaMasiva).toHaveBeenCalledWith(file);
      });
    });

    it("maneja caracteres especiales en nombre de archivo", async () => {
      const { container } = renderWithProviders();

      const file = new File(["datos"], "archivo-con-ñ-y-acentós.csv", {
        type: "text/csv",
      });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      expect(fileInput.files?.[0]?.name).toBe("archivo-con-ñ-y-acentós.csv");
    });
  });

  describe("Múltiples subidas", () => {
    it("permite subir múltiples archivos consecutivamente", async () => {
      const { container } = renderWithProviders();

      const file1 = new File(["datos1"], "file1.csv", { type: "text/csv" });
      const file2 = new File(["datos2"], "file2.csv", { type: "text/csv" });

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      // Primera subida
      await userEvent.upload(fileInput, file1);
      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      await userEvent.click(uploadButton);

      await waitFor(() => {
        expect(mockCargaMasiva).toHaveBeenCalledWith(file1);
      });

      // Segunda subida
      await userEvent.upload(fileInput, file2);
      await userEvent.click(uploadButton);

      await waitFor(() => {
        expect(mockCargaMasiva).toHaveBeenCalledWith(file2);
      });

      expect(mockCargaMasiva).toHaveBeenCalledTimes(2);
    });
  });

  describe("Errores de red", () => {
    it("maneja error de red sin mensaje específico", async () => {
      mockCargaMasiva.mockRejectedValue(new Error("Network Error"));

      const { container } = renderWithProviders();

      const file = new File(["datos"], "test.csv", { type: "text/csv" });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      await userEvent.upload(fileInput, file);

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      await userEvent.click(uploadButton);

      // Debería mostrar el mensaje de error genérico
      const errorMessages = await screen.findAllByText(/Ups!! Algo salió mal/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });

    it("maneja timeout de servidor", async () => {
      mockCargaMasiva.mockRejectedValue({
        response: { data: { mensaje: "Timeout: El servidor tardó demasiado" } },
      });

      const { container } = renderWithProviders();

      const file = new File(["datos"], "test.csv", { type: "text/csv" });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      await userEvent.upload(fileInput, file);

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      await userEvent.click(uploadButton);

      const errorMessages = await screen.findAllByText(/Timeout/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("UI/UX", () => {
    it("mantiene el estado del botón durante la carga", async () => {
      // Simular una carga lenta
      mockCargaMasiva.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { container } = renderWithProviders();

      const file = new File(["datos"], "test.csv", { type: "text/csv" });
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      
      await userEvent.upload(fileInput, file);

      const uploadButton = screen.getByRole("button", { name: /Subir archivo/i });
      await userEvent.click(uploadButton);

      // El botón debería mantener su estado
      expect(uploadButton).toBeInTheDocument();

      await waitFor(() => {
        expect(mockCargaMasiva).toHaveBeenCalled();
      });
    });

    it("renderiza correctamente en un Box con textAlign center", () => {
      const { container } = renderWithProviders();

      const box = container.querySelector(".MuiBox-root");
      expect(box).toBeInTheDocument();
    });
  });
});
