<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </router-view>
</template>

<script>
export default {
  // Ваш код компонента, если есть
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
  opacity: 0;
}
.fade-enter-to{
  transition: opacity 0.5s;
  opacity: 1;
} .fade-leave-to /* .fade-leave-active в <2.1.8 */ {
    transition: opacity 0.5s;
    opacity: 0;
  }
</style>