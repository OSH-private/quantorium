<script>
import {router} from "../router/index.js";
import {useGarageStore, useItemStore, useWiresStore} from "../stores/index.js";
import HorBar from "../components/HorBar.vue";
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
  components:{HorBar},
  data(){
    return{
      //для диалога
      dialogueIntro: [
        { text: "О нет, робот сломан!", emotion: e4 },
        { text: "Кажется ему не хватает деталей", emotion: e4 },
        { text: "Рядом есть склад, возможно там мы найдем что-то полезное", emotion: e1 },
        { text: "Попробуй отыскать все и подставить в робота", emotion: e1 },
      ],
      dialogueSuccess:[
        { text: "Ого!", emotion: e4},
        { text: "У тебя получилось!", emotion: e4 },
        { text: "Робот как новенький, можем идти дальше", emotion: e2 },
      ],
      activeDialogue: [],
      activeDialogueId: "intro",
      dialogueIndex: 0,
      typedText: "",
      typingInterval: null,
      showCharacter: true,
      isExiting: false,
      dialogueFinished: false,

      //остальное
      garage:false,
      itemStore: useItemStore(),
      draggedItem: null,
      foundItems: {},
      counter: 0,
      naming: "",
      robotSlots: [
        { id: "detail1", top: "-4%", left: "29%", width: "30%",  item: null },
        { id: "detail2", top: "50%", left: "-9%", width: "24%", item: null },
        { id: "detail3", top: "41.8%", left: "33.35%", width: "17%", item: null },
        { id: "detail4", top: "77%", left: "38%", width: "18%", item: null },
        { id: "detail5", top: "15%", left: "60%", width: "30%", item: null },
      ],
      allItems1: [
        { id: "detail1", image: "/detail1.svg" },
        { id: "detail2", image: "/detail2.svg" },
        { id: "detail3", image: "/detail3normal.svg" },
        { id: "detail4", image: "/detail4.svg" },
        { id: "detail5", image: "/detail5.svg" }
      ],
      allItems2: [
        { id: "detail1", image: "/detail1_2.svg" },
        { id: "detail2", image: "/detail2_2.svg" },
        { id: "detail3", image: "/detail3_2.svg" },
        { id: "detail4", image: "/detail4_2.svg" },
        { id: "detail5", image: "/detail5_2.svg" },
      ]
    }
  },
  methods: {
    Back(){
      router.push({ path: "/roadmap" });
    },
    onDragStart(item) {
      this.draggedItem = item;
    },
    onDrop(index) {
      const slot = this.robotSlots[index];

      if (!slot.item && this.draggedItem) {
        if (this.draggedItem.id === slot.id) {
          slot.item = this.draggedItem;
          delete this.itemStore.foundItems[this.draggedItem.id];
          localStorage.setItem("foundItems", JSON.stringify(this.itemStore.foundItems));

          this.playSuccessSound();
        } else {
          console.log("Неправильная деталь для этого места!");
        }

        this.draggedItem = null;
      }
    },
    Perehod1() {
      router.push({path: '/roadmap'});
    },
    ChangePage(){
      this.garage=!this.garage
      console.log(this.garage)
    },
    playSuccessSound() {
      const audio = new Audio('/found.mp3')
      audio.play()
    },
    playRobotRepaired() {
      const audio = new Audio('/completed.mp3')
      audio.play()
    },
    findItem(id) {
      this.itemStore.markItemFound(id)
      this.playSuccessSound()
    },
    isFound(id) {
      return this.itemStore.isItemFound(id)
    },
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



        if (this.activeDialogueId === "intro") {
          this.itemStore.setDialogueSeen(true);
        } else if (this.activeDialogueId === "success") {
          localStorage.setItem("quest1_success_seen", "true");
          setTimeout(() => {
            this.Perehod1();
          }, 1000);
        }

        setTimeout(() => {
          this.showCharacter = false;
        }, 1000);
      }
    },

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
    text() {
      return this.garage ? "К роботу" : "На склад";
    },
    isRobotComplete() {
      return this.robotSlots.every(slot => slot.item !== null);
    },
    foundInventoryItems1() {
      return this.allItems1.filter(item => this.itemStore.isItemFound(item.id));
    },
    foundInventoryItems2() {
      return this.allItems2.filter(item => this.itemStore.isItemFound(item.id));
    },
    nextItem() {
      return this.allItems1.find(item => !this.isFound(item.id));
    }
  },
  mounted() {
      console.log(useGarageStore().dialogueSeen)
    //this.itemStore.resetItems() //для возвращения всех найденных вещей обратно
    //useItemStore().setDialogueSeen(false)

    this.startDialogue(this.dialogueIntro, "intro");


    const saved = localStorage.getItem("foundItems");
    if (saved) {
      this.itemStore.foundItems = JSON.parse(saved);
    }
  },
  watch: {
    dialogueIndex() {
      this.typeText();
    },
    isRobotComplete(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.playRobotRepaired();
        this.startDialogue(this.dialogueSuccess, "success");

      }
    }
  },

}
</script>

<template>
  <div  class="wrapper" @click="handleClick" >
    <div @click="ChangePage" class="page_changer"><p class="text">{{text}}</p></div>
    <div @click="Back" class="back_btn"><p class="text">Назад</p></div>

    <img v-if="showCharacter"
         class="character-behind"
         :class="{ exit: isExiting }"
         :src="currentEmotion"
         alt="Персонаж"
    />
    <div v-if="showCharacter" class="dialogue-container" :class="{ exit: isExiting }">
      <p>{{ typedText }}</p>
    </div>

    <div class="maindiv" v-if="!this.garage">
      <img class="background-img1" src="/fon_car.svg">
      <HorBar :robotSlots="robotSlots" />


      <div class="robot" v-if="!isRobotComplete">
        <img class="underRobot" src="/underRobot.svg">
        <img class="back_Robot" src="/back_BrokenRobot.svg">
        <div
            v-for="(slot, index) in robotSlots"
            :key="slot.id"
            class="robot-slot"
            :style="{ top: slot.top, left: slot.left, width: slot.width }"
            @dragover.prevent
            @drop="onDrop(index)"
        >
          <img v-if="!slot.item" :src="`/place${index+1}.svg`" />
          <div v-else class="slot-item">
            <img :src="slot.item.image" />
          </div>
        </div>

        <img class="robotImg" src="/slomanyRobat.svg">
      </div>

      <div v-else class="robot" style="width: 60vh">
        <img class="underRobot" src="/underRobot.svg">
        <img class="back_Robot" src="/back_RepairedRobot.svg">
        <img class="robotImg" src="/Robot.svg">
      </div>

      <img class="robotName" :src="isRobotComplete ? '/robotName.svg' : '/trash.svg'  " />
      <div class="inventory2">
        <div v-for="(item, index) in foundInventoryItems2" :key="index" class="inventory-item2" draggable="true" @dragstart="onDragStart(item)">
          <img :src="item.image" :alt="item.id" />
        </div>
      </div>
    </div>

    <div v-if="this.garage" class="background-container">
      <img class="background-img2" src="/Q1background.svg" />
      <div class="items">
        <img class="detail detail1" v-if="!isFound('detail1')" @click="findItem('detail1')" src="/detail1.svg" />
        <img class="detail detail2" v-if="!isFound('detail2')" @click="findItem('detail2')" src="/detail2.svg" />
        <img class="detail detail3" v-if="!isFound('detail3')" @click="findItem('detail3')" src="/detail3.svg" />
        <img class="detail detail4" v-if="!isFound('detail4')" @click="findItem('detail4')" src="/detail4.svg" />
        <img class="detail detail5" v-if="!isFound('detail5')" @click="findItem('detail5')" src="/detail5.svg" />
      </div>

      <div class="inventory">
        <div v-for="item in foundInventoryItems1" :key="item.id" class="inventory-item" draggable="true" @dragstart="onDragStart(item)">
          <img :src="item.image" :alt="item.id" />
        </div>
      </div>
      <div class="search">
        <img
            v-if="nextItem"
            :src="nextItem.image"
            :alt="nextItem.id"
        />
      </div>
    </div>




  </div>
</template>

<style scoped>
.search{
  left: 68%;
  right: 35%;
  padding-right: 5px;
  padding-left: 5px;
  bottom: 3%;
  background-image: url("/search.svg");
  background-size: cover;
  position: absolute;
  aspect-ratio: 8/9;
  width: 7%;
  height: auto;
}
.search img{
  margin-top: 30%;
  margin-left: 10%;
  width: 70%;
  height: 60%;
}
.underRobot{
  position: absolute;
  bottom:-14%;
  left: 0;
  width: 90%;

}
.back_Robot{
  position: absolute;
  top:0;
  left: -25%;
  width: 140%;
}
.robotName{
  position: absolute;
  bottom: 76vh;
  right: 13vw;
  width: 35vh;
}
.items {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.maindiv{
  width: 85vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: 85vh;
  border-radius: 20px;
  border: min(2vw,2vh) solid #0C5789;
  background-color: #E1F0FC;
}
.detail {
  position: absolute;
  cursor: pointer;
  transition: all 0.3s ease;
  height: auto;
}
.detail:hover{
  scale:120%;
}
.detail1 {
  width: 6%;
  top: 16%;
  left: 10%;
}
.detail2 {
  width: 7%;
  top: 81%;
  left: 10%;
}
.detail3 {
  width: 4%;
  top: 26.8%;
  left: 40.9%;
}
.detail4 {
  width: 4%;
  top: 72%;
  left: 47%;
}
.detail5 {
  width: 8%;
  top: 56%;
  right: 7%;
}
.robotImg{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.robot{
  position: relative;
  width: 55vh;
  z-index: 2;
  aspect-ratio: 1/1;
}
.robot-slot {
  position: absolute;
  width: 10%;
  height: 10%;
  pointer-events: auto;
}
.robot-slot > img {
  width: 100%;
  height: auto;
  object-fit: contain;
  position: relative;
  z-index: 2;
}
.slot-item {
  position: absolute;
  inset: 0;
  z-index: -1;
}
.slot-item img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
.text{
  text-align: center;
  width: 100%;
  font-size: 2vw;
  font-weight: bold;
  font-family: Arial, sans-serif;
}
.inventory-item2 img{
  height: 70%;
  width: 70%;
}
.inventory-item2 {
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
  height: 100%;
}
.inventory2{
  padding-right: 5px;
  padding-left: 5px;
  bottom: 3%;
  background-image: url("/public/inventory2.svg");
  background-size: cover;
  aspect-ratio: 10.2/15.5;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 5px;
  height: 60%;
}
.inventory{
  left: 35%;
  right: 35%;
  padding-right: 5px;
  padding-left: 5px;
  bottom: 3%;
  background-image: url("/public/inventory.svg");
  background-size: cover;
  position: absolute;
  aspect-ratio: 10.2 / 2.3;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  width: 30%;
  height: auto;
}
.inventory-item {
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
  height: 100%;
}
.inventory-item img{
  height: 70%;
  width: 70%;
}
.background-container {
  position: relative;
  width: 100vw;
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  overflow: hidden;
}
.wrapper{
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  justify-content: center;
  align-items: center;
  display: flex;
}
.wrapper,
.wrapper * {
  user-select: none;
}
.background-img2 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.background-img1 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.page_changer{
  align-items: center;
  display: flex;
  position: absolute;
  top: 5vh;
  right: 3vw;
  transition: all 0.3s ease;
  width: 10vw;
  height: max(6vh, 3vw);
  padding: 0.5vw 1vw;
  background-color: rgba(230, 210, 170);
  color: white;
  border: 4px solid rgb(200,150,110,9) ;
  cursor: pointer;
  border-radius: 12px;
  z-index: 3;
}

.page_changer:hover{
  scale:120%;
}
.back_btn{
  align-items: center;
  display: flex;
  position: absolute;
  top: 5vh;
  left: 3vw;
  transition: all 0.3s ease;
  width: 10vw;
  height: max(6vh, 3vw);
  padding: 0.5vw 1vw;
  background-color: rgba(230, 210, 170);
  color: white;
  border: 4px solid rgb(200,150,110,9) ;
  cursor: pointer;
  border-radius: 12px;
  z-index: 3;
}
.back_btn:hover{
  scale:120%;
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
