<template>
  <form id="optionsForm" @submit.prevent="createPuzzle">
    <img alt="Start panel image" :src="image" v-if="image" />

    <div>
      <button type="submit" :disabled="!image">Create Puzzle</button>
    </div>
  </form>
</template>

<script setup lang="ts">
// Import image
import monksImage from '../assets/monks.jpg'

// Reactive properties
const image = monksImage
const size = {
  horizontal: 4,
  vertical: 4,
}

// Emit event to parent
function createPuzzle() {
  emit('gameStart', { image, size })
}

// Define emits
defineEmits<{
  (
    event: 'gameStart',
    payload: { image: string; size: { horizontal: number; vertical: number } },
  ): void
}>()
</script>

<style scoped>
img {
  border: 1px solid #ccc;
  margin-bottom: 8px;
  width: 100%;
  max-width: 300px;
  display: block;
}

button {
  -webkit-appearance: none;
  appearance: none;
  padding: 12px 16px;
  background-color: #00cccc;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

button:focus {
  outline: 2px solid #005757;
  outline-offset: 2px;
}

button:hover {
  background-color: #009999;
}

button:disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}
</style>
