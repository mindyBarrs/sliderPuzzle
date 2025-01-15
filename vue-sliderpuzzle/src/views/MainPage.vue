<template>
  <PuzzleBoard ref="puzzleBoard" v-show="playing" />

  <!-- Wrap StartPanel in a div -->
  <div v-show="!playing">
    <StartPanel @gameStart="createPuzzle" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

import PuzzleBoard from '@/components/Puzzle/PuzzleBoard.vue'
import StartPanel from '@/components/StartPanel.vue'

const playing = ref(false)
const puzzleBoard: Ref<InstanceType<typeof PuzzleBoard> | null> = ref(null)

const createPuzzle = ({
  image: { ...imageArgs },
  size: { ...sizeArgs },
}: {
  image: { urls: { small: string }; alt_description: string }
  size: { horizontal: number; vertical: number }
}) => {
  playing.value = true
  puzzleBoard.value?.createPuzzle({ image: imageArgs, size: sizeArgs })
}
</script>
