import { createRouter, createWebHistory } from 'vue-router'
// import MainView from '../views/MainView.vue'
import MusicSelectView from '@/components/view/MusicSelectView.vue'
import MainView from '@/components/view/MainView.vue'
import UserView from "@/components/view/UserView.vue";
import ExploreView from "@/components/view/ExploreView.vue";
import RecommendView from "@/components/explore/recommendView/RecommendView.vue";
import HistoryView from "@/components/explore/history/HistoryView.vue";
import MyView from "@/components/explore/my/MyView.vue";
import CollectionDisplay from "@/components/explore/my/collection/CollectionDisplay.vue";
import PlaylistDisplay from "@/components/explore/my/playList/PlaylistDisplay.vue";
import SearchView from "@/components/explore/search/SearchView.vue";

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
          title: 'OPlayer - 用户界面',
          showNavBar: true,
          showFooterBar: true
        },
      },
    {
      path: '/explore',
      name: 'Explorer',
      component: ExploreView,
      meta: {
        title: 'OPlayer - 发现界面',
        showNavBar: true,
        showFooterBar: true
      },
      children: [
        // 添加默认重定向
        {
          path: '',
          redirect: '/explore/recommend'
        },
        // 修改子路由为相对路径
        {
          path: 'recommend',  // 去掉开头的/
          name: 'Recommend',
          component: RecommendView,
        },
        {
          path: 'history',  // 去掉开头的/
          name: 'History',
          component: HistoryView,
        },
        {
          path: 'my',  // 去掉开头的/
          name: 'My',
          component: MyView,
        },
        // 搜索（动态路由）
        {
          path: 'search',
          name: 'Search',
          component: SearchView,
        },
          // 收藏歌单
          {
            path: 'my/collection',
            name: 'Collection',
            component: CollectionDisplay,
          },
          // 歌单详情（动态路由）
          {
            path: 'my/list/:id',
            name: 'PlaylistDetail',
            component: PlaylistDisplay,
            props: true // 将路由参数作为props传递给组件
          },
      ],
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