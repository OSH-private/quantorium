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
  display: flex;
  flex-direction: column-reverse; /* чтобы шло снизу вверх */
  width: 40px;
  height: 200px;
  border: 2px solid #333;
  padding: 2px;
  gap: 4px;
}

.bar-cell {
  flex: 1;
  background: #ddd;
  border-radius: 4px;
  transition: background 0.3s;
}

.bar-cell.filled {
  background: #4caf50; /* зелёный для заполненной */
}
</style>
