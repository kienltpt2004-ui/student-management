import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sms_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sms_token')
      localStorage.removeItem('sms_user')
      window.dispatchEvent(new Event('sms:logout'))
    }
    return Promise.reject(error)
  }
)

export const unwrap = (response) => {
  const body = response?.data
  return body && Object.prototype.hasOwnProperty.call(body, 'data') ? body.data : body
}

export const apiError = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  'Có lỗi xảy ra. Vui lòng thử lại.'
