<template>
  <div class="app">
    <!-- 导航栏 - 控制所有面板 -->
    <NavBar :activeItem="activeNavItem"></NavBar>

    <!-- 主页面 -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavBar from '@/components/NavBar.vue';

// 如果需要，可以设置默认激活项
const activeNavItem = ref('');
</script>

<style>
.app {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 添加 OSU! Lazer 风格的顶部间距，为导航栏腾出空间 */
.router-view {
  padding-top: 45px;
  /* 导航栏高度 */
}
</style>