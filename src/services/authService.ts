import api from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

const TOKEN_KEY = "access_token";

export const authService = {
  // Login y guardar token
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/users/generate-token", credentials);
    const { access_token } = response.data;
    
    // Guardar token en localStorage
    localStorage.setItem(TOKEN_KEY, access_token);
    
    return response.data;
  },

  // Logout y limpiar token
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;
