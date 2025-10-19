/**
 * Tests para AuthContext - Contexto de autenticación
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import authService from "../services/authService";

// Mock authService
jest.mock("../services/authService", () => ({
  __esModule: true,
  default: {
    isAuthenticated: jest.fn(),
    logout: jest.fn(),
  },
}));

const mockAuthService = authService as jest.Mocked<typeof authService>;

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("AuthProvider", () => {
    it("renderiza children correctamente", () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      );

      expect(screen.getByText("Test Child")).toBeInTheDocument();
    });

    it("inicializa con el estado de autenticación correcto (autenticado)", () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it("inicializa con el estado de autenticación correcto (no autenticado)", () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("useAuth hook", () => {
    it("lanza error cuando se usa fuera del AuthProvider", () => {
      // Suprimir console.error para esta prueba
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth debe usarse dentro de un AuthProvider");

      consoleSpy.mockRestore();
    });

    it("retorna el contexto cuando se usa dentro del AuthProvider", () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current).toHaveProperty("isAuthenticated");
      expect(result.current).toHaveProperty("login");
      expect(result.current).toHaveProperty("logout");
    });

    it("login() actualiza isAuthenticated a true", () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isAuthenticated).toBe(false);

      act(() => {
        result.current.login();
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it("logout() actualiza isAuthenticated a false y llama authService.logout()", () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it("login y logout múltiples veces funciona correctamente", () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Login
      act(() => {
        result.current.login();
      });
      expect(result.current.isAuthenticated).toBe(true);

      // Logout
      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);

      // Login de nuevo
      act(() => {
        result.current.login();
      });
      expect(result.current.isAuthenticated).toBe(true);

      // Logout de nuevo
      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockAuthService.logout).toHaveBeenCalledTimes(2);
    });
  });

  describe("Integración con authService", () => {
    it("verifica autenticación al montar el componente", () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);

      renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Se llama al menos una vez al inicializar
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });

    it("múltiples componentes comparten el mismo estado", () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);

      const TestComponent = () => {
        const { isAuthenticated, login } = useAuth();
        return (
          <div>
            <span data-testid="status">{isAuthenticated ? "logged-in" : "logged-out"}</span>
            <button onClick={login}>Login</button>
          </div>
        );
      };

      const { getAllByTestId, getAllByText } = render(
        <AuthProvider>
          <TestComponent />
          <TestComponent />
        </AuthProvider>
      );

      const statusElements = getAllByTestId("status");
      expect(statusElements[0]).toHaveTextContent("logged-out");
      expect(statusElements[1]).toHaveTextContent("logged-out");

      const loginButtons = getAllByText("Login");
      act(() => {
        loginButtons[0].click();
      });

      // Ambos componentes deben reflejar el cambio
      expect(statusElements[0]).toHaveTextContent("logged-in");
      expect(statusElements[1]).toHaveTextContent("logged-in");
    });
  });
});

export {};
