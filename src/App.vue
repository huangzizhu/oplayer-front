<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
// App.vue 不需要太多逻辑，主要作为应用的入口
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #fff;
  overflow: hidden;
}

.app {
  width: 100%;
  height: 100vh;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 模拟 osu! 的字体图标，实际项目中需替换为真实图标库 */
/* @font-face {
  font-family: 'osu-icons';
  src: url('/src/assets/fonts/osu-icons.woff2') format('woff2');
}

[class^="icon-"] {
  font-family: 'osu-icons';
  font-style: normal;
} */

.icon-settings:before {
  content: '\e900';
}

.icon-clock:before {
  content: '\e901';
}

.icon-notifications:before {
  content: '\e902';
}

.icon-music:before {
  content: '\e903';
}

.icon-playlist:before {
  content: '\e904';
}

.icon-library:before {
  content: '\e905';
}

.icon-visualizer:before {
  content: '\e906';
}
</style>
