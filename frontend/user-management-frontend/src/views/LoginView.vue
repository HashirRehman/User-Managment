<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
  <p class="register-link">
    Don't have an account?
    <router-link to="/register">Register here</router-link>
  </p>
</template>

<script>
import { login } from '../services/api'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: null,
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.error = null

      try {
        const response = await login(this.email, this.password)
        localStorage.setItem('token', response.token)
        this.$store.commit('setAuthenticated', true)
        this.$router.push('/users')
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #a8d5c2;
}

.error {
  color: red;
  font-size: 14px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.register-link a {
  color: #42b983;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
