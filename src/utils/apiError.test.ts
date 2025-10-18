import { getApiErrorMessage } from "./apiError";

describe("getApiErrorMessage", () => {
  it("debe extraer mensaje de error tipo Axios", () => {
    const axiosError = {
      response: {
        data: {
          mensaje: "Error desde el servidor"
        }
      }
    };

    const result = getApiErrorMessage(axiosError);
    expect(result).toBe("Error desde el servidor");
  });

  it("debe extraer mensaje de error tipo Fetch", () => {
    const fetchError = {
      data: {
        mensaje: "Error de fetch"
      }
    };

    const result = getApiErrorMessage(fetchError);
    expect(result).toBe("Error de fetch");
  });

  it("debe extraer mensaje directo", () => {
    const directError = {
      mensaje: "Error directo"
    };

    const result = getApiErrorMessage(directError);
    expect(result).toBe("Error directo");
  });

  it("debe retornar mensaje fallback cuando no hay mensaje", () => {
    const emptyError = {};
    
    const result = getApiErrorMessage(emptyError);
    expect(result).toBe("Ups!! Algo salió mal");
  });

  it("debe usar mensaje fallback personalizado", () => {
    const emptyError = {};
    
    const result = getApiErrorMessage(emptyError, "Error personalizado");
    expect(result).toBe("Error personalizado");
  });

  it("debe ignorar mensajes vacíos", () => {
    const emptyMessageError = {
      response: {
        data: {
          mensaje: "   "
        }
      }
    };

    const result = getApiErrorMessage(emptyMessageError);
    expect(result).toBe("Ups!! Algo salió mal");
  });
});

