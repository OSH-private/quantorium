<script>
import {router} from "../router/index.js";

export default {
  created() {
  },
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
      <p class="text1">
        ФИНАЛ
      </p>
      <div class="sert">
        <img src="../../public/gifka.gif" class="norm"/>
        <img src="../../public/sert.png" class="sertik"/>
      </div>
      <div class="div2">
        <button class="bot1" @click="Perehod1">
          вернутся обратно
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.sert{
  width: 40vh;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: rgb(253, 253, 253);
}

.text1 {
  font-size: 4vh;
  color: white;
}

.norm {
  justify-content: center;
  width: 15vh;
}

.sertik {
  justify-content: center;
  width: 35vh;
}
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
  justify-content: center;
  align-items: center;
  background-color: rgb(0, 190, 150);
}

.bot1 {
  font-size: 3vh;
  height: 5vh;
  width: 30vh;
  background-color: rgb(230, 210, 170);
  margin-bottom: 0;
}
.div2 {
  margin-top: 1vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>