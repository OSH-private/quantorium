import { createApp } from 'vue'
import './style.css'
import { router } from "./router/index.js"
import App from './App.vue'
import { createPinia } from 'pinia'
import { useHomeStore } from './stores/home'

const app = createApp(App)

app.use(router)

const pinia = createPinia()
app.use(pinia)

const homeStore = useHomeStore()


app.mount('#app')
