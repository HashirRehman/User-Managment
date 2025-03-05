<template>
  <div class="users">
    <h2>Users</h2>

    <SearchBar v-model="searchQuery" @search="handleSearch" />

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">Loading users...</div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <!-- Users list -->
    <UserList v-else :users="users" @user-click="handleUserClick" />

    <!-- Pagination -->
    <div class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="pagination-button"
      >
        Previous
      </button>

      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>

      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="pagination-button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUsers, searchUsers } from '../services/api'
import socket from '../services/socket'
import SearchBar from '../components/SearchBar.vue'
import UserList from '../components/UserList.vue'

export default {
  name: 'UsersView',
  components: {
    SearchBar,
    UserList,
  },
  data() {
    return {
      searchQuery: '',
      loading: false,
      error: null,
    }
  },
  computed: {
    ...mapState(['users', 'currentPage', 'totalPages']),
  },
  methods: {
    async fetchUsers(page = 1) {
      this.loading = true
      this.error = null
      try {
        const data = await getUsers(page)
        this.$store.commit('setUsers', data)
        // Save current page to sessionStorage
        sessionStorage.setItem('lastViewedPage', page.toString())
      } catch (error) {
        console.error('Error fetching users:', error)
        this.error = 'Failed to load users. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async handleSearch(query) {
      if (!query.trim()) {
        return this.fetchUsers(this.currentPage)
      }

      this.loading = true
      this.error = null
      try {
        const results = await searchUsers(query)
        // Store search results and query in sessionStorage
        sessionStorage.setItem(
          'userSearchState',
          JSON.stringify({
            query,
            results,
            timestamp: Date.now(),
          }),
        )
        this.$store.commit('setUsers', {
          users: results,
          total: results.length,
          currentPage: 1,
          totalPages: 1,
        })
      } catch (error) {
        console.error('Search error:', error)
        this.error = 'Search failed. Please try again.'
      } finally {
        this.loading = false
      }
    },

    handleUserClick(user) {
      // Save current state before navigation
      this.saveCurrentState()
      this.$router.push(`/users/${user.uuid}`)
    },

    changePage(page) {
      this.fetchUsers(page)
    },

    saveCurrentState() {
      const state = {
        page: this.currentPage,
        searchQuery: this.searchQuery,
        timestamp: Date.now(),
      }
      sessionStorage.setItem('userListState', JSON.stringify(state))
    },

    restoreState() {
      const state = sessionStorage.getItem('userListState')
      if (state) {
        const { page, searchQuery, timestamp } = JSON.parse(state)
        // Only restore if less than 30 minutes old
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          this.searchQuery = searchQuery
          if (searchQuery) {
            this.handleSearch(searchQuery)
          } else {
            this.fetchUsers(page)
          }
          return true
        }
      }
      return false
    },

    clearState() {
      sessionStorage.removeItem('userListState')
      sessionStorage.removeItem('userSearchState')
    },
  },

  created() {
    // Try to restore previous state
    if (!this.restoreState()) {
      // If no state to restore, check for search state
      const searchState = sessionStorage.getItem('userSearchState')
      if (searchState) {
        const { query, results, timestamp } = JSON.parse(searchState)
        // Use cached results if less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          this.searchQuery = query
          this.$store.commit('setUsers', {
            users: results,
            total: results.length,
            currentPage: 1,
            totalPages: 1,
          })
          return
        }
      }

      // If no cached state, fetch first page
      this.fetchUsers(1)
    }

    // Listen for real-time updates
    socket.on('users:updated', ({ newUsers }) => {
      if (newUsers > 0) {
        this.fetchUsers(this.currentPage)
      }
    })
  },

  beforeUnmount() {
    socket.off('users:updated')
  },

  // Clean up old states when component is destroyed
  unmounted() {
    const now = Date.now()
    const states = ['userListState', 'userSearchState']
    states.forEach((key) => {
      const state = sessionStorage.getItem(key)
      if (state) {
        const { timestamp } = JSON.parse(state)
        if (now - timestamp > 30 * 60 * 1000) {
          sessionStorage.removeItem(key)
        }
      }
    })
  },
}
</script>

<style scoped>
.users {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
  margin: 1rem 0;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.error-state {
  color: #dc3545;
  background-color: #fff5f5;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}

.pagination-button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #3aa876;
}

.pagination-button:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #666;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}
</style>
