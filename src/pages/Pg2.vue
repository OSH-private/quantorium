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
        КВЕСТ 1
      </p>
      <p style="font-size: 4vw; color: #eef2ff">
        тут типа будет головоломка
      </p>
      <div class="div2">
        <button class="bot1" @click="Perehod1">
          Переход на roadmap
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  background-color: rgb(44, 47, 102);
}

.bot1 {
  font-size: 4vw;
  height: 20vw;
  width: 50vw;
  background-color: rgb(230, 210, 170);
}
.div2 {
  font-size: 40vw;
  margin-top: 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>