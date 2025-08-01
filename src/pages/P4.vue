<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { router } from '../router/index.js'

const red = { x: 100, y: 80 }
const green = { x: 100, y: 150 }
const blue = { x: 100, y: 220 }

const filter = { x: 300, y: 150 }
const lamp = { x: 500, y: 150 }

const connections = ref([]) // [{ from, to }]
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
  const points = { filter, lamp }
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
  if (point === 'red') return red.x
  if (point === 'green') return green.x
  if (point === 'blue') return blue.x
  if (point === 'filter') return filter.x
  if (point === 'lamp') return lamp.x
  return 0
}

const getY = (point) => {
  if (point === 'red') return red.y
  if (point === 'green') return green.y
  if (point === 'blue') return blue.y
  if (point === 'filter') return filter.y
  if (point === 'lamp') return lamp.y
  return 0
}

const playSuccessSound = () => {
  const audio = new Audio('/click.mp3')
  audio.play()
}

const getSignalColor = () => {
  const firstConn = connections.value.find(c => c.to === 'filter')
  if (!firstConn) return null
  return firstConn.from
}

const allCorrect = computed(() => {
  const hasGreenToFilter = connections.value.some(c => c.from === 'green' && c.to === 'filter')
  const hasFilterToLamp = connections.value.some(c => c.from === 'filter' && c.to === 'lamp')
  return hasGreenToFilter && hasFilterToLamp
})

const reset = () => {
  connections.value = []
}

const Perehod5 = () => router.push({ path: '/quest5' })

onMounted(() => {
  document.addEventListener('mousemove', updateDrag)
  document.addEventListener('mouseup', endDrag)
})
</script>

<template>
  <div class="game">
    <svg width="600" height="300">
      <!-- Источники -->
      <circle :cx="red.x" :cy="red.y" r="20" fill="red" @mousedown="startDrag('red', $event)" />
      <circle :cx="green.x" :cy="green.y" r="20" fill="green" @mousedown="startDrag('green', $event)" />
      <circle :cx="blue.x" :cy="blue.y" r="20" fill="blue" @mousedown="startDrag('blue', $event)" />

      <!-- Фильтр -->
      <rect
          :x="filter.x - 25"
          :y="filter.y - 25"
          width="50"
          height="50"
          fill="lightgreen"
          @mousedown="startDrag('filter', $event)"
      />
      <text :x="filter.x - 15" :y="filter.y + 5" font-size="14">Фильтр</text>

      <!-- Лампа -->
      <circle :cx="lamp.x" :cy="lamp.y" r="20" :fill="allCorrect ? 'lime' : '#444'" />

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

    <!-- Управление -->
    <div class="controls">
      <button class="bot1" @click="reset">Сбросить</button>
    </div>

    <div v-if="allCorrect" class="success">
      ✅ Правильно! Только зелёный прошёл фильтр.
      <button class="bot1" @click="Perehod5">Готово</button>
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
</style>
