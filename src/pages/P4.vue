<script>
import {router} from "../router/index.js";

export default {
  methods: {
    Perehod3() {
      router.push({path: '/quest2'});
    }
  }
}
</script>

<template>
  <div>
    <div class="div1">
      <p style="font-size: 4vw; color: #92b3d3">
        КВЕСТ 4
      </p>
      <div class="div2">
        <button class="bot1" @click="Perehod3">
          выйти
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.div1 {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-drag: none;
  -webkit-user-drag: none;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-image: url('../assets/provoda.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
}

.bot1 {
  color: white;
  margin-top: 1vw;
  font-size: 5vw;
  height: 7vw;
  width: 20vw;
  border-radius: 25px;
  background-color: rgb(70, 125, 190);
}
.div2 {
  font-size: 40vw;
  margin-top: 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 75vw;
  margin-bottom: 2vw;
}
</style>