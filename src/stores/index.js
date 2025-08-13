import { defineStore } from "pinia";

const useHomeStore = defineStore("home", {
    state: () => ({
        dialogueSeen: JSON.parse(localStorage.getItem("dialogueSeen") || "false")
    }),
    actions: {
        setDialogueSeen(value) {
            this.dialogueSeen = value;
            localStorage.setItem("dialogueSeen", JSON.stringify(value));
        }
    }
});

const useWiresStore = defineStore("wires", {
    state: () => ({
        dialogueSeen: JSON.parse(localStorage.getItem("dialogueSeen") || "false")
    }),
    actions: {
        setDialogueSeen(value) {
            this.dialogueSeen = value;
            localStorage.setItem("dialogueSeen", JSON.stringify(value));
        }
    }
});

export {useWiresStore, useHomeStore}
