<template>
  <div class="userview">
    <UserProfile v-if="isLoggedIn" />
    <div v-else class="auth-container">
      <!-- 使用新的 TabSwitcher 组件 -->
      <TabSwitcher
          v-model:activeTab="activeTab"
          @update:activeTab="activeTab = $event"
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
import { computed, ref, onMounted } from 'vue';
import {getLoginStatus} from "@/utils/api/UserApi";
import LoginFrame from "@/components/view/user/LoginFrame.vue";
import RegisterFrame from "@/components/view/user/RegisterFrame.vue";
import UserProfile from '@/components/view/user/UserProfile.vue';
import TabSwitcher from '@/components/view/user/TabSwitcher.vue';
import {ElMessage} from "element-plus";

const activeTab = ref('login');
const isLoggedIn = ref(true);

const currentComponent = computed(() => {
  return activeTab.value === 'login' ? LoginFrame : RegisterFrame;
});

const emitLoginSuccess = () => {
  isLoggedIn.value = true;
};
const emitRegSuccess = () => {
  activeTab.value = 'login';
};

const checkLoginStatus = async () => {
  try {
    const response = await getLoginStatus(); // 假设 getLoginStatus 是异步的
    if (response.code === 1) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false; // 确保更新登录状态
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      isLoggedIn.value = false; // 确保更新登录状态
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