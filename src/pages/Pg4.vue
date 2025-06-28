<script>
import {router} from "../router/index.js";

export default {
  methods: {
    Perehod1() {
      router.push({path: '/roadmap'});
    }
  }
}
</script>

<template>
  <div>
    <div class="div1">
      <p style="font-size: 6vw; color: #eef2ff">
        КВЕСТ 3
      </p>
      <p style="font-size: 4vw; color: #eef2ff">
        тут типа будет головоломка
      </p>
      <div class="div2">
        <button class="fnbt1" onclick="unlockFourthPage()">
          кнопка для финала
        </button>
        <button class="bot1" @click="Perehod1">
          Переход на roadmap
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.div1 {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #0b0b38;
  background: linear-gradient(0deg, rgb(0, 0, 0) 0%, rgb(63, 85, 179) 53%, rgb(0, 0, 0) 100%);
}

.fnbt1 {
  font-size: 4vw;
  height: 10vw;
  width: 50vw;
  background-color: rgb(255, 189, 41);
}

.bot1 {
  color: white;
  margin-top: 1vw;
  font-size: 4vw;
  height: 10vw;
  width: 50vw;
  background-color: rgb(70, 125, 190);
}
.div2 {
  font-size: 40vw;
  margin-top: 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>