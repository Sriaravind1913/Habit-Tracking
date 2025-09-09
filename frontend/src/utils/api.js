import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh')
        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Try to refresh the token
        const response = await axios.post(`${API}/auth/refresh`, {
          refresh: refreshToken
        })

        const { access } = response.data
        localStorage.setItem('access', access)

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Refresh failed, redirect to login
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Log other errors for debugging
    if (error.response?.status >= 400) {
      console.error('API Error:', error.response?.status, error.response?.data)
    }

    return Promise.reject(error)
  }
)

export default api
