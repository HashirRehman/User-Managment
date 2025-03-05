import { createStore } from 'vuex'
import { login } from '@/services/api'

export default createStore({
  state: {
    users: [],
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
    selectedUser: null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  mutations: {
    setUsers(state, { users, total, currentPage, totalPages }) {
      state.users = users
      state.totalUsers = total
      state.currentPage = currentPage
      state.totalPages = totalPages
    },
    setSelectedUser(state, user) {
      state.selectedUser = user
    },
    setAuthenticated(state, value) {
      state.isAuthenticated = value
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await login(email, password)
        localStorage.setItem('token', response.token)
        commit('setAuthenticated', true)
        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },
    logout({ commit }) {
      localStorage.removeItem('token')
      commit('setAuthenticated', false)
    },
  },
})
