import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { createPinia } from 'pinia'
import gsap from 'gsap'

import './assets/styles/main.scss'
import './assets/styles/variables.scss'
import './assets/styles/animations.scss'
import animations from './utils/animations'

const app = createApp(App)
const pinia = createPinia()

app.config.globalProperties.$gsap = gsap
app.config.globalProperties.$anim = animations
app.use(pinia).use(store).use(router).mount('#app')