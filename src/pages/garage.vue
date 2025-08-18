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
import {useGarageStore} from "../stores/index.js";

export default {
  data() {
    return {
      dialogue: [
        { text: "Вау!", emotion: e4 },
        { text: "Смотри какой грузовик!", emotion: e4 },
        { text: "Кстати в нём лежит какая то батарейка.", emotion: e1 },
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
    //useGarageStore().setDialogueSeen(false)
    const garageStore = useGarageStore();

    if (garageStore.dialogueSeen) {
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

        const garageStore = useGarageStore();
        garageStore.setDialogueSeen(true);

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
  <div class="div1" @click="handleClick">
    <!-- Фон -->
    <img src="../assets/gar.svg" alt="Фон" class="background-img" />
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
      <button class="final-btn"
          @click.stop="Perehod4"
          :disabled="buttonsDisabled"
      ><p>
        НАЧАТЬ
      </p>
      </button>
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
.final-btn p{
  font-size: max(6vh, 3vw);
  height: 100%;
  text-align: center;
  margin: 0;
  width: 100%;
}

.final-btn {
  left: 39vw;
  position: absolute;
  bottom: 6vh;
  z-index: 50;
  transition: all 0.3s ease;
  width: 22vw;
  height: max(10vh, 6vw);
  padding: 1vw 2vw;
  background-color: rgba(230, 210, 170, 0.9);
  color: white;
  border: 4px solid rgb(200,150,110,9) ;
  cursor: pointer;
  border-radius: 12px;
}

.final-btn:hover{
  scale:120%;
}

.final-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
