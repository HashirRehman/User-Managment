<template>
  <div id="app">
    <nav v-if="isAuthenticated">
      <router-link to="/users">Users</router-link> |
      <a href="#" @click.prevent="logout">Logout</a>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['isAuthenticated']),
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    },
  },
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
