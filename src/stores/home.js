import { defineStore } from "pinia";

export const useHomeStore = defineStore("home", {
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
