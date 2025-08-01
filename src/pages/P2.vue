<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { router } from '../router/index.js'

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 300

const source = { x: 0.17, y: 0.45 } // нормализованные координаты
const splitter = { x: 0.5, y: 0.45 }
const lamps = reactive([
  { x: 0.83, y: 0.23, on: false },
  { x: 0.83, y: 0.62, on: false }
])

const connections = ref([])
const dragging = reactive({ from: null, active: false, x: 0, y: 0 })

const startDrag = (from, event) => {
  const fromCount = connections.value.filter(conn => conn.from === from).length
  if ((from === 'source' && fromCount >= 1) || (from === 'splitter' && fromCount >= 2)) return

  const { x, y } = getMousePositionInViewBox(event)
  dragging.from = from
  dragging.active = true
  dragging.x = x
  dragging.y = y
}

const updateDrag = (event) => {
  if (!dragging.active) return
  const { x, y } = getMousePositionInViewBox(event)
  dragging.x = x
  dragging.y = y
}

const endDrag = () => {
  if (!dragging.active || dragging.from === null) return

  const to = getNearestTarget(dragging.x, dragging.y)
  if (to && !connections.value.some(conn => conn.to === to)) {
    connections.value.push({ from: dragging.from, to })
    playConnectSound()
    checkLamps()
  }

  dragging.active = false
  dragging.from = null
}

const getNearestTarget = (xNorm, yNorm) => {
  const x = xNorm * VIEWBOX_WIDTH
  const y = yNorm * VIEWBOX_HEIGHT
  const minDist = 25

  const targets = {
    splitter: splitter,
    lamp0: lamps[0],
    lamp1: lamps[1]
  }

  for (const [key, point] of Object.entries(targets)) {
    const dx = x - point.x * VIEWBOX_WIDTH
    const dy = y - point.y * VIEWBOX_HEIGHT
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < minDist) return key
  }

  return null
}

const getMousePositionInViewBox = (event) => {
  const svg = event.target.ownerSVGElement || document.querySelector('svg')
  const pt = svg.createSVGPoint()
  pt.x = event.clientX
  pt.y = event.clientY
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
  return {
    x: svgP.x / VIEWBOX_WIDTH,
    y: svgP.y / VIEWBOX_HEIGHT
  }
}

const playConnectSound = () => {
  const audio = new Audio('../public/connected.mp3')
  audio.play()
}
const playSuccessSound = () => {
  const audio = new Audio('../public/completed.mp3')
  audio.play()
}

const checkLamps = () => {
  const fromSource = connections.value.find(c => c.from === 'source' && c.to === 'splitter')
  const toLamps = connections.value.filter(c => c.from === 'splitter' && c.to.startsWith('lamp'))

  if (fromSource && toLamps.length === 2) {
    lamps.forEach(l => l.on = true)
  }
}

const allOn = computed(() => {
  const isAllConnected = lamps.every(l => l.on)
  if (isAllConnected) playSuccessSound()
  return isAllConnected
})

const reset = () => {
  connections.value = []
  lamps.forEach(l => l.on = false)
}

const Perehod3 = () => router.push({ path: '/P3' })

onMounted(() => {
  document.addEventListener('mousemove', updateDrag)
  document.addEventListener('mouseup', endDrag)
})

const getX = (point) => {
  if (point === 'source') return source.x * VIEWBOX_WIDTH
  if (point === 'splitter') return splitter.x * VIEWBOX_WIDTH
  if (point === 'lamp0') return lamps[0].x * VIEWBOX_WIDTH
  if (point === 'lamp1') return lamps[1].x * VIEWBOX_WIDTH
  return 0
}
const getY = (point) => {
  if (point === 'source') return source.y * VIEWBOX_HEIGHT
  if (point === 'splitter') return splitter.y * VIEWBOX_HEIGHT
  if (point === 'lamp0') return lamps[0].y * VIEWBOX_HEIGHT
  if (point === 'lamp1') return lamps[1].y * VIEWBOX_HEIGHT
  return 0
}
</script>

<template>
  <div class="wrapper">
    <svg class="game" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
      <!-- Соединения -->
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

      <!-- Источник -->
      <circle
          :cx="source.x * VIEWBOX_WIDTH"
          :cy="source.y * VIEWBOX_HEIGHT"
          r="20"
          fill="red"
          class="items"
          @mousedown="startDrag('source', $event)"
      />

      <!-- Разветвитель -->
      <rect
          :x="splitter.x * VIEWBOX_WIDTH - 20"
          :y="splitter.y * VIEWBOX_HEIGHT - 20"
          width="40"
          height="40"
          class="items"
          fill="#888"
          @mousedown="startDrag('splitter', $event)"
      />

      <!-- Лампочки -->
      <g v-for="(lamp, i) in lamps" :key="i" class="items">
        <circle
            :cx="lamp.x * VIEWBOX_WIDTH"
            :cy="lamp.y * VIEWBOX_HEIGHT"
            r="20"
            :fill="lamp.on ? 'red' : '#440000'"
        />
      </g>

      <!-- Активное соединение -->
      <line
          v-if="dragging.active"
          :x1="getX(dragging.from)"
          :y1="getY(dragging.from)"
          :x2="dragging.x * VIEWBOX_WIDTH"
          :y2="dragging.y * VIEWBOX_HEIGHT"
          stroke="gray"
          stroke-dasharray="5,5"
          stroke-width="3"
      />
    </svg>

    <div class="controls">
      <div v-if="!allOn" class="btns" @click="reset">
        Сбросить
      </div>
      <div v-if="allOn" class="end">
        <div class="success">🔥 Обе лампы зажглись!</div>
        <div class="btns" @click="Perehod3">Готово</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.end{
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-left: auto;
}
.btns{
  margin-left: auto;
  border: 2px outset black;
  background-color: rgb(70, 125, 190);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  display: flex;
  border-radius: 25px;
  font-size: 3vw;
  height: 7vh;
  width: 15vw;
}
.controls{
  justify-content:space-between;
  align-items: center;
  display: flex;
  width: 80vw;
  height: 20vh;
  margin: auto;
}
.success {
  font-size: 24px;
  color: green;
  margin-right: 2vw;
}
.game {
  user-select: none;
  height: 80vh;
  width: 100vw;
}
.items{
  cursor: pointer;
}

</style>
