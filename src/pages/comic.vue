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
      initialVolume: 0.5, // 💡 здесь настраивается ИСХОДНАЯ громкость
      volume: 0.5,         // будет установлена из initialVolume при запуске
    };
  },
  mounted() {
    // Установим начальную громкость при монтировании компонента
    this.volume = this.initialVolume;
    this.updateVolume();
  },
  methods: {
    nextFrame() {
      if (this.currentFrame < 4) {
        this.currentFrame++;
      } else {
        router.push({ path: "/roadmap" });
      }
    },
    updateVolume() {
      if (window.audio) {
        window.audio.volume = this.volume;
      }
    }
  }
};
</script>

<template>
  <div class="divcom">
    <!-- 🎚️ Слайдер громкости -->
    <div class="volume-control">
      <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" />
    </div>

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
    </div>
  </div>
</template>

<style scoped>
.divcom {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-drag: none;
  -webkit-user-drag: none;
  background-color: #000;
  width: 100vw;
  height: 100vh;
}

.comic-grid {
  background-color: #000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 90vw;
  max-width: 1500px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  cursor: pointer;
}
.comic-frame {
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.4s ease-in-out;
  overflow: hidden;

  margin-left: -125px;
  margin-right: -125px;
}

.com {
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 100%;

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
.volume-control {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  padding: 6px 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  height: 30px;
}

.volume-control input[type="range"] {
  width: 120px;
}
</style>