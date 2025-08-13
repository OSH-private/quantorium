<script>
import { router } from "../router/index.js";

// Импорт эмоций
import e1 from "../assets/e1.svg";
import e2 from "../assets/e2.svg";
import e3 from "../assets/e3.svg";
import e4 from "../assets/e4.svg";
import e5 from "../assets/e5.svg";
import e6 from "../assets/e6.svg";
import e7 from "../assets/e7.svg";
import e8 from "../assets/e8.svg";

export default {
  data() {
    return {
      dialogue: [
        { text: "Вау!", emotion: e4 },
        { text: "Смотри какой грузовик!", emotion: e4 },
        { text: "Кстати в нём лежит какая то батарейка.", emotion: e4 },
        { text: "Думаю это и есть то питание для ядра.", emotion: e1 },
        { text: "Тогда давай поможем грузовичку доехать!", emotion: e2 }
      ],
      dialogueIndex: 0,
      typedText: "",
      typingInterval: null,
      showCharacter: true,
      isExiting: false,
      dialogueFinished: false,
      hoverQuest: null
    };
  },

  computed: {
    currentLine() {
      return this.dialogue[this.dialogueIndex].text;
    },
    currentEmotion() {
      return this.dialogue[this.dialogueIndex].emotion;
    },
    buttonsDisabled() {
      return !this.dialogueFinished || this.typedText !== this.currentLine;
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
      }, 40);
    },

    advanceDialogue() {
      if (this.typingInterval) clearInterval(this.typingInterval);

      if (this.typedText !== this.currentLine) {
        this.typedText = this.currentLine;
        return;
      }

      if (this.dialogueIndex < this.dialogue.length - 1) {
        this.dialogueIndex++;
      } else {
        this.isExiting = true;
        this.dialogueFinished = true;
        setTimeout(() => {
          this.showCharacter = false;
        }, 1000);
      }
    },
    Perehod4() {
      if (this.buttonsDisabled) return;
      router.push({ path: "/quest3" });
    }
  }
};
</script>

<template>
  <div class="div1" @click="advanceDialogue">
    <!-- Фон -->
    <img src="../assets/gar.svg" alt="Фон" class="background-img" />
    <img
        class="character-behind"
        :class="{ exit: isExiting }"
        :src="currentEmotion"
        alt="Персонаж"
    />

    <!-- Диалоговое окно -->
    <div v-if="showCharacter" class="dialogue-container" :class="{ exit: isExiting }">
      <p>{{ typedText }}</p>
    </div>
    <div class="final-btn">
      <button
          @click.stop="Perehod4"
          :disabled="buttonsDisabled"
      >НАЧАТЬ</button>
    </div>
  </div>
</template>

<style scoped>
.div1 {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: black;
  user-select: none;
}

/* Фон */
.background-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.quest-container.hover .quest-contour {
  opacity: 1;
}

/* Персонаж позади диалога */
.character-behind {
  position: absolute;
  bottom: -300px;
  right: 2vw;
  height: 130vh;
  z-index: 20;
  object-fit: contain;
  transition: transform 1s ease, opacity 1s ease;
}

.character-behind.exit {
  transform: translateX(100%);
  opacity: 0;
}

/* Диалоговое окно */
.dialogue-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30vh;
  z-index: 60;
  background: rgba(0, 0, 0, 0.6);
  transition: transform 1s ease, opacity 1s ease;
  display: flex;
  align-items: flex-start;
  padding: 2vw;
  box-sizing: border-box;
}

.dialogue-container.exit {
  transform: translateX(100%);
  opacity: 0;
}

.dialogue-container p {
  position: absolute;
  font-size: 3vw;
  color: white;
  max-width: 100%;
  margin: 0;
}

.final-btn {
  position: absolute;
  bottom: 5vh;
  left: 90%;
  transform: translateX(-50%);
  z-index: 50;
}

.final-btn button {
  font-size: 2vw;
  padding: 1vw 2vw;
  background-color: rgba(230, 210, 170, 0.9);
  border: none;
  cursor: pointer;
  border-radius: 12px;
  transition: opacity 0.3s;
}

.final-btn button:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
