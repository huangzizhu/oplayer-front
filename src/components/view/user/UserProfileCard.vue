<template>
  <div class="user-profile-card">
    <!-- 头像 -->
    <div class="avatar-container">
      <img
          :src="avatarUrl"
          alt="用户头像"
          class="avatar"
          @error="handleAvatarError"
      >
    </div>

    <!-- 用户名 -->
    <h2 class="username">{{ username }}</h2>

    <!-- 用户数据 -->
    <div class="user-stats">
      <div class="stat-item">
        <span class="stat-label">UID</span>
        <span class="stat-value">{{ uid }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">播放数</span>
        <span class="stat-value">{{ playCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">时长</span>
        <span class="stat-value">{{ formatDuration(duration) }}</span>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="button-group">
      <button
          class="profile-button"
          @click="navigateToUserProfile"
      >
        个人中心
        <span class="shooting-star"></span>
      </button>
      <button
          class="logout-button"
          @click="handleLogout"
      >
        退出登录
        <span class="shooting-star"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import defaultAvatar from '@/assets/images/avatar.jpg'
import {useUserStore} from '@/store/User'
import {getLoginStatus} from "@/utils/api/UserApi";
import {ElMessage} from "element-plus";


const userStore = useUserStore();
const router = useRouter()

// 定义props
const props = defineProps({
  avatarUrl: {
    type: String,
    default: 'https://example.com/default-avatar.jpg'
  },
  username: {
    type: String,
    default: '用户名'
  },
  uid: {
    type: [String, Number],
    default: 0
  },
  playCount: {
    type: [String, Number],
    default: 0
  },
  duration: { // 单位分钟
    type: [String, Number],
    default: 0
  }
})

// 格式化时长
const formatDuration = (minutes) => {
  const mins = parseInt(minutes)
  if (mins < 60) return `${mins}min`

  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours}h${remainingMins > 0 ? `${remainingMins}min` : ''}`
}

// 头像加载失败处理
const avatarUrl = ref(props.avatarUrl)
const handleAvatarError = () => {
  avatarUrl.value = defaultAvatar
}

// 跳转到个人中心
const navigateToUserProfile = () => {
  router.push(`/user/${props.uid}`)
}

// 处理退出登录
const handleLogout = () => {
  // 这里添加退出登录逻辑
  console.log('用户退出登录')
}
onMounted(async ()=>{
  const loginUser = JSON.parse(localStorage.getItem("loginUser"));
  if(!loginUser){
    props.username = "未登录"
    return;
  }
  try {
    const response = await getLoginStatus(); // 假设 getLoginStatus 是异步的
    if (response.code === 1) {
      props.avatarUrl = response.data.avatarUrl;

    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
      router.push('/user')
      ElMessage.error("检查登录状态失败");
    }
})
</script>

<style scoped>
.user-profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  background: #1D1C1F;
  font-family: 'Arial', sans-serif;
  color: #FFFFFF;
  position: relative;
  z-index: 1;
  background: rgba(29, 28, 31, 0.85); /* 半透明背景 */
  backdrop-filter: blur(8px); /* 毛玻璃效果 */
  border: 1px solid rgba(255, 255, 255, 0.08); /* 微妙的边框 */
  /* 边缘发光效果 */
  box-shadow:
      0 0 0 1px rgba(230, 100, 159, 0.05),
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(230, 100, 159, 0.1); /* 粉色光晕 */
}
/* 卡片边缘的渐变装饰（可选） */
.user-profile-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(
      135deg,
      rgba(230, 100, 159, 0.3),
      rgba(29, 28, 31, 0)
  );
  -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: -1;
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
  border: 3px solid #2E2D30;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  color: #E6649F;
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.user-stats {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  padding: 0 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #A0A0A0;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.profile-button,
.logout-button {
  margin-top: 1em;
  position: relative;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  overflow: hidden;
  background: #E6649F;
  box-shadow: 0 2px 10px rgba(230, 100, 159, 0.3);
}

.profile-button:hover,
.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(230, 100, 159, 0.4);
}

.profile-button:active,
.logout-button:active {
  transform: translateY(0);
}

/* 流星动画效果 */
.shooting-star {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255,255,255,0), #FFFFFF);
  transform: rotate(-45deg);
  opacity: 0;
}

.profile-button:hover .shooting-star,
.logout-button:hover .shooting-star {
  animation: shooting 1.5s ease-in-out infinite;
}

@keyframes shooting {
  0% {
    left: -50%;
    top: -50%;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 150%;
    top: 150%;
    opacity: 0;
  }
}
</style>