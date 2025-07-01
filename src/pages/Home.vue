<script>
import { router } from "../router/index.js";

export default {
  methods: {
    Perehod1() {
      router.push({ path: '/comic' });
    }
  }
}
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