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
  { color: 'red', image:'/red_p_end.svg', start: { x: 0.1, y: 0 }, end: { x: 0.9, y: 1 } },
  { color: 'blue', image:'/blue_p_end.svg', start: { x: 0.1, y: 0.5 }, end: { x: 0.9, y: 0 } },
  { color: 'green', image:'/green_p_end.svg', start: { x: 0.1, y: 1 }, end: { x: 0.9, y: 0.5 } }
])

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 400

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
    <div class="maindiv">
      <div class="game_wrap">
        <svg class="game" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">

          <g v-for="(wire, index) in wires" :key="index">
            <!-- Источник -->
            <image
                :x="wire.start.x * VIEWBOX_WIDTH - 25"
                :y="wire.start.y * VIEWBOX_HEIGHT - 25"
                width="50"
                height="50"
                cursor="pointer"
                :href="wire.image"
                @mousedown="startDrag(index, $event)"
            />

            <!-- Приёмник -->
            <image
                :x="wire.end.x * VIEWBOX_WIDTH - 25"
                :y="wire.end.y * VIEWBOX_HEIGHT - 25"
                width="50"
                height="50"
                :href="wire.image"
            />
            <!-- Прозрачный круг для кликов -->
            <circle
                :cx="wire.end.x * VIEWBOX_WIDTH"
                :cy="wire.end.y * VIEWBOX_HEIGHT"
                r="25"
                fill="transparent"
                @mouseup="endDrag"
            />
          </g>

          <!-- Протянутые линии -->
          <path
              v-for="(conn, i) in connections"
              :key="i"
              :d="computePath(conn.from, conn.to)"
              stroke="darkgray"
              stroke-width="20"
              stroke-linecap="round"
              fill="none"
          />

          <!-- Активная линия -->
          <path
              v-if="dragging.active"
              :d="computeActivePath()"
              stroke="darkgray"
              stroke-width="15"
              stroke-dasharray="10,5"
              fill="none"
          />
        </svg>
      </div>

    </div>

    <div class="controls">
        <div v-if="!allConnected" class="btns" @click="resetConnections">
          <p>Сбросить</p>
        </div>
        <div v-if="allConnected" class="end">
          <div class="success"><p>Все соединения правильные!</p></div>
          <div class="btns" @click="Perehod3"><p>Готово</p></div>
        </div>
    </div>

  </div>
</template>

<style scoped>
.game_wrap{
  height: 80%;
  width: 35%;
  position: relative;
}
.end{
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-left: auto;
}
.btns{
  margin-left: auto;
  font-family: Arial, sans-serif;
  margin-right: 5%;
  background-color: rgb(70, 125, 190);
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 3vw;
  height: max(6vh, 3vw);
  padding: 0.5vw 1vw;
  background-color: rgba(230, 210, 170, 0.9);
  color: white;
  border: 4px solid rgb(200, 150, 110, 9);
  cursor: pointer;
  border-radius: 12px;
}
.btns p{
  text-align: center;
  width: 100%;
  font-size: 2vw;
  font-weight: bold;
  font-family: Arial, sans-serif;
}
.controls{
  position: absolute;
  justify-content:space-between;
  align-items: center;
  display: flex;
  width: 100vw;
  height: 15vh;
  bottom:0;

}
.success {
  align-items: center;
  justify-content: center;
  display: flex;
  text-align: center;
  background-color: rgba(230, 210, 170, 0.9);
  border-radius: 12px;
  padding: 5px;
  width: 40vw;
  height: 7vh;
  margin-right: 2vw;
}
.success p{
  font-weight: bold;
  font-size: 2vw;
  font-family: Arial, sans-serif;
  text-align: center;
  color: #ffffff;
}
.game {
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
}
.maindiv{
  align-items: center;
  aspect-ratio: 1920/1080;
  display: flex;
  margin-right: auto;
  margin-left: auto;
  justify-content: center;
  width: 100%;
  max-height: 100%;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -webkit-user-drag: none;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url("/shitok_back.svg");
}
.wrapper {
  overflow: hidden;
  justify-content: center;
  width: 100vw;
  background-image: url("/fon_car.svg");
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

</style>
