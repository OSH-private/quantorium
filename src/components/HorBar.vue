<template>
  <div class="bar">
    <div
        v-for="(cell, index) in 5"
        :key="index"
        class="bar-cell"
        :class="{ filled: index < filledCount }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "RobotBar",
  props: {
    robotSlots: {
      type: Array,
      required: true,
    },
  },
  computed: {
    filledCount() {
      return this.robotSlots.filter(slot => slot.item !== null).length;
    },
  },
};
</script>

<style scoped>
.bar {
  border-radius: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column-reverse;
  width: 40px;
  background: #3E8B5A;
  height: 200px;
  border: 5px solid #3E8B5A;


}

.bar-cell {
  flex: 1;
  border: 5px solid #3E8B5A;
  background: #ddd;
  border-radius: 4px;
  transition: background 0.3s;
}

.bar-cell.filled {
  background: #68B888;
}
</style>
