<script>
import { router } from "../router/index.js";
import c1 from '../assets/c1.png';
import c2 from '../assets/c2.png';
import c3 from '../assets/c3.png';
import c4 from '../assets/c4.png';

export default {
  data() {
    return {
      currentFrame: 1,
      frames: [c1, c2, c3, c4],
    };
  },
  methods: {
    nextFrame() {
      if (this.currentFrame < 4) {
        this.currentFrame++;
      } else {
        router.push({ path: "/roadmap" });
      }
    },
  },
};
</script>

<template>
  <div class="divcom">
  <div class="comic-grid" @click="nextFrame">
    <div v-if="currentFrame >= 1" class="comic-frame top-left">
      <img :src="frames[0]" class="com" />
    </div>
    <div v-if="currentFrame >= 2" class="comic-frame top-right">
      <img :src="frames[1]" class="com" />
    </div>
    <div v-if="currentFrame >= 3" class="comic-frame bottom-left">
      <img :src="frames[2]" class="com" />
    </div>
    <div v-if="currentFrame >= 4" class="comic-frame bottom-right">
      <img :src="frames[3]" class="com" />
    </div>

    <div class="progress-indicator">
      Прогресс: {{ currentFrame }} / 4
    </div>
  </div>
  </div>
</template>

<style scoped>
.divcom {
  background-color: #000;
  width: 100vw;
  height: 100vh;
}

.comic-grid {
  background-color: #000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  width: 90vw;
  max-width: 1500px;
  height: 90vh;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  cursor: pointer;
}

.comic-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #333;
  border-radius: 10px;
  background-color: #fff;
  animation: fadeIn 0.4s ease-in-out;
  overflow: hidden;
}

.com {
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 100%;
  border-radius: 8px;
}

/* Расположение по углам */
.top-left {
  grid-area: 1 / 1;
}
.top-right {
  grid-area: 1 / 2;
}
.bottom-left {
  grid-area: 2 / 1;
}
.bottom-right {
  grid-area: 2 / 2;
}

.progress-indicator {
  position: absolute;
  bottom: 10px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  padding: 6px 12px;
  border-radius: 6px;
  font-style: italic;
  font-size: 14px;
  color: #555;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>