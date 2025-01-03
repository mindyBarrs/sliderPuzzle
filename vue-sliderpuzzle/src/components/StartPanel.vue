// search button opens a modal
<template>
  <form id="optionsForm" @submit.prevent="createPuzzle">
    <button type="submit">Create Puzzle with Random Image</button>

    <button type="submit">Search for image & Create Puzzle</button>
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

// Define emits
const emit = defineEmits<{
  (
    event: 'gameStart',
    payload: { image: string; size: { horizontal: number; vertical: number } },
  ): void
}>()

// Emit event to parent
function createPuzzle() {
  emit('gameStart', { image, size })
}
</script>

<style lang="scss">
form {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

button {
  -webkit-appearance: none;
  appearance: none;
  padding: 12px 16px;
  background-color: $lite-green;
  color: $black;
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
  outline: 2px solid $mid-green;
  outline-offset: 2px;
}

button:hover {
  background-color: $mid-green;
}
</style>
