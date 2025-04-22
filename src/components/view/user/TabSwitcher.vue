<template>
  <div class="tab-switcher">
    <div class="tabs">
      <div class="tab-wrapper" :style="tabStyle">
        <div
            class="tab"
            :class="{ active: activeTab === 'login' }"
            @click="switchTab('login')"
        >
          登录
        </div>
        <div
            class="tab"
            :class="{ active: activeTab === 'register' }"
            @click="switchTab('register')"
        >
          注册
        </div>
        <div class="meteors">
          <div class="meteor" :style="{ animationDelay: '-0.5s' }"></div>
          <div class="meteor" :style="{ animationDelay: '-1s' }"></div>
          <div class="meteor" :style="{ animationDelay: '-1.5s' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable no-undef */
/* global defineProps, defineEmits */
import { computed } from 'vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
    validator: (value) => ['login', 'register'].includes(value)
  }
});

const emit = defineEmits(['update:activeTab']);

const tabStyle = computed(() => {
  const transform = props.activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)';
  return {
    '--tab-transform': transform
  };
});

const switchTab = (tab) => {
  emit('update:activeTab', tab);
};
</script>

<style scoped>
.tab-switcher {
  position: relative;
  width: 100%;
}

.tabs {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px auto;
  overflow: hidden;
  border-radius: 20px;
  background: #24222A;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.tab-wrapper {
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  z-index: 1;
  transition: color 0.3s ease;
}

.tab.active {
  color: #24222A;
}

.tab-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: #8C66FF;
  border-radius: 20px;
  transition: transform 0.3s ease;
  z-index: 0;
  transform: var(--tab-transform, translateX(0));
}

.meteor {
  position: absolute;
  top: 80%;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, #8C66FF, transparent);
  animation: meteorSlide 2s linear infinite;
}

@keyframes meteorSlide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>