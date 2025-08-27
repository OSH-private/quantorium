<script>
import {router} from "../router/index.js";
import {useItemStore} from "../stores/index.js";
import garage from "./garage.vue";


export default {
  data(){
    return{
     garage:false,
      itemStore: useItemStore(),
      draggedItem: null,
      foundItems: {},
      naming: "",
      robotSlots:[null, null, null, null, null],
      allItems: [
        { id: "detail1", image: "/public/detail1.svg" },
        { id: "detail2", image: "/public/detail2.svg" },
        { id: "detail3", image: "/public/detail3normal.svg" },
        { id: "detail4", image: "/public/detail4.svg" },
        { id: "detail5", image: "/detail5.svg" }
      ]
    }
  },
  methods: {
    onDragStart(item) {
      this.draggedItem = item;
    },
    onDrop(index) {
      if (!this.robotSlots[index] && this.draggedItem) {
        this.robotSlots[index] = this.draggedItem;

        delete this.itemStore.foundItems[this.draggedItem.id];
        localStorage.setItem(
            "foundItems",
            JSON.stringify(this.itemStore.foundItems)
        );

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
      const audio = new Audio('../public/found.mp3')
      audio.play()
    },
    findItem(id) {
      this.itemStore.markItemFound(id)
      this.playSuccessSound()
    },
    isFound(id) {
      return this.itemStore.isItemFound(id)
    }
  },
  mounted() {
    //this.itemStore.resetItems() //для возвращения всех найденных вещей обратно
  },
  computed: {
    text() {
      return this.garage ? "К роботу" : "На склад";
    },
    foundInventoryItems() {
      return this.allItems.filter(item => this.itemStore.isItemFound(item.id));
    }
  }

}
</script>

<template>
  <div  class="wrapper" >
    <div @click="ChangePage" class="page_changer"><p class="text">{{text}}</p></div>

    <div style="width: 100%; height: 100%" v-if="!this.garage">
      <img class="background-img1" src="/fon_car.svg">
      <div class="robot">
          <div
              v-for="(slot, index) in robotSlots"
              :key="index"
              class="robot-slot"
              @dragover.prevent
              @drop="onDrop(index)"
          >
              <img v-if="slot" :src="slot.image" :alt="slot.name" />
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
    </div>


    <div class="inventory">
      <div v-for="item in foundInventoryItems" :key="item.id" class="inventory-item" draggable="true" @dragstart="onDragStart(item)">
        <img :src="item.image" :alt="item.id" />
      </div>
    </div>

  </div>
</template>

<style scoped>
.text{
  text-align: center;
  width: 100%;
  font-size: 2vw;
  font-weight: bold;
  font-family: Arial, sans-serif;
}
.inventory{
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
.items {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
.wrapper{
  width: 100vw;
  height: 100vh;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  justify-content: center;
  align-items: center;
  display: flex;
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
  background-color: rgba(230, 210, 170, 0.9);
  color: white;
  border: 4px solid rgb(200,150,110,9) ;
  cursor: pointer;
  border-radius: 12px;
  z-index: 3;
}

.page_changer:hover{
  scale:120%;
}
</style>
