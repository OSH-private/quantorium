<template>
  <div class="scaling-wrapper">
    <div class="scene">
      <button class="start-button" @click="Perehod1">СТАРТ</button>
    </div>
  </div>
</template>

<script>
import { router } from "../router/index.js";

export default {
  methods: {
    async Perehod1() {
      await this.goFullscreen();

      if (!window.audio) {
        window.audio = new Audio("../../public/background.mp3");
        window.audio.loop = true;
        window.audio.volume = 0.5;

        try {
          await window.audio.play();
        } catch (err) {
          console.warn("Автовоспроизведение не удалось:", err);
        }
      }

      router.push({ path: "/comic" });
    },

    goFullscreen() {
      const el = document.documentElement;
      if (el.requestFullscreen) return el.requestFullscreen();
      else if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) return el.msRequestFullscreen();
      else {
        console.warn("Fullscreen API не поддерживается");
        return Promise.resolve();
      }
    }
  }
};
</script>

<style scoped>
/* Контейнер, заполняющий экран и масштабирующий сцену */
.scaling-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  overflow: hidden;
}

/* "Сцена" с фиксированным соотношением сторон, масштабируется целиком */
.scene {
  position: relative;
  width: 1920px;
  height: 1080px;
  background-image: url("../../public/startimage.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform-origin: top left;
  scale: 1;
}

/* Автоматическое масштабирование сцены под экран */
.scaling-wrapper .scene {
  transform: scale(calc(100vw / 1920));
}

/* Для экранов с малой высотой – масштаб по высоте */
@media (max-aspect-ratio: 16/9) {
  .scaling-wrapper .scene {
    transform: scale(calc(100vh / 1080));
  }
}

.start-button {
  position: absolute;
  left: 50%;
  top: 62%;
  transform: translateX(-50%);
  width: 400px;
  height: 140px;
  background-image: url("../../public/start_button.png");
  background-size: cover;
  background-color: transparent;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0;
  color: rgba(0, 0, 0, 0);
  transition: transform 0.3s ease-out;
  z-index: 10;
}

.start-button:hover {
  transform: translateX(-50%) scale(1.05);
}
</style>