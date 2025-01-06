<template>
  <PuzzleBoard ref="puzzleBoard" v-show="playing" />

  <!-- Wrap StartPanel in a div -->
  <div v-show="!playing">
    <StartPanel @gameStart="createPuzzle" />
  </div>
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
      console.log('hey')
      this.playing = true
      this.$refs.puzzleBoard.createPuzzle(...args)
    },
  },
}
</script>
