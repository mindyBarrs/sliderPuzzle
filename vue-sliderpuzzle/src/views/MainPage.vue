<template>
  <PuzzleBoard ref="puzzleBoard" v-show="playing" />

  <StartPanel @gameStart="createPuzzle" v-show="!playing" />
</template>

<script lang="ts">
/* COMPONENTS */
import PuzzleBoard from '@/components/Puzzle/PuzzleBoard.vue'
import StartPanel from '@/components/StartPanel.vue'

export default {
  name: 'app',
  components: {
    PuzzleBoard,
    StartPanel,
  },
  data() {
    return {
      playing: false,
    }
  },
  methods: {
    createPuzzle(...args) {
      this.playing = true
      this.$refs.puzzleBoard.createPuzzle(...args)
    },
  },
}
</script>
