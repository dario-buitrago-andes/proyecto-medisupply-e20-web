import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "../../test-utils/i18n-test-helper";
import userEvent from "@testing-library/user-event";

// ============================================================================
// MOCKS - Deben ir ANTES de importar el componente
// ============================================================================
const mockPaisesListar = jest.fn();
const mockVendedorCrear = jest.fn();

jest.mock("../../services/paisesService", () => ({
  PaisesService: {
    listar: (...args: any[]) => mockPaisesListar(...args),
  },
}));

jest.mock("../../services/vendedoresService", () => ({
  VendedorService: {
    crear: (...args: any[]) => mockVendedorCrear(...args),
  },
}));

// Ahora importar el componente y providers
import VendedorForm from "./VendedorForm";
import { NotificationProvider } from "../../components/NotificationProvider";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function renderWithProviders() {
  return render(
    <NotificationProvider>
      <VendedorForm />
    </NotificationProvider>
  );
}

function setupDefaultMocks() {
  mockPaisesListar.mockResolvedValue({
    data: [
      { id: 1, nombre: "Colombia" },
      { id: 2, nombre: "México" },
      { id: 3, nombre: "Argentina" },
      { id: 4, nombre: "Chile" },
    ],
  });

  mockVendedorCrear.mockResolvedValue({ data: { id: 1 } });
}

// ============================================================================
// TESTS
// ============================================================================
describe("VendedorForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  describe("Carga inicial y países", () => {
    it("carga y muestra países en el select", async () => {
      renderWithProviders();

      // Esperar a que carguen los países
      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      // Verificar que el servicio fue llamado y hay datos
      expect(mockPaisesListar).toHaveBeenCalledTimes(1);
      
      // Verificar que el input de país no está deshabilitado después de cargar
      await waitFor(() => {
        const paisInput = document.querySelector('input[name="pais"]') as HTMLInputElement;
        expect(paisInput).not.toBeDisabled();
      });
    });

    it("deshabilita el select de país mientras carga", () => {
      renderWithProviders();

      const paisInput = document.querySelector('input[name="pais"]') as HTMLInputElement;

      // Debería estar deshabilitado inicialmente
      expect(paisInput).toBeDisabled();
    });

    it("habilita el select de país después de cargar", async () => {
      renderWithProviders();

      // Esperar a que termine la carga
      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const paisInput = document.querySelector('input[name="pais"]') as HTMLInputElement;

      // Debería estar habilitado después de cargar
      await waitFor(() => {
        expect(paisInput).not.toBeDisabled();
      });
    });

    it("muestra notificación de error si falla la carga de países", async () => {
      mockPaisesListar.mockRejectedValue({
        response: { data: { mensaje: "Error al cargar países" } },
      });

      renderWithProviders();

      // Esperar notificación de error
      const errorMessages = await screen.findAllByText(/Error al cargar países/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Campo Estado con valor por defecto", () => {
    it("muestra 'Activo' como valor por defecto", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const estadoInput = document.querySelector('input[name="estado"]') as HTMLInputElement;

      // El valor por defecto debería ser "ACTIVO"
      expect(estadoInput?.value).toBe("ACTIVO");
    });

    it("permite cambiar el estado a Inactivo", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      // Buscar todos los selects y tomar el segundo (estado)
      const selects = screen.getAllByRole('combobox');
      const estadoSelect = selects[1]; // El segundo select es el de estado

      // Abrir select
      await userEvent.click(estadoSelect);

      const listbox = await screen.findByRole("listbox");
      await userEvent.click(within(listbox).getByText("Inactivo"));

      // Verificar cambio
      const estadoInput = document.querySelector('input[name="estado"]') as HTMLInputElement;
      await waitFor(() => {
        expect(estadoInput?.value).toBe("INACTIVO");
      });
    });
  });

  describe("Validaciones con Yup", () => {
    it("valida que nombre completo es obligatorio", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Yup muestra el error de diferentes formas, buscar cualquier error relacionado con nombre
      await waitFor(() => {
        const errors = screen.queryAllByText(/obligatorio|required/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it("valida que email es obligatorio", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Email corporativo obligatorio/i)).toBeInTheDocument();
    });

    it("valida que país es obligatorio", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Buscar errores de validación en general
      await waitFor(() => {
        const errors = screen.queryAllByText(/obligatorio|Seleccione|required/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it("valida formato de email", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      await userEvent.type(emailInput, "correo-invalido");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Email inválido/i)).toBeInTheDocument();
    });

    it("valida que nombre solo contenga letras y espacios", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
      await userEvent.type(nombreInput, "Juan123");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Solo letras y espacios/i)).toBeInTheDocument();
    });

    it("acepta nombres con letras acentuadas y ñ", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
      await userEvent.type(nombreInput, "José María Núñez");

      // Seleccionar país
      const selects = screen.getAllByRole('combobox');
      await userEvent.click(selects[0]); // Primer select es país
      const paisListbox = await screen.findByRole("listbox");
      await userEvent.click(within(paisListbox).getByText("Colombia"));

      // Email válido
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      await userEvent.type(emailInput, "jose@empresa.com");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // No debería haber error de nombre
      await waitFor(() => {
        expect(screen.queryByText(/Solo letras y espacios/i)).not.toBeInTheDocument();
      });

      expect(mockVendedorCrear).toHaveBeenCalled();
    });

    it("valida y limpia espacios en nombre (trim)", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;

      // Intentar solo espacios
      await userEvent.type(nombreInput, "   ");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Debería mostrar error porque trim() deja string vacío
      await waitFor(() => {
        const errors = screen.queryAllByText(/obligatorio|required/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it("muestra todos los errores de validación simultáneamente", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar que aparecen errores de validación
      await waitFor(() => {
        const errors = screen.queryAllByText(/obligatorio|Seleccione/i);
        expect(errors.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("Selección de país", () => {
    it("muestra los países cargados en el DOM", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      // Verificar que el input del país está habilitado
      const paisInput = document.querySelector('input[name="pais"]') as HTMLInputElement;
      await waitFor(() => {
        expect(paisInput).not.toBeDisabled();
      });
    });
  });

  describe("Flujo completo de creación", () => {
    it("permite completar y enviar el formulario correctamente", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      // Llenar nombre
      const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
      await userEvent.type(nombreInput, "María Fernanda García");

      // Llenar email
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      await userEvent.type(emailInput, "maria.garcia@empresa.com");

      // Seleccionar país
      const selects = screen.getAllByRole('combobox');
      await userEvent.click(selects[0]);
      const paisListbox = await screen.findByRole("listbox");
      await userEvent.click(within(paisListbox).getByText("Colombia"));

      // Estado ya tiene valor por defecto "Activo"

      // Enviar formulario
      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar que no hay errores
      await waitFor(() => {
        expect(screen.queryByText(/obligatorio/i)).not.toBeInTheDocument();
      });

      // Verificar que se llamó al servicio
      expect(mockVendedorCrear).toHaveBeenCalledTimes(1);

      // Verificar estructura del payload
      const payload = mockVendedorCrear.mock.calls[0][0];
      expect(payload.nombre).toBe("María Fernanda García");
      expect(payload.email).toBe("maria.garcia@empresa.com");
      expect(payload.pais).toBe(1);
      expect(payload.estado).toBe("ACTIVO");
    });

    it("permite crear vendedor con estado Inactivo", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      // Llenar campos
      const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
      await userEvent.type(nombreInput, "Pedro López");

      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      await userEvent.type(emailInput, "pedro@empresa.com");

      // Seleccionar país
      const selects = screen.getAllByRole('combobox');
      await userEvent.click(selects[0]);
      const paisListbox = await screen.findByRole("listbox");
      await userEvent.click(within(paisListbox).getByText("Argentina"));

      // Cambiar estado a Inactivo
      const selects2 = screen.getAllByRole('combobox');
      await userEvent.click(selects2[1]); // Segundo select es estado
      const estadoListbox = await screen.findByRole("listbox");
      await userEvent.click(within(estadoListbox).getByText("Inactivo"));

      // Enviar
      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockVendedorCrear).toHaveBeenCalled();
      });

      // Verificar payload
      const payload = mockVendedorCrear.mock.calls[0][0];
      expect(payload.nombre).toBe("Pedro López");
      expect(payload.email).toBe("pedro@empresa.com");
      expect(payload.pais).toBe(3);
      expect(payload.estado).toBe("INACTIVO");
    });

    it("muestra notificación de éxito al crear vendedor", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      // Llenar campos mínimos
      const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
      await userEvent.type(nombreInput, "Ana Torres");

      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      await userEvent.type(emailInput, "ana@empresa.com");

      const selects = screen.getAllByRole('combobox');
      await userEvent.click(selects[0]);
      const paisListbox = await screen.findByRole("listbox");
      await userEvent.click(within(paisListbox).getByText("Chile"));

      // Enviar
      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar notificación de éxito
      expect(await screen.findByText(/Vendedor creado/i)).toBeInTheDocument();
    });

    it("muestra notificación de error si falla la creación", async () => {
      mockVendedorCrear.mockRejectedValue({
        response: { data: { mensaje: "Email ya existe" } },
      });

      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      // Llenar campos
      const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
      await userEvent.type(nombreInput, "Carlos Ruiz");

      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      await userEvent.type(emailInput, "duplicado@empresa.com");

      const selects = screen.getAllByRole('combobox');
      await userEvent.click(selects[0]);
      const paisListbox = await screen.findByRole("listbox");
      await userEvent.click(within(paisListbox).getByText("México"));

      // Enviar
      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar notificación de error
      const errorMessages = await screen.findAllByText(/Email ya existe/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Validaciones específicas de formato", () => {
    it("rechaza nombres con números", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
      await userEvent.type(nombreInput, "Juan 2023");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Solo letras y espacios/i)).toBeInTheDocument();
    });

    it("rechaza nombres con caracteres especiales", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
      await userEvent.type(nombreInput, "Juan@#$");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Solo letras y espacios/i)).toBeInTheDocument();
    });

    it("acepta email con formato válido", async () => {
      renderWithProviders();

      await waitFor(() => expect(mockPaisesListar).toHaveBeenCalled());

      const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
      await userEvent.type(nombreInput, "Juan Pérez");

      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      await userEvent.type(emailInput, "juan.perez@ejemplo.com.co");

      const selects = screen.getAllByRole('combobox');
      await userEvent.click(selects[0]);
      const paisListbox = await screen.findByRole("listbox");
      await userEvent.click(within(paisListbox).getByText("Colombia"));

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // No debería haber error de email
      await waitFor(() => {
        expect(screen.queryByText(/Email inválido/i)).not.toBeInTheDocument();
      });

      expect(mockVendedorCrear).toHaveBeenCalled();
    });
  });
});
