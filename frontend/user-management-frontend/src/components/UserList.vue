<template>
  <div class="user-list">
    <div v-if="!users.length" class="no-users">No users found</div>

    <div v-else class="users-grid">
      <div
        v-for="user in users"
        :key="user.uuid"
        class="user-card"
        @click="$emit('user-click', user)"
      >
        <div class="user-avatar-container">
          <img
            :src="user.picture"
            :alt="`${user.firstName} ${user.lastName}`"
            @error="handleImageError"
            class="user-avatar"
          />
        </div>
        <div class="user-info">
          <h3>{{ user.firstName }} {{ user.lastName }}</h3>
          <p>Age: {{ user.age }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    if (this.users.length > 0) {
      console.log('First user in UserList:', this.users[0])
    }
  },
  methods: {
    handleImageError(e) {
      console.error('Image failed to load:', e.target.src)
      e.target.src = 'https://via.placeholder.com/60'
    },
  },
  emits: ['user-click'],
}
</script>

<style scoped>
.user-list {
  margin: 20px 0;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #2c3e50;
}

.user-info p {
  margin: 0;
  color: #666;
}

.no-users {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
