<template>
  <PuzzleBoard ref="puzzleBoard" v-show="playing" />

  <!-- Wrap StartPanel in a div -->
  <div v-show="!playing">
    <StartPanel @gameStart="createPuzzle" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import PuzzleBoard from '@/components/Puzzle/PuzzleBoard.vue'
import StartPanel from '@/components/StartPanel.vue'

const playing = ref(false)
const puzzleBoard = ref(null)

const createPuzzle = (...args: string[]) => {
  playing.value = true
  puzzleBoard.value?.createPuzzle(...args)
}
</script>
