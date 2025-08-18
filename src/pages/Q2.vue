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
import { useWiresStore} from "../stores/index.js";
import {useQuestsStore} from "../stores/index.js";


export default {
  data() {
    return {
      dialogueIntro: [
        { text: "Ого!", emotion: e4 },
        { text: "Даже свет не горит.", emotion: e7 },
        { text: "Похоже что с проводами что то случилось при перенапряжении.", emotion: e2 },
        { text: "Давай посмотрим и попробуем починить.", emotion: e1 },
        { text: "Начни с любого щитка, а я тебе помогу!", emotion: e2 }
      ],
      dialogueSuccess:[
        { text: "Ого!", emotion: e4},
        { text: "У тебя получилось!", emotion: e4 },
        { text: "Электричество восстановлено, можем идти дальше.", emotion: e2 },
      ],
      questsStore: useQuestsStore(),
      activeDialogue: [],
      activeDialogueId: "intro",
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
      const line = this.activeDialogue[this.dialogueIndex];
      return line ? line.text : "";
    },
    currentEmotion() {
      const line = this.activeDialogue[this.dialogueIndex];
      return line ? line.emotion : e1;
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
    //useQuestsStore().cleanQuests() //очистка пройденных заданий
    //localStorage.setItem("quest2_success_seen", "false"); //разблокировать повторный конечный диалог
    //useWiresStore().setDialogueSeen(false) //разблокировать повторный входной диалог


    const WiresStore = useWiresStore();

    const allDone = ['P1', 'P2', 'P3', 'P4'].every(id => this.questsStore.isQuestCompleted(id));
    const successSeen = JSON.parse(localStorage.getItem("quest2_success_seen") || "false");

    if (allDone && !successSeen) {
      this.startDialogue(this.dialogueSuccess, "success"); // <-- передаём сам массив
    } else if (WiresStore.dialogueSeen) {
      // Первый диалог уже показывали раньше — сразу разблокируем управление без показа
      this.showCharacter = false;
      this.dialogueFinished = true;
      this.typedText = this.currentLine;
    } else {
      // Первый визит — запускаем вступительный диалог
      this.startDialogue(this.dialogueIntro, "intro"); // <-- передаём сам массив
    }
  },

  methods: {
    startDialogue(dialogArray, id = "intro") {
      this.activeDialogue = dialogArray;
      this.activeDialogueId = id;
      this.dialogueIndex = 0;
      this.typedText = "";
      this.dialogueFinished = false;
      this.isExiting = false;
      this.showCharacter = true;
      this.typeText();
    },
    typeText() {
      clearInterval(this.typingInterval);
      this.typedText = "";
      let i = 0;
      const line = this.currentLine;

      this.typingInterval = setInterval(() => {
        if (i < line.length) {
          this.typedText += line[i++];
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

      if (this.dialogueIndex < this.activeDialogue.length - 1) {
        this.dialogueIndex++;
      } else {
        this.isExiting = true;
        this.dialogueFinished = true;

        const wiresStore = useWiresStore();

        if (this.activeDialogueId === "intro") {
          wiresStore.setDialogueSeen(true);
        } else if (this.activeDialogueId === "success") {
          localStorage.setItem("quest2_success_seen", "true");
        }

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
  <div class="div1" @click="handleClick">
    <!-- Фон -->
    <img src="../assets/ceh1.svg" alt="Фон" class="background-img" />

    <!-- Контуры квестов -->
    <div class="quest-images">
      <div class="quest-container" :class="{ hover: hoverQuest === 1 }" :style="{ opacity: questsStore.isQuestCompleted('P1') ? 0 : 1 }">
        <img src="../assets/z1.svg" alt="Контур 1" class="quest-contour" />
      </div>
      <div class="quest-container" :class="{ hover: hoverQuest === 2 }" :style="{ opacity: questsStore.isQuestCompleted('P2') ? 0 : 1 }">
        <img src="../assets/z2.svg" alt="Контур 2" class="quest-contour" />
      </div>
      <div class="quest-container" :class="{ hover: hoverQuest === 3 }" :style="{ opacity: questsStore.isQuestCompleted('P3') ? 0 : 1 }">
        <img src="../assets/z3.svg" alt="Контур 3" class="quest-contour" />
      </div>
      <div class="quest-container" :class="{ hover: hoverQuest === 4 }" :style="{ opacity: questsStore.isQuestCompleted('P4') ? 0 : 1 }">
        <img src="../assets/z4.svg" alt="Контур 4" class="quest-contour" />
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
          @click.stop="Perehod2"
          :disabled="buttonsDisabled || questsStore.isQuestCompleted('P1')"
      ></button>
      <button
          class="invisible-btn btn-quest2"
          @mouseenter="setHoverQuest(2)"
          @mouseleave="clearHoverQuest"
          @click.stop="Perehod3"
          :disabled="buttonsDisabled || questsStore.isQuestCompleted('P2')"
      ></button>
      <button
          class="invisible-btn btn-quest3"
          @mouseenter="setHoverQuest(3)"
          @mouseleave="clearHoverQuest"
          @click.stop="PerehodG"
          :disabled="buttonsDisabled || questsStore.isQuestCompleted('P3')"
      ></button>
      <button
          class="invisible-btn btn-quest4"
          @mouseenter="setHoverQuest(4)"
          @mouseleave="clearHoverQuest"
          @click.stop="Perehod4"
          :disabled="buttonsDisabled || questsStore.isQuestCompleted('P4')"
      ></button>
    </div>

    <!-- ФИНАЛ -->
    <button @click.stop="Perehod5"
         :disabled="buttonsDisabled" class="final-btn">
      <p>НАЗАД</p>
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
  opacity: 1;
  transition: opacity 0.4s ease;
}

.quest-container.hover .quest-contour {
  opacity: 0.5;
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
  background-color: rgba(230, 210, 170, 1);
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
