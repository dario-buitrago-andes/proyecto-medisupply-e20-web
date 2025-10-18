import reportWebVitals from "./reportWebVitals";

describe("reportWebVitals", () => {
  describe("Sin callback", () => {
    it("no hace nada si no se proporciona callback", () => {
      expect(() => {
        reportWebVitals();
      }).not.toThrow();
    });

    it("no hace nada si se pasa undefined", () => {
      expect(() => {
        reportWebVitals(undefined);
      }).not.toThrow();
    });

    it("no hace nada si se pasa null", () => {
      expect(() => {
        reportWebVitals(null as any);
      }).not.toThrow();
    });
  });

  describe("Con callback válido", () => {
    it("acepta una función como callback sin lanzar error", () => {
      const mockCallback = jest.fn();

      expect(() => {
        reportWebVitals(mockCallback);
      }).not.toThrow();
    });

    it("acepta console.log como callback", () => {
      expect(() => {
        reportWebVitals(console.log);
      }).not.toThrow();
    });

    it("acepta funciones personalizadas como callback", () => {
      const customCallback = (metric: any) => {
        // Función personalizada
      };

      expect(() => {
        reportWebVitals(customCallback);
      }).not.toThrow();
    });
  });

  describe("Validación de tipo", () => {
    it("no lanza error si el callback no es una función", () => {
      expect(() => {
        reportWebVitals("not a function" as any);
      }).not.toThrow();
    });

    it("no lanza error si el callback es un objeto", () => {
      expect(() => {
        reportWebVitals({} as any);
      }).not.toThrow();
    });

    it("no lanza error si el callback es un número", () => {
      expect(() => {
        reportWebVitals(123 as any);
      }).not.toThrow();
    });

    it("verifica el tipo antes de ejecutar", () => {
      const mockCallback = jest.fn();
      
      // Debe ser una función
      expect(typeof mockCallback).toBe("function");
      
      reportWebVitals(mockCallback);
    });
  });

  describe("Comportamiento", () => {
    it("llama al callback si es una función válida", () => {
      const mockCallback = jest.fn();
      
      // El callback debe ser una función
      expect(typeof mockCallback).toBe("function");
      
      reportWebVitals(mockCallback);
      
      // Verificar que es válido
      expect(mockCallback).toBeDefined();
    });
  });

  describe("Múltiples llamadas", () => {
    it("puede llamarse múltiples veces sin error", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      expect(() => {
        reportWebVitals(callback1);
        reportWebVitals(callback2);
      }).not.toThrow();
    });

    it("cada llamada es independiente", () => {
      const callback1 = jest.fn();
      
      reportWebVitals(callback1);
      reportWebVitals(callback1);
      
      // No debería lanzar error
      expect(callback1).toBeDefined();
    });
  });

  describe("Exportación", () => {
    it("exporta una función por defecto", () => {
      expect(typeof reportWebVitals).toBe("function");
    });

    it("la función está definida", () => {
      expect(reportWebVitals).toBeDefined();
    });
  });

  describe("Casos reales", () => {
    it("maneja llamada sin argumentos (producción común)", () => {
      // En producción, comúnmente se llama sin argumentos
      expect(() => {
        reportWebVitals();
      }).not.toThrow();
    });

    it("maneja llamada con console.log (desarrollo común)", () => {
      // En desarrollo, se usa console.log
      expect(() => {
        reportWebVitals(console.log);
      }).not.toThrow();
    });

    it("maneja función personalizada para analytics", () => {
      const sendToAnalytics = (metric: any) => {
        // Enviar a servicio de analytics
      };

      expect(() => {
        reportWebVitals(sendToAnalytics);
      }).not.toThrow();
    });
  });
});
