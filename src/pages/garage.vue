<script>
import { router } from "../router/index.js";

export default {
  data() {
    return {
      dialogue: [
        "Это наш гараж с грузовиками.",
        "Ярик это просто смешной котик, он наш водитель грузовика (добавлен в шутку).",
        "Надо помочь Ярику отвезти БАТАРЕЮ ПИТАНИЯ в ЦЕНТРАЛЬНОЕ ЯДРО.",
        "Для этого пролагай маршрут по нашей карте, а Ярик по твоему маршруту довезёт батарею до ядра.",
        "Удачи!"
      ],
      dialogueIndex: 0,
      typedText: "",
      typingInterval: null,
      showCharacter: true,
      isExiting: false // для запуска анимации ухода
    };
  },

  computed: {
    currentLine() {
      return this.dialogue[this.dialogueIndex];
    }
  },

  watch: {
    dialogueIndex() {
      this.typeText();
    }
  },

  mounted() {
    this.typeText();
  },

  methods: {
    typeText() {
      clearInterval(this.typingInterval);
      this.typedText = "";
      let i = 0;
      this.typingInterval = setInterval(() => {
        if (i < this.currentLine.length) {
          this.typedText += this.currentLine[i];
          i++;
        } else {
          clearInterval(this.typingInterval);
        }
      }, 40); // скорость печати
    },

    advanceDialogue() {
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }

      if (this.typedText !== this.currentLine) {
        // если печатает — сразу весь текст
        this.typedText = this.currentLine;
        return;
      }

      if (this.dialogueIndex < this.dialogue.length - 1) {
        this.dialogueIndex++;
      } else {
        // анимация выхода
        this.isExiting = true;
        setTimeout(() => {
          this.showCharacter = false;
        }, 1000); // ждём окончания анимации
      }
    },

    Perehod1() {
      router.push({ path: '/roadmap' });
    },
    Perehod4() {
      router.push({ path: '/quest3' });
    }
  }
};
</script>

<template>
  <div class="div1" @click="advanceDialogue">
    <p class="title">маршрут</p>

    <!-- Диалоговый блок -->
    <div v-if="showCharacter" class="dialogue-container" :class="{ exit: isExiting }">
      <div class="dialogue-box">
        <p>{{ typedText }}</p>
      </div>
      <img class="character-image" src="../assets/pers.png" alt="Персонаж" />
    </div>

    <!-- Кнопки -->
    <div class="button-row">
      <button class="bot1" @click.stop="Perehod4">СТАРТ</button>
      <button class="bot1" @click.stop="Perehod1">НАЗАД</button>
    </div>
  </div>
</template>

<style scoped>
.dialogue-container {
  position: relative;
  bottom: 0vh;
  left: 0;
  width: 100%;
  height: 30vh;
  display: flex;
  z-index: 30;
  pointer-events: none;
  transition: transform 1s ease, opacity 1s ease; /* для абсолютного позиционирования персонажа */
}

.dialogue-box {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2vw;
  width: 100%;
  height: 100%;
  font-size: 3vw;
  overflow-y: auto;
  z-index: 31;
  pointer-events: auto;
  box-sizing: border-box;
}


.dialogue-container.exit {
  transform: translateX(100%);
  opacity: 0;
}

.character-image {
  height: 80vh;
  position: absolute;
  right: 2vw;
  bottom: 0;
  z-index: 29; /* ниже диалога */
  transition: transform 1s ease, opacity 1s ease;
}

.dialogue-container.exit .character-image {
  transform: translateX(-100%); /* картинка уходит влево */
  opacity: 0;
}

.button-row {
  position: absolute;
  bottom: 2vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 20vw;
  z-index: 10;
  max-width: 90vw;
  overflow-x: auto;
}

.bot1 {
  border-radius: 25px;
  font-size: 2vw;
  height: 4vw;
  min-width: 12vw;
  flex-shrink: 0;
  background-color: rgb(230, 210, 170);
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
  justify-content: space-between;
  background-image: url('../assets/fongarage.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
}

.title {
  font-size: 6vw;
  color: #000000;
  text-align: center;
}
</style>