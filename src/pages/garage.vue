<script>
import { router } from "../router/index.js";

export default {
  data() {
    return {
      dialogue: [
        "...",
        "...",
        "Ярик блять",
        "Ты должен был перевезти батарейку, какого хуя ты всё еще тут торчиш, уебан усатый сука",
        "(ЯРИК) МЯУ МЯУ МЯУ МЯУ МЯУ МЯУ МЯУ",
        "(ЯРИК) МЯУ ЕБАНЫЕ МЯУ ЛОГИСТЫ МЯУ МЯУ МЯУ",
        "(ЯРИК) МЯУ МЯУ ПИДОРАСЫ МЯУ МЯУ МАРШРУТЫ МЯУ",
        "(ЯРИК) МЯУ ХУЯУ ПЕРЕПУТАЛИ БЛЯУ МЯУ МЯУ ХУЯУ",
        "Бля.., Я НИХУЯ НЕ ПОНИАМЮ",
        "Ладно",
        "Похуй",
        "Ща ченибуть придумаем хуй волосатый, только не уходи",
        "ТАК, ты бля игрок ебаный, помоги ярику доехать до ядра с батарейкой, а то ему тяжело",
        "У него же лапки",
        "ВСЁ кароче ЗАНИМАЙСЯ нахуй"
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
    <p class="title">КУДА РУЛИТЬ БЛЯ</p>

    <!-- Диалоговый блок -->
    <div v-if="showCharacter" class="dialogue-container" :class="{ exit: isExiting }">
      <div class="dialogue-box">
        <p>{{ typedText }}</p>
      </div>
      <img class="character-image" src="../assets/pers.png" alt="Персонаж" />
    </div>

    <!-- Кнопки -->
    <div class="button-row">
      <button class="bot1" @click.stop="Perehod4">НУ ГО ПОМОЖЕМ</button>
      <button class="bot1" @click.stop="Perehod1">НУ НАХУЙ</button>
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