import axios, { type AxiosInstance, AxiosError, type AxiosResponse } from 'axios'
import { API_BASE_URL } from '../utils/constants'

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    timestamp: string
  }
}

class ApiService {
  private client: AxiosInstance
  private authToken: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  setToken(token: string | null): void {
    this.authToken = token
    if (token) {
      sessionStorage.setItem('auth_token', token)
    } else {
      sessionStorage.removeItem('auth_token')
    }
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized()
        }
        return Promise.reject(this.formatError(error))
      }
    )
  }

  private getAuthToken(): string | null {
    return this.authToken || sessionStorage.getItem('auth_token')
  }

  private handleUnauthorized(): void {
    sessionStorage.removeItem('auth_token')
    window.location.href = '/login'
  }

  private formatError(error: AxiosError<ApiResponse>): Error {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error.message)
    }
    if (error.message) {
      return new Error(error.message)
    }
    return new Error('An unexpected error occurred')
  }

  async get<T = unknown>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url)
    return response.data
  }

  async post<T = unknown>(url: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data)
    return response.data
  }

  async put<T = unknown>(url: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data)
    return response.data
  }

  async delete<T = unknown>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url)
    return response.data
  }
}

export const apiService = new ApiService()
export default apiService
