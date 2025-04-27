import { createRouter, createWebHistory } from 'vue-router'
// import MainView from '../views/MainView.vue'
import MusicSelectView from '@/components/view/MusicSelectView.vue'
import MainView from '@/components/view/MainView.vue'
import UserView from "@/components/view/UserView.vue";
import LoginFrame from "@/components/view/user/login/LoginFrame.vue";
// // import PlaylistView from '../views/PlaylistView.vue'
// import SettingsView from '../views/SettingsView.vue'
// import AboutView from '../views/AboutView.vue'

const routes = [
      {
        path: '/', // 修改为相对路径
        name: 'Main',
        component: MainView,
        meta: {
          title: 'OPlayer - 主界面',
          showNavBar: true,
          showFooterBar: false
        },
      },
      {
        path: '/music',
        name: 'MusicSelect',
        component: MusicSelectView,
        meta: {
          title: 'OPlayer - 选曲界面',
          showNavBar: true,
          showFooterBar: true
        }
      },
      {
        path: '/user',
        name: 'User',
        component: UserView,
        meta: {
          title: 'OPlayer - 选曲界面',
          showNavBar: true,
          showFooterBar: true
        },
        children: [
          {
            path: 'login', // 修改为相对路径
            name: 'Login',
            component: LoginFrame,
          }
        ]
      }
];

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