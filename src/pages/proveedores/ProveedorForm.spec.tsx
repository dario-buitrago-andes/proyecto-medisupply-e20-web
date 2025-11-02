import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ============================================================================
// MOCKS - Deben ir ANTES de importar el componente
// ============================================================================
const mockPaisesListar = jest.fn();
const mockCertificacionesListar = jest.fn();
const mockCategoriasListar = jest.fn();
const mockProveedorCrear = jest.fn();

jest.mock("../../services/paisesService", () => ({
  PaisesService: {
    listar: (...args: any[]) => mockPaisesListar(...args),
  },
}));

jest.mock("../../services/certificacionesService", () => ({
  CertificacionesService: {
    listar: (...args: any[]) => mockCertificacionesListar(...args),
  },
}));

jest.mock("../../services/categoriasSuministrosService", () => ({
  CategoriasSuministrosService: {
    listar: (...args: any[]) => mockCategoriasListar(...args),
  },
}));

jest.mock("../../services/proveedoresService", () => ({
  ProveedorService: {
    crear: (...args: any[]) => mockProveedorCrear(...args),
  },
}));

// Ahora importar el componente y providers
import ProveedorForm from "./ProveedorForm";
import { NotificationProvider } from "../../components/NotificationProvider";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function renderWithProviders() {
  return render(
    <NotificationProvider>
      <ProveedorForm />
    </NotificationProvider>
  );
}

function setupDefaultMocks() {
  mockPaisesListar.mockResolvedValue({
    data: [
      { id: 1, nombre: "Colombia" },
      { id: 2, nombre: "México" },
      { id: 3, nombre: "Argentina" },
    ],
  });

  mockCertificacionesListar.mockResolvedValue({
    data: [
      { id: 10, codigo: "ISO-9001", nombre: "ISO 9001" },
      { id: 20, codigo: "FDA-APPROVED", nombre: "FDA Approved" },
      { id: 30, codigo: "CE-MARK", nombre: "CE Mark" },
    ],
  });

  mockCategoriasListar.mockResolvedValue({
    data: [
      { id: 100, nombre: "Medicamentos" },
      { id: 200, nombre: "Equipos Médicos" },
      { id: 300, nombre: "Insumos Quirúrgicos" },
    ],
  });

  mockProveedorCrear.mockResolvedValue({ data: { id: 1 } });
}

// ============================================================================
// TESTS
// ============================================================================
describe("ProveedorForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  describe("Renderizado del título", () => {
    it("muestra el título 'Registrar Proveedor'", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Verificar que el título está presente
      const titulo = screen.getByRole("heading", { name: /Registrar Proveedor/i, level: 1 });
      expect(titulo).toBeInTheDocument();
    });
  });

  describe("Estados de carga inicial", () => {
    it("muestra mensaje de carga mientras obtiene datos", () => {
      renderWithProviders();
      expect(screen.getByText(/Cargando datos.../i)).toBeInTheDocument();
    });

    it("carga y muestra países como checkboxes", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      expect(screen.getByLabelText("Colombia")).toBeInTheDocument();
      expect(screen.getByLabelText("México")).toBeInTheDocument();
      expect(screen.getByLabelText("Argentina")).toBeInTheDocument();
    });

    it("carga y muestra certificaciones como checkboxes", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      expect(screen.getByLabelText("ISO-9001")).toBeInTheDocument();
      expect(screen.getByLabelText("FDA-APPROVED")).toBeInTheDocument();
      expect(screen.getByLabelText("CE-MARK")).toBeInTheDocument();
    });

    it("carga y muestra categorías de suministros como checkboxes", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      expect(screen.getByLabelText("Medicamentos")).toBeInTheDocument();
      expect(screen.getByLabelText("Equipos Médicos")).toBeInTheDocument();
      expect(screen.getByLabelText("Insumos Quirúrgicos")).toBeInTheDocument();
    });

    it("muestra opciones de cadena de frío predefinidas", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      expect(screen.getByLabelText("2-8°C")).toBeInTheDocument();
      expect(screen.getByLabelText("-20°C")).toBeInTheDocument();
      expect(screen.getByLabelText("-80°C")).toBeInTheDocument();
      expect(screen.getByLabelText("Ambiente")).toBeInTheDocument();
    });

    it("muestra mensaje de error si falla la carga de países", async () => {
      mockPaisesListar.mockRejectedValue({
        response: { data: { mensaje: "Error al cargar países" } },
      });

      renderWithProviders();

      const errorMessages = await screen.findAllByText(/Error al cargar países/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });

    it("muestra mensaje de error si falla la carga de certificaciones", async () => {
      mockCertificacionesListar.mockRejectedValue({
        response: { data: { mensaje: "Error al cargar certificaciones" } },
      });

      renderWithProviders();

      const errorMessages = await screen.findAllByText(/Error al cargar certificaciones/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });

    it("muestra mensaje de error si falla la carga de categorías", async () => {
      mockCategoriasListar.mockRejectedValue({
        response: { data: { mensaje: "Error al cargar categorías" } },
      });

      renderWithProviders();

      const errorMessages = await screen.findAllByText(/Error al cargar categorías/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Validaciones con Yup", () => {
    it("valida que razón social es obligatoria", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Razón social obligatoria/i)).toBeInTheDocument();
    });

    it("valida que se debe seleccionar al menos un país", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Llenar razón social para que solo falle países
      const razonSocialInput = screen.getByLabelText(/Razón social/i);
      await userEvent.type(razonSocialInput, "Mi Empresa S.A.");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Seleccione al menos un país/i)).toBeInTheDocument();
    });

    it("valida que se debe seleccionar al menos una certificación", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Llenar campos mínimos excepto certificaciones
      const razonSocialInput = screen.getByLabelText(/Razón social/i);
      await userEvent.type(razonSocialInput, "Mi Empresa S.A.");

      // Seleccionar un país
      const colombiaCheckbox = screen.getByLabelText("Colombia");
      await userEvent.click(colombiaCheckbox);

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      expect(await screen.findByText(/Seleccione al menos una certificación/i)).toBeInTheDocument();
    });

    it("muestra todos los errores de validación simultáneamente", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar que aparecen múltiples errores
      await waitFor(() => {
        expect(screen.getByText(/Razón social obligatoria/i)).toBeInTheDocument();
        expect(screen.getByText(/Seleccione al menos un país/i)).toBeInTheDocument();
        expect(screen.getByText(/Seleccione al menos una certificación/i)).toBeInTheDocument();
      });
    });

    it("valida y limpia espacios en razón social (trim)", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Intentar enviar con solo espacios
      const razonSocialInput = screen.getByLabelText(/Razón social/i);
      await userEvent.type(razonSocialInput, "   ");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Debería mostrar error porque trim() deja string vacío
      expect(await screen.findByText(/Razón social obligatoria/i)).toBeInTheDocument();
    });
  });

  describe("Selección de países", () => {
    it("permite seleccionar múltiples países", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      const colombiaCheckbox = screen.getByLabelText("Colombia");
      const mexicoCheckbox = screen.getByLabelText("México");

      await userEvent.click(colombiaCheckbox);
      await userEvent.click(mexicoCheckbox);

      expect(colombiaCheckbox).toBeChecked();
      expect(mexicoCheckbox).toBeChecked();
      expect(screen.getByLabelText("Argentina")).not.toBeChecked();
    });

    it("permite deseleccionar países", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      const colombiaCheckbox = screen.getByLabelText("Colombia");

      // Seleccionar y deseleccionar
      await userEvent.click(colombiaCheckbox);
      expect(colombiaCheckbox).toBeChecked();

      await userEvent.click(colombiaCheckbox);
      expect(colombiaCheckbox).not.toBeChecked();
    });

    it("seleccionar un país elimina el error de validación", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Llenar razón social y provocar error de países
      const razonSocialInput = screen.getByLabelText(/Razón social/i);
      await userEvent.type(razonSocialInput, "Mi Empresa");

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar que aparece el error
      expect(await screen.findByText(/Seleccione al menos un país/i)).toBeInTheDocument();

      // Seleccionar un país
      const colombiaCheckbox = screen.getByLabelText("Colombia");
      await userEvent.click(colombiaCheckbox);

      // Intentar enviar de nuevo
      await userEvent.click(submitBtn);

      // El error de países debería desaparecer
      await waitFor(() => {
        expect(screen.queryByText(/Seleccione al menos un país/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Selección de certificaciones", () => {
    it("permite seleccionar múltiples certificaciones", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      const isoCheckbox = screen.getByLabelText("ISO-9001");
      const fdaCheckbox = screen.getByLabelText("FDA-APPROVED");

      await userEvent.click(isoCheckbox);
      await userEvent.click(fdaCheckbox);

      expect(isoCheckbox).toBeChecked();
      expect(fdaCheckbox).toBeChecked();
      expect(screen.getByLabelText("CE-MARK")).not.toBeChecked();
    });

    it("permite deseleccionar certificaciones", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      const isoCheckbox = screen.getByLabelText("ISO-9001");

      await userEvent.click(isoCheckbox);
      expect(isoCheckbox).toBeChecked();

      await userEvent.click(isoCheckbox);
      expect(isoCheckbox).not.toBeChecked();
    });
  });

  describe("Selección de categorías de suministros", () => {
    it("permite seleccionar múltiples categorías (opcional)", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      const medicamentosCheckbox = screen.getByLabelText("Medicamentos");
      const equiposCheckbox = screen.getByLabelText("Equipos Médicos");

      await userEvent.click(medicamentosCheckbox);
      await userEvent.click(equiposCheckbox);

      expect(medicamentosCheckbox).toBeChecked();
      expect(equiposCheckbox).toBeChecked();
      expect(screen.getByLabelText("Insumos Quirúrgicos")).not.toBeChecked();
    });

    it("no es obligatorio seleccionar categorías", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Llenar solo campos obligatorios (sin categorías)
      const razonSocialInput = screen.getByLabelText(/Razón social/i);
      await userEvent.type(razonSocialInput, "Proveedor Test");

      const colombiaCheckbox = screen.getByLabelText("Colombia");
      await userEvent.click(colombiaCheckbox);

      const isoCheckbox = screen.getByLabelText("ISO-9001");
      await userEvent.click(isoCheckbox);

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar que el servicio fue llamado (no hay errores de validación)
      await waitFor(() => {
        expect(mockProveedorCrear).toHaveBeenCalled();
      });

      // Verificar que no se seleccionaron categorías en el payload
      const payload = mockProveedorCrear.mock.calls[0][0];
      expect(payload.categorias_suministradas).toEqual([]);
    });
  });

  describe("Capacidad de cadena de frío", () => {
    it("permite seleccionar múltiples opciones de cadena de frío", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      const option1 = screen.getByLabelText("2-8°C");
      const option2 = screen.getByLabelText("-20°C");
      const option3 = screen.getByLabelText("Ambiente");

      await userEvent.click(option1);
      await userEvent.click(option2);
      await userEvent.click(option3);

      expect(option1).toBeChecked();
      expect(option2).toBeChecked();
      expect(option3).toBeChecked();
      expect(screen.getByLabelText("-80°C")).not.toBeChecked();
    });

    it("permite deseleccionar opciones de cadena de frío", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      const ambienteCheckbox = screen.getByLabelText("Ambiente");

      await userEvent.click(ambienteCheckbox);
      expect(ambienteCheckbox).toBeChecked();

      await userEvent.click(ambienteCheckbox);
      expect(ambienteCheckbox).not.toBeChecked();
    });

    it("no es obligatorio seleccionar capacidad de cadena de frío", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Llenar solo campos obligatorios
      const razonSocialInput = screen.getByLabelText(/Razón social/i);
      await userEvent.type(razonSocialInput, "Proveedor Sin Cadena Fría");

      const colombiaCheckbox = screen.getByLabelText("Colombia");
      await userEvent.click(colombiaCheckbox);

      const isoCheckbox = screen.getByLabelText("ISO-9001");
      await userEvent.click(isoCheckbox);

      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // No debería haber error de cadena de frío
      await waitFor(() => {
        expect(screen.queryByText(/cadena.*frío/i)).not.toBeInTheDocument();
      });

      expect(mockProveedorCrear).toHaveBeenCalled();
    });
  });

  describe("Flujo completo de creación", () => {
    it("permite completar y enviar el formulario con campos mínimos obligatorios", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Llenar razón social
      const razonSocialInput = screen.getByLabelText(/Razón social/i);
      await userEvent.type(razonSocialInput, "Distribuidora MediSupply S.A.");

      // Seleccionar países
      await userEvent.click(screen.getByLabelText("Colombia"));
      await userEvent.click(screen.getByLabelText("México"));

      // Seleccionar certificaciones
      await userEvent.click(screen.getByLabelText("ISO-9001"));
      await userEvent.click(screen.getByLabelText("FDA-APPROVED"));

      // Enviar formulario
      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar que no hay errores
      await waitFor(() => {
        expect(screen.queryByText(/obligatori/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Seleccione/i)).not.toBeInTheDocument();
      });

      // Verificar que se llamó al servicio
      expect(mockProveedorCrear).toHaveBeenCalledTimes(1);

      // Verificar estructura del payload
      const payload = mockProveedorCrear.mock.calls[0][0];
      expect(payload.razon_social).toBe("Distribuidora MediSupply S.A.");
      expect(payload.paises_operacion).toEqual([1, 2]);
      expect(payload.certificaciones_sanitarias).toEqual([10, 20]);
    });

    it("permite completar el formulario con todos los campos", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Razón social
      const razonSocialInput = screen.getByLabelText(/Razón social/i);
      await userEvent.type(razonSocialInput, "Proveedor Completo Ltda.");

      // Países
      await userEvent.click(screen.getByLabelText("Colombia"));
      await userEvent.click(screen.getByLabelText("Argentina"));

      // Certificaciones
      await userEvent.click(screen.getByLabelText("ISO-9001"));
      await userEvent.click(screen.getByLabelText("CE-MARK"));

      // Categorías
      await userEvent.click(screen.getByLabelText("Medicamentos"));
      await userEvent.click(screen.getByLabelText("Equipos Médicos"));

      // Cadena de frío
      await userEvent.click(screen.getByLabelText("2-8°C"));
      await userEvent.click(screen.getByLabelText("-20°C"));

      // Enviar
      const submitBtn = screen.getByRole("button", { name: /Guardar/i });
      await userEvent.click(submitBtn);

      // Verificar llamada
      await waitFor(() => {
        expect(mockProveedorCrear).toHaveBeenCalled();
      });

      // Verificar payload completo
      const payload = mockProveedorCrear.mock.calls[0][0];
      expect(payload.razon_social).toBe("Proveedor Completo Ltda.");
      expect(payload.paises_operacion).toEqual([1, 3]);
      expect(payload.certificaciones_sanitarias).toEqual([10, 30]);
      expect(payload.categorias_suministradas).toEqual([100, 200]);
      expect(payload.capacidad_cadena_frio).toEqual(["2-8°C", "-20°C"]);
    });

    it("muestra notificación de éxito al crear proveedor", async () => {
      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Llenar campos mínimos
      await userEvent.type(screen.getByLabelText(/Razón social/i), "Test SA");
      await userEvent.click(screen.getByLabelText("Colombia"));
      await userEvent.click(screen.getByLabelText("ISO-9001"));

      // Enviar
      await userEvent.click(screen.getByRole("button", { name: /Guardar/i }));

      // Verificar que aparece notificación de éxito
      expect(await screen.findByText(/Proveedor registrado/i)).toBeInTheDocument();
    });

    it("muestra notificación de error si falla la creación", async () => {
      mockProveedorCrear.mockRejectedValue({
        response: { data: { mensaje: "Error al crear proveedor" } },
      });

      renderWithProviders();

      await waitFor(() => expect(screen.queryByText(/Cargando datos/i)).not.toBeInTheDocument());

      // Llenar campos mínimos
      await userEvent.type(screen.getByLabelText(/Razón social/i), "Test SA");
      await userEvent.click(screen.getByLabelText("Colombia"));
      await userEvent.click(screen.getByLabelText("ISO-9001"));

      // Enviar
      await userEvent.click(screen.getByRole("button", { name: /Guardar/i }));

      // Verificar notificación de error
      const errorMessages = await screen.findAllByText(/Error al crear proveedor/i);
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });
  });
});
