<script>
import {router} from "../router/index.js";
import html2canvas from "html2canvas";
import e4 from "../assets/e4.svg";
import e1 from "../assets/e1.svg";
import e2 from "../assets/e2.svg";
import {
  useFinalStore,
  useGarageStore,
  useHomeStore,
  useItemStore,
  useQuestsStore,
  useWiresStore
} from "../stores/index.js";

export default {
  data(){
    return{
      text: "Готово",
      showSaveBtn: false, // управление кнопкой "Сохранить"
      name: "",
      surname: "",
      location: "",
      date:"",
      dialogue: [
        { text: "Прежде чем ты уйдешь, я бы хотел подарить тебе это, на память", emotion: e4 },
        { text: "Попроси учителя или взрослых, чтобы помогли вместе заполнили данные о тебе", emotion: e2},
        { text: "До встречи!", emotion: e1 },

      ],
      dialogueIndex: 0,
      typedText: "",
      typingInterval: null,
      showCharacter: true,
      isExiting: false,
      dialogueFinished: false,
      hoverQuest: null
    }
  },
  mounted() {
    //useFinalStore().setDialogueSeen(false)
    const finalStore = useFinalStore();

    if (finalStore.dialogueSeen) {
      this.showCharacter = false;
      this.dialogueFinished = true;
      this.typedText = this.currentLine;
    } else {
      this.typeText();
    }
  },
  computed:{
    currentLine() {
      return this.dialogue[this.dialogueIndex].text;
    },
    currentEmotion() {
      return this.dialogue[this.dialogueIndex].emotion;
    },
  },
  watch: {
    dialogueIndex() {
      this.typeText();
    }
  },
  methods: {
    async sendToGoogleSheet(surname, name, location, date) {
      await fetch("https://script.google.com/macros/s/AKfycbwvNjRA8vA_CK3H8XPm6CjE5peG5YNVobXAQft7hqyop2zav3tPsfJDRWTAxr_6zzg/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          family_name: surname,
          name: name,
          city: location,
          birthdate: date
        })
      });
    },
    goToPrivacyPolicy() {
      this.$router.push('/privacy');
    },
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

        const finalStore = useFinalStore();
        finalStore.setDialogueSeen(true);

        setTimeout(() => {
          this.showCharacter = false;
        }, 1000);
      }
    },
    Perehod1() {
      router.push({path: '/roadmap'});
    },
    Save() {
      this.name = this.$refs.nameInput.value;
      this.surname = this.$refs.surnameInput.value;
      this.location = this.$refs.locationInput.value;
      this.date = this.$refs.date.value;
      if(!this.name || !this.surname || !this.location || !this.date)
      {return alert('Вы заполнили не все поля!')}
      if(this.$refs.agree.checked===false){
        return alert('Вы должны дать согласие на обработку данных')
      }
      this.sendToGoogleSheet(this.surname, this.name, this.location, this.date);
      this.showSaveBtn = true;
    },
    Download() {
      const block = this.$refs.grammBlock;
      document.fonts.ready.then(() => {
      html2canvas(block, { scale: 2 }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "gramota.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
      })
      useItemStore().setDialogueSeen(false)
      useGarageStore().setDialogueSeen(false)
      useHomeStore().setDialogueSeen(false)
      useQuestsStore().cleanQuests()
      useWiresStore().setDialogueSeen(false)
      localStorage.setItem("quest1_success_seen", "false");
      localStorage.setItem("quest2_success_seen", "false");
      localStorage.setItem("quest3_success_seen", "false");
      setTimeout(() => {
        router.push({path: '/'})
      }, 5000);
    },
  }
}
</script>

<template>
  <div class="wrapper" @click="handleClick">

    <img v-if="showCharacter"
         class="character-behind"
         :class="{ exit: isExiting }"
         :src="currentEmotion"
         alt="Персонаж"
    />
    <div v-if="showCharacter" class="dialogue-container" :class="{ exit: isExiting }">
      <p>{{ typedText }}</p>
    </div>

    <div v-if="!showSaveBtn" @click="Save" class="button">
      <p>Готово</p>
    </div>
    <div v-if="showSaveBtn" @click="Download" class="button">
      <p>Сохранить</p>
    </div>
    <div class="police">
      <input ref="agree" type="checkbox">
      <p>Согласен с <a href="#" @click.prevent="goToPrivacyPolicy"> политикой обработки персональных данных</a></p>
    </div>

    <div ref="grammBlock" class="gramm">
      <div class="topText">
        <p>Грамота за успешное прохождение
          приключения с Роби</p>
      </div>
      <div class="middle">
        <template v-if="!showSaveBtn">
          <input ref="nameInput" placeholder="Имя:" />
          <input ref="surnameInput" placeholder="Фамилия:" />
        </template>
        <template v-else>
          <p class="print-text">{{ name }}</p>
          <p class="print-text">{{ surname }}</p>
        </template>
      </div>
      <div class="lines">
        <hr class="line">
        <hr class="line">
      </div>

      <div class="bottom">
        <template v-if="!showSaveBtn">
          <textarea ref="locationInput" placeholder="Место проживания:"></textarea>
        </template>
        <template v-else>
          <p class="print-text">{{ location }}</p>
        </template>
        <div class="date_div" v-if="!showSaveBtn">
          <p class="date_txt">Дата рождения:</p>
          <input class="date" ref="date" type="date" />
        </div>
        <div class="date_div" v-else>
          <p class="print-text">Дата рождения:</p>
          <p class="date">{{date}}</p>
        </div>
      </div>
      <div class="robot">
        <img src="/maskot.svg">
      </div>
      <div class="wave">
        <img src="/wave.svg">
      </div>
      <div class="qwantr">
        <img src="/qwant.svg">
      </div>
    </div>
  </div>
</template>

<style scoped>
.date{
  height: 50%  !important;
  margin-left: -60% !important;
  margin-top: 0.2%;
  cursor: pointer;
  width: 35% !important;
}
.date_div{
  margin-right: auto;
  display: flex;
  flex-direction: row;
  width: 90%; justify-content: left;
  height: 30%;
}
.button p{
  font-weight: bold;
  font-size: 3vw;
  font-family: Arial, sans-serif;
  text-align: center;
}
.button{
  position: absolute;
  align-items: center;
  z-index: 10;
  bottom: 8%;
  width: 12vw;
  height: max(6vh, 3vw);
  padding: 1vw 2vw;
  text-align: center;
  justify-content: center;
  display: flex;
  background-color: rgba(230, 210, 170, 1);
  color: white;
  border: 4px solid rgb(200,150,110,9) ;
  right: 3%;
  cursor: pointer;
  border-radius: 12px;
}
.lines{
  width: 80%;
  gap: 5%;
  display: flex;
  margin-right: auto;
  margin-left: auto;
  flex-direction: row;
}
.line{
  width: 45%;
  color: black;
  border: 2px solid;
  margin-bottom: 6%;
}
.middle input, .middle p{
  font-weight: bold;
  font-family: Arial, sans-serif;
  font-size: min(3vw, 5vh);
  width: 50%;
  height: 50%;
  border: 0;
}
.bottom input, .bottom p{
  margin-right: auto;
  font-weight: bold;
  font-family: Arial, sans-serif;
  font-size: min(3vw, 5vh);
  width: 32%;
  height: 30%;
  border: 0;
}
.middle{
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 10%;
  width: 80%;
}
.bottom textarea, .bottom p{
  margin-right: auto;
  font-weight: bold;
  font-family: Arial, sans-serif;
  resize: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: min(3vw, 5vh);
  width: 90%;
  height: 50%;
  border: 0;
}
.bottom{
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 35%;
  width: 80%;
}
.topText{
  margin-top: 5%;
  margin-left: 18%;
  width: 80%;
  height: 20%;
}
.topText p{
  font-size: min(3vw, 5vh);
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-style:italic;
}
.police{
  display: flex;
  position: absolute;
  justify-content: space-between;
  flex-direction: row;
  width: 40vw;
  bottom: 10vh;
  left: 20vw;
  height: auto;
  font-family: Arial, sans-serif;
  font-size: max(2vw, 3vh);
  z-index: 2;
}
.police input{
  margin-right: 4%;
  width: 8%;
}
img{
  width: 100%;
  height: 100%;
}
.gramm{
  flex-direction: column;
  display: flex;
  position: relative;
  aspect-ratio: 842/595;
  background-color: white;
  height: 90%;
  max-width: 90%;
}
.robot{
  opacity: 0.4;
  right: 0;
  bottom: 0;
  position: absolute;
  height: 70%;
  width: auto;
}
.wave{
  left: 0;
  bottom: 0;
  position: absolute;
  width: 70%;
  height: auto;
}
.qwantr{
  top: 4%;
  left: 4%;
  position: absolute;
  width: auto;
  height: 15%;
}
.wrapper{
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/fon_car.svg");
  width: 100vw;
  height: 100vh;
}
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
</style>
