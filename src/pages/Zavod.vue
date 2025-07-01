<script>
import { router } from "../router/index.js";

export default {
  data() {
    return {
      dialogue: [
        "Привет!",
        "Меня зовут Роби.",
        "Я умный робот, созданный для помощи иследователям и рабочим с починкой нашей фабрики.",
        "Нажми на место, где ты хочешь нам помочь.",
        "Если ты не знаешь что выбрать, предлагаю помочь с починкой одного из наших роботов (квест1)!"
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

    Perehod2() {
      router.push({ path: '/quest1' });
    },
    Perehod3() {
      router.push({ path: '/quest2' });
    },
    PerehodG() {
      router.push({ path: '/garage' });
    },
    Perehod5() {
      router.push({ path: '/final' });
    }
  }
};
</script>

<template>
    <div class="div1" @click="advanceDialogue">
      <p class="title">Выбери квест</p>

      <!-- Диалоговый блок -->
      <div v-if="showCharacter" class="dialogue-container" :class="{ exit: isExiting }">
        <div class="dialogue-box">
          <p>{{ typedText }}</p>
        </div>
        <img class="character-image" src="../assets/pers.png" alt="Персонаж" />
      </div>

      <!-- Кнопки -->
      <div class="button-row">
        <button class="bot1" @click.stop="Perehod2">квест 1</button>
        <button class="bot1" @click.stop="Perehod3">квест 2</button>
        <button class="bot1" @click.stop="PerehodG">квест 3</button>
        <button class="bot1" @click.stop="Perehod5">ФИНАЛ</button>
      </div>
    </div>
</template>

<style scoped>
.dialogue-container {
  position: absolute;
  bottom: 0vh;
  left: 0;
  width: 100%;
  height: 30vh;
  display: flex;
  z-index: 30;
  pointer-events: none;
  transition: transform 1s ease, opacity 1s ease;
  position: relative; /* для абсолютного позиционирования персонажа */
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
  bottom: 5vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 2vw;
  z-index: 10;
  max-width: 90vw;
  overflow-x: auto;
}

.bot1 {
  font-size: 2vw;
  height: 5vw;
  min-width: 12vw;
  flex-shrink: 0;
  background-color: rgb(230, 210, 170);
}

.div1 {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-image: url('../assets/background.png');
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