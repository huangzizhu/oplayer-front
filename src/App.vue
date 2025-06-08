<template>
  <div class="app">

    <!-- 背景组件 -->
    <BG></BG>

    <!-- 导航栏 - 控制所有面板 -->
    <NavBar :activeItem="activeNavItem"></NavBar>

    <!-- 主页面 -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavBar from '@/components/NavBar.vue';
import BG from '@/components/BG.vue';
// 如果需要，可以设置默认激活项
const activeNavItem = ref('');
</script>

<style>
.app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* position: relative; */
}

.router-view {
  padding-top: 45px;

}
</style>