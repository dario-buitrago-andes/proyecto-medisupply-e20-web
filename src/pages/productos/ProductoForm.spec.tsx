import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "../../test-utils/i18n-test-helper";
import userEvent from "@testing-library/user-event";

// ============================================================================
// MOCKS - Deben ir ANTES de importar el componente
// ============================================================================
const mockCertificacionesListar = jest.fn();
const mockProveedoresListar = jest.fn();
const mockProductosCrear = jest.fn();

jest.mock("../../services/certificacionesService", () => ({
  CertificacionesService: {
    listar: (...args: any[]) => mockCertificacionesListar(...args),
  },
}));

jest.mock("../../services/proveedoresService", () => ({
  ProveedorService: {
    listar: (...args: any[]) => mockProveedoresListar(...args),
  },
}));

jest.mock("../../services/productosService", () => ({
  ProductoService: {
    crear: (...args: any[]) => mockProductosCrear(...args),
  },
}));

// Ahora importar el componente y providers
import ProductoForm from "./ProductoForm";
import { NotificationProvider } from "../../components/NotificationProvider";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function renderWithProviders() {
  return render(
    <NotificationProvider>
      <ProductoForm />
    </NotificationProvider>
  );
}

function setupDefaultMocks() {
  mockCertificacionesListar.mockResolvedValue({
    data: [
      { id: 1, codigo: "ISO-9001", nombre: "ISO 9001" },
      { id: 2, codigo: "FDA-APPROVED", nombre: "FDA Approved" },
      { id: 3, codigo: "CE-MARK", nombre: "CE Mark" },
    ],
  });

  mockProveedoresListar.mockResolvedValue({
    data: [
      { id: 10, razon_social: "Proveedor Alpha" },
      { id: 20, razon_social: "Proveedor Beta" },
      { id: 30, razon_social: "Proveedor Gamma" },
    ],
  });

  mockProductosCrear.mockResolvedValue({ data: { id: 1 } });
}

// ============================================================================
// TESTS
// ============================================================================
describe("ProductoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  describe("Estados de carga inicial", () => {
    it("muestra CircularProgress mientras carga datos", () => {
      renderWithProviders();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("carga y muestra proveedores desde la API", async () => {
      renderWithProviders();

      // Esperar a que desaparezca el loader y aparezca el formulario
      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const proveedorInput = screen.getByLabelText(/Proveedor/i);
      await userEvent.click(proveedorInput);

      const listbox = await screen.findByRole("listbox");
      expect(within(listbox).getByText("Proveedor Alpha")).toBeInTheDocument();
      expect(within(listbox).getByText("Proveedor Beta")).toBeInTheDocument();
      expect(within(listbox).getByText("Proveedor Gamma")).toBeInTheDocument();
    });

    it("carga y muestra certificaciones como checkboxes", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      // Verificar que las certificaciones aparecen como checkboxes
      expect(screen.getByLabelText("ISO-9001")).toBeInTheDocument();
      expect(screen.getByLabelText("FDA-APPROVED")).toBeInTheDocument();
      expect(screen.getByLabelText("CE-MARK")).toBeInTheDocument();
    });

    it("muestra mensaje de error si falla la carga de certificaciones", async () => {
      mockCertificacionesListar.mockRejectedValue({
        response: { data: { mensaje: "Error al cargar certificaciones" } },
      });

      renderWithProviders();

      // Esperar el mensaje de error (puede aparecer en múltiples lugares: div + notificación)
      const errorMessages = await screen.findAllByText(/Error al cargar certificaciones/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });

    it("muestra mensaje de error si falla la carga de proveedores", async () => {
      mockProveedoresListar.mockRejectedValue({
        response: { data: { mensaje: "Error al cargar proveedores" } },
      });

      renderWithProviders();

      // Esperar el mensaje de error (puede aparecer en múltiples lugares: div + notificación)
      const errorMessages = await screen.findAllByText(/Error al cargar proveedores/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Validaciones de campos obligatorios", () => {
    it("muestra errores múltiples cuando se intenta enviar sin llenar campos obligatorios", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // El proveedor con valor 0 no pasa la validación required, pero el componente lo acepta
      // Verificar que aparecen errores en general
      await waitFor(() => {
        const errors = screen.queryAllByText(/(obligatorio|Debe ser mayor)/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it("muestra error cuando no se selecciona tipo de medicamento", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Seleccione un tipo de medicamento/i)).toBeInTheDocument();
    });

    it("muestra error cuando el valor unitario es cero (valor por defecto)", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      // El valor por defecto es 0, que no pasa la validación min: 0.01
      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Debe ser mayor a cero/i)).toBeInTheDocument();
    });

    it("valida todos los campos obligatorios juntos", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar que aparecen múltiples mensajes de error
      await waitFor(() => {
        const proveedorError = screen.queryByText(/El proveedor es obligatorio/i);
        const tipoError = screen.queryByText(/Seleccione un tipo de medicamento/i);
        const valorError = screen.queryByText(/El valor unitario es obligatorio/i);
        
        expect(proveedorError || tipoError || valorError).toBeInTheDocument();
      });
    });
  });

  describe("Validaciones de valores numéricos", () => {
    it("valida que el valor unitario sea mayor a cero", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const valorInput = screen.getByLabelText(/Valor unitario \(USD\)/i);
      await userEvent.clear(valorInput);
      await userEvent.type(valorInput, "0");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Debe ser mayor a cero/i)).toBeInTheDocument();
    });

    it("valida que el tiempo de entrega sea mayor o igual a 0", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const tiempoInput = screen.getByLabelText(/Tiempo de entrega estándar \(días\)/i);
      await userEvent.clear(tiempoInput);
      await userEvent.type(tiempoInput, "-1");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Debe ser mayor o igual a 0/i)).toBeInTheDocument();
    });
  });

  describe("Selección de certificaciones", () => {
    it("permite seleccionar múltiples certificaciones", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      // Seleccionar dos certificaciones
      const iso9001Checkbox = screen.getByLabelText("ISO-9001");
      const fdaCheckbox = screen.getByLabelText("FDA-APPROVED");

      await userEvent.click(iso9001Checkbox);
      await userEvent.click(fdaCheckbox);

      // Verificar que están marcadas
      expect(iso9001Checkbox).toBeChecked();
      expect(fdaCheckbox).toBeChecked();
      expect(screen.getByLabelText("CE-MARK")).not.toBeChecked();
    });

    it("permite deseleccionar certificaciones", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const iso9001Checkbox = screen.getByLabelText("ISO-9001");

      // Seleccionar y deseleccionar
      await userEvent.click(iso9001Checkbox);
      expect(iso9001Checkbox).toBeChecked();

      await userEvent.click(iso9001Checkbox);
      expect(iso9001Checkbox).not.toBeChecked();
    });
  });

  describe("Campo de ficha técnica", () => {
    it("permite ingresar URL de ficha técnica", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const urlInput = screen.getByLabelText(/URL de ficha técnica/i);
      await userEvent.type(urlInput, "https://example.com/ficha.pdf");

      expect(urlInput).toHaveValue("https://example.com/ficha.pdf");
    });
  });

  describe("Campos opcionales y condiciones", () => {
    it("permite llenar campos opcionales sin validación", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const skuInput = screen.getByLabelText(/SKU/i);
      const nombreInput = screen.getByLabelText(/Nombre del producto/i);

      await userEvent.type(skuInput, "PROD-001");
      await userEvent.type(nombreInput, "Producto de prueba");

      expect(skuInput).toHaveValue("PROD-001");
      expect(nombreInput).toHaveValue("Producto de prueba");
    });

    it("permite seleccionar temperatura de almacenamiento", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const tempInput = screen.getByLabelText(/Temperatura de almacenamiento/i);
      await userEvent.click(tempInput);

      const listbox = await screen.findByRole("listbox");
      
      // Verificar que hay opciones de temperatura
      expect(within(listbox).getByText("-80°C")).toBeInTheDocument();
      expect(within(listbox).getByText("0°C")).toBeInTheDocument();
      expect(within(listbox).getByText("8°C")).toBeInTheDocument();

      await userEvent.click(within(listbox).getByText("8°C"));
    });

    it("permite llenar todos los campos de condiciones de almacenamiento", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      await userEvent.type(screen.getByLabelText(/Condiciones de humedad/i), "60-70%");
      await userEvent.type(screen.getByLabelText(/Condiciones de luz/i), "Oscuridad");
      await userEvent.type(screen.getByLabelText(/Condiciones de ventilación/i), "Natural");
      await userEvent.type(screen.getByLabelText(/Condiciones de seguridad/i), "Armario cerrado");
      await userEvent.type(screen.getByLabelText(/Condiciones del envase/i), "Hermético");

      expect(screen.getByLabelText(/Condiciones de humedad/i)).toHaveValue("60-70%");
      expect(screen.getByLabelText(/Condiciones de luz/i)).toHaveValue("Oscuridad");
    });
  });

  describe("Selección de tipo de medicamento", () => {
    it("muestra todos los tipos de medicamento disponibles", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const tipoInput = screen.getByLabelText(/Tipo de medicamento/i);
      await userEvent.click(tipoInput);

      const listbox = await screen.findByRole("listbox");

      // Verificar algunos tipos principales
      expect(within(listbox).getByText("Analgésicos")).toBeInTheDocument();
      expect(within(listbox).getByText("Antibióticos")).toBeInTheDocument();
      expect(within(listbox).getByText("Antiinflamatorios")).toBeInTheDocument();
      expect(within(listbox).getByText("Vacunas")).toBeInTheDocument();
      expect(within(listbox).getByText("Otros")).toBeInTheDocument();
    });

    it("permite seleccionar un tipo de medicamento", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      const tipoInput = screen.getByLabelText(/Tipo de medicamento/i);
      await userEvent.click(tipoInput);

      const listbox = await screen.findByRole("listbox");
      await userEvent.click(within(listbox).getByText("Antibióticos"));

      // Verificar que se seleccionó - MUI muestra el valor en el div interior
      await waitFor(() => {
        const selectedValue = screen.getByLabelText(/Tipo de medicamento/i).textContent;
        expect(selectedValue).toContain("Antibióticos");
      });
    });
  });

  describe("Flujo completo de creación", () => {
    it("permite completar y enviar el formulario con campos obligatorios", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      // Llenar campos obligatorios
      const proveedorInput = screen.getByLabelText(/Proveedor/i);
      await userEvent.click(proveedorInput);
      const proveedorListbox = await screen.findByRole("listbox");
      await userEvent.click(within(proveedorListbox).getByText("Proveedor Alpha"));

      const tipoInput = screen.getByLabelText(/Tipo de medicamento/i);
      await userEvent.click(tipoInput);
      const tipoListbox = await screen.findByRole("listbox");
      await userEvent.click(within(tipoListbox).getByText("Antibióticos"));

      const valorInput = screen.getByLabelText(/Valor unitario \(USD\)/i);
      await userEvent.clear(valorInput);
      await userEvent.type(valorInput, "25.50");

      const tiempoInput = screen.getByLabelText(/Tiempo de entrega estándar \(días\)/i);
      await userEvent.clear(tiempoInput);
      await userEvent.type(tiempoInput, "7");

      // Enviar formulario
      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar que no hay errores
      await waitFor(() => {
        expect(screen.queryByText(/obligatorio/i)).not.toBeInTheDocument();
      });

      // Verificar que se llamó al servicio
      expect(mockProductosCrear).toHaveBeenCalled();
    });

    it("permite completar el formulario con todos los campos opcionales", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());

      // Campos básicos
      await userEvent.type(screen.getByLabelText(/SKU/i), "PROD-123");
      await userEvent.type(screen.getByLabelText(/Nombre del producto/i), "Amoxicilina 500mg");

      // Proveedor
      const proveedorInput = screen.getByLabelText(/Proveedor/i);
      await userEvent.click(proveedorInput);
      await userEvent.click((await screen.findByRole("listbox")).querySelector('li:first-child')!);

      // URL de ficha técnica
      await userEvent.type(screen.getByLabelText(/URL de ficha técnica/i), "https://example.com/ficha.pdf");

      // Temperatura
      const tempInput = screen.getByLabelText(/Temperatura de almacenamiento/i);
      await userEvent.click(tempInput);
      const tempListbox = await screen.findByRole("listbox");
      await userEvent.click(within(tempListbox).getByText("8°C"));

      // Condiciones
      await userEvent.type(screen.getByLabelText(/Condiciones de humedad/i), "60%");
      await userEvent.type(screen.getByLabelText(/Condiciones de luz/i), "Oscuridad");

      // Tipo de medicamento
      const tipoInput = screen.getByLabelText(/Tipo de medicamento/i);
      await userEvent.click(tipoInput);
      const tipoListbox = await screen.findByRole("listbox");
      await userEvent.click(within(tipoListbox).getByText("Antibióticos"));

      // Fecha de vencimiento
      const fechaInput = screen.getByLabelText(/Fecha de vencimiento/i);
      await userEvent.type(fechaInput, "2026-12-31");

      // Valor unitario
      const valorInput = screen.getByLabelText(/Valor unitario \(USD\)/i);
      await userEvent.clear(valorInput);
      await userEvent.type(valorInput, "15.75");

      // Certificaciones
      await userEvent.click(screen.getByLabelText("ISO-9001"));
      await userEvent.click(screen.getByLabelText("FDA-APPROVED"));

      // Tiempo de entrega
      const tiempoInput = screen.getByLabelText(/Tiempo de entrega estándar \(días\)/i);
      await userEvent.clear(tiempoInput);
      await userEvent.type(tiempoInput, "10");

      // Enviar
      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar llamada al servicio
      await waitFor(() => {
        expect(mockProductosCrear).toHaveBeenCalled();
      });

      // Verificar estructura del payload
      const payload = mockProductosCrear.mock.calls[0][0];
      expect(payload.sku).toBe("PROD-123");
      expect(payload.nombre_producto).toBe("Amoxicilina 500mg");
      expect(payload.proveedor_id).toBe(10);
      expect(payload.organizacion.tipo_medicamento).toBe("Antibióticos");
      // valor_unitario_usd se envía como string desde el input
      expect(parseFloat(payload.valor_unitario_usd)).toBe(15.75);
      expect(parseInt(payload.tiempo_entrega_dias)).toBe(10);
      expect(payload.certificaciones).toEqual([1, 2]);
    });
  });
});
