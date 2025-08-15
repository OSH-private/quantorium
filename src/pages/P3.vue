<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { router } from '../router/index.js'
import {useQuestsStore} from "../stores/index.js";

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 300

const source = reactive({ x: 0.166, y: 0.833 })
const switcher = { x: 0.5, y: 0.5 }
const receiver = { x: 0.833, y: 0.3 }
const red1 = reactive({ x: 0.166, y: 0.3 })
const red2 = reactive({ x: 0.833, y: 0.833 })

const connections = ref([]) // [{ from, to }]
const dragging = reactive({ from: null, active: false, x: 0, y: 0 })
const switchedColor = ref(null) // 'red' | 'yellow' | null

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
    playConnectSound()
  }
  dragging.active = false
  dragging.from = null
}

const getNearestTarget = (xNorm, yNorm) => {
  const x = xNorm * VIEWBOX_WIDTH
  const y = yNorm * VIEWBOX_HEIGHT
  const minDist = 25
  const points = { switcher, receiver, red1, red2 }
  for (const [key, point] of Object.entries(points)) {
    const dx = x - point.x * VIEWBOX_WIDTH
    const dy = y - point.y * VIEWBOX_HEIGHT
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < minDist) return key
  }
  return null
}

const getX = (point) => {
  return ({
    source, switcher, receiver, red1, red2
  }[point]?.x ?? 0) * VIEWBOX_WIDTH
}

const getY = (point) => {
  return ({
    source, switcher, receiver, red1, red2
  }[point]?.y ?? 0) * VIEWBOX_HEIGHT
}

const playConnectSound = () => {
  const audio = new Audio('/connected.mp3')
  audio.play()
}

const playSuccessSound = () => {
  const audio = new Audio('/completed.mp3')
  audio.play()
}

const chooseColor = (color) => {
  switchedColor.value = color
  playConnectSound()
}

const allCorrect = computed(() => {
  const hasSourceToSwitcher = connections.value.some(c => c.from === 'source' && c.to === 'switcher')
  const hasSwitcherToReceiver = connections.value.some(c => c.from === 'switcher' && (c.to === 'red2' || c.to === 'receiver'))
  const hasRedToReceiver = connections.value.some(c => c.from === 'red1' && (c.to === 'receiver' ||c.to === 'red2'))
  const finish = hasSourceToSwitcher && hasSwitcherToReceiver && hasRedToReceiver && switchedColor.value === 'red'
  if (finish) playSuccessSound()
  return finish
})

const reset = () => {
  connections.value = []
  switchedColor.value = null
}

const Perehod4 = () => {
  const questsStore = useQuestsStore()
  questsStore.markQuestComplete("P3") // пометили как завершённый
  router.push({ path: '/quest2' })
}

onMounted(() => {
  document.addEventListener('mousemove', updateDrag)
  document.addEventListener('mouseup', endDrag)
})
</script>

<template>
  <div>

    <svg class="game" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" >

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

      <!-- Источник -->
      <circle :cx="source.x * VIEWBOX_WIDTH" :cy="source.y * VIEWBOX_HEIGHT" r="20" class="items" fill="blue" @mousedown="startDrag('source', $event)" />
      <circle :cx="red1.x * VIEWBOX_WIDTH" :cy="red1.y * VIEWBOX_HEIGHT" r="20" class="items" fill="red" @mousedown="startDrag('red1', $event)" />
      <circle :cx="red2.x * VIEWBOX_WIDTH" :cy="red2.y * VIEWBOX_HEIGHT" r="20" class="items" fill="red" @mousedown="startDrag('red2', $event)" />

      <!-- Переключатель -->
      <rect
          :x="switcher.x * VIEWBOX_WIDTH - 25"
          :y="switcher.y * VIEWBOX_HEIGHT - 25"
          width="50"
          height="50"
          class="items"
          :fill="switchedColor ? switchedColor : '#888'"
          @mousedown="startDrag('switcher', $event)"
      />
      <text x="270" y="140" font-size="12">🔁</text>

      <!-- Приёмник -->
      <circle :cx="receiver.x * VIEWBOX_WIDTH" :cy="receiver.y * VIEWBOX_HEIGHT" r="20" fill="red" class="items" />

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
      <div class="color-switcher">
        <p>Выбери цвет сигнала:</p>
        <button @click="chooseColor('red')" class="color-btn red">🔴 Красный</button>
        <button @click="chooseColor('yellow')" class="color-btn yellow">🟡 Жёлтый</button>
      </div>
      <div v-if="!allCorrect" class="btns" @click="reset">
        Сбросить
      </div>
      <div v-if="allCorrect" class="end">
        <div class="success">🔥 Обе лампы зажглись!</div>
        <div class="btns" @click="Perehod4">Готово</div>
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
.items{
  cursor: pointer;
}

</style>
