<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import StartPanel from './components/StartPanel.vue'
import PuzzleBoard from './components/Puzzle/PuzzleBoard.vue'

// State
const playing = ref(false)

// Component references
const puzzleBoard = shallowRef<InstanceType<typeof PuzzleBoard> | null>(null)

// Handle game start event
function createPuzzle(payload: { image: string; size: { horizontal: number; vertical: number } }) {
  playing.value = true
  puzzleBoard.value?.createPuzzle(payload)
}
</script>

<template>
  <main>
    <PuzzleBoard ref="puzzleBoard" v-show="playing" />
    <StartPanel @gameStart="createPuzzle" v-show="!playing" />
  </main>
</template>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

main {
  font: 14px/20px sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding: 16px;
}

header h1 {
  font-weight: 100;
  line-height: 80px;
  font-size: 38px;
}
</style>
