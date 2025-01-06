<script setup lang="ts"></script>

<template>
  <div>
    <input type="text" placeholder="Search" v-model="searchTerm" />

    <button @click="searchImage(searchTerm)">Search</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useImageStore } from '@/stores/imageStore'

const searchTerm = ref('')

const imageStore = useImageStore()
const { searchImage } = imageStore
</script>
