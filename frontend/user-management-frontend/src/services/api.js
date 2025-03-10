import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const getUsers = async (page = 1, limit = 10) => {
  const response = await api.get(`/users?page=${page}&limit=${limit}`)
  return response.data
}

export const getUserDetails = async (uuid) => {
  const response = await api.get(`/users/${uuid}`)
  return response.data
}

export const searchUsers = async (query) => {
  const response = await api.get(`/users/search?query=${query}`)
  return response.data
}

export const register = async (email, password) => {
  const response = await api.post('/auth/register', { email, password })
  return response.data
}

export default api
