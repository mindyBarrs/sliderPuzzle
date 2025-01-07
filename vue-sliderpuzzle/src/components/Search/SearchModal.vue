<template>
  <div v-if="isOpen" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" ref="target">
        <div class="modal-header">
          <slot name="header"><button @click.stop="closeModal">X</button></slot>
        </div>

        <div class="modal-body">
          <slot name="content">
            <SearchBar />

            <div v-if="searchedImages.length === 0 && !error">No images found</div>

            <div v-else-if="error" class="error">{{ error }}</div>

            <div v-else>
              <ul class="image-container">
                <li
                  v-for="image in searchedImages"
                  :key="image.id"
                  class="image-item"
                  @click="selectImage(image)"
                >
                  <img :alt="image.alt_description" :src="image.urls.small" />
                </li>
              </ul>
            </div>
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer"> </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/imageStore'
import { onClickOutside } from '@vueuse/core'

import SearchBar from '@/components/Search/SearchBar.vue'

defineProps({
  isOpen: Boolean,
  imageResults: [Array, Object],
})

const emit = defineEmits(['modal-close', 'gameStart'])

const imageStore = useImageStore()
const { searchedImages, error } = storeToRefs(imageStore)
console.log(error)
const target = ref(null)
onClickOutside(target, () => closeModal())

const closeModal = () => {
  emit('modal-close')
}

interface Image {
  id: string
  alt_description: string
  urls: {
    small: string
  }
}

const selectImage = (image: Image) => {
  emit('gameStart', { image: image, size: { horizontal: 4, vertical: 4 } })
  closeModal()
}
</script>

<style scoped lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  width: 550px;
  margin: 150px auto;
  padding: 20px 30px;
  background-color: $white;
  color: $dark-blue;
  font-weight: 700;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 1.5rem;

  button {
    border-radius: 50px;
    padding: 5px 10px;
    background-color: unset;
    border: 1px solid #000;

    &:hover {
      background-color: $dark-blue;
      color: $yellow;
    }
  }
}

.image-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0;

  .image-item {
    list-style: none;

    img {
      width: 100px;
      height: 100px;
      border-radius: 5px;
    }
  }
}
</style>
