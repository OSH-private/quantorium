<script>
import {router} from "../router/index.js";

export default {
  methods: {
    Perehod1() {
      router.push({path: '/comic'});
    }
  }
}
</script>

<template>
  <div>
    <div class="div1">
      <p style="font-size: 6vw; color: #eef2ff">
        ФАБРИКЕ ПИЗДЕЦ
      </p>
      <div class="looping-background"></div>
      <div class="div2">
        <button class="bot1" @click="Perehod1">
          НАЧАТЬ
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.looping-background {
  margin-top: 1vw;
  width: 100%;
  height: 600px;
  background-image: url('../../public/fon.png');
  background-repeat: repeat-x;
  background-size: contain;
  animation: scrollLeft 20s linear infinite;
}

@keyframes scrollLeft {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: -2602%;
  }
}

body {
  background-color: #2c2f66;
}
.div1 {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #0b0b38;
  background: linear-gradient(0deg, rgb(30, 90, 18) 0%, rgb(109, 207, 216) 53%, rgb(52, 173, 204) 100%);
}

.bot1 {
  border-radius: 30px;
  font-size: 4vw;
  height: 5vw;
  width: 20vw;
  background-color: rgb(230, 210, 170);
}
.div2 {
  font-size: 40vw;
  margin-top: 1vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>