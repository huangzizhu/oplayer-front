<template>
  <div class="userview">
    <UserProfile v-if="isLoggedIn" />
    <div v-else class="auth-container">
      <!-- 使用新的 TabSwitcher 组件 -->
      <TabSwitcher
          v-model:activeTab="userStore.activeTab"
          @update:activeTab="userStore.activeTab = $event"
      />

      <transition
          :name="activeTab === 'login' ? 'fade-slide-login' : 'fade-slide-register'"
      >
        <component :is="currentComponent" @login-success="emitLoginSuccess" @reg-success="emitRegSuccess"/>
      </transition>
    </div>
  </div>
</template>

<script setup>
/*eslint-disable*/
import { computed, ref, onMounted } from 'vue';
import {getLoginStatus} from "@/utils/api/UserApi";
import LoginFrame from "@/components/view/user/login/LoginFrame.vue";
import RegisterFrame from "@/components/view/user/login/RegisterFrame.vue";
import UserProfile from '@/components/view/user/profile/UserProfile.vue';
import TabSwitcher from '@/components/view/user/login/TabSwitcher.vue';
import {ElMessage} from "element-plus";
import {useUserStore} from "@/store/User";

const userStore = useUserStore();

const currentComponent = computed(() => {
  return userStore.activeTab === 'login' ? LoginFrame : RegisterFrame;
});
const isLoggedIn = computed(() => {
  return userStore.isLoggedIn;
});

const emitLoginSuccess = () => {
  userStore.isLoggedIn = true;
};
const emitRegSuccess = () => {
  userStore.activeTab = 'login';
};

const checkLoginStatus = async () => {
  try {
    const response = await getLoginStatus(); // 假设 getLoginStatus 是异步的
    if (response.code === 1) {
      userStore.isLoggedIn = true;
    } else {
      userStore.isLoggedIn = false; // 确保更新登录状态
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      ElMessage.error("请先登录");
      userStore.isLoggedIn = false; // 确保更新登录状态
    } else {
      ElMessage.error("检查登录状态失败");
    }
  }
};

onMounted(()=> {
  checkLoginStatus();
});
</script>

<style scoped>
.userview {
  overflow-y: auto; /* 添加垂直滚动条 */
  max-height: 100vh; /* 限制最大高度为视口高度 */
}
/* 保留原有的过渡动画样式 */
.auth-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding-top: 50px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: transform 0.8s ease, opacity 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}

.fade-slide-enter-from {
  transform: translateX(-100%);
}

.fade-slide-leave-to {
  transform: translateX(100%);
}

.fade-slide-leave-active {
  position: absolute;
}

.fade-slide-login-enter-active,
.fade-slide-login-leave-active {
  transition: transform 0.8s ease, opacity 0.5s ease;
  position: absolute;
}

.fade-slide-login-enter-from,
.fade-slide-login-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.fade-slide-register-enter-active,
.fade-slide-register-leave-active {
  transition: transform 0.8s ease, opacity 0.5s ease;
  position: absolute;
}

.fade-slide-register-enter-from,
.fade-slide-register-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>