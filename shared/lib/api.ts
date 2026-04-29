import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiOptions extends RequestInit {
  responseType?: 'json' | 'blob';
}

export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { responseType = 'json', ...fetchOptions } = options;
  const token = Cookies.get('token');

  const defaultHeaders: Record<string, string> = {};
  
  if (!(fetchOptions.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...fetchOptions.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login?expired=true';
      }
    }

    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.message || 'Error en la comunicación con el servidor') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  if (responseType === 'blob') {
    const blob = await response.blob();
    return blob as unknown as T;
  }

  return await response.json();
}
