import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { createPinia } from 'pinia'
import gsap from 'gsap'
import animations from './utils/animations'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import './assets/styles/main.scss'
import './assets/styles/variables.scss'
import './assets/styles/animations.scss'
import './assets/styles/fonts.css'

// 将gsap显式暴露到全局
window.gsap = gsap;

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({
    components,
    directives,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia).use(store).use(router).use(ElementPlus).use(vuetify).mount('#app')
app.config.globalProperties.$gsap = gsap
app.config.globalProperties.$anim = animations

// 添加调试信息
console.log("GSAP version in main.js:", gsap.version);

