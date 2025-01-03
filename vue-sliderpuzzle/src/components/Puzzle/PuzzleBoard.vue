<template>
  <main class="board">
    <div class="puzzle-board">
      <div class="frame-wrapper" :style="frameSize">
        <h2 v-if="isValid" class="win">You Win!</h2>

        <div class="frame" :style="frameSize">
          <PuzzleTile
            v-for="tile in tiles"
            :key="tile.position"
            :tile="tile"
            @moving="moveTile"
            ref="tiles"
          />
        </div>
      </div>

      <div class="preview">
        <h3>Image Preview</h3>

        <img :alt="imageAlt" :src="image" v-if="image" />
      </div>
    </div>

    <div class="controls">
      <button class="shuffle" @click.prevent="shuffleTiles">Reshuffle Puzzle</button>

      <button class="restart" @click.prevent="restart">New Game</button>
    </div>
  </main>
</template>

<script lang="ts">
/* LIBRARY
 * Url: https://lodash.com/docs/4.17.15#sample
 * The reason I used to was to simplify the picking of
 * a random item from the collection of movable tiles.
 */
import sample from 'lodash/sample'

/* COMPONENTS */
import PuzzleTile from './PuzzleTile.vue'

export default {
  components: { PuzzleTile },
  data() {
    return {
      image: '',
      imageAlt: '',
      size: {
        horizontal: 4,
        vertical: 4,
      },
      tiles: [],
      tileSize: {
        width: 0,
        height: 0,
      },
    }
  },
  computed: {
    frameSize() {
      return {
        width: `${this.tileSize.width * this.size.horizontal}px`,
        height: `${this.tileSize.height * this.size.vertical}px`,
      }
    },
    /**
     * The total number of tiles in the current board.
     * @return {Number}
     */
    totalTiles() {
      return this.size.horizontal * this.size.vertical
    },
    /**
     * Determine if the current board is valid (solved).
     * @return {boolean}
     */
    isValid() {
      if (!this.tiles.length) {
        return false
      }
      for (let i = 0; i < this.totalTiles; ++i) {
        if (this.tiles[i].styles.order !== this.tiles[i].position) {
          return false
        }
      }
      return true
    },
  },
  methods: {
    // Creates Puzzle Board
    createPuzzle({ image, size }) {
      this.size = size
      this.image = image.urls.small
      this.imageAlt = image.alt_description

      const img = new Image()

      img.onload = () => {
        this.tileSize.width = Math.floor(img.width / size.horizontal)
        this.tileSize.height = Math.floor(img.height / size.vertical)

        this.generatePuzzleTiles()
        this.shuffleTiles()
      }

      img.src = this.image
    },
    // Generate Puzzle tiles
    generatePuzzleTiles() {
      this.tiles = []

      for (let i = 0; i < this.totalTiles; ++i) {
        this.tiles.push({
          styles: {
            background: i === 0 ? 'transparent' : `url(${this.image})`,
            backgroundPositionX: `-${(i % this.size.horizontal) * this.tileSize.width}px`,
            backgroundPositionY: `-${Math.floor(i / this.size.horizontal) * this.tileSize.height}px`,
            width: `${this.tileSize.width}px`,
            height: `${this.tileSize.height}px`,
            order: i,
          },
          position: i,
          isEmpty: i === 0,
        })
      }
    },
    // Suffle Puzzle Tiles
    shuffleTiles() {
      for (let i = 0, j = this.totalTiles * 5; i < j; ++i) {
        const emptyTile = this.tiles.find((t) => t.isEmpty)

        const movableTiles = this.tiles.filter((t) => {
          return this.getAdjacentOrders(emptyTile).indexOf(t.styles.order) > -1
        })

        this.switchTiles(emptyTile, sample(movableTiles))
      }
    },
    // Move Puzzle Tile to free space
    moveTile(tile) {
      if (tile.isEmpty) {
        return
      }

      const target = this.tiles.find((t) => {
        return t.isEmpty && this.getAdjacentOrders(tile).indexOf(t.styles.order) > -1
      })

      if (target) {
        this.switchTiles(target, tile)
      }
    },
    // Switch Puzzle Tiles
    switchTiles(a, b) {
      ;[a.styles.order, b.styles.order] = [b.styles.order, a.styles.order]
    },
    // Get Dirrections of Adjecent Puzzle Tiles
    getAdjacentOrders(tile) {
      const pos = tile.styles.order
      return [
        pos % this.size.horizontal ? pos - 1 : null,
        (pos + 1) % this.size.horizontal ? pos + 1 : null,
        pos - this.size.horizontal,
        pos + this.size.horizontal,
      ]
    },
    /* Restart Puzzle */
    restart() {
      this.$emit('restart')
    },
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
    color: #fff;
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
