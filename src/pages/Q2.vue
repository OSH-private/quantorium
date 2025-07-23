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
        { text: "Ого!", emotion: e4 },
        { text: "Даже свет не горит.", emotion: e7 },
        { text: "Похоже что с проводами что то случилось при перенапряжении.", emotion: e2 },
        { text: "Давай посмотрим и попробуем починить.", emotion: e1 },
        { text: "Начни с любого щитка, а я тебе помогу!", emotion: e2 }
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

    setHoverQuest(num) {
      this.hoverQuest = num;
    },
    clearHoverQuest() {
      this.hoverQuest = null;
    },

    Perehod2() {
      if (this.buttonsDisabled) return;
      router.push({ path: "/P1" });
    },
    Perehod3() {
      if (this.buttonsDisabled) return;
      router.push({ path: "/P2" });
    },
    PerehodG() {
      if (this.buttonsDisabled) return;
      router.push({ path: "/P3" });
    },
    Perehod4() {
      if (this.buttonsDisabled) return;
      router.push({ path: "/P4" });
    },
    Perehod5() {
      if (this.buttonsDisabled) return;
      router.push({ path: "/roadmap" });
    }
  }
};
</script>

<template>
  <div class="div1" @click="advanceDialogue">
    <!-- Фон -->
    <img src="../assets/ceh1.svg" alt="Фон" class="background-img" />

    <!-- Контуры квестов -->
    <div class="quest-images">
      <div class="quest-container" :class="{ hover: hoverQuest === 1 }">
        <img src="../assets/z1.svg" alt="Контур 1" class="quest-contour" />
      </div>
      <div class="quest-container" :class="{ hover: hoverQuest === 2 }">
        <img src="../assets/z2.svg" alt="Контур 2" class="quest-contour" />
      </div>
      <div class="quest-container" :class="{ hover: hoverQuest === 3 }">
        <img src="../assets/z3.svg" alt="Контур 3" class="quest-contour" />
      </div>
      <div class="quest-container" :class="{ hover: hoverQuest === 4 }">
        <img src="../assets/z4.svg" alt="Контур 4" class="quest-contour" />
      </div>
    </div>

    <!-- Персонаж позади диалога -->
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

    <!-- Кнопки зданий -->
    <div class="button-layer">
      <button
          class="invisible-btn btn-quest1"
          @mouseenter="setHoverQuest(1)"
          @mouseleave="clearHoverQuest"
          @click.stop="Perehod2"
          :disabled="buttonsDisabled"
      ></button>
      <button
          class="invisible-btn btn-quest2"
          @mouseenter="setHoverQuest(2)"
          @mouseleave="clearHoverQuest"
          @click.stop="Perehod3"
          :disabled="buttonsDisabled"
      ></button>
      <button
          class="invisible-btn btn-quest3"
          @mouseenter="setHoverQuest(3)"
          @mouseleave="clearHoverQuest"
          @click.stop="PerehodG"
          :disabled="buttonsDisabled"
      ></button>
      <button
          class="invisible-btn btn-quest4"
          @mouseenter="setHoverQuest(4)"
          @mouseleave="clearHoverQuest"
          @click.stop="Perehod4"
          :disabled="buttonsDisabled"
      ></button>
    </div>

    <!-- ФИНАЛ -->
    <div class="final-btn">
      <button
          @click.stop="Perehod5"
          :disabled="buttonsDisabled"
      >НАЗАД</button>
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

/* Контуры квестов */
.quest-images {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
}

.quest-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.quest-contour {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.quest-container.hover .quest-contour {
  opacity: 1;
}

/* Персонаж позади диалога */
.character-behind {
  position: absolute;
  bottom: -100px;
  right: 2vw;
  height: 90vh;
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

/* Кнопки зданий */
.button-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 30;
}

.invisible-btn {
  position: absolute;
  background: transparent;
  border: none;
  cursor: pointer;
}

.invisible-btn:disabled {
  cursor: default;
  pointer-events: none;
}

/* Индивидуальное позиционирование кнопок */
.btn-quest1 {
  top: 25.5%;
  left: 15.5%;
  width: 8.5%;
  height: 18.5%;
}

.btn-quest2 {
  top: 52%;
  left: 28%;
  width: 9.5%;
  height: 20%;
}

.btn-quest3 {
  top: 25%;
  left: 72%;
  width: 7.4%;
  height: 15%;
}

.btn-quest4 {
  top: 32.5%;
  left: 84.2%;
  width: 10%;
  height: 19%;
}

/* Кнопка ФИНАЛ ниже диалога */
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