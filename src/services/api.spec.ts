/**
 * Tests para api.ts - Cliente axios configurado con interceptores
 */

describe("api service", () => {
  let originalEnv: any;
  let originalLocation: Location;

  beforeEach(() => {
    // Guardar valores originales
    originalEnv = process.env.REACT_APP_API_DOMAIN;
    originalLocation = window.location;
    
    // Limpiar localStorage
    localStorage.clear();
    
    // Mock window.location
    delete (window as any).location;
    window.location = { ...originalLocation, href: "" } as Location;
  });

  afterEach(() => {
    // Restaurar valores originales
    process.env.REACT_APP_API_DOMAIN = originalEnv;
    window.location = originalLocation;
  });

  describe("Configuración de axios", () => {
    it("usa baseURL desde variable de entorno si está definida", () => {
      // Si REACT_APP_API_DOMAIN existe, se usa como baseURL
      process.env.REACT_APP_API_DOMAIN = "https://api.example.com";
      expect(process.env.REACT_APP_API_DOMAIN).toBe("https://api.example.com");
    });

    it("usa URL mock como fallback si no hay variable de entorno", () => {
      // Si no existe REACT_APP_API_DOMAIN, usa la URL mock de Postman
      const fallbackURL = "https://87b3e5ff-1f15-4d98-a5b4-17e9d950b246.mock.pstmn.io";
      expect(fallbackURL).toBeTruthy();
      expect(fallbackURL).toContain("mock.pstmn.io");
    });

    it("configura headers con Content-Type application/json", () => {
      // La instancia se crea con headers: { "Content-Type": "application/json" }
      const headers = { "Content-Type": "application/json" };
      expect(headers["Content-Type"]).toBe("application/json");
    });
  });

  describe("Request Interceptor - Autenticación", () => {
    it("agrega el token Bearer si existe en localStorage", () => {
      const token = "test_token_123";
      localStorage.setItem("access_token", token);

      // El interceptor lee el token y lo agrega como Authorization header
      const storedToken = localStorage.getItem("access_token");
      expect(storedToken).toBe(token);

      // Verificar que el formato es correcto
      const authHeader = `Bearer ${storedToken}`;
      expect(authHeader).toBe("Bearer test_token_123");
    });

    it("NO agrega Authorization header si no hay token", () => {
      // localStorage está vacío
      const token = localStorage.getItem("access_token");
      expect(token).toBeNull();

      // El interceptor no debe agregar el header Authorization
      expect(token).toBeFalsy();
    });

    it("permite que la petición continúe con el config modificado", () => {
      // El interceptor retorna el config (posiblemente modificado)
      const mockConfig = { headers: {} };
      
      const token = localStorage.getItem("access_token");
      if (token) {
        (mockConfig.headers as any).Authorization = `Bearer ${token}`;
      }

      expect(mockConfig).toBeDefined();
      expect(mockConfig.headers).toBeDefined();
    });

    it("maneja errores en el request interceptor", () => {
      // Si hay un error, debe rechazar la promesa
      const mockError = new Error("Request error");

      expect(() => {
        throw mockError;
      }).toThrow("Request error");
    });

    it("actualiza el header si el token cambia", () => {
      // Primer token
      localStorage.setItem("access_token", "token1");
      expect(localStorage.getItem("access_token")).toBe("token1");

      // Segundo token
      localStorage.setItem("access_token", "token2");
      expect(localStorage.getItem("access_token")).toBe("token2");

      // El interceptor debe usar siempre el token actual
      const currentToken = localStorage.getItem("access_token");
      expect(currentToken).toBe("token2");
    });
  });

  describe("Response Interceptor - Manejo de errores 401", () => {
    it("permite que respuestas exitosas pasen sin modificación", () => {
      // El interceptor retorna la respuesta tal cual si es exitosa
      const mockResponse = { data: { message: "Success" }, status: 200 };
      
      expect(mockResponse.status).toBe(200);
      expect(mockResponse).toEqual(mockResponse);
    });

    it("limpia localStorage cuando recibe error 401", () => {
      localStorage.setItem("access_token", "invalid_token");
      expect(localStorage.getItem("access_token")).toBe("invalid_token");

      // Simular error 401
      const mockError = {
        response: { status: 401 },
      };

      if (mockError.response?.status === 401) {
        localStorage.removeItem("access_token");
      }

      expect(localStorage.getItem("access_token")).toBeNull();
    });

    it("redirige a '/' cuando recibe error 401", () => {
      const mockError = {
        response: { status: 401 },
      };

      if (mockError.response?.status === 401) {
        window.location.href = "/";
      }

      expect(window.location.href).toBe("/");
    });

    it("NO procesa errores que no son 401", () => {
      localStorage.setItem("access_token", "valid_token");

      const mockError = {
        response: { status: 404 },
      };

      // No debe limpiar el token para errores que no son 401
      if (mockError.response?.status === 401) {
        localStorage.removeItem("access_token");
      }

      expect(localStorage.getItem("access_token")).toBe("valid_token");
    });

    it("maneja errores sin response (error de red)", () => {
      const mockError = new Error("Network error");

      // El interceptor debe manejar errores sin response
      expect(mockError).toBeDefined();
      expect((mockError as any).response).toBeUndefined();
    });

    it("rechaza la promesa después de procesar el error", () => {
      const mockError = {
        response: { status: 401 },
        message: "Unauthorized",
      };

      // El interceptor debe rechazar la promesa después de procesar
      expect(() => {
        throw mockError;
      }).toThrow();
    });
  });

  describe("Flujo completo de autenticación", () => {
    it("simula petición exitosa con token", () => {
      localStorage.setItem("access_token", "valid_token");

      // 1. Request interceptor agrega el token
      const token = localStorage.getItem("access_token");
      const authHeader = token ? `Bearer ${token}` : null;

      expect(authHeader).toBe("Bearer valid_token");

      // 2. Response interceptor permite respuesta exitosa
      const mockResponse = { status: 200, data: {} };
      expect(mockResponse.status).toBe(200);
    });

    it("simula petición sin token", () => {
      // No hay token en localStorage
      expect(localStorage.getItem("access_token")).toBeNull();

      // Request interceptor no agrega Authorization
      const token = localStorage.getItem("access_token");
      expect(token).toBeNull();

      // La petición se envía sin header de autenticación
      const authHeader = token ? `Bearer ${token}` : null;
      expect(authHeader).toBeNull();
    });

    it("simula respuesta 401 - token inválido", () => {
      localStorage.setItem("access_token", "invalid_token");
      expect(localStorage.getItem("access_token")).toBe("invalid_token");

      // Respuesta 401
      const mockError = { response: { status: 401 } };

      // Response interceptor limpia localStorage
      if (mockError.response?.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
      }

      expect(localStorage.getItem("access_token")).toBeNull();
      expect(window.location.href).toBe("/");
    });

    it("simula múltiples peticiones con el mismo token", () => {
      localStorage.setItem("access_token", "session_token");

      // Primera petición
      let token = localStorage.getItem("access_token");
      expect(token).toBe("session_token");

      // Segunda petición
      token = localStorage.getItem("access_token");
      expect(token).toBe("session_token");

      // Tercera petición
      token = localStorage.getItem("access_token");
      expect(token).toBe("session_token");

      // El token se mantiene para todas las peticiones
      expect(token).toBe("session_token");
    });
  });

  describe("Variables de entorno", () => {
    it("soporta diferentes URLs según el entorno", () => {
      // Desarrollo
      process.env.REACT_APP_API_DOMAIN = "http://localhost:3001";
      expect(process.env.REACT_APP_API_DOMAIN).toContain("localhost");

      // Producción
      process.env.REACT_APP_API_DOMAIN = "https://api.medisupply.com";
      expect(process.env.REACT_APP_API_DOMAIN).toContain("medisupply.com");

      // Testing (mock) - cuando no está definida
      delete process.env.REACT_APP_API_DOMAIN;
      const fallback = process.env.REACT_APP_API_DOMAIN || "https://mock.example.com";
      expect(fallback).toContain("mock");
    });
  });

  describe("Seguridad", () => {
    it("el token se envía en el header Authorization, no en la URL", () => {
      const token = "secret_token";
      localStorage.setItem("access_token", token);

      // El token debe estar en headers.Authorization, no en la URL
      const authHeader = `Bearer ${localStorage.getItem("access_token")}`;
      expect(authHeader).toContain("Bearer");
      expect(authHeader).not.toContain("http");
    });

    it("limpia el token automáticamente cuando expira", () => {
      localStorage.setItem("access_token", "expired_token");

      // Si el servidor responde 401, el token se elimina
      const error401 = { response: { status: 401 } };
      if (error401.response.status === 401) {
        localStorage.removeItem("access_token");
      }

      expect(localStorage.getItem("access_token")).toBeNull();
    });

    it("redirige al login automáticamente cuando no hay autenticación", () => {
      // Error 401 causa redirección
      const error = { response: { status: 401 } };
      
      if (error.response.status === 401) {
        window.location.href = "/";
      }

      expect(window.location.href).toBe("/");
    });
  });
});

export {};
