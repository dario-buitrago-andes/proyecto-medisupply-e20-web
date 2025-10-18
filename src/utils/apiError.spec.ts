import { getApiErrorMessage, alertApiError } from "./apiError";

describe("apiError utilities", () => {
  describe("getApiErrorMessage", () => {
    describe("Errores estilo Axios", () => {
      it("extrae mensaje de error.response.data.mensaje", () => {
        const error = {
          response: {
            data: {
              mensaje: "Error desde el servidor",
            },
          },
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Error desde el servidor");
      });

      it("ignora mensajes vacíos de axios", () => {
        const error = {
          response: {
            data: {
              mensaje: "   ",
            },
          },
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Ups!! Algo salió mal");
      });

      it("ignora mensajes no-string de axios", () => {
        const error = {
          response: {
            data: {
              mensaje: 123,
            },
          },
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Ups!! Algo salió mal");
      });
    });

    describe("Errores estilo Fetch", () => {
      it("extrae mensaje de error.data.mensaje", () => {
        const error = {
          data: {
            mensaje: "Error de fetch API",
          },
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Error de fetch API");
      });

      it("ignora mensajes vacíos de fetch", () => {
        const error = {
          data: {
            mensaje: "",
          },
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Ups!! Algo salió mal");
      });
    });

    describe("Errores directos", () => {
      it("extrae mensaje de error.mensaje", () => {
        const error = {
          mensaje: "Error directo",
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Error directo");
      });

      it("ignora mensajes solo con espacios", () => {
        const error = {
          mensaje: "  \n  ",
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Ups!! Algo salió mal");
      });
    });

    describe("Fallback", () => {
      it("usa fallback por defecto cuando no hay mensaje", () => {
        const error = {};

        const result = getApiErrorMessage(error);
        expect(result).toBe("Ups!! Algo salió mal");
      });

      it("usa fallback personalizado", () => {
        const error = {};
        const customFallback = "Error personalizado";

        const result = getApiErrorMessage(error, customFallback);
        expect(result).toBe(customFallback);
      });

      it("usa fallback cuando error es null", () => {
        const result = getApiErrorMessage(null);
        expect(result).toBe("Ups!! Algo salió mal");
      });

      it("usa fallback cuando error es undefined", () => {
        const result = getApiErrorMessage(undefined);
        expect(result).toBe("Ups!! Algo salió mal");
      });

      it("usa fallback cuando el parsing falla", () => {
        const error = {
          response: {
            data: null,
          },
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Ups!! Algo salió mal");
      });
    });

    describe("Prioridad de mensajes", () => {
      it("prioriza axios sobre fetch style", () => {
        const error = {
          response: {
            data: {
              mensaje: "Mensaje Axios",
            },
          },
          data: {
            mensaje: "Mensaje Fetch",
          },
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Mensaje Axios");
      });

      it("prioriza fetch sobre directo", () => {
        const error = {
          data: {
            mensaje: "Mensaje Fetch",
          },
          mensaje: "Mensaje Directo",
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Mensaje Fetch");
      });

      it("usa directo cuando axios y fetch no están disponibles", () => {
        const error = {
          mensaje: "Mensaje Directo",
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Mensaje Directo");
      });
    });

    describe("Casos edge", () => {
      it("maneja objetos con propiedades null", () => {
        const error = {
          response: null,
          data: null,
          mensaje: null,
        };

        const result = getApiErrorMessage(error);
        expect(result).toBe("Ups!! Algo salió mal");
      });

      it("maneja errores circulares sin lanzar excepción", () => {
        const error: any = { mensaje: "test" };
        error.self = error; // referencia circular

        const result = getApiErrorMessage(error);
        expect(result).toBe("test");
      });

      it("maneja strings como error", () => {
        const error = "Error simple string";

        const result = getApiErrorMessage(error);
        expect(result).toBe("Ups!! Algo salió mal");
      });

      it("maneja números como error", () => {
        const error = 404;

        const result = getApiErrorMessage(error);
        expect(result).toBe("Ups!! Algo salió mal");
      });
    });
  });

  describe("alertApiError", () => {
    let alertSpy: jest.SpyInstance;

    beforeEach(() => {
      alertSpy = jest.spyOn(window, "alert").mockImplementation();
    });

    afterEach(() => {
      alertSpy.mockRestore();
    });

    it("muestra alert con mensaje extraído del error", () => {
      const error = {
        response: {
          data: {
            mensaje: "Error de validación",
          },
        },
      };

      alertApiError(error);

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith("Error de validación");
    });

    it("muestra alert con fallback por defecto", () => {
      const error = {};

      alertApiError(error);

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith("Ups!! Algo salió mal");
    });

    it("muestra alert con fallback personalizado", () => {
      const error = {};
      const customFallback = "Error personalizado para alert";

      alertApiError(error, customFallback);

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith(customFallback);
    });

    it("llama a getApiErrorMessage internamente", () => {
      const error = {
        data: {
          mensaje: "Mensaje de fetch",
        },
      };

      alertApiError(error);

      expect(alertSpy).toHaveBeenCalledWith("Mensaje de fetch");
    });

    it("maneja múltiples llamadas consecutivas", () => {
      const error1 = { mensaje: "Error 1" };
      const error2 = { mensaje: "Error 2" };

      alertApiError(error1);
      alertApiError(error2);

      expect(alertSpy).toHaveBeenCalledTimes(2);
      expect(alertSpy).toHaveBeenNthCalledWith(1, "Error 1");
      expect(alertSpy).toHaveBeenNthCalledWith(2, "Error 2");
    });
  });

  describe("Integración entre funciones", () => {
    it("alertApiError usa getApiErrorMessage correctamente", () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation();
      
      const error = {
        response: {
          data: {
            mensaje: "Error integrado",
          },
        },
      };

      alertApiError(error);
      const manualMessage = getApiErrorMessage(error);

      expect(alertSpy).toHaveBeenCalledWith(manualMessage);
      
      alertSpy.mockRestore();
    });
  });
});
