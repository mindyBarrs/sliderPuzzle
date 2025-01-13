<template>
  <main class="board">
    <!-- Puzzle Board -->
    <div class="puzzle-board">
      <div class="frame-wrapper" :style="frameSize">
        <h2 v-if="isSolved" class="win">You Win!</h2>

        <div class="frame" :style="frameSize">
          <PuzzleTile v-for="tile in tiles" :key="tile.position" :tile="tile" @move="moveTile" />
        </div>
      </div>

      <!-- Image Preview -->
      <div class="preview">
        <h3>Image Preview</h3>
        <img v-if="image" :src="image" :alt="imageAlt" />
      </div>
    </div>

    <!-- Controls -->
    <div class="controls">
      <button type="button" class="shuffle" @click="shuffleTiles" ref="reshuffleBtn">
        Reshuffle Puzzle
      </button>
      <button type="button" class="restart" @click="restartGame" ref="newGameBtn">New Game</button>
    </div>
  </main>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { sample } from 'lodash'
import { storeToRefs } from 'pinia'

import PuzzleTile from './PuzzleTile.vue'

import { useImageStore } from '@/stores/imageStore'

import monksImage from '@/assets/monks.jpg'

export default {
  components: { PuzzleTile },

  setup() {
    const image = ref('')
    const imageAlt = ref('')
    const size = ref({ horizontal: 4, vertical: 4 })
    const tiles = ref<
      {
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
      }[]
    >([])
    const tileSize = ref({ width: 0, height: 0 })

    const imageStore = useImageStore()
    const { randomImage } = storeToRefs(imageStore)
    const { getRandomImage } = imageStore

    // Frame size calculation
    const frameSize = computed(() => ({
      width: `${tileSize.value.width * size.value.horizontal}px`,
      height: `${tileSize.value.height * size.value.vertical}px`,
    }))

    // Check if the puzzle is solved
    const isSolved = computed(() => {
      return tiles.value.every((tile) => tile.styles.order === tile.position)
    })

    // Create a new puzzle
    function createPuzzle({
      image: img,
      size: newSize,
    }: {
      image: { urls: { small: string }; alt_description: string }
      size: { horizontal: number; vertical: number }
    }) {
      image.value = (img?.urls.small || monksImage) as string
      imageAlt.value = img?.alt_description || 'Default image'
      size.value = newSize

      const imgElement = new Image()
      imgElement.onload = () => {
        tileSize.value.width = Math.floor(imgElement.width / size.value.horizontal)
        tileSize.value.height = Math.floor(imgElement.height / size.value.vertical)
        generatePuzzleTiles()
        shuffleTiles()
      }
      imgElement.src = image.value as unknown as string
    }

    // Generate puzzle tiles
    function generatePuzzleTiles() {
      tiles.value = Array.from({ length: size.value.horizontal * size.value.vertical }, (_, i) => ({
        styles: {
          background: i === 0 ? 'transparent' : `url(${image.value})`,
          backgroundPositionX: `-${(i % size.value.horizontal) * tileSize.value.width}px`,
          backgroundPositionY: `-${Math.floor(i / size.value.horizontal) * tileSize.value.height}px`,
          width: `${tileSize.value.width}px`,
          height: `${tileSize.value.height}px`,
          order: i,
        },
        position: i,
        isEmpty: i === 0,
      }))
    }

    // Shuffle tiles
    function shuffleTiles() {
      for (let i = 0; i < tiles.value.length * 5; i++) {
        const emptyTile = tiles.value.find((t) => t.isEmpty)
        const movableTiles = tiles.value.filter((t) =>
          getAdjacentOrders(emptyTile).includes(t.styles.order),
        )

        switchTiles(emptyTile, sample(movableTiles))
      }
    }

    // Move a tile
    function moveTile(tile: {
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
    }) {
      if (tile.isEmpty) return
      const targetTile = tiles.value.find(
        (t) => t.isEmpty && getAdjacentOrders(tile).includes(t.styles.order),
      )
      if (targetTile) switchTiles(targetTile, tile)
    }

    // Switch two tiles
    function switchTiles(
      tileA:
        | {
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
        | undefined,
      tileB:
        | {
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
        | undefined,
    ) {
      if (tileA && tileB) {
        ;[tileA.styles.order, tileB.styles.order] = [tileB.styles.order, tileA.styles.order]
      }
    }

    // Get adjacent tile positions
    function getAdjacentOrders(
      tile:
        | {
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
        | undefined,
    ) {
      if (!tile) return []
      const pos = tile.styles.order
      return [
        pos % size.value.horizontal ? pos - 1 : null,
        (pos + 1) % size.value.horizontal ? pos + 1 : null,
        pos - size.value.horizontal,
        pos + size.value.horizontal,
      ].filter(Boolean)
    }

    // Restart the game
    async function restartGame() {
      await getRandomImage()

      createPuzzle({
        image: {
          urls: { small: randomImage.value?.urls.small || monksImage },
          alt_description: randomImage.value?.alt_description || 'Default description',
        },
        size: size.value,
      })
    }

    return {
      image,
      imageAlt,
      tiles,
      frameSize,
      isSolved,
      createPuzzle,
      shuffleTiles,
      moveTile,
      restartGame,
    }
  },
}
</script>

<style lang="scss">
.puzzle-board {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  gap: 25px;
}

.frame-wrapper {
  margin-right: 50px;
  position: relative;
  box-shadow: 0 0 0px 10px;

  .original {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  h2.win {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    color: $white;
    font-size: 40px;
    margin: 0 0;
    background: rgba(97, 155, 138, 0.7);
    text-transform: uppercase;
  }
}

.frame {
  display: flex;
  flex-wrap: wrap;
}

.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  img {
    max-width: 100%;
    height: auto;
  }
}

.controls {
  margin-top: 30px;

  .restart {
    background: $lite-green;
    display: inline-block;
    text-decoration: none;
    padding: 12px 12px;
    color: #000;
    border-radius: 3px;
  }

  .shuffle {
    background: $orange;
    display: inline-block;
    text-decoration: none;
    padding: 12px 12px;
    color: #000;
    border-radius: 3px;
    margin-right: 15px;
  }
}
</style>
