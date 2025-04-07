<template>
  <div class="app">
    <!-- 导航栏 -->
    <NavBar @toggleSettings="handleToggleSettings" @toggleAbout="handleToggleAbout"
      @toggleNotifications="handleToggleNotifications" @toggleProfile="handleToggleProfile"></NavBar>

    <!-- 主页面 -->
    <router-view></router-view>

    <!-- 组件容器 - 每个组件将在相应事件触发时显示/隐藏 -->
    <div class="overlay-components">
      <div ref="settingsPanel" class="settings-panel panel" v-show="isSettingsVisible">
        <!-- 设置面板内容占位符 -->
        <h3>设置面板</h3>
      </div>

      <div ref="aboutPanel" class="about-panel panel" v-show="isAboutVisible">
        <!-- 关于面板内容占位符 -->
        <h3>关于面板</h3>
      </div>

      <div ref="notificationsPanel" class="notifications-panel panel" v-show="isNotificationsVisible">
        <!-- 通知面板内容占位符 -->
        <h3>通知面板</h3>
      </div>

      <div ref="profilePanel" class="profile-panel panel" v-show="isProfileVisible">
        <!-- 用户资料面板内容占位符 -->
        <h3>用户资料</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import NavBar from '@/components/NavBar.vue';
import animations from '@/utils/animations';

// 面板引用
const settingsPanel = ref(null);
const aboutPanel = ref(null);
const notificationsPanel = ref(null);
const profilePanel = ref(null);

// 定义各组件的显示状态
const isSettingsVisible = ref(false);
const isAboutVisible = ref(false);
const isNotificationsVisible = ref(false);
const isProfileVisible = ref(false);

// 使用watch监听状态变化并应用GSAP动画
watch(isSettingsVisible, (newVal) => {
  if (newVal) {
    animations.showPanelLeft(settingsPanel.value);
  }
});

watch(isAboutVisible, (newVal) => {
  if (newVal) {
    animations.showPanelLeft(aboutPanel.value);
  }
});

watch(isNotificationsVisible, (newVal) => {
  if (newVal) {
    animations.showPanelRight(notificationsPanel.value);
  }
});

watch(isProfileVisible, (newVal) => {
  if (newVal) {
    animations.showPanelRight(profilePanel.value);
  }
});

// 处理各种组件的切换显示
const handleToggleSettings = (isActive) => {
  if (!isActive && isSettingsVisible.value) {
    // 先执行动画再隐藏
    animations.hidePanelLeft(settingsPanel.value).then(() => {
      isSettingsVisible.value = false;
    });
  } else {
    isSettingsVisible.value = isActive;
  }
};

const handleToggleAbout = (isActive) => {
  if (!isActive && isAboutVisible.value) {
    animations.hidePanelLeft(aboutPanel.value).then(() => {
      isAboutVisible.value = false;
    });
  } else {
    isAboutVisible.value = isActive;
  }
};

const handleToggleNotifications = (isActive) => {
  if (!isActive && isNotificationsVisible.value) {
    animations.hidePanelRight(notificationsPanel.value).then(() => {
      isNotificationsVisible.value = false;
    });
  } else {
    isNotificationsVisible.value = isActive;
  }
};

const handleToggleProfile = (isActive) => {
  if (!isActive && isProfileVisible.value) {
    animations.hidePanelRight(profilePanel.value).then(() => {
      isProfileVisible.value = false;
    });
  } else {
    isProfileVisible.value = isActive;
  }
};
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

/* 覆盖组件容器 */
.overlay-components {
  position: fixed;
  top: 45px;
  /* 导航栏高度 */
  left: 0;
  width: 100%;
  height: calc(100vh - 45px);
  pointer-events: none;
  /* 允许点击穿透到下层 */
  z-index: 990;
}

/* 通用面板样式 */
.panel {
  position: absolute;
  pointer-events: auto;
  /* 重新启用面板内部的点击 */
  background: rgba(35, 35, 35, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 20px;
  color: white;
  backdrop-filter: blur(10px);
}

/* 每个面板的位置和大小 */
.settings-panel {
  top: 10px;
  left: 10px;
  width: 300px;
  height: 500px;
}

.about-panel {
  top: 10px;
  left: 10px;
  width: 400px;
  height: 300px;
}

.notifications-panel {
  top: 10px;
  right: 10px;
  width: 300px;
  height: 400px;
}

.profile-panel {
  top: 10px;
  right: 10px;
  width: 350px;
  height: 450px;
}
</style>