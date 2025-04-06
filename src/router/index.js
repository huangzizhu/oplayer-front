import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
// import MusicSelectView from '../views/MusicSelectView.vue'
// import PlaylistView from '../views/PlaylistView.vue'
// import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: MainView,
    meta: {
      title: 'OPlayer - 主界面',
      showNavBar: true,
      showFooterBar: false
    }
  },
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
  // {
  //   path: '/playlist/:id',
  //   name: 'Playlist',
  //   component: PlaylistView,
  //   meta: {
  //     title: 'OPlayer - 歌单',
  //     showNavBar: true,
  //     showFooterBar: true
  //   }
  // },
  // {
  //   path: '/settings',
  //   name: 'Settings',
  //   component: SettingsView,
  //   meta: {
  //     title: 'OPlayer - 设置',
  //     showNavBar: true,
  //     showFooterBar: false
  //   }
  // }
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