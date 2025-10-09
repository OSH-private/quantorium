<template>
  <div class="container" @click="handleClick">
    <div @click="Back" class="back_btn"><p class="text">Назад</p></div>

    <img v-if="showCharacter"
         class="character-behind"
         :class="{ exit: isExiting }"
         :src="currentEmotion"
         alt="Персонаж"
    />
    <div v-if="showCharacter" class="dialogue-container" :class="{ exit: isExiting }">
      <p>{{ typedText }}</p>
    </div>

    <div class="map-wrapper">
      <div class="controls-panel">
        <button @click="addCommand('up')">↑</button>
        <button @click="addCommand('down')">↓</button>
        <button @click="addCommand('left')">←</button>
        <button @click="addCommand('right')">→</button>
      </div>
    <img src="/public/car_without_back.png" alt="Фон" class="background-img" />

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
            @click.stop.prevent="removeCommand(index)"
        >
          <img :src="getCommandImage(cmd)" :alt="cmd" />
        </div>
      </div>
      <div class="fade-overlay"></div>
    </div>

    <button @click="start" class="start-btn">Старт</button>

      <div class="maze-grid">
        <template v-for="(row, y) in maze" :key="'row-'+y">
          <div
              v-for="(cell, x) in row"
              :key="'cell-'+y+'-'+x"
              :class="['cell', cellClass(cell)]"
          />
        </template>
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



    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">OK</button>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import e1 from "../assets/e1.svg";
import e2 from "../assets/e2.svg";
import e3 from "../assets/e3.svg";
import e4 from "../assets/e4.svg";

// Командные изображения
import upImage from '../assets/cn1.svg'
import downImage from '../assets/cn2.svg'
import leftImage from '../assets/cn3.svg'
import rightImage from '../assets/cn4.svg'

// Машинки
import carImageBefore from '../assets/car.svg'
import carImageAfter from '../assets/car2.svg'
import {router} from "../router/index.js";

const Back = function (){
  router.push({ path: "/roadmap" });
}

// Размеры

const mazeWidth = 12
const mazeHeight = 7

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
const startX= ref(0)
const scrollTop = ref(0)

const carImage = computed(() => passedCheckpoint.value ? carImageAfter : carImageBefore)

// Позиция чекпоинта
const checkpointPosition = computed(() => {
  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if (maze[y][x] === 3) return { x, y }
    }
  }
  return { x: -1, y: -1 }
})

const checkpointStyle = computed(() => ({
  top: (12 + checkpointPosition.value.y * (63 / mazeHeight)) + '%',
  left: (26 + checkpointPosition.value.x * (63 / mazeHeight)) + '%',
  width: (63 / mazeWidth) + '%',
  height: (63 / mazeHeight) + '%',
}))

const carStyle = computed(() => ({
  top: (12 + posY.value * (63 / mazeHeight)) + '%',
  left: (29.5 + posX.value * (63 / mazeWidth)) + '%',
  width: (63 / mazeWidth) + '%',
  height: (63 / mazeHeight) + '%',
  transform: `rotate(${rotation.value}deg)`,
  transition: 'transform 0.3s ease-out, left 0.3s ease-out, top 0.3s ease-out'
}))

const removeCommand = (index) => {
  commandQueue.value.splice(index, 1)

  // Подкрутить прокрутку после удаления (опционально)
  nextTick(() => {
    if (queueContainer.value) {
      queueContainer.value.scrollTop = queueContainer.value.scrollHeight
    }
  })
}

const dialogueIntro = [
  { text: "Ого, мы едем по заводу!", emotion: e4 },
  { text: `Чтобы дойти до конца, тебе нужно "запрограммировать" путь.`, emotion: e1 },
  { text: "Добавляй кнопки с направлением в очередь и нажимай 'Старт' чтобы поехать.", emotion: e1 },
  { text: "Не забудь про батарею — её нужно проехать и собрать!", emotion: e2 }
]

const activeDialogue = ref([])
const activeDialogueId = ref('intro')
const dialogueIndex = ref(0)
const typedText = ref('')
const typingInterval = ref(null)
const showCharacter = ref(true)
const isExiting = ref(false)
const dialogueFinished = ref(false)

// Начало диалога
function startDialogue(dialogArray, id = 'intro') {
  activeDialogue.value = dialogArray
  activeDialogueId.value = id
  dialogueIndex.value = 0
  typedText.value = ''
  dialogueFinished.value = false
  isExiting.value = false
  showCharacter.value = true
  typeText()
}

function typeText() {
  clearInterval(typingInterval.value)
  typedText.value = ''
  let i = 0
  const line = currentLine.value
  typingInterval.value = setInterval(() => {
    if (i < line.length) {
      typedText.value += line[i++]
    } else {
      clearInterval(typingInterval.value)
    }
  }, 40)
}

function handleClick() {
  if (!dialogueFinished.value && showCharacter.value) {
    advanceDialogue()
  }
}

function advanceDialogue() {
  if (typingInterval.value) clearInterval(typingInterval.value)

  // Если текст еще печатается — просто показать всё сразу
  if (typedText.value !== currentLine.value) {
    typedText.value = currentLine.value
    return
  }

  // Если есть следующая реплика — перейти и напечатать её
  if (dialogueIndex.value < activeDialogue.value.length - 1) {
    dialogueIndex.value++
    typeText() // ✅ ДОБАВЬ ЭТУ СТРОКУ
  } else {
    // Если диалог закончился
    isExiting.value = true
    dialogueFinished.value = true

    if (activeDialogueId.value === 'intro') {
      localStorage.setItem('quest3_intro_seen', 'true')
    } else if (activeDialogueId.value === 'success') {
      localStorage.setItem('quest3_success_seen', 'true')
      setTimeout(() => {
        router.push({ path: '/roadmap' })
      }, 1000)
    }

    setTimeout(() => {
      showCharacter.value = false
    }, 1000)
  }
}

const currentLine = computed(() => {
  const line = activeDialogue.value[dialogueIndex.value]
  return line ? line.text : ''
})

const currentEmotion = computed(() => {
  const line = activeDialogue.value[dialogueIndex.value]
  return line ? line.emotion : e1
})

async function returnToStart() {
  const start = { x: targetX.value, y: targetY.value }
  findStartPosition() // получаем стартовые координаты в posX/Y и targetX/Y
  const steps = 15
  const fromX = posX.value
  const fromY = posY.value
  const toX = targetX.value
  const toY = targetY.value

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps
    posX.value = fromX + (toX - fromX) * progress
    posY.value = fromY + (toY - fromY) * progress
    await new Promise(resolve => setTimeout(resolve, 30))
  }

  currentCommandIndex.value = 0
  commandQueue.value = []
  isMoving.value = false
}

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
function Perehod(){
  router.push({ path: "/roadmap" });
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
    const finishCell = maze[targetY.value][targetX.value]
    if (finishCell !== 4 || !passedCheckpoint.value) {
      await new Promise(resolve => setTimeout(resolve, 500))
      showNotification('Попробуй снова!')
      await returnToStart()
    }
    commandQueue.value = []
    return
  }

  const cmd = queue.shift()
  targetRotation.value = { 'up': 0, 'right': 90, 'down': 180, 'left': 270 }[cmd]
  rotation.value = targetRotation.value
  await new Promise(resolve => setTimeout(resolve, 300))

  let nextX = targetX.value
  let nextY = targetY.value
  if (cmd === 'up') nextY--
  else if (cmd === 'down') nextY++
  else if (cmd === 'left') nextX--
  else if (cmd === 'right') nextX++

  // Проверка на границы и стены
  if (nextX >= 0 && nextY >= 0 && nextX < mazeWidth && nextY < mazeHeight && maze[nextY][nextX] !== 1) {
    const fromX = posX.value
    const fromY = posY.value
    targetX.value = nextX
    targetY.value = nextY
    const steps = 10
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      posX.value = fromX + (targetX.value - fromX) * progress
      posY.value = fromY + (targetY.value - fromY) * progress
      await new Promise(resolve => setTimeout(resolve, 30))
    }

    const cell = maze[targetY.value][targetX.value]
    if (cell === 3) passedCheckpoint.value = true
    else if (cell === 4) {
      if (passedCheckpoint.value) {
        showNotification('ПОБЕДА! Вы успешно прошли уровень!')
        localStorage.setItem("quest3_success_seen", "true");
        reset()
        setTimeout(() => {
          Perehod();
        }, 1000);
        return
      } else {
        showNotification('Нужно сначала проехать через чекпоинт!')
        await returnToStart()
        return
      }
    }
  }

  currentCommandIndex.value++
  await execute(queue)

}

onMounted(() => {
  startDialogue(dialogueIntro, 'intro')
  findStartPosition()
})

</script>

<style scoped>
.container {
  background-image: url("/fon_car.svg");
  justify-content: center;
  display: flex;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0 auto;
  user-select: none;
  transform-origin: top left;
}

.background-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill; /* контейнер уже держит нужную пропорцию */
  z-index: 1;
  pointer-events: none;
}

.maze-grid {
  position: absolute;
  left: 29.5%;
  top: 12%;
  width: 63%;
  height: 63%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  z-index: 2;
  grid-template-rows: repeat(7, 1fr);
}
.map-wrapper {
  position: relative;
  width: 100vw;
  height: calc(100vw * (7 / 12)); /* высота по пропорции */
  max-height: 100vh;
  max-width: calc(100vh * (12 / 7));
  margin: auto;
}
.row {
  display: flex;
  user-select: none;
}

.cell {
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.empty, .wall, .start, .checkpoint, .finish {
  background-color: transparent;
}

.start-btn, .controls-panel {
  z-index: 100;
}

.car {
  position: absolute;
  z-index: 3;
  transform-origin: center;
  user-select: none;
  pointer-events: none;
}

.global-checkpoint-img {
  position: absolute;
  z-index: 4;
  animation: pulse 1.2s infinite ease-in-out;
  pointer-events: none;
}

.queue-display {
  position: absolute;
  top: 11%;
  left: 10%;
  width: 18%;
  height: 66%;
  z-index: 5;
  background: transparent;
  overflow: hidden;
  mask-image: linear-gradient(to top, transparent 0%, black 3%, black 98%, transparent 100%);
}

.queue-content {
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: auto;
  -ms-overflow-style: auto;
  padding: 10px;
  box-sizing: border-box;
}
.queue-content::-webkit-scrollbar {
  width: 0.8vw;          /* ширина вертикального скролла */
}

.queue-content::-webkit-scrollbar-track {
  background: transparent; /* фон дорожки */
}

.queue-content::-webkit-scrollbar-thumb {
  background-color: rgba(250,250,250,0.6); /* цвет ползунка */
  border-radius: 4px;
}

.command-icon { width: 90%; height: 14%; border-radius: 6px; padding: 0 5px; cursor: pointer; flex-shrink: 0; opacity: 1; transition: opacity 0.3s ease-out; }
.command-icon.fade-out { opacity: 0; }
.command-icon img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
.command-icon:hover {
  background-color: red;
}

.fade-overlay { position: absolute; top: 0; left: 0; right: 0; height: 50px; pointer-events: none; z-index: 6; }

.start-btn {
  position: absolute;
  opacity: 0;
  top: 80%;
  left: 7.5%;
  height: 10%;
  width: 19%;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  z-index: 6;
  user-select: none;
}

.start-btn:hover {
  background: #45a049;
}

.controls-panel {
  position: absolute;
  opacity: 0;
  top: 79.5%;
  left: 61%;
  transform: translateX(-50%);
  height: 9%;
  width: 63%;
  justify-content: space-between;
  display: flex
;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  border: 1px solid #ccc;
  z-index: 10;
  user-select: none;
  padding: 6px;
}

.back_btn{
  align-items: center;
  display: flex;
  position: absolute;
  top: 5vh;
  left: 3vw;
  transition: all 0.3s ease;
  width: 10vw;
  height: max(6vh, 3vw);
  padding: 0.5vw 1vw;
  background-color: rgba(230, 210, 170);
  color: white;
  border: 4px solid rgb(200,150,110,9) ;
  cursor: pointer;
  border-radius: 12px;
  z-index: 3;
}
.back_btn:hover{
  scale:120%;
}
.text{
  text-align: center;
  width: 100%;
  font-size: 2vw;
  font-weight: bold;
  font-family: Arial, sans-serif;
}

.controls-panel button {
  height: 100%;
  width: 24%;
  cursor: pointer;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 6px;
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

.dialogue-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30vh;
  z-index: 60;
  background: rgba(0, 0, 0, 0.6);
  transition: transform 1s ease, opacity 1s ease;
  display: flex;
  align-items: flex-start;
  padding: 2vw;
  box-sizing: border-box;
}

.dialogue-container.exit {
  transform: translateX(100%);
  opacity: 0;
}

.dialogue-container p {
  position: absolute;
  font-size: 3vw;
  color: white;
  max-width: 100%;
  margin: 0;
}
/* Персонаж позади диалога */
.character-behind {
  position: absolute;
  bottom: -300px;
  right: 2vw;
  height: 130vh;
  z-index: 20;
  object-fit: contain;
  transition: transform 1s ease, opacity 1s ease;
}

.character-behind.exit {
  transform: translateX(100%);
  opacity: 0;
}
</style>
