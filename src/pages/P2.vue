<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { router } from '../router/index.js'
import {useQuestsStore} from "../stores/index.js";

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 400

const source = { x: 0.1, y: 0.45 } // нормализованные координаты
const splitter = { x: 0.5, y: 0.45 }
const lamps = reactive([
  { x: 0.9, y: 0, on: false },
  { x: 0.9, y: 1, on: false }
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

const Perehod3 = () => {
  const questsStore = useQuestsStore()
  questsStore.markQuestComplete("P2") // пометили как завершённый
  router.push({ path: '/quest2' })
}

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
    <div class="maindiv">
      <div class="game_wrap">
        <svg class="game" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
      <!-- Соединения -->
      <line
          v-for="(conn, i) in connections"
          :key="i"
          :x1="getX(conn.from)"
          :y1="getY(conn.from)"
          :x2="getX(conn.to)"
          :y2="getY(conn.to)"
          stroke="darkgray"
          stroke-width="30"
          stroke-linecap="round"
      />

      <!-- Источник -->
      <image
          :x="source.x * VIEWBOX_WIDTH-25"
          :y="source.y * VIEWBOX_HEIGHT-25"
          cursor="pointer"
          class="items"
          width="50"
          height="50"
          href="/red_p_end.svg"
          @mousedown="startDrag('source', $event)"
      />

      <!-- Разветвитель -->
      <image
          :x="splitter.x * VIEWBOX_WIDTH - 40"
          :y="splitter.y * VIEWBOX_HEIGHT - 40"
          href="/splitter.svg"
          width="80"
          height="80"
          class="items"
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
        <image
            :x="lamp.x * VIEWBOX_WIDTH-25"
            :y="lamp.y * VIEWBOX_HEIGHT-25"
            width="50"
            height="50"
            href="/red_p_end.svg"
        />
      </g>

      <!-- Активное соединение -->
      <line
          v-if="dragging.active"
          :x1="getX(dragging.from)"
          :y1="getY(dragging.from)"
          :x2="dragging.x * VIEWBOX_WIDTH"
          :y2="dragging.y * VIEWBOX_HEIGHT"
          stroke="darkgray"
          stroke-dasharray="10,5"
          stroke-width="20"
      />
    </svg>
    </div>
    </div>

    <div class="controls">
      <div v-if="!allOn" class="btns" @click="reset">
        <p>Сбросить</p>
      </div>
      <div v-if="allOn" class="end">
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
  margin-right: 5%;
  font-family: Arial, sans-serif;
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
