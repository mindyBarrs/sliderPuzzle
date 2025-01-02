<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue'
import sample from 'lodash/sample'

/* COMPONENTS */
import PuzzleTile from './PuzzleTile.vue'

/* TYPES */
interface Tile {
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

interface BoardSize {
  horizontal: number
  vertical: number
}

/* PROPS */
defineProps({
  image: {
    type: String,
    default: '@/assets/monks.jpg',
  },
})

const size = ref<BoardSize>({ horizontal: 4, vertical: 4 })
const tiles = ref<Tile[]>([])
const tileSize = ref({ width: 0, height: 0 })

/* COMPUTED */
const frameSize = computed(() => ({
  width: `${tileSize.value.width * size.value.horizontal}px`,
  height: `${tileSize.value.height * size.value.vertical}px`,
}))

const totalTiles = computed(() => size.value.horizontal * size.value.vertical)

const valid = computed(() => {
  return tiles.value.every((tile) => tile.styles.order === tile.position)
})

/* METHODS */
function createPuzzle(imageUrl: string) {
  const img = new Image()
  img.onload = () => {
    tileSize.value.width = Math.floor(img.width / size.value.horizontal)
    tileSize.value.height = Math.floor(img.height / size.value.vertical)

    generatePuzzleTiles()
    shuffleTiles()
  }
  img.src = imageUrl
}

function generatePuzzleTiles() {
  tiles.value = Array.from({ length: totalTiles.value }, (_, i) => ({
    styles: {
      background: i === 0 ? 'transparent' : `url(${image})`,
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

function shuffleTiles() {
  for (let i = 0, j = totalTiles.value * 5; i < j; ++i) {
    const emptyTile = tiles.value.find((t) => t.isEmpty)!
    const movableTiles = tiles.value.filter((t) =>
      getAdjacentOrders(emptyTile).includes(t.styles.order),
    )
    if (movableTiles.length) {
      switchTiles(emptyTile, sample(movableTiles)!)
    }
  }
}

function moveTile(tile: Tile) {
  if (tile.isEmpty) return

  const target = tiles.value.find(
    (t) => t.isEmpty && getAdjacentOrders(tile).includes(t.styles.order),
  )

  if (target) {
    switchTiles(target, tile)
  }
}

function switchTiles(a: Tile, b: Tile) {
  ;[a.styles.order, b.styles.order] = [b.styles.order, a.styles.order]
}

function getAdjacentOrders(tile: Tile): (number | null)[] {
  const pos = tile.styles.order
  return [
    pos % size.value.horizontal ? pos - 1 : null,
    (pos + 1) % size.value.horizontal ? pos + 1 : null,
    pos - size.value.horizontal,
    pos + size.value.horizontal,
  ]
}

function restart() {
  createPuzzle(image)
}

onMounted(() => {
  createPuzzle(image)
})
</script>

<template>
  <div class="board">
    <div class="puzzle-board">
      <div class="frame-wrapper" :style="frameSize">
        <p v-if="valid" class="win">You Win!</p>

        <div class="frame" :style="frameSize">
          <PuzzleTile v-for="tile in tiles" :key="tile.position" :tile="tile" @moving="moveTile" />
        </div>
      </div>

      <div class="preview">
        <h3>Image Preview</h3>
        <img alt="slider puzzle image" :src="image" v-if="image" />
      </div>
    </div>

    <div class="controls">
      <button class="shuffle" @click="shuffleTiles">Reshuffle Puzzle</button>
      <button class="restart" @click="restart">New Game</button>
    </div>
  </div>
</template>

<style scoped>
.puzzle-board {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
}

.frame-wrapper {
  margin: 0 50px;
  position: relative;
  box-shadow: 0 0 10px #000;
}

.win {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(43, 181, 82, 0.7);
  color: #fff;
  font-size: 2rem;
  text-transform: uppercase;
}

.frame {
  display: flex;
  flex-wrap: wrap;
  background: #612211 url('../assets/wood.jpg');
  background-size: cover;
}

.controls {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 1rem;
}

.shuffle {
  background: #dcedc1;
  color: #000;
}

.restart {
  background: #a8e6cf;
  color: #000;
}
</style>
