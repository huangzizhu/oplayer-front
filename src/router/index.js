import { createRouter, createWebHistory } from 'vue-router'
// import MainView from '../views/MainView.vue'
// // import MusicSelectView from '../views/MusicSelectView.vue'
// // import PlaylistView from '../views/PlaylistView.vue'
// import SettingsView from '../views/SettingsView.vue'
// import AboutView from '../views/AboutView.vue'

const routes = [
  {
    path: '/',
    name: 'Main',
    meta: {
      title: 'OPlayer - 主界面',
      showNavBar: true,
      showFooterBar: false
    }
  // },
  // {
  //   path: '/music',
  //   name: 'MusicSelect',
  //   component: MusicSelectView,
  //   meta: {
  //     title: 'OPlayer - 选曲界面',
  //     showNavBar: true,
  //     showFooterBar: true
  //   }
  // },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，用于处理标题和其他全局行为
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'OPlayer'
  next()
})

export default router