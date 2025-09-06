<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { router } from '../router/index.js'
import {useQuestsStore} from "../stores/index.js";

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 400

const source = reactive({ x: 0.1, y: 1 , color: '/blue_p_end.svg'})
const switcher = { x: 0.5, y: 0.5 }
const receiver = { x: 0.9, y: 0.1, color: '/red_p_end.svg' }
const red1 = reactive({ x: 0.1, y: 0.1, color:'/red_p_end.svg' })
const red2 = reactive({ x: 0.9, y: 1, color:'/red_p_end.svg' })

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
  const finish = hasSourceToSwitcher && hasSwitcherToReceiver && hasRedToReceiver && switchedColor.value === '/red_changer.svg'
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
  <div class="wrapper">
    <div class="maindiv">
      <div class="game_wrap">
    <svg class="game" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" >

      <!-- Провода -->
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
      <circle :cx="source.x * VIEWBOX_WIDTH" :cy="source.y * VIEWBOX_HEIGHT" r="20" class="items" fill="blue" @mousedown="startDrag('source', $event)" />
      <circle :cx="red1.x * VIEWBOX_WIDTH" :cy="red1.y * VIEWBOX_HEIGHT" r="20" class="items" fill="red" @mousedown="startDrag('red1', $event)" />
      <circle :cx="red2.x * VIEWBOX_WIDTH" :cy="red2.y * VIEWBOX_HEIGHT" r="20" class="items" fill="red" @mousedown="startDrag('red2', $event)" />
      <image :x="source.x * VIEWBOX_WIDTH-25" :y="source.y * VIEWBOX_HEIGHT-25" :href="source.color" width="50" height="50" class="items" @mousedown="startDrag('source', $event)" />
      <image  :x="red1.x * VIEWBOX_WIDTH-25" :y="red1.y * VIEWBOX_HEIGHT-25" :href="red1.color" width="50" height="50" class="items" @mousedown="startDrag('red1', $event)" />
      <image :x="red2.x * VIEWBOX_WIDTH-25" :y="red2.y * VIEWBOX_HEIGHT-25" :href="red2.color" width="50" height="50"  class="items" @mousedown="startDrag('red2', $event)" />

      <!-- Переключатель -->
      <image
          :x="switcher.x * VIEWBOX_WIDTH - 40"
          :y="switcher.y * VIEWBOX_HEIGHT - 40"
          width="80"
          height="80"
          class="items"
          :href="switchedColor ? switchedColor : '/changer.svg'"
          @mousedown="startDrag('switcher', $event)"
      />

      <!-- Приёмник -->
      <circle :cx="receiver.x * VIEWBOX_WIDTH" :cy="receiver.y * VIEWBOX_HEIGHT" r="20" fill="red" class="items" />
      <image
          :x="receiver.x * VIEWBOX_WIDTH-25"
          :y="receiver.y * VIEWBOX_WIDTH-45"
          width="50"
          height="50"
          :href="receiver.color"
      />
      <!-- Активная линия -->
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
      <div class="color-switcher">
        <p>Выбери цвет сигнала:</p>
        <div class="btns">
          <button @click="chooseColor('/yellow_changer.svg')" class="color-btn yellow">____</button>
          <button @click="chooseColor('/red_changer.svg')" class="color-btn red">____</button>
        </div>
      </div>
      <div v-if="!allCorrect" class="btn" @click="reset">
        Сбросить
      </div>
      <div v-if="allCorrect" class="end">
        <div class="success"><p>Все соединения правильные!</p></div>
        <div class="btn" @click="Perehod4"><p>Готово</p></div>
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
.btn{
  margin-left: auto;
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
  font-family: Arial, sans-serif;
}
.btn p{
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
.btns{
  width: 100%;
  height: 50%;
  justify-content: space-between;
  display: flex;
}
.color-switcher{
  font-family: Arial, sans-serif;
  color: #323232;
  border-radius: 12px;
  border: 5px solid #5E5E5E;
  padding: 0.7vw;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  background-color: #D9D9D9;
  position: absolute;
  left: 5vw;
  height: 10vh;
  width: 24vw;
  font-size: 2vw;
}
.color-btn.red {
  cursor: pointer;
  height: 100%;
  width: 49%;
  background-color: #7A313D;
  border: 3px solid #4B171D;
  color: white;
}
.color-btn.yellow {
  cursor: pointer;
  width: 49%;
  height: 100%;
  background-color: #BAC337;
  border: 3px solid #4B4517;
  color: black;
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

