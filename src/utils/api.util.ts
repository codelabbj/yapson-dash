import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

class Api {
  private api: AxiosInstance;

  constructor() {
    const baseUrl = "https://api.yapson.net/yapson";

    this.api = axios.create({
      baseURL: `${baseUrl}`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "fr",
        /*   "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
          */
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("access");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          window.location.href = "auth/signin";
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Clear token and redirect to login
          localStorage.removeItem("accessToken");
          window.location.href = "auth/signin";
        }

        // Handle other errors
        if (error.response?.status === 404) {
          console.error("Resource not found:", error);
        }

        if (error.response?.status === 500) {
          console.error("Server error:", error);
        }

        return Promise.reject(error);
      },
    );
  }

  // Generic GET method
  async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get<T, AxiosResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic POST method
  async post<T>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post<T, AxiosResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic PUT method
  async put<T>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put<T, AxiosResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic PUT method
  async patch<T>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.patch<T, AxiosResponse<T>>(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic DELETE method
  async delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.delete<T, AxiosResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Exporting a singleton instance of Api (optional)
const api = new Api();
export default api;
