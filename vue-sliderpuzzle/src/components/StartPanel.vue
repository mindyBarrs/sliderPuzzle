<template>
  <div id="optionsForm">
    <button @click="createPuzzle">Create Puzzle with Random Image</button>
    <button type="button" ref="searchModalBtn" @click="openModal">
      Search for image & Create Puzzle
    </button>
  </div>

  <SearchModal
    :isOpen="isModalOpened"
    @modal-close="closeModal"
    name="search-modal"
    @gameStart="selectImage"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import SearchModal from '@/components/Search/SearchModal.vue'

import { useImageStore } from '@/stores/imageStore'

import monksImage from '@/assets/monks.jpg'

const imageStore = useImageStore()
const { randomImage } = storeToRefs(imageStore)
const { getRandomImage } = imageStore

const isModalOpened = ref(false)

const openModal = () => {
  isModalOpened.value = true
}

const closeModal = () => {
  isModalOpened.value = false
}

// Define emits
const emit = defineEmits(['gameStart'])

// Reactive properties
const size = {
  horizontal: 4,
  vertical: 4,
}

// Emit event to parent
const createPuzzle = async () => {
  try {
    await getRandomImage()
    emit('gameStart', { image: randomImage.value, size })
  } catch (error) {
    console.error('Failed to get random image:', error)
    emit('gameStart', { image: monksImage, size })
  }
}

const selectImage = (payload: {
  image: string
  size: { horizontal: number; vertical: number }
}) => {
  emit('gameStart', payload)
}
</script>

<style lang="scss" scoped>
#optionsForm {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  background-color: $lite-green;
}

button:hover {
  background-color: $mid-green;
}
</style>
