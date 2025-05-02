<template>
  <!-- 上半部分：头像和名字 -->
  <Motion
      class="card touch-none"
      :transform-template="template"
      :animate="controls"
      :style="{ backgroundImage: `url(${props.background})` }"
      @pan="handlePan"
      @pan-end="handlePanEnd"
      @error="handleBackGroundError"
  >
    <div class="profile-card">
    <div class="profile-header" @click="handleEdit">
      <div class="avatar-wrapper">
        <img
            :src="avatarUrl"
            alt="用户头像"
            class="avatar-image"
            @error="handleAvatarError"
        >
      </div>
      <h1 class="username" :style="usernameStyle">{{ username }}</h1>
    </div>
    <!-- 下半部分：描述和联系信息 -->
    <div class="profile-body">
      <div class="bio-box">
        <span class="decorative-text top-left">“</span>
        <p class="bio-text">{{ description || '这个人很神秘，还没有留下任何介绍...' }}</p>
        <span class="decorative-text bottom-right">”</span>
      </div>

      <div class="contact-info">
        <div class="contact-item"
             @mouseenter="showTooltip('email')"
             @mouseleave="hideTooltip">
          <div class="icon-circle">
            <svg-icon class="icon-placeholder" type="mdi" :path="emailIconPath"></svg-icon>
          </div>
        </div>
        <div class="contact-item"
             @mouseenter="showTooltip('phone')"
             @mouseleave="hideTooltip">
          <div class="icon-circle">
            <svg-icon class="icon-placeholder" type="mdi" :path="phoneIconPath"></svg-icon>
          </div>
        </div>
        <div class="contact-item">
          <div class="icon-circle">
            <svg-icon type="mdi" :path="editIconPath" @click="handleEdit"></svg-icon>
          </div>
        </div>
      </div>

      <!-- 新增的tooltip容器 -->
      <transition name="slide-up">
        <div v-if="activeTooltip" class="contact-tooltip">
          <div class="tooltip-content">
            {{ activeTooltip === 'email' ? (props.email || '未设置邮箱') : (props.phone || '未设置手机号') }}
          </div>
        </div>
      </transition>
    </div>
    </div>

  </Motion>

</template>

<script setup>
/* eslint-disable */
import {ref, computed, defineEmits} from 'vue';
import {useUserStore} from "@/store/User";
import { mdiEmailEdit,mdiCellphone } from '@mdi/js'
import { Motion, useAnimationControls } from 'motion-v'
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPencil } from '@mdi/js';

const editIconPath = mdiPencil;

const emit = defineEmits(['update:box-visibility']);
const handleEdit = () => {
  emit('update:box-visibility', true);
};

const template = ({ rotateY, rotateX }) => {
  return `perspective(500px) rotateX(${rotateX}) rotateY(${rotateY})`
}

const controls = useAnimationControls()
const handlePan = (_ , info) => {
  controls.set({
    rotateY: info.offset.x / 2,
    rotateX: -info.offset.y / 2,
  })
}

const handlePanEnd = () => {
  controls.start({
    rotateY: 0,
    rotateX: 0,
  })
}
const emailIconPath = mdiEmailEdit;
const phoneIconPath = mdiCellphone;

const props = defineProps({
  avatarUrl: String,
  username: String,
  description: String,
  email: String,
  phone: String,
  background: String
});

const activeTooltip = ref(null);

const usernameStyle = computed(() => {
  const baseSize = 50; // 基础字体大小
  const minSize = 24; // 最小字体大小
  const length = props.username.length;

  // 根据用户名长度调整字体大小
  if (length <= 6) return { fontSize: `${baseSize}px` };
  if (length <= 10) return { fontSize: `${baseSize - (length - 6) * 2}px` };
  return { fontSize: `${minSize}px` };
});

const handleAvatarError = () => {
  props.avatarUrl = useUserStore().defaultAvatarUrl
};
const handleBackGroundError = () => {
  props.background = useUserStore().defaultBackgroundUrl
};

const showTooltip = (type) => {
  activeTooltip.value = type;
};

const hideTooltip = () => {
  activeTooltip.value = null;
  console.log(11)
};
</script>

<style scoped>
.card {
  height: 100%;
  border-radius: 10px;
  cursor: pointer;
  background-color: transparent; /* 设置背景为完全透明 */
  background-size: cover; /* 确保背景图片覆盖整个元素 */
  background-position: center; /* 确保背景图片居中 */
  background-repeat: no-repeat; /* 确保背景图片不重复 */
  transition: background-color 1s ease; /* 可选：添加过渡效果 */
  &:active {
    cursor: grab;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
.profile-card {
  margin: 10% auto 0 auto;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-header {
  display: flex;
  margin: 1em 0;
  align-items: center;
  gap: 20px;
  padding: 0 10px;
  min-height: 150px;
}

.avatar-wrapper {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  color: white;
  margin: 0;
  font-weight: 900;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.profile-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bio-box {
  position: relative;
  background: rgba(50, 50, 50, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 25px 20px;
  min-height: 200px;
}

.decorative-text {
  position: absolute;
  font-size: 48px;
  font-family: serif;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1;
}

.top-left {
  top: 10px;
  left: 15px;
}

.bottom-right {
  bottom: 10px;
  right: 15px;
}

.bio-text {
  color: rgba(255, 255, 255, 0.9);
  margin: 5% 10%;
  line-height: 1.6;
  font-size: 1.5em;
  position: relative;
  z-index: 1;
}


.contact-info:hover {
  background: rgba(50, 50, 50, 0.4);
}


.icon-circle {
  margin: 0 0 0 1em;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  transition: all 0.3s ease;
}


.icon-placeholder {
  font-size: 20px;
  display: inline-block;
  color: white;
}

.contact-item {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* 联系人信息区域 */
.contact-info {
  display: flex;
  border-radius: 0 0 12px 12px;
  transition: background-color 0.3s ease;
  padding: 10px 0;
  position: relative;
  z-index: 2;
}

/* 工具提示容器 */
.contact-tooltip {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.tooltip-content {
  background: rgba(50, 50, 50, 0.7); /* 保持半透明 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  font-size: 1.2em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1; /* 强制保持不透明 */
}

/* 仅控制位移的动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-up-enter-from {
  transform: translateY(40px);
}

.slide-up-enter-to {
  transform: translateY(0);
}

.slide-up-leave-from {
  transform: translateY(0);
}

.slide-up-leave-to {
  transform: translateY(40px);
}
</style>