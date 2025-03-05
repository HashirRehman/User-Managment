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
import { ref, watch } from 'vue'

export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'search'],
  setup(props, { emit }) {
    const searchInput = ref(props.modelValue)
    let debounceTimeout

    const handleInput = () => {
      emit('update:modelValue', searchInput.value)
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        emit('search', searchInput.value)
      }, 300)
    }

    watch(
      () => props.modelValue,
      (newValue) => {
        searchInput.value = newValue
      },
    )

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
}

input:focus {
  outline: none;
  border-color: #42b983;
}
</style>
