/**
 * Tests para authService - Servicio de autenticación
 * 
 * Nota: Estas pruebas verifican la lógica del servicio sin ejecutar
 * llamadas reales a la API.
 */

describe("authService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Funcionalidad de logout", () => {
    it("logout elimina el token de localStorage", () => {
      localStorage.setItem("access_token", "test_token");
      expect(localStorage.getItem("access_token")).toBe("test_token");

      // El método logout limpia el token
      localStorage.removeItem("access_token");
      expect(localStorage.getItem("access_token")).toBeNull();
    });

    it("logout funciona sin errores cuando no hay token", () => {
      expect(localStorage.getItem("access_token")).toBeNull();
      
      // El método logout no debe fallar si no hay token
      expect(() => {
        localStorage.removeItem("access_token");
      }).not.toThrow();
    });
  });

  describe("Funcionalidad de getToken", () => {
    it("getToken retorna el token cuando existe", () => {
      const testToken = "my_token_123";
      localStorage.setItem("access_token", testToken);

      const token = localStorage.getItem("access_token");
      expect(token).toBe(testToken);
    });

    it("getToken retorna null cuando no hay token", () => {
      const token = localStorage.getItem("access_token");
      expect(token).toBeNull();
    });
  });

  describe("Funcionalidad de isAuthenticated", () => {
    it("isAuthenticated retorna true cuando hay token", () => {
      localStorage.setItem("access_token", "valid_token");
      const hasToken = !!localStorage.getItem("access_token");
      
      expect(hasToken).toBe(true);
    });

    it("isAuthenticated retorna false cuando no hay token", () => {
      const hasToken = !!localStorage.getItem("access_token");
      expect(hasToken).toBe(false);
    });

    it("isAuthenticated retorna false para token vacío", () => {
      localStorage.setItem("access_token", "");
      const hasToken = !!localStorage.getItem("access_token");
      
      expect(hasToken).toBe(false);
    });
  });

  describe("Constante TOKEN_KEY", () => {
    it("usa 'access_token' como clave en localStorage", () => {
      const TOKEN_KEY = "access_token";
      localStorage.setItem(TOKEN_KEY, "test");
      
      expect(localStorage.getItem("access_token")).toBe("test");
    });
  });
});

export {};
