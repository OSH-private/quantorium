<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { router } from '../router/index.js'
import { useQuestsStore } from '../stores/index.js'


const cornerRadius = 5

const computePath = (fromIndex, toIndex) => {
  const startX = wires[fromIndex].start.x * VIEWBOX_WIDTH
  const startY = wires[fromIndex].start.y * VIEWBOX_HEIGHT
  const endX = wires[toIndex].end.x * VIEWBOX_WIDTH
  const endY = wires[toIndex].end.y * VIEWBOX_HEIGHT
  const midX = (startX + endX) / 2
  const verticalDir = endY >= startY ? 1 : -1

  return `M ${startX} ${startY}
          L ${midX - cornerRadius} ${startY}
          Q ${midX} ${startY} ${midX} ${startY + cornerRadius * verticalDir}
          L ${midX} ${endY - cornerRadius * verticalDir}
          Q ${midX} ${endY} ${midX + cornerRadius} ${endY}
          L ${endX} ${endY}`
}

// Для активного провода (dragging)
const computeActivePath = () => {
  if (dragging.index === null) return ''
  const startX = wires[dragging.index].start.x * VIEWBOX_WIDTH
  const startY = wires[dragging.index].start.y * VIEWBOX_HEIGHT
  const endX = dragging.x * VIEWBOX_WIDTH
  const endY = dragging.y * VIEWBOX_HEIGHT
  const midX = (startX + endX) / 2
  const verticalDir = endY >= startY ? 1 : -1

  return `M ${startX} ${startY}
          L ${midX - cornerRadius} ${startY}
          Q ${midX} ${startY} ${midX} ${startY + cornerRadius * verticalDir}
          L ${midX} ${endY - cornerRadius * verticalDir}
          Q ${midX} ${endY} ${midX + cornerRadius} ${endY}
          L ${endX} ${endY}`
}

const x1 = computed(() => {
  if (dragging.index === null) return 0
  return wires[dragging.index].start.x * VIEWBOX_WIDTH
})

const y1 = computed(() => {
  if (dragging.index === null) return 0
  return wires[dragging.index].start.y * VIEWBOX_HEIGHT
})

const midX = computed(() => {
  if (dragging.index === null) return 0
  return (x1.value + dragging.x * VIEWBOX_WIDTH) / 2
})

const wires = reactive([
  { color: 'red', start: { x: 0.1, y: 0.2 }, end: { x: 0.9, y: 0.8 } },
  { color: 'blue', start: { x: 0.1, y: 0.5 }, end: { x: 0.9, y: 0.2 } },
  { color: 'green', start: { x: 0.1, y: 0.8 }, end: { x: 0.9, y: 0.5 } }
])

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 300

const connections = ref([]) // [{ from: 0, to: 0 }, ...]
const dragging = reactive({ index: null, active: false, x: 0, y: 0 })

const startDrag = (index, event) => {
  if (connections.value.some(conn => conn.from === index)) return
  const { x, y } = getMousePositionInViewBox(event)
  dragging.index = index
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
  if (dragging.index === null) return
  const to = getNearestEnd(dragging.x, dragging.y)
  if (
      to !== null &&
      !connections.value.some(conn => conn.to === to)
  ) {
    connections.value.push({ from: dragging.index, to })
    playConnectSound()
  }

  dragging.active = false
  dragging.index = null
}

const getNearestEnd = (xNorm, yNorm) => {
  const x = xNorm * VIEWBOX_WIDTH
  const y = yNorm * VIEWBOX_HEIGHT

  let nearest = null
  let minDist = 20
  wires.forEach((wire, i) => {
    const dx = x - wire.end.x * VIEWBOX_WIDTH
    const dy = y - wire.end.y * VIEWBOX_HEIGHT
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < minDist) {
      nearest = i
      minDist = dist
    }
  })
  return nearest
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

const allConnected = computed(() => {
  if (connections.value.length !== wires.length) return false
  const isConnected = connections.value.every(conn => {
    return wires[conn.from].color === wires[conn.to].color
  })
  if (isConnected) {
    playSuccessSound()
  }
  return isConnected
})

const playConnectSound = () => {
  const audio = new Audio('../public/connected.mp3')
  audio.play()
}

const playSuccessSound = () => {
  const audio = new Audio('../public/completed.mp3')
  audio.play()
}

const resetConnections = () => {
  connections.value = []
}

const Perehod3 = () => {
  const questsStore = useQuestsStore()
  questsStore.markQuestComplete("P1") // пометили как завершённый
  router.push({ path: '/quest2' })
}

onMounted(() => {
  document.addEventListener('mousemove', updateDrag)
  document.addEventListener('mouseup', endDrag)
})
</script>

<template>
  <div class="wrapper">
    <svg class="game" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">

    <g v-for="(wire, index) in wires" :key="index">
        <!-- Источник -->
      <circle
          :cx="wire.start.x * VIEWBOX_WIDTH"
          :cy="wire.start.y * VIEWBOX_HEIGHT"
          r="20"
          :fill="wire.color"
          @mousedown="startDrag(index, $event)"
      />

        <!-- Приёмник -->
        <circle
            :cx="wire.end.x * VIEWBOX_WIDTH"
            :cy="wire.end.y * VIEWBOX_HEIGHT"
            r="20"
            :fill="wire.color"
        />
      </g>

      <!-- Протянутые линии -->
      <path
          v-for="(conn, i) in connections"
          :key="i"
          :d="computePath(conn.from, conn.to)"
          stroke="gray"
          stroke-width="20"
          stroke-linecap="round"
          fill="none"
      />

      <!-- Активная линия -->
      <path
          v-if="dragging.active"
          :d="computeActivePath()"
          stroke="gray"
          stroke-width="15"
          stroke-dasharray="10,5"
          fill="none"
      />
    </svg>
    <div class="controls">
        <div v-if="!allConnected" class="btns" @click="resetConnections">
          Сбросить
        </div>
        <div v-if="allConnected" class="end">
          <div class="success">🎉 Все соединения правильные!</div>
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
  width: 100%;
  height: 80%;
}
.wrapper {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-drag: none;
  -webkit-user-drag: none;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
}

</style>
