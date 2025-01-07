<template>
  <div>
    <label htmlFor="search">Search for an image</label>

    <div class="search-wrapper">
      <input id="search" type="text" placeholder="Search" v-model="searchTerm" />

      <button @click="searchImage(searchTerm)">Search</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useImageStore } from '@/stores/imageStore'

const searchTerm = ref('')

const imageStore = useImageStore()
const { searchImage } = imageStore
</script>

<style scoped lang="scss">
.search-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  input {
    padding: 10px;
    border-radius: 8px 0px 0px 8px;
    width: 100%;
    border: 1px solid $dark-blue;

    &:focus {
      border-radius: 8px 0px 0px 8px;
    }
  }

  button {
    padding: 10.5px;
    border-radius: 0px 8px 8px 0px;

    &:hover {
      background-color: $dark-blue;
      color: $yellow;
    }
  }
}
</style>
