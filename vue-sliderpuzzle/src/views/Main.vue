<script setup lang="ts">
import { ref, shallowRef } from 'vue'

import PuzzleBoard from '../components/Puzzle/PuzzleBoard.vue'
import Search from '../components/Search.vue'
import StartPanel from '../components/StartPanel.vue'

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
    <Search v-show="!playing" />

    <PuzzleBoard ref="puzzleBoard" v-show="playing" />

    <StartPanel @gameStart="createPuzzle" v-show="!playing" />
  </main>
</template>
