<script>
import {router} from "../router/index.js";

export default {
  methods: {
    Perehod2() {
      router.push({path: '/quest1'});
    },
    Perehod3() {
      router.push({path: '/quest2'});
    },
    Perehod4() {
      router.push({path: '/quest3'});
    },
    Perehod5() {
      router.push({path: '/final'});
    }

  }
}
</script>

<template>
  <div>
    <div class="div1">
      <p style="font-size: 6vw; color: #eef2ff">
        Выбери квест
      </p>
      <div class="div2">
        <button class="bot1" @click="Perehod2">
          квест 1
        </button>
        <button class="bot1" @click="Perehod3">
          квест 2
        </button>
        <button class="bot1" @click="Perehod4">
          квест 3
        </button>
      </div>
      <div>
        <button class="bot1" style="margin-top: 5vw" @click="Perehod5">
          ФИНАЛ
          </button>/
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #467dbe;
}

.div1 {
  width: 100vw;
  height: 100vh;


  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(70, 125, 190);
}

.bot1 {
  font-size: 2vw;
  height: 5vw;
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