<template>
  <div class="tile" :style="tile.styles" @click="move" :class="{ empty: tile.isEmpty }"></div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

// Define props with type annotations
const props = defineProps<{
  tile: {
    styles: {
      background: string
      backgroundPositionX: string
      backgroundPositionY: string
      width: string
      height: string
      order: number
    }
    position: number
    isEmpty: boolean
  }
}>()

// Define emits
const emit = defineEmits<{
  (event: 'move', tile: typeof props.tile): void
}>()

// Emit 'moving' event
function move() {
  if (!props.tile.isEmpty) {
    emit('move', props.tile)
  }
}
</script>

<style scoped>
.tile {
  border: 1px solid #241433;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.tile.empty {
  box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 10px inset;
}

.tile.empty:hover {
  border-color: #241433;
  cursor: default;
}

.tile:hover {
  border-color: #ff0000;
  cursor: pointer;
}
</style>
