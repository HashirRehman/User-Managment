<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required @blur="validateEmail" />
        <span v-if="emailError" class="error-message">{{ emailError }}</span>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required @blur="validatePassword" />
        <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
          @blur="validateConfirmPassword"
        />
        <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
      </div>

      <button type="submit" :disabled="loading || !isValid">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>

      <div v-if="error" class="error-container">
        <p class="error">{{ error }}</p>
      </div>

      <p class="login-link">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/api'

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const loading = ref(false)
    const error = ref(null)
    const emailError = ref('')
    const passwordError = ref('')
    const confirmPasswordError = ref('')

    const validateEmail = () => {
      emailError.value = ''
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.value) {
        emailError.value = 'Email is required'
      } else if (!emailRegex.test(email.value)) {
        emailError.value = 'Please enter a valid email address'
      }
    }

    const validatePassword = () => {
      passwordError.value = ''
      if (!password.value) {
        passwordError.value = 'Password is required'
      } else if (password.value.length < 6) {
        passwordError.value = 'Password must be at least 6 characters long'
      }
    }

    const validateConfirmPassword = () => {
      confirmPasswordError.value = ''
      if (password.value !== confirmPassword.value) {
        confirmPasswordError.value = 'Passwords do not match'
      }
    }

    const isValid = computed(() => {
      return (
        email.value &&
        password.value &&
        confirmPassword.value &&
        password.value === confirmPassword.value &&
        password.value.length >= 6 &&
        !emailError.value &&
        !passwordError.value &&
        !confirmPasswordError.value
      )
    })

    const handleSubmit = async () => {
      // Validate all fields before submission
      validateEmail()
      validatePassword()
      validateConfirmPassword()

      if (!isValid.value) {
        error.value = 'Please fix the errors before submitting'
        return
      }

      loading.value = true
      error.value = null

      try {
        const response = await register(email.value, password.value)
        // Show success message
        alert(response.message || 'Registration successful! Please login to continue.')
        router.push('/login')
      } catch (err) {
        error.value = err.response?.data?.message || 'Registration failed. Please try again.'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      confirmPassword,
      loading,
      error,
      emailError,
      passwordError,
      confirmPasswordError,
      isValid,
      handleSubmit,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
    }
  },
}
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.register-form {
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
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 14px;
}

.login-link {
  text-align: center;
  font-size: 14px;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.error-container {
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
}

.error-message {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
}

.success {
  color: #4caf50;
  text-align: center;
  margin: 10px 0;
}
</style>
