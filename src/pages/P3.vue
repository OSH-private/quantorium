<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { router } from '../router/index.js'

const source = { x: 100, y: 150 }
const switcher = { x: 300, y: 150 }
const receiver = { x: 500, y: 150 }
const red1 = { x: 100, y: 250 }
const red2 = { x: 500, y: 250 }

const connections = ref([]) // [{ from, to }]

const switchedColor = ref(null) // 'red' | 'yellow' | null

const dragging = reactive({ from: null, active: false, x: 0, y: 0 })

const startDrag = (from, event) => {
  if (connections.value.some(conn => conn.from === from)) return

  dragging.from = from
  dragging.active = true
  dragging.x = event.offsetX
  dragging.y = event.offsetY
}

const updateDrag = (event) => {
  if (!dragging.active) return
  dragging.x = event.offsetX
  dragging.y = event.offsetY
}

const endDrag = () => {
  if (!dragging.active || dragging.from === null) return

  const to = getNearestTarget(dragging.x, dragging.y)

  if (to && !connections.value.some(conn => conn.to === to)) {
    connections.value.push({ from: dragging.from, to })
    playSuccessSound()
  }

  dragging.active = false
  dragging.from = null
}

const getNearestTarget = (x, y) => {
  const points = {
    switcher: switcher,
    receiver: receiver,
    red1: red1,
    red2: red2
  }

  const minDist = 25
  for (const [key, point] of Object.entries(points)) {
    const dx = x - point.x
    const dy = y - point.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < minDist) return key
  }
  return null
}

const getX = (point) => {
  if (point === 'source') return source.x
  if (point === 'switcher') return switcher.x
  if (point === 'receiver') return receiver.x
  if (point === 'red1') return red1.x
  if (point === 'red2') return red2.x
  return 0
}
const getY = (point) => {
  if (point === 'source') return source.y
  if (point === 'switcher') return switcher.y
  if (point === 'receiver') return receiver.y
  if (point === 'red1') return red1.y
  if (point === 'red2') return red2.y
  return 0
}

const playSuccessSound = () => {
  const audio = new Audio('/click.mp3')
  audio.play()
}

const chooseColor = (color) => {
  switchedColor.value = color
  playSuccessSound()
}

const allCorrect = computed(() => {
  const hasSourceToSwitcher = connections.value.some(c => c.from === 'source' && c.to === 'switcher')
  const hasSwitcherToReceiver = connections.value.some(c => c.from === 'switcher' && c.to === 'receiver')
  const hasRedToReceiver = connections.value.some(c => c.from === 'red1' && c.to === 'red2')
  return hasSourceToSwitcher && hasSwitcherToReceiver && hasRedToReceiver && switchedColor.value === 'red'
})

const reset = () => {
  connections.value = []
  switchedColor.value = null
}

const Perehod4 = () => router.push({ path: '/quest4' })

onMounted(() => {
  document.addEventListener('mousemove', updateDrag)
  document.addEventListener('mouseup', endDrag)
})
</script>

<template>
  <div class="game">
    <svg width="600" height="300">
      <!-- Источник -->
      <circle :cx="source.x" :cy="source.y" r="20" fill="blue" @mousedown="startDrag('source', $event)" />
      <circle :cx="red1.x" :cy="red1.y" r="20" fill="red" @mousedown="startDrag('red1', $event)" />
      <circle :cx="red2.x" :cy="red2.y" r="20" fill="red" @mousedown="startDrag('red2', $event)" />


      <!-- Переключатель -->
      <rect
          :x="switcher.x - 25"
          :y="switcher.y - 25"
          width="50"
          height="50"
          :fill="switchedColor ? switchedColor : '#888'"
          @mousedown="startDrag('switcher', $event)"
      />
      <text x="270" y="140" font-size="12">🔁</text>

      <!-- Приёмник -->
      <circle :cx="receiver.x" :cy="receiver.y" r="20" fill="red" />

      <!-- Провода -->
      <line
          v-for="(conn, i) in connections"
          :key="i"
          :x1="getX(conn.from)"
          :y1="getY(conn.from)"
          :x2="getX(conn.to)"
          :y2="getY(conn.to)"
          stroke="black"
          stroke-width="30"
          stroke-linecap="round"
      />

      <!-- Активная линия -->
      <line
          v-if="dragging.active"
          :x1="getX(dragging.from)"
          :y1="getY(dragging.from)"
          :x2="dragging.x"
          :y2="dragging.y"
          stroke="gray"
          stroke-dasharray="5,5"
          stroke-width="3"
      />
    </svg>

    <!-- Выбор цвета -->
    <div class="color-switcher">
      <p>Выбери цвет сигнала:</p>
      <button @click="chooseColor('red')" class="color-btn red">🔴 Красный</button>
      <button @click="chooseColor('yellow')" class="color-btn yellow">🟡 Жёлтый</button>
    </div>

    <!-- Управление -->
    <div class="controls">
      <button class="bot1" @click="reset">Сбросить</button>
    </div>

    <div v-if="allCorrect" class="success">
      ✅ Сигнал прошёл правильно!
      <button class="bot1" @click="Perehod4">Готово</button>
    </div>
  </div>
</template>

<style scoped>
.game {
  user-select: none;
}
.success {
  margin-top: 20px;
  font-size: 24px;
  color: green;
}
.controls {
  margin-top: 20px;
}
.bot1 {
  color: white;
  font-size: 5vw;
  height: 7vw;
  width: 20vw;
  border-radius: 25px;
  background-color: rgb(70, 125, 190);
}
.color-switcher {
  margin-top: 10px;
}
.color-btn {
  margin-right: 10px;
  padding: 10px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}
.color-btn.red {
  background-color: red;
  color: white;
}
.color-btn.yellow {
  background-color: gold;
  color: black;
}
</style>
