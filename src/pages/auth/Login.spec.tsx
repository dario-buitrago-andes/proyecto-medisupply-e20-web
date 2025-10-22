/**
 * Tests para Login - Componente de inicio de sesión
 */

// Mock CSS
jest.mock("./Login.css", () => ({}));

// Mock api.ts para evitar problemas con axios
jest.mock("../../services/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock authService
jest.mock("../../services/authService");

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import authService from "../../services/authService";

const mockAuthService = authService as jest.Mocked<typeof authService>;

describe("Login", () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderizado del componente", () => {
    it("renderiza el componente correctamente", () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      expect(screen.getByText("MediSupply")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument();
    });

    it("tiene la estructura HTML correcta", () => {
      const { container } = render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      expect(container.querySelector(".login-container")).toBeInTheDocument();
      expect(container.querySelector(".login-box")).toBeInTheDocument();
    });
  });

  describe("Campos del formulario", () => {
    it("renderiza el campo de email con sus atributos", () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      
      expect(emailInput).toBeInTheDocument();
      expect(emailInput.type).toBe("email");
      expect(emailInput.id).toBe("email");
      expect(emailInput.required).toBe(true);
      expect(emailInput.placeholder).toBe("tu@email-sustentacion.com");
      expect(emailInput.getAttribute("autocomplete")).toBe("email");
    });

    it("renderiza el campo de contraseña con sus atributos", () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;
      
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput.type).toBe("password");
      expect(passwordInput.id).toBe("password");
      expect(passwordInput.required).toBe(true);
      expect(passwordInput.placeholder).toBe("••••••••");
      expect(passwordInput.getAttribute("autocomplete")).toBe("current-password");
    });

    it("renderiza el botón de envío", () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveClass("login-button");
      expect(submitButton).toHaveAttribute("type", "submit");
    });

    it("los inputs tienen labels asociados correctamente", () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailLabel = screen.getByText("Email");
      const passwordLabel = screen.getByText("Contraseña");
      
      expect(emailLabel).toHaveAttribute("for", "email");
      expect(passwordLabel).toHaveAttribute("for", "password");
    });
  });

  describe("Interacción con el formulario", () => {
    it("permite escribir en el campo de email", async () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      
      await userEvent.type(emailInput, "test@example.com");
      
      expect(emailInput.value).toBe("test@example.com");
    });

    it("permite escribir en el campo de contraseña", async () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;
      
      await userEvent.type(passwordInput, "password123");
      
      expect(passwordInput.value).toBe("password123");
    });

    it("limpia los campos cuando se cambian", async () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      
      await userEvent.type(emailInput, "first@test.com");
      expect(emailInput.value).toBe("first@test.com");
      
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, "second@test.com");
      expect(emailInput.value).toBe("second@test.com");
    });
  });

  describe("Envío del formulario", () => {
    it("llama a authService.login con las credenciales correctas", async () => {
      mockAuthService.login = jest.fn().mockResolvedValue({ access_token: "token123" });
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      
      await userEvent.type(emailInput, "user@test.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockAuthService.login).toHaveBeenCalledWith({
          email: "user@test.com",
          password: "password123",
        });
      });
    });

    it("llama a onLoginSuccess cuando el login es exitoso", async () => {
      mockAuthService.login = jest.fn().mockResolvedValue({ access_token: "token123" });
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      
      await userEvent.type(emailInput, "user@test.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it("previene el comportamiento por defecto del formulario", async () => {
      mockAuthService.login = jest.fn().mockResolvedValue({ access_token: "token123" });
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const form = screen.getByRole("button", { name: /iniciar sesión/i }).closest("form");
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");
      
      form?.dispatchEvent(submitEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Estado de carga", () => {
    it("muestra 'Iniciando sesión...' durante la petición", async () => {
      mockAuthService.login = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ access_token: "token" }), 100))
      );
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      
      await userEvent.type(emailInput, "user@test.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);
      
      expect(screen.getByText("Iniciando sesión...")).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText("Iniciando sesión...")).not.toBeInTheDocument();
      });
    });

    it("deshabilita los campos durante la carga", async () => {
      mockAuthService.login = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ access_token: "token" }), 100))
      );
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      
      await userEvent.type(emailInput, "user@test.com");
      await userEvent.type(passwordInput, "password123");
      await userEvent.click(submitButton);
      
      expect(emailInput.disabled).toBe(true);
      expect(passwordInput.disabled).toBe(true);
      expect(submitButton).toBeDisabled();
      
      await waitFor(() => {
        expect(emailInput.disabled).toBe(false);
      });
    });
  });

  describe("Manejo de errores", () => {
    it("muestra error genérico cuando el login falla", async () => {
      mockAuthService.login = jest.fn().mockRejectedValue(new Error("Network error"));
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      
      await userEvent.type(emailInput, "user@test.com");
      await userEvent.type(passwordInput, "wrongpassword");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/error al iniciar sesión/i)).toBeInTheDocument();
      });
    });

    it("muestra mensaje de error personalizado del servidor", async () => {
      mockAuthService.login = jest.fn().mockRejectedValue({
        response: { data: { message: "Credenciales inválidas" } },
      });
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      
      await userEvent.type(emailInput, "user@test.com");
      await userEvent.type(passwordInput, "wrongpassword");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
      });
    });

    it("el mensaje de error tiene la clase CSS correcta", async () => {
      mockAuthService.login = jest.fn().mockRejectedValue(new Error("Test error"));
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      
      await userEvent.type(emailInput, "user@test.com");
      await userEvent.type(passwordInput, "wrongpassword");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/error al iniciar sesión/i);
        expect(errorMessage).toHaveClass("error-message");
      });
    });

    it("limpia el error al intentar login nuevamente", async () => {
      mockAuthService.login = jest.fn()
        .mockRejectedValueOnce(new Error("First error"))
        .mockResolvedValueOnce({ access_token: "token" });
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      
      // Primer intento - falla
      await userEvent.type(emailInput, "user@test.com");
      await userEvent.type(passwordInput, "wrongpassword");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/error al iniciar sesión/i)).toBeInTheDocument();
      });
      
      // Segundo intento - éxito
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, "correctpassword");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/error al iniciar sesión/i)).not.toBeInTheDocument();
      });
    });

    it("NO llama a onLoginSuccess cuando el login falla", async () => {
      mockAuthService.login = jest.fn().mockRejectedValue(new Error("Login failed"));
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      
      await userEvent.type(emailInput, "user@test.com");
      await userEvent.type(passwordInput, "wrongpassword");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/error al iniciar sesión/i)).toBeInTheDocument();
      });
      
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
  });

  describe("Accesibilidad", () => {
    it("el formulario es accesible por teclado", async () => {
      mockAuthService.login = jest.fn().mockResolvedValue({ access_token: "token" });
      
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      
      // Navegar con Tab
      await userEvent.tab();
      expect(emailInput).toHaveFocus();
      
      await userEvent.type(emailInput, "user@test.com");
      
      await userEvent.tab();
      expect(passwordInput).toHaveFocus();
      
      await userEvent.type(passwordInput, "password123");
      
      // Enter para enviar
      await userEvent.keyboard("{Enter}");
      
      await waitFor(() => {
        expect(mockAuthService.login).toHaveBeenCalled();
      });
    });

    it("los inputs tienen el atributo autoComplete correcto", () => {
      render(<Login onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      
      expect(emailInput).toHaveAttribute("autocomplete", "email");
      expect(passwordInput).toHaveAttribute("autocomplete", "current-password");
    });
  });
});

export {};
