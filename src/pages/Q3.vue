<template>
  <div class="game">
    <div class="maze-wrapper">
      <div
          class="maze-grid"
          :style="{
          width: gridWidth + 'px',
          height: gridHeight + 'px'
        }"
      >
        <div
            v-for="(row, y) in maze"
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
            src="../assets/bip.png"
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

    <!-- Модальное окно для уведомлений -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const tileSize = 100 // 100x100 pixels per block
const mazeWidth = 14 // 14 blocks wide
const mazeHeight = 7 // 9 blocks tall
const gridWidth = computed(() => tileSize * mazeWidth)
const gridHeight = computed(() => tileSize * mazeHeight)

// Maze definition:
// 0 - empty space
// 1 - wall
// 2 - start position
// 3 - checkpoint
// 4 - finish
const maze = [
  [1,2,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,1,0,1,0,1],
  [1,1,1,1,0,0,0,0,0,1,0,1,0,1],
  [1,0,0,0,0,0,1,1,0,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,1,4,1],
  [1,3,1,0,0,0,0,1,1,1,1,1,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

const posX = ref(1)
const posY = ref(1)
const targetX = ref(1)
const targetY = ref(1)
const rotation = ref(0) // Начальный поворот - носом вверх
const targetRotation = ref(0)
const passedCheckpoint = ref(false)
const commandQueue = ref([])
const carVisible = computed(() => true)
const isMoving = ref(false)
const showModal = ref(false)
const modalMessage = ref('')

const cellStyle = computed(() => ({
  width: tileSize + 'px',
  height: tileSize + 'px'
}))

const carStyle = computed(() => ({
  top: (posY.value * tileSize) + 'px',
  left: (posX.value * tileSize) + 'px',
  width: tileSize + 'px',
  height: tileSize + 'px',
  transform: `rotate(${rotation.value}deg)`,
  transition: 'transform 0.3s ease-out, left 0.3s ease-out, top 0.3s ease-out'
}))

function cellClass(cell) {
  return {
    0: 'empty',
    1: 'wall',
    2: 'start',
    3: 'checkpoint',
    4: 'finish'
  }[cell]
}

function isCarHere(x, y) {
  return Math.round(posX.value) === x && Math.round(posY.value) === y
}

function addCommand(cmd) {
  commandQueue.value.push(cmd)
}

function reset() {
  findStartPosition()
  commandQueue.value = []
  isMoving.value = false
}

function showNotification(message) {
  modalMessage.value = message
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function findStartPosition() {
  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if (maze[y][x] === 2) {
        posX.value = x
        posY.value = y
        targetX.value = x
        targetY.value = y
        rotation.value = 0 // Носом вверх
        targetRotation.value = 0
        passedCheckpoint.value = false
        return
      }
    }
  }
}

async function start() {
  if (isMoving.value) return

  // Сброс позиции перед началом движения
  findStartPosition()
  await new Promise(resolve => setTimeout(resolve, 100)) // Небольшая задержка для сброса

  isMoving.value = true
  await execute([...commandQueue.value])
  isMoving.value = false
}

async function execute(queue) {
  if (queue.length === 0) return

  const cmd = queue.shift()

  // Set target rotation based on command
  if (cmd === 'up') {
    targetRotation.value = 0
  } else if (cmd === 'down') {
    targetRotation.value = 180
  } else if (cmd === 'left') {
    targetRotation.value = 270
  } else if (cmd === 'right') {
    targetRotation.value = 90
  }

  // Wait for rotation to complete
  rotation.value = targetRotation.value
  await new Promise(resolve => setTimeout(resolve, 300))

  // Calculate movement path
  let path = []
  let currentX = targetX.value
  let currentY = targetY.value

  while (true) {
    let nextX = currentX
    let nextY = currentY

    if (cmd === 'up') {
      nextY--
    } else if (cmd === 'down') {
      nextY++
    } else if (cmd === 'left') {
      nextX--
    } else if (cmd === 'right') {
      nextX++
    }

    // Check boundaries
    if (nextX < 0 || nextY < 0 || nextX >= mazeWidth || nextY >= mazeHeight) {
      break
    }

    // Check if next cell is a wall
    if (maze[nextY][nextX] === 1) {
      break
    }

    // Add to path
    path.push({ x: nextX, y: nextY })
    currentX = nextX
    currentY = nextY
  }

  if (path.length === 0) {
    // No movement possible in this direction
    await execute(queue)
    return
  }

  // Move through the path
  for (const point of path) {
    targetX.value = point.x
    targetY.value = point.y

    // Animate movement
    const steps = 10
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      posX.value = posX.value + (targetX.value - posX.value) * progress
      posY.value = posY.value + (targetY.value - posY.value) * progress
      await new Promise(resolve => setTimeout(resolve, 30))
    }

    // Check current cell
    const cell = maze[point.y][point.x]

    if (cell === 3) {
      passedCheckpoint.value = true
    } else if (cell === 4) {
      if (passedCheckpoint.value) {
        showNotification('ПОБЕДА! Вы успешно прошли уровень!')
        reset()
        return
      } else {
        showNotification('Нужно сначала проехать через чекпоинт!')
        reset()
        return
      }
    }
  }

  // Continue with next command
  await execute(queue)
}

// Initialize car position
findStartPosition()
</script>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  position: relative;
}

.maze-wrapper {
  border: 4px solid #333;
  overflow: hidden;
}

.maze-grid {
  position: relative;
  background-color: #f0f0f0;
}

.row {
  display: flex;
}

.cell {
  box-sizing: border-box;
  border: 1px solid #000000;
}

.empty {
  background-color: white;
}

.wall {
  background-color: #333;
}

.start {
  background-color: #84ff7e;
}

.checkpoint {
  background-color: #ffff84;
}

.finish {
  background-color: #ffaaaa;
}

.car {
  position: absolute;
  transition: all 0.3s ease;
  z-index: 10;
  transform-origin: center;
}

.controls {
  display: flex;
  gap: 10px;
}

.controls button {
  padding: 10px 15px;
  font-size: 18px;
  cursor: pointer;
}

.queue {
  font-size: 18px;
  margin-top: 10px;
}

/* Стили для модального окна */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 80%;
}

.modal-content button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #45a049;
}
</style>