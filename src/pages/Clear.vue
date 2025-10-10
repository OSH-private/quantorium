<script>

import {useGarageStore, useHomeStore, useItemStore, useQuestsStore, useWiresStore} from "../stores/index.js";

export default {
  created(){
    useItemStore().setDialogueSeen(false)
    useGarageStore().setDialogueSeen(false)
    useHomeStore().setDialogueSeen(false)
    useQuestsStore().cleanQuests()
    useWiresStore().setDialogueSeen(false)
    localStorage.setItem("quest1_success_seen", "false");
    localStorage.setItem("quest2_success_seen", "false");
    localStorage.setItem("quest3_success_seen", "false");
  }
}

</script>

<template>

</template>

<style scoped>

</style>
