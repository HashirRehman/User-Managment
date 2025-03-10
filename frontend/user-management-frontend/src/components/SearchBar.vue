<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchInput"
      placeholder="Search by name or email..."
      @input="handleInput"
    />
  </div>
</template>

<script>
import { ref, watchEffect, onUnmounted } from 'vue'

export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'search'],
  setup({ modelValue }, { emit }) {
    const searchInput = ref(modelValue)
    let debounceTimeout = null

    const handleInput = () => {
      emit('update:modelValue', searchInput.value)
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        emit('search', searchInput.value)
      }, 300)
    }

    watchEffect(() => {
      searchInput.value = modelValue
    })

    onUnmounted(() => {
      clearTimeout(debounceTimeout)
    })

    return {
      searchInput,
      handleInput,
    }
  },
}
</script>

<style scoped>
.search-bar {
  margin: 20px 0;
}

input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #42b983;
}
</style>
