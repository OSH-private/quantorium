<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { router } from '../router/index.js'

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 300

const red = { x: 0.166, y: 0.266 }
const blue = { x: 0.166, y: 0.5 }
const green = { x: 0.166, y: 0.733 }

const filter = { x: 0.5, y: 0.5 }
const lamp = { x: 0.833, y: 0.5 }

const connections = ref([])
const dragging = reactive({ from: null, active: false, x: 0, y: 0 })

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

const startDrag = (from, event) => {
  if (connections.value.some(conn => conn.from === from)) return
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
    playSuccessSound()
  }
  dragging.active = false
  dragging.from = null
}

const getNearestTarget = (x, y) => {
  const points = { filter, lamp }
  const minDist = 25
  for (const [key, point] of Object.entries(points)) {
    const dx = x * VIEWBOX_WIDTH - point.x * VIEWBOX_WIDTH
    const dy = y * VIEWBOX_HEIGHT - point.y * VIEWBOX_HEIGHT
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < minDist) return key
  }
  return null
}

const getX = (point) => {
  return ({
    red, green, blue, filter, lamp
  }[point]?.x ?? 0) * VIEWBOX_WIDTH
}

const getY = (point) => {
  return ({
    red, green, blue, filter, lamp
  }[point]?.y ?? 0) * VIEWBOX_HEIGHT
}

const playSuccessSound = () => {
  const audio = new Audio('/click.mp3')
  audio.play()
}

const allCorrect = computed(() => {
  const hasGreenToFilter = connections.value.some(c => c.from === 'green' && c.to === 'filter')
  const hasFilterToLamp = connections.value.some(c => c.from === 'filter' && c.to === 'lamp')
  return hasGreenToFilter && hasFilterToLamp
})

const reset = () => {
  connections.value = []
}

const Perehod5 = () => router.push({ path: '/quest1' })

onMounted(() => {
  document.addEventListener('mousemove', updateDrag)
  document.addEventListener('mouseup', endDrag)
})
</script>


<template>
  <div>
    <svg class="game" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">

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

      <!-- Источники -->
      <circle :cx="red.x * VIEWBOX_WIDTH" :cy="red.y * VIEWBOX_HEIGHT" r="20" class="items" fill="red" @mousedown="startDrag('red', $event)" />
      <circle :cx="green.x * VIEWBOX_WIDTH" :cy="green.y * VIEWBOX_HEIGHT" r="20" class="items" fill="green" @mousedown="startDrag('green', $event)" />
      <circle :cx="blue.x * VIEWBOX_WIDTH" :cy="blue.y * VIEWBOX_HEIGHT" r="20" class="items" fill="blue" @mousedown="startDrag('blue', $event)" />

      <!-- Фильтр -->
      <rect
          :x="filter.x * VIEWBOX_WIDTH - 25"
          :y="filter.y * VIEWBOX_HEIGHT - 25"
          width="50"
          height="50"
          class="items"
          fill="lightgreen"
          @mousedown="startDrag('filter', $event)"
      />
      <text
          :x="filter.x * VIEWBOX_WIDTH - 15"
          :y="filter.y * VIEWBOX_HEIGHT + 5"
          font-size="14"
          class="items"
          @mousedown="startDrag('filter', $event)"
      >Фильтр</text>

      <!-- Лампа -->
      <circle :cx="lamp.x * VIEWBOX_WIDTH" :cy="lamp.y * VIEWBOX_HEIGHT" r="20" class="items" :fill="allCorrect ? 'lime' : '#444'" />

      <!-- Активная линия -->
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
      <div v-if="!allCorrect" class="btns" @click="reset">
        Сбросить
      </div>
      <div v-if="allCorrect" class="end">
        <div class="success">🔥 Обе лампы зажглись!</div>
        <div class="btns" @click="Perehod5">Готово</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.end {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-left: auto;
}
.btns {
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
.controls {
  justify-content: space-between;
  align-items: center;
  display: flex;
  width: 80vw;
  height: 20vh;
  margin: auto;
}
.game {
  user-select: none;
  height: 80vh;
  width: 100vw;
}
.success {
  font-size: 24px;
  color: green;
  margin-right: 2vw;
}
.items {
  cursor: pointer;
}
</style>
