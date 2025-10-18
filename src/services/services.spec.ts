// Mock del módulo api.ts para evitar problemas con import.meta
jest.mock("./api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import api from "./api";
import { PaisesService } from "./paisesService";
import { VendedorService } from "./vendedoresService";
import { ProductoService } from "./productosService";
import { PlanVentaService } from "./planesVentaService";
import { ProveedorService } from "./proveedoresService";
import { CertificacionesService } from "./certificacionesService";
import { CategoriasSuministrosService } from "./categoriasSuministrosService";

const mockGet = api.get as jest.Mock;
const mockPost = api.post as jest.Mock;

describe("Services Layer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("PaisesService", () => {
    it("listar() llama a GET /paises", async () => {
      const mockData = [
        { id: 1, nombre: "Colombia" },
        { id: 2, nombre: "México" },
      ];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await PaisesService.listar();

      expect(mockGet).toHaveBeenCalledWith("/paises");
      expect(result.data).toEqual(mockData);
    });

    it("listar() maneja errores correctamente", async () => {
      const errorMessage = "Network Error";
      mockGet.mockRejectedValue(new Error(errorMessage));

      await expect(PaisesService.listar()).rejects.toThrow(errorMessage);
      expect(mockGet).toHaveBeenCalledWith("/paises");
    });
  });

  describe("VendedorService", () => {
    it("listar() llama a GET /vendedores", async () => {
      const mockData = [
        { id: 1, nombre: "Juan Pérez", email: "juan@email.com" },
        { id: 2, nombre: "María López", email: "maria@email.com" },
      ];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await VendedorService.listar();

      expect(mockGet).toHaveBeenCalledWith("/vendedores");
      expect(result.data).toEqual(mockData);
    });

    it("crear() llama a POST /vendedores con los datos correctos", async () => {
      const vendedorData = {
        nombre_completo: "Carlos Ruiz",
        email: "carlos@empresa.com",
        pais_id: 1,
        estado: "Activo",
      };
      const mockResponse = { data: { id: 10, ...vendedorData } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await VendedorService.crear(vendedorData);

      expect(mockPost).toHaveBeenCalledWith("/vendedores", vendedorData);
      expect(result.data).toEqual(mockResponse.data);
    });

    it("crear() maneja errores de validación", async () => {
      const vendedorData = { nombre_completo: "", email: "invalid" };
      mockPost.mockRejectedValue({
        response: {
          status: 400,
          data: { mensaje: "Datos inválidos" },
        },
      });

      await expect(VendedorService.crear(vendedorData)).rejects.toMatchObject({
        response: { status: 400 },
      });
    });
  });

  describe("ProductoService", () => {
    it("listar() llama a GET /productos", async () => {
      const mockData = [
        { id: 1, nombre: "Producto A", precio: 100 },
        { id: 2, nombre: "Producto B", precio: 200 },
      ];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await ProductoService.listar();

      expect(mockGet).toHaveBeenCalledWith("/productos");
      expect(result.data).toEqual(mockData);
    });

    it("crear() llama a POST /productos con los datos correctos", async () => {
      const productoData = {
        nombre_producto: "Nuevo Producto",
        sku: "PROD-001",
        valor_unitario: 150,
      };
      const mockResponse = { data: { id: 5, ...productoData } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await ProductoService.crear(productoData);

      expect(mockPost).toHaveBeenCalledWith("/productos", productoData);
      expect(result.data).toEqual(mockResponse.data);
    });

    it("cargaMasiva() envía archivo con FormData", async () => {
      const file = new File(["contenido"], "productos.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const mockResponse = { data: { procesados: 50, errores: 0 } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await ProductoService.cargaMasiva(file);

      expect(mockPost).toHaveBeenCalledWith(
        "/productos/carga-masiva",
        expect.any(FormData),
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      expect(result.data).toEqual(mockResponse.data);

      // Verificar que el FormData contiene el archivo
      const formDataCall = mockPost.mock.calls[0][1] as FormData;
      expect(formDataCall.get("file")).toBe(file);
    });

    it("cargaMasiva() maneja errores de carga", async () => {
      const file = new File(["contenido"], "productos.xlsx");
      mockPost.mockRejectedValue({
        response: {
          status: 422,
          data: { mensaje: "Formato de archivo inválido" },
        },
      });

      await expect(ProductoService.cargaMasiva(file)).rejects.toMatchObject({
        response: { status: 422 },
      });
    });
  });

  describe("PlanVentaService", () => {
    it("crear() llama a POST /planes-venta con los datos correctos", async () => {
      const planData = {
        vendedor: 1,
        periodo: "Q1",
        anio: 2024,
        pais: 1,
        productos_objetivo: [1, 2, 3],
        meta_monetaria: 50000,
      };
      const mockResponse = { data: { id: 100, ...planData } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await PlanVentaService.crear(planData);

      expect(mockPost).toHaveBeenCalledWith("/planes-venta", planData);
      expect(result.data).toEqual(mockResponse.data);
    });

    it("crear() maneja conflictos de planes duplicados", async () => {
      const planData = { vendedor: 1, periodo: "Q1", anio: 2024 };
      mockPost.mockRejectedValue({
        response: {
          status: 409,
          data: { mensaje: "Ya existe un plan para este vendedor en Q1 2024" },
        },
      });

      await expect(PlanVentaService.crear(planData)).rejects.toMatchObject({
        response: { status: 409 },
      });
    });
  });

  describe("ProveedorService", () => {
    it("listar() llama a GET /proveedores", async () => {
      const mockData = [
        { id: 1, razon_social: "Proveedor A" },
        { id: 2, razon_social: "Proveedor B" },
      ];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await ProveedorService.listar();

      expect(mockGet).toHaveBeenCalledWith("/proveedores");
      expect(result.data).toEqual(mockData);
    });

    it("crear() llama a POST /proveedores con los datos correctos", async () => {
      const proveedorData = {
        razon_social: "Distribuidora XYZ",
        paises_operacion: [1, 2],
        certificaciones: [10, 20],
      };
      const mockResponse = { data: { id: 15, ...proveedorData } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await ProveedorService.crear(proveedorData);

      expect(mockPost).toHaveBeenCalledWith("/proveedores", proveedorData);
      expect(result.data).toEqual(mockResponse.data);
    });
  });

  describe("CertificacionesService", () => {
    it("listar() llama a GET /certificaciones", async () => {
      const mockData = [
        { id: 1, codigo: "ISO-9001", nombre: "ISO 9001" },
        { id: 2, codigo: "FDA", nombre: "FDA Approved" },
      ];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await CertificacionesService.listar();

      expect(mockGet).toHaveBeenCalledWith("/certificaciones");
      expect(result.data).toEqual(mockData);
    });

    it("listar() retorna array vacío cuando no hay certificaciones", async () => {
      mockGet.mockResolvedValue({ data: [] });

      const result = await CertificacionesService.listar();

      expect(result.data).toEqual([]);
    });
  });

  describe("CategoriasSuministrosService", () => {
    it("listar() llama a GET /categorias-suministros", async () => {
      const mockData = [
        { id: 1, nombre: "Medicamentos" },
        { id: 2, nombre: "Equipos Médicos" },
      ];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await CategoriasSuministrosService.listar();

      expect(mockGet).toHaveBeenCalledWith("/categorias-suministros");
      expect(result.data).toEqual(mockData);
    });
  });

  describe("Error Handling", () => {
    it("maneja errores de red (Network Error)", async () => {
      mockGet.mockRejectedValue(new Error("Network Error"));

      await expect(PaisesService.listar()).rejects.toThrow("Network Error");
    });

    it("maneja errores 404 (Not Found)", async () => {
      mockGet.mockRejectedValue({
        response: {
          status: 404,
          data: { mensaje: "Recurso no encontrado" },
        },
      });

      await expect(VendedorService.listar()).rejects.toMatchObject({
        response: { status: 404 },
      });
    });

    it("maneja errores 500 (Internal Server Error)", async () => {
      mockPost.mockRejectedValue({
        response: {
          status: 500,
          data: { mensaje: "Error interno del servidor" },
        },
      });

      await expect(ProductoService.crear({})).rejects.toMatchObject({
        response: { status: 500 },
      });
    });

    it("maneja errores 401 (Unauthorized)", async () => {
      mockGet.mockRejectedValue({
        response: {
          status: 401,
          data: { mensaje: "No autorizado" },
        },
      });

      await expect(CertificacionesService.listar()).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });

  describe("Data Integrity", () => {
    it("preserva los tipos de datos en las respuestas", async () => {
      const mockData: Array<{ id: number; nombre: string }> = [
        { id: 1, nombre: "Colombia" },
        { id: 2, nombre: "México" },
      ];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await PaisesService.listar();

      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(typeof result.data[0].id).toBe("number");
      expect(typeof result.data[0].nombre).toBe("string");
      expect(result.data[0]).toEqual({ id: 1, nombre: "Colombia" });
    });

    it("no modifica los datos enviados en POST", async () => {
      const originalData = {
        nombre: "Test",
        valores: [1, 2, 3],
        config: { activo: true },
      };
      const dataCopy = JSON.parse(JSON.stringify(originalData));
      
      mockPost.mockResolvedValue({ data: { id: 1 } });

      await ProductoService.crear(originalData);

      // Verificar que los datos originales no se modificaron
      expect(originalData).toEqual(dataCopy);
      expect(mockPost).toHaveBeenCalledWith("/productos", originalData);
    });
  });
});
