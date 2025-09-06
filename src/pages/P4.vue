<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { router } from '../router/index.js'
import {useQuestsStore} from "../stores/index.js";

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 400

const red = { x: 0.1, y: 0 , image:'/red_p_end.svg',}
const blue = { x: 0.1, y: 0.5, image:'/blue_p_end.svg', }
const green = { x: 0.1, y: 1, image:'/green_p_end.svg',}

const filter = { x: 0.5, y: 0.5 }
const lamp = { x: 0.9, y: 0.5 }

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

const Perehod5 = () => {
  const questsStore = useQuestsStore()
  questsStore.markQuestComplete("P4") // пометили как завершённый
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

      <!-- Источники -->
      <circle :cx="red.x * VIEWBOX_WIDTH" :cy="red.y * VIEWBOX_HEIGHT" r="20" class="items" fill="red" @mousedown="startDrag('red', $event)" />
      <circle :cx="green.x * VIEWBOX_WIDTH" :cy="green.y * VIEWBOX_HEIGHT" r="20" class="items" fill="green" @mousedown="startDrag('green', $event)" />
      <circle :cx="blue.x * VIEWBOX_WIDTH" :cy="blue.y * VIEWBOX_HEIGHT" r="20" class="items" fill="blue" @mousedown="startDrag('blue', $event)" />
      <image :x="red.x * VIEWBOX_WIDTH-25" :y="red.y * VIEWBOX_HEIGHT-25" width="50" height="50" cursor="pointer" :href="red.image" class="items" @mousedown="startDrag('red', $event)" />
      <image :x="green.x * VIEWBOX_WIDTH-25" :y="green.y * VIEWBOX_HEIGHT-25" width="50" height="50" cursor="pointer"  :href="green.image" class="items" @mousedown="startDrag('green', $event)" />
      <image :x="blue.x * VIEWBOX_WIDTH-25" :y="blue.y * VIEWBOX_HEIGHT-25" width="50" height="50" cursor="pointer"  :href="blue.image" class="items" @mousedown="startDrag('blue', $event)" />

      <!-- Фильтр -->
      <image
          :x="filter.x * VIEWBOX_WIDTH - 50"
          :y="filter.y * VIEWBOX_HEIGHT - 50"
          width="100"
          height="100"
          class="items"
          href="/filter.svg"
          @mousedown="startDrag('filter', $event)"
      />

      <!-- Лампа -->
      <circle :cx="lamp.x * VIEWBOX_WIDTH" :cy="lamp.y * VIEWBOX_HEIGHT"  class="items" :fill="allCorrect ? 'lime' : '#444'" />
      <image :x="lamp.x * VIEWBOX_WIDTH-25" :y="lamp.y * VIEWBOX_HEIGHT-25" width="50" height="50"  class="items" :href="allCorrect ? '/green_p_end.svg' : '/gray_p_end.svg'" />
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
      <div v-if="!allCorrect" class="btns" @click="reset">
        Сбросить
      </div>
      <div v-if="allCorrect" class="end">
        <div class="success"><p>Обе лампы зажглись!</p></div>
        <div class="btns" @click="Perehod5"><p>Готово</p></div>
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
