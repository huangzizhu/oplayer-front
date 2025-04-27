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
    <div class="profile-header">
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
          <div class="tooltip-box" v-show="activeTooltip === 'email'" :class="{ active: activeTooltip === 'email' }">
            {{ email }}
          </div>
        </div>
        <div class="contact-item"
             @mouseenter="showTooltip('phone')"
             @mouseleave="hideTooltip">
          <div class="icon-circle">
            <svg-icon class="icon-placeholder" type="mdi" :path="phoneIconPath"></svg-icon>
          </div>
          <div class="tooltip-box" v-show="activeTooltip === 'phone'" :class="{ active: activeTooltip === 'phone' }">
            {{ phone || '未提供手机号' }}
          </div>
        </div>
      </div>
    </div>
  </div>
  </Motion>

</template>

<script setup>
/* eslint-disable */
import { ref, computed } from 'vue';
import {useUserStore} from "@/store/User";
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiEmailEdit,mdiCellphone } from '@mdi/js'
import { Motion, useAnimationControls } from 'motion-v'

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
  props.avatarUrl = useUserStore().userAvatarUrl
};
const handleBackGroundError = () => {
  props.background = useUserStore().defaultBackgroundUrl
};

const showTooltip = (type) => {
  activeTooltip.value = type;
};

const hideTooltip = () => {
  activeTooltip.value = null;
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

.contact-info {
  display: flex;
  border-radius: 0 0 12px 12px; /* 上直角下圆角 */
  transition: background-color 0.3s ease;
}

.contact-info:hover {
  background: rgba(50, 50, 50, 0.4);
}

.contact-item {
  position: relative;
  cursor: pointer;
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

.tooltip-box {
  position: absolute;
  bottom: 100%;
  left: 50%;
  width: 0;
  background: white;
  color: #333;
  border-radius: 8px;
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateX(-50%);
  opacity: 0;
  transition:
      width 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      opacity 0.3s ease;
}

.tooltip-box.active {
  width: max-content;
  max-width: 300px;
  opacity: 1;
}

.tooltip-content {
  padding: 8px 12px;
  white-space: nowrap;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s 0.1s ease-out;
}

.tooltip-box.active .tooltip-content {
  transform: scaleX(1);
}

.tooltip-box::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
  transition: all 0.3s 0.1s ease;
  opacity: 0;
}

.tooltip-box.active::after {
  opacity: 1;
}
</style>