<template>
  <div class="game">
    <div class="maze-wrapper">
      <div
          class="maze-grid"
          :style="{
          width: gridSize + 'px',
          height: gridSize + 'px'
        }"
      >
        <div
            v-for="(row, y) in visibleMaze"
            :key="y"
            class="row"
        >
          <div
              v-for="(cell, x) in row"
              :key="x"
              :class="['cell', cellClass(cell), isCarHere(x, y) ? 'car-cell' : '']"
              :style="cellStyle"
          />
        </div>
        <img
            v-if="carVisible"
            src="../assets/bip.webp"
            alt="Car"
            class="car"
            :style="carStyle"
        />
      </div>
    </div>

    <div class="controls">
      <button @click="addCommand('up')">↑</button>
      <button @click="addCommand('down')">↓</button>
      <button @click="addCommand('left')">←</button>
      <button @click="addCommand('right')">→</button>
      <button @click="start">Старт</button>
      <button @click="reset">Сброс</button>
    </div>

    <div class="queue">Очередь: {{ commandQueue.join(', ') }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 🔧 Меняй только эту переменную для масштабирования
const scale = 1.6

const baseTile = 50
const tileSize = computed(() => baseTile * scale)
const viewSize = 10
const gridSize = computed(() => tileSize.value * viewSize)

const baseMaze = [
  [1,0,1,1,1,1,1,1,1,1],
  [1,2,0,0,1,0,0,0,3,1],
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,4,1,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
]

const posX = ref(1)
const posY = ref(1)
const rotation = ref(0)
const passedCheckpoint = ref(false)

const commandQueue = ref([])

const viewStartX = computed(() => Math.max(0, Math.min(posX.value - 5, 10 - viewSize)))
const viewStartY = computed(() => Math.max(0, Math.min(posY.value - 5, 10 - viewSize)))

const visibleMaze = computed(() =>
    baseMaze.slice(viewStartY.value, viewStartY.value + viewSize).map(row =>
        row.slice(viewStartX.value, viewStartX.value + viewSize)
    )
)

const carX = computed(() => (posX.value - viewStartX.value) * tileSize.value)
const carY = computed(() => (posY.value - viewStartY.value) * tileSize.value)
const carVisible = computed(() => true)

const cellStyle = computed(() => ({
  width: tileSize.value + 'px',
  height: tileSize.value + 'px'
}))

const carStyle = computed(() => ({
  top: carY.value + 'px',
  left: carX.value + 'px',
  width: tileSize.value + 'px',
  height: tileSize.value + 'px',
  transform: `rotate(${rotation.value}deg)`,
}))

function addCommand(cmd) {
  commandQueue.value.push(cmd)
}

function reset() {
  posX.value = 1
  posY.value = 1
  rotation.value = 0
  passedCheckpoint.value = false
  commandQueue.value = []
}

function start() {
  execute([...commandQueue.value])
}

function execute(queue) {
  if (queue.length === 0) return

  const cmd = queue.shift()
  let x = posX.value
  let y = posY.value

  if (cmd === 'up') {
    y--
    rotation.value = 90
  } else if (cmd === 'down') {
    y++
    rotation.value = 270
  } else if (cmd === 'left') {
    x--
    rotation.value = 0
  } else if (cmd === 'right') {
    x++
    rotation.value = 180
  }

  if (x < 0 || y < 0 || x >= 10 || y >= 10) {
    alert('КУДА ХУЯРИШЬ БЛЯ ТОРМОЗИ!')
    reset()
    return
  }

  const cell = baseMaze[y][x]

  if (cell === 1) {
    alert('ПИЗДЕЦ ЯРИК ВОДИЛА')
    reset()
    return
  }

  posX.value = x
  posY.value = y

  if (cell === 4) {
    passedCheckpoint.value = true
  }

  if (cell === 3) {
    if (passedCheckpoint.value) {
      alert('ЗАЕБИСЬ')
      Perehod1()
    } else {
      alert('ТЫ ЧЕ ДАУН? А НЕ ЧЕ ТОЧНО НАДА СНАЧАЛА КОНТРОЛЬНУЮ ТОЧКУ ПРОЙТИ?')
      reset()
      return
    }
    reset()
    return
  }

  setTimeout(() => execute(queue), 300)
}

function Perehod1() {
  router.push({ path: '/roadmap' })
}

function isCarHere(x, y) {
  return x + viewStartX.value === posX.value && y + viewStartY.value === posY.value
}

function cellClass(value) {
  return {
    0: 'empty',
    1: 'wall',
    2: 'start',
    3: 'end',
    4: 'checkpoint'
  }[value]
}
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.game {
  min-height: 100vh;
  width: 100vw;
  background: url('../assets/fonroad.png') center center no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px; /* отступ сверху */
  box-sizing: border-box;
}

.maze-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
}

.maze-grid {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 2px solid #444;
  margin-bottom: 1rem;
}

.row {
  display: flex;
}

.cell {
  box-sizing: border-box;
  border: 1px solid #aaa;
}

.empty {
  background-color: #fff;
}

.wall {
  background-color: #53a3bd;
}

.start {
  background-color: #0f0;
}

.end {
  background-color: #f00;
}

.checkpoint {
  background-color: #e8c43b;
}

.car-cell {
  background-color: rgba(0, 0, 255, 0.15);
}

.car {
  position: absolute;
  transition: top 0.3s, left 0.3s, transform 0.2s ease;
  pointer-events: none;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.controls button {
  padding: 8px 14px;
  font-size: 18px;
}

.queue {
  font-family: monospace;
}
</style>