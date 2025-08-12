<script>
import { router } from "../router/index.js";
import { useHomeStore } from "../stores/home";

// Импортируем эмоции
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
        { text: "Привет!", emotion: e1 },
        { text: "Меня зовут Роби.", emotion: e1 },
        { text: "Я умный робот, созданный для помощи исследователям и рабочим с починкой нашей фабрики.", emotion: e4 },
        { text: "Нажми на место, где ты хочешь нам помочь.", emotion: e1 },
        { text: "Если ты не знаешь что выбрать, предлагаю помочь с починкой одного из наших роботов (квест1)!", emotion: e4 }
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
    //useHomeStore().setDialogueSeen(false)
    const homeStore = useHomeStore();

    if (homeStore.dialogueSeen) {
      this.showCharacter = false;
      this.dialogueFinished = true;
      this.typedText = this.currentLine;
    } else {
      this.typeText();
    }
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

    handleClick() {
      if (!this.dialogueFinished && this.showCharacter) {
        this.advanceDialogue();
      }
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

        const homeStore = useHomeStore();
        homeStore.setDialogueSeen(true);

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
      router.push({ path: "/quest1" });
    },
    Perehod3() {
      if (this.buttonsDisabled) return;
      router.push({ path: "/quest2" });
    },
    PerehodG() {
      if (this.buttonsDisabled) return;
      router.push({ path: "/garage" });
    },
    Perehod5() {
      if (this.buttonsDisabled) return;
      router.push({ path: "/final" });
    }
  }
};
</script>

<template>
  <div class="div1" @click="handleClick">
    <!-- Фон -->
    <img src="../assets/zavodfon.svg" alt="Фон" class="background-img" />

    <!-- Картинки квестов -->
    <div class="quest-images">
      <div class="quest-container" :class="{ hover: hoverQuest === 1 }">
        <img src="../assets/b1.svg" alt="Квест 1" class="quest-img" />
        <img src="../assets/k1.svg" alt="Контур 1" class="quest-contour" />
      </div>
      <div class="quest-container" :class="{ hover: hoverQuest === 2 }">
        <img src="../assets/b2.svg" alt="Квест 2" class="quest-img" />
        <img src="../assets/k2.svg" alt="Контур 2" class="quest-contour" />
      </div>
      <div class="quest-container" :class="{ hover: hoverQuest === 3 }">
        <img src="../assets/b3.svg" alt="Квест 3" class="quest-img" />
        <img src="../assets/k3.svg" alt="Контур 3" class="quest-contour" />
      </div>
    </div>

    <!-- Персонаж позади диалога -->
    <img v-if="showCharacter"
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
          @click.stop="Perehod3"
          :disabled="buttonsDisabled"
      ></button>
      <button
          class="invisible-btn btn-quest2"
          @mouseenter="setHoverQuest(2)"
          @mouseleave="clearHoverQuest"
          @click.stop="Perehod2"
          :disabled="buttonsDisabled"
      ></button>
      <button
          class="invisible-btn btn-quest3"
          @mouseenter="setHoverQuest(3)"
          @mouseleave="clearHoverQuest"
          @click.stop="PerehodG"
          :disabled="buttonsDisabled"
      ></button>
    </div>

    <!-- ФИНАЛ -->
    <div class="final-btn">
      <button
          @click.stop="Perehod5"
          :disabled="buttonsDisabled"
      >ФИНАЛ</button>
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

/* Картинки квестов */
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

.quest-img,
.quest-contour {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  transition: opacity 0.4s ease;
}

.quest-contour {
  opacity: 0;
  z-index: -2;
}

.quest-container.hover .quest-contour {
  opacity: 1;
}

.quest-img {
  z-index: 2;
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
  top: 25%;
  left: 15%;
  width: 23.5%;
  height: 31%;
}

.btn-quest2 {
  top: 50%;
  left: 40%;
  width: 30%;
  height: 38%;
}

.btn-quest3 {
  top: 12%;
  left: 65%;
  width: 20%;
  height: 35%;
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
