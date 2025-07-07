<script>
import { router } from "../router/index.js";

export default {
  methods: {
    async Perehod1() {
      await this.goFullscreen();

      // Инициализируем и запускаем музыку один раз
      if (!window.audio) {
        window.audio = new Audio("../../public/background.mp3");
        window.audio.loop = true;
        window.audio.volume = 0.5;

        try {
          await window.audio.play(); // запускаем звук
        } catch (err) {
          console.warn("Автовоспроизведение не удалось:", err);
        }
      }

      router.push({ path: "/comic" });
    },

    goFullscreen() {
      const el = document.documentElement;

      if (el.requestFullscreen) {
        return el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        return el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        return el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        return el.msRequestFullscreen();
      } else {
        console.warn("Fullscreen API не поддерживается");
        return Promise.resolve();
      }
    }
  }
};
</script>

<template>
  <div class="container">
    <button class="bot1" @click="Perehod1">
      СТАРТ
    </button>
  </div>
</template>

<style scoped>
:global(html, body) {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.container {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-drag: none;
  -webkit-user-drag: none;
  width: 100vw;
  height: 100vh;
  background-image: url('../../public/startimage.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 9vw;
  box-sizing: border-box;
}

.bot1 {
  display: flex;
  color: #f5f7db;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  font-size: 5vw;
  height: 5.5vw;
  width: 21vw;
  background-color: rgb(0, 0, 0);
  font-weight: 900;
}
</style>