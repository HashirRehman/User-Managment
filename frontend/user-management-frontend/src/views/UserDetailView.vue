<template>
  <div class="user-detail">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="user" class="user-profile">
      <button class="back-button" @click="$router.back()">← Back to Users</button>

      <div class="profile-header">
        <img
          :src="user.picture"
          :alt="`${user.firstName} ${user.lastName}`"
          class="profile-picture"
        />
        <h2>{{ user.firstName }} {{ user.lastName }}</h2>
      </div>

      <div class="profile-details">
        <div class="detail-item">
          <strong>Email:</strong>
          <span>{{ user.email }}</span>
        </div>

        <div class="detail-item">
          <strong>Age:</strong>
          <span>{{ user.age }}</span>
        </div>

        <div class="detail-item">
          <strong>Gender:</strong>
          <span>{{ user.gender }}</span>
        </div>

        <div class="detail-item">
          <strong>Location:</strong>
          <span>{{ user.city }}, {{ user.country }}</span>
        </div>

        <div class="detail-item">
          <strong>Phone:</strong>
          <span>{{ user.phone }}</span>
        </div>
      </div>
    </div>

    <div v-else class="not-found">User not found</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getUserDetails } from '../services/api'

export default {
  name: 'UserDetailView',
  setup() {
    const route = useRoute()
    const user = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchUserDetails = async () => {
      try {
        loading.value = true
        const uuid = route.params.uuid
        const data = await getUserDetails(uuid)
        user.value = data
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load user details'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchUserDetails)

    return {
      user,
      loading,
      error,
    }
  },
}
</script>

<style scoped>
.user-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #42b983;
}

.profile-details {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.detail-item {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}

.detail-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-item strong {
  width: 100px;
  color: #666;
}

.loading,
.error,
.not-found {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #dc3545;
}
</style>
