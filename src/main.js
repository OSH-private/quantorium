import { createApp } from 'vue'
import './style.css'
import { router } from "./router/index.js"
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(router)

const pinia = createPinia()
app.use(pinia)

app.mount('#app')