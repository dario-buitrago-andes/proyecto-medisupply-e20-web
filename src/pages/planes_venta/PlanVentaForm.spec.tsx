import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ============================================================================
// MOCKS - Deben ir ANTES de importar el componente
// ============================================================================
const mockPaisesListar = jest.fn();
const mockVendedoresListar = jest.fn();
const mockProductosListar = jest.fn();
const mockPlanesVentaCrear = jest.fn();

jest.mock("../../services/paisesService", () => ({
  PaisesService: {
    listar: (...args: any[]) => mockPaisesListar(...args),
  },
}));

jest.mock("../../services/vendedoresService", () => ({
  VendedorService: {
    listar: (...args: any[]) => mockVendedoresListar(...args),
  },
}));

jest.mock("../../services/productosService", () => ({
  ProductoService: {
    listar: (...args: any[]) => mockProductosListar(...args),
  },
}));

jest.mock("../../services/planesVentaService", () => ({
  PlanVentaService: {
    crear: (...args: any[]) => mockPlanesVentaCrear(...args),
  },
}));

// Ahora importar el componente y providers
import PlanVentaForm from "./PlanVentaForm";
import { NotificationProvider } from "../../components/NotificationProvider";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function renderWithProviders() {
  return render(
    <NotificationProvider>
      <PlanVentaForm />
    </NotificationProvider>
  );
}

function setupDefaultMocks() {
  mockPaisesListar.mockResolvedValue({
    data: [
      { id: 1, nombre: "Colombia" },
      { id: 2, nombre: "México" },
    ],
  });

  mockVendedoresListar.mockResolvedValue({
    data: [
      { id: 10, nombre: "Vendedor Activo", estado: "ACTIVO" },
      { id: 11, nombre: "Vendedor Inactivo", estado: "INACTIVO" },
    ],
  });

  mockProductosListar.mockResolvedValue({
    data: [
      { id: 5, nombre_producto: "Guantes" },
      { id: 6, nombre_producto: "Mascarillas" },
    ],
  });

  mockPlanesVentaCrear.mockResolvedValue({ data: { id: 1 } });
}

// ============================================================================
// TESTS
// ============================================================================
describe("PlanVentaForm", () => {
  beforeEach(() => {
    // Resetear y configurar mocks antes de cada test
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  describe("Renderizado del título", () => {
    it("muestra el título 'Registrar Plan de Venta'", async () => {
      renderWithProviders();

      // Verificar que el título está presente
      const titulo = screen.getByRole("heading", { name: /Registrar Plan de Venta/i, level: 1 });
      expect(titulo).toBeInTheDocument();
    });
  });

  describe("Carga inicial y datos desde API", () => {
    it("carga y muestra vendedores activos (filtra inactivos)", async () => {
      renderWithProviders();

      // Esperar a que el select de vendedor esté disponible
      await waitFor(() => expect(screen.getByLabelText(/Vendedor/i)).toBeInTheDocument());

      // MUI TextField con select se renderiza como combobox
      const vendedorInput = screen.getByLabelText(/Vendedor/i);
      
      // Hacer clic para abrir el menú
      await userEvent.click(vendedorInput);

      // Esperar a que aparezca el listbox (portal de MUI)
      const listbox = await screen.findByRole("listbox");

      // Verificar que solo aparece el vendedor activo
      expect(within(listbox).getByText("Vendedor Activo")).toBeInTheDocument();
      expect(within(listbox).queryByText("Vendedor Inactivo")).not.toBeInTheDocument();
    });

    it("carga y muestra países desde la API", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.getByLabelText(/País/i)).toBeInTheDocument());

      const paisInput = screen.getByLabelText(/País/i);
      await userEvent.click(paisInput);

      const listbox = await screen.findByRole("listbox");
      expect(within(listbox).getByText("Colombia")).toBeInTheDocument();
      expect(within(listbox).getByText("México")).toBeInTheDocument();
    });

    it("carga y muestra productos desde la API", async () => {
      renderWithProviders();

      // Esperar a que cargue el formulario
      await waitFor(() => expect(screen.getByLabelText(/Vendedor/i)).toBeInTheDocument());

      // Buscar el FormControl que contiene "Productos objetivo" usando una query más específica
      const allLabels = screen.queryAllByText(/Productos objetivo/i);
      const productosLabel = allLabels.find(el => el.tagName === 'LABEL');
      expect(productosLabel).toBeInTheDocument();
      
      const productosContainer = productosLabel?.closest('.MuiFormControl-root');
      const productosSelect = productosContainer?.querySelector('[role="combobox"]') as HTMLElement;
      
      expect(productosSelect).toBeInTheDocument();
      await userEvent.click(productosSelect);

      const listbox = await screen.findByRole("listbox");
      expect(within(listbox).getByText("Guantes")).toBeInTheDocument();
      expect(within(listbox).getByText("Mascarillas")).toBeInTheDocument();
      
      // Cerrar el menú
      await userEvent.keyboard("{Escape}");
    });
  });

  describe("Validaciones de campos obligatorios", () => {
    it("muestra errores cuando se intenta enviar sin completar campos", async () => {
      renderWithProviders();

      // Esperar carga
      await waitFor(() => expect(screen.getByLabelText(/Vendedor/i)).toBeInTheDocument());

      // Intentar enviar sin completar
      const submitBtn = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(submitBtn);

      // Verificar errores de campos obligatorios
      expect(await screen.findByText(/El vendedor es obligatorio/i)).toBeInTheDocument();
      expect(await screen.findByText(/El periodo es obligatorio/i)).toBeInTheDocument();
      expect(await screen.findByText(/El país es obligatorio/i)).toBeInTheDocument();
      expect(await screen.findByText(/Debe seleccionar al menos un producto/i)).toBeInTheDocument();
    });

    it("valida que el año tenga 4 dígitos", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.getByLabelText(/Año/i)).toBeInTheDocument());

      const anioInput = screen.getByLabelText(/Año/i);
      await userEvent.clear(anioInput);
      await userEvent.type(anioInput, "20");

      const submitBtn = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Debe tener 4 dígitos/i)).toBeInTheDocument();
    });

    it("valida que el año esté en rango (1900-2100)", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.getByLabelText(/Año/i)).toBeInTheDocument());

      const anioInput = screen.getByLabelText(/Año/i);
      await userEvent.clear(anioInput);
      await userEvent.type(anioInput, "1800");

      const submitBtn = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Año fuera de rango/i)).toBeInTheDocument();
    });
  });

  describe("Flujo completo de creación", () => {
    it("permite completar y enviar el formulario correctamente", async () => {
      renderWithProviders();

      // Esperar carga de datos
      await waitFor(() => expect(screen.getByLabelText(/Vendedor/i)).toBeInTheDocument());

      // Seleccionar vendedor
      const vendedorInput = screen.getByLabelText(/Vendedor/i);
      await userEvent.click(vendedorInput);
      const vendedorListbox = await screen.findByRole("listbox");
      await userEvent.click(within(vendedorListbox).getByText("Vendedor Activo"));

      // Seleccionar periodo
      const periodoInput = screen.getByLabelText(/Periodo/i);
      await userEvent.click(periodoInput);
      const periodoListbox = await screen.findByRole("listbox");
      await userEvent.click(within(periodoListbox).getByText("Q1"));

      // Ingresar año válido
      const anioInput = screen.getByLabelText(/Año/i);
      await userEvent.clear(anioInput);
      await userEvent.type(anioInput, "2026");

      // Seleccionar país
      const paisInput = screen.getByLabelText(/País/i);
      await userEvent.click(paisInput);
      const paisListbox = await screen.findByRole("listbox");
      await userEvent.click(within(paisListbox).getByText("Colombia"));

      // Seleccionar productos (multi-select)
      const allProductosLabels = screen.queryAllByText(/Productos objetivo/i);
      const productosLabel = allProductosLabels.find(el => el.tagName === 'LABEL');
      const productosContainer = productosLabel?.closest('.MuiFormControl-root');
      const productosSelect = productosContainer?.querySelector('[role="combobox"]') as HTMLElement;
      
      await userEvent.click(productosSelect);
      const productosListbox = await screen.findByRole("listbox");
      
      // Hacer clic en las opciones del multi-select
      await userEvent.click(within(productosListbox).getByText("Guantes"));
      await userEvent.click(within(productosListbox).getByText("Mascarillas"));
      
      // Cerrar el menú
      await userEvent.keyboard("{Escape}");

      // Ingresar meta monetaria
      const metaInput = screen.getByLabelText(/Meta monetaria/i);
      await userEvent.clear(metaInput);
      await userEvent.type(metaInput, "12345.67");

      // Enviar formulario
      const submitBtn = screen.getByRole("button", { name: /guardar/i });
      await userEvent.click(submitBtn);

      // Verificar que no hay errores visibles
      await waitFor(() => {
        expect(screen.queryByText(/obligatorio/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/debe tener 4 dígitos/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/fuera de rango/i)).not.toBeInTheDocument();
      });
    });
  });
});
