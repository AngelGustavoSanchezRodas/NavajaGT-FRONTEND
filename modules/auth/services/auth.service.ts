import Cookies from "js-cookie";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth`;

export interface AuthResponse {
  token?: string;
  message?: string;
  user?: {
    id: string;
    nombre: string;
    email: string;
  };
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, contrasena: password }),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Error al iniciar sesión");
    }

    if (data?.token) {
      Cookies.set("token", data.token, { expires: 7 });
    }

    return data;
  }

  async register(nombre: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, contrasena: password }),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Error al registrar usuario");
    }

    return data;
  }

  logout() {
    Cookies.remove("token");
  }

  getToken() {
    return Cookies.get("token") || null;
  }

  isAuthenticated() {
    return !!Cookies.get("token");
  }
}

export const authService = new AuthService();
