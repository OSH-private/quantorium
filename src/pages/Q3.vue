<template>
  <div class="container">
    <img src="../assets/qu3.svg" alt="Фон" class="background-img" />

    <!-- Отдельное отображение bat.svg -->
    <img
        v-if="!passedCheckpoint"
        src="../assets/bat.svg"
        class="global-checkpoint-img"
        :style="checkpointStyle"
    />

    <div class="queue-display">
      <div
          class="queue-content"
          ref="queueContainer"
          @wheel="handleScroll"
          @mousedown="startDrag"
          @mousemove="handleDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
      >
        <div
            v-for="(cmd, index) in commandQueue"
            :key="index"
            class="command-icon"
            :class="{ 'fade-out': index < currentCommandIndex }"
            :style="{ transitionDelay: (index * 0.1) + 's' }"
        >
          <img :src="getCommandImage(cmd)" :alt="cmd" />
        </div>
      </div>
      <div class="fade-overlay"></div>
    </div>

    <button @click="start" class="start-btn">Старт</button>

    <div class="maze-grid" :style="{ width: gridWidth + 'px', height: gridHeight + 'px' }">
      <div v-for="(row, y) in maze" :key="'row-' + y" class="row">
        <div
            v-for="(cell, x) in row"
            :key="'cell-' + y + '-' + x"
            :class="['cell', cellClass(cell), isCarHere(x, y) ? 'car-cell' : '']"
            :style="cellStyle"
        />
      </div>

      <!-- Машинка -->
      <img
          v-if="carVisible"
          :src="carImage"
          alt="Car"
          class="car"
          :style="carStyle"
      />
    </div>

    <div class="controls-panel">
      <button @click="addCommand('up')">↑</button>
      <button @click="addCommand('down')">↓</button>
      <button @click="addCommand('left')">←</button>
      <button @click="addCommand('right')">→</button>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

// Командные изображения
import upImage from '../assets/cn1.svg'
import downImage from '../assets/cn2.svg'
import leftImage from '../assets/cn3.svg'
import rightImage from '../assets/cn4.svg'

// Машинки
import carImageBefore from '../assets/car.svg'
import carImageAfter from '../assets/car2.svg'

// Размеры
const tileSize = 100
const mazeWidth = 12
const mazeHeight = 7
const gridWidth = computed(() => tileSize * mazeWidth)
const gridHeight = computed(() => tileSize * mazeHeight)

// Лабиринт
const maze = [
  [1,0,1,1,0,0,0,1,1,0,0,0],
  [1,2,0,0,0,0,1,1,1,0,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0],
  [1,3,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,4,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0]
]

const posX = ref(1)
const posY = ref(1)
const targetX = ref(1)
const targetY = ref(1)
const rotation = ref(0)
const targetRotation = ref(0)
const passedCheckpoint = ref(false)
const commandQueue = ref([])
const isMoving = ref(false)
const carVisible = computed(() => true)
const showModal = ref(false)
const modalMessage = ref('')
const currentCommandIndex = ref(0)

const queueContainer = ref(null)
const isDragging = ref(false)
const startY = ref(0)
const scrollTop = ref(0)

const carImage = computed(() => passedCheckpoint.value ? carImageAfter : carImageBefore)

// Позиция чекпоинта
const checkpointPosition = computed(() => {
  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if (maze[y][x] === 3) {
        return { x, y }
      }
    }
  }
  return { x: -1, y: -1 }
})

const checkpointStyle = computed(() => ({
  top: (120 + checkpointPosition.value.y * tileSize) + 'px',
  left: (570 + checkpointPosition.value.x * tileSize) + 'px',
  width: tileSize + 'px',
  height: tileSize + 'px'
}))

const cellStyle = computed(() => ({
  width: tileSize + 'px',
  height: tileSize + 'px'
}))

const carStyle = computed(() => ({
  top: (posY.value * tileSize) + 'px',
  left: (posX.value * tileSize) + 'px',
  width: tileSize + 'px',
  height: tileSize + 'px',
  transform: 'rotate(' + rotation.value + 'deg)',
  transition: 'transform 0.3s ease-out, left 0.3s ease-out, top 0.3s ease-out'
}))

function getCommandImage(cmd) {
  return {
    'up': upImage,
    'down': downImage,
    'left': leftImage,
    'right': rightImage
  }[cmd]
}

function handleScroll(e) {
  if (queueContainer.value) queueContainer.value.scrollTop += e.deltaY
}

function startDrag(e) {
  isDragging.value = true
  startY.value = e.pageY - queueContainer.value.offsetTop
  scrollTop.value = queueContainer.value.scrollTop
}

function handleDrag(e) {
  if (!isDragging.value) return
  const y = e.pageY - queueContainer.value.offsetTop
  const walk = (y - startY.value) * 2
  queueContainer.value.scrollTop = scrollTop.value - walk
}

function endDrag() {
  isDragging.value = false
}

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
  nextTick(() => {
    if (queueContainer.value) {
      queueContainer.value.scrollTop = queueContainer.value.scrollHeight
    }
  })
}

function reset() {
  findStartPosition()
  commandQueue.value = []
  isMoving.value = false
  currentCommandIndex.value = 0
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
        rotation.value = 0
        targetRotation.value = 0
        passedCheckpoint.value = false
        return
      }
    }
  }
}

async function start() {
  if (isMoving.value) return
  findStartPosition()
  await new Promise(resolve => setTimeout(resolve, 100))
  isMoving.value = true
  currentCommandIndex.value = 0
  await execute([...commandQueue.value])
  isMoving.value = false
}

async function execute(queue) {
  if (queue.length === 0) {
    commandQueue.value = []
    return
  }

  const cmd = queue.shift()
  targetRotation.value = {
    'up': 0,
    'right': 90,
    'down': 180,
    'left': 270
  }[cmd]

  rotation.value = targetRotation.value
  await new Promise(resolve => setTimeout(resolve, 300))

  let path = []
  let currentX = targetX.value
  let currentY = targetY.value

  while (true) {
    let nextX = currentX
    let nextY = currentY

    if (cmd === 'up') nextY--
    else if (cmd === 'down') nextY++
    else if (cmd === 'left') nextX--
    else if (cmd === 'right') nextX++

    if (nextX < 0 || nextY < 0 || nextX >= mazeWidth || nextY >= mazeHeight) break
    if (maze[nextY][nextX] === 1) break

    path.push({ x: nextX, y: nextY })
    currentX = nextX
    currentY = nextY
  }

  if (path.length === 0) {
    currentCommandIndex.value++
    await execute(queue)
    return
  }

  for (const point of path) {
    targetX.value = point.x
    targetY.value = point.y

    const steps = 10
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      posX.value = posX.value + (targetX.value - posX.value) * progress
      posY.value = posY.value + (targetY.value - posY.value) * progress
      await new Promise(resolve => setTimeout(resolve, 30))
    }

    const cell = maze[point.y][point.x]
    if (cell === 3) {
      passedCheckpoint.value = true
    } else if (cell === 4) {
      if (passedCheckpoint.value) {
        showNotification('ПОБЕДА! Вы успешно прошли уровень!')
      } else {
        showNotification('Нужно сначала проехать через чекпоинт!')
      }
      reset()
      return
    }
  }

  currentCommandIndex.value++
  await execute(queue)

}

findStartPosition()

</script>

<style scoped>
.container {
  position: relative;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  margin: 0 auto;
  user-select: none;
}

.background-img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 15;
  pointer-events: none;
}

.maze-grid {
  position: absolute;
  top: 126px;
  left: 570px;
  background: transparent;
  border: none;
  z-index: 16;
}

.row {
  display: flex;
  user-select: none;
}

.cell {
  box-sizing: border-box;
  border: none;
  user-select: none;
}

.empty, .wall, .start, .checkpoint, .finish {
  background-color: transparent;
  border: none;
}

.car {
  position: absolute;
  transition: all 0.3s ease;
  z-index: 20;
  transform-origin: center;
  user-select: none;
}

.global-checkpoint-img {
  position: absolute;
  z-index: 25;
  animation: pulse 1.2s infinite ease-in-out;
  pointer-events: none;
}

.queue-display {
  mask-image: linear-gradient(to top, transparent 0%, black 3%, black 98%, transparent 100%);
  position: absolute;
  top: 126px;
  left: 200px;
  width: 300px;
  height: 720px;
  z-index: 17;
  background: transparent;
  overflow: hidden;
}

.queue-content {
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 10px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 10px;
  box-sizing: border-box;
}

.queue-content::-webkit-scrollbar {
  display: none;
}

.command-icon {
  width: 285px;
  height: 92px;
  flex-shrink: 0;
  pointer-events: none;
  user-select: none;
  opacity: 1;
  transition: opacity 0.3s ease-out;
}

.command-icon.fade-out {
  opacity: 0;
}

.command-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

.fade-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  pointer-events: none;
  z-index: 11;
}

.start-btn {
  position: absolute;
  top: 861px;
  left: 146px;
  height: 106px;
  width: 357px;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  z-index: 10;
  user-select: none;
}

.start-btn:hover {
  background: #45a049;
}

.controls-panel {
  position: absolute;
  top: 870px;
  left: 565px;
  display: flex;
  gap: 23px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid #ccc;
  z-index: 10;
  user-select: none;
}

.controls-panel button {
  height: 92px;
  width: 285px;
  cursor: pointer;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 60px;
  user-select: none;
}

.controls-panel button:hover {
  background: #e0e0e0;
}

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
  user-select: none;
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

@keyframes pulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(0.9);
    opacity: 0.8;
  }
}
</style>