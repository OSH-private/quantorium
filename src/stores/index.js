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

const useGarageStore = defineStore("garage", {
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

const useItemStore = defineStore("items", {
    state: () => ({
        dialogueSeen: JSON.parse(localStorage.getItem("dialogueSeen") || "false"),
        foundItems: JSON.parse(localStorage.getItem("foundItems") || "{}")
    }),
    getters: {
        isItemFound: (state) => (id) => state.foundItems[id] === true
    },
    actions: {
        markItemFound(id) {
            if (!this.foundItems[id]) {
                this.foundItems[id] = true;
                localStorage.setItem("foundItems", JSON.stringify(this.foundItems));
            }
        },
        setDialogueSeen(value) {
            this.dialogueSeen = value;
            localStorage.setItem("dialogueSeen", JSON.stringify(value));
        },

    }
});


const useQuestsStore = defineStore('quests', {
    state: () => ({
        completedQuests: JSON.parse(localStorage.getItem('completedQuests') || '[]')
    }),
    actions: {
        markQuestComplete(questId) {
            if (!this.completedQuests.includes(questId)) {
                this.completedQuests.push(questId)
                localStorage.setItem('completedQuests', JSON.stringify(this.completedQuests))
            }
        },
        cleanQuests() {
            this.completedQuests = [] // очищаем массив
            localStorage.setItem('completedQuests', JSON.stringify([])) // синхронизируем с localStorage
        },
        isQuestCompleted(questId) {
            return this.completedQuests.includes(questId)
        }
    }
})

export {useWiresStore, useHomeStore, useQuestsStore, useGarageStore, useItemStore}
