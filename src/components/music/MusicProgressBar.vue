<template>
  <div class="music-progress-bar-container">
    <!-- 当前时间 -->
    <div class="time current-time">{{ musicPlayerStore.formattedCurrentTime }}</div>

    <!-- 进度条 -->
    <div class="progress-bar" ref="progressBarRef" @mousedown="startSeeking" @mousemove="updateSeekPreview"
      @mouseleave="hideSeekPreview">
      <!-- 进度条背景 -->
      <div class="progress-background"></div>

      <!-- 进度条填充部分 -->
      <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>

      <!-- 进度条滑块 -->
      <div class="progress-handle" :style="{ left: `${progressPercentage}%` }" :class="{ 'active': isSeeking }"></div>

      <!-- 悬停预览时间 -->
      <div class="seek-preview" v-show="showPreview" :style="{ left: `${previewPosition}px` }">
        {{ previewTime }}
      </div>
    </div>

    <!-- 总时长 -->
    <div class="time duration">{{ musicPlayerStore.formattedDuration }}</div>
  </div>
</template>

<script setup>
// 
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMusicPlayer } from '@/store/MusicPlayer';

const musicPlayerStore = useMusicPlayer();
const progressBarRef = ref(null);

// 是否正在拖拽进度条
const isSeeking = ref(false);
// 是否显示预览
const showPreview = ref(false);
// 预览位置
const previewPosition = ref(0);
// 预览时间
const previewTime = ref('0:00');

// 计算进度百分比
const progressPercentage = computed(() => {
  if (musicPlayerStore.duration <= 0) return 0;
  return (musicPlayerStore.currentTime / musicPlayerStore.duration) * 100;
});

// 格式化时间（秒 -> 分:秒）
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 计算时间预览
const calculatePreview = (clientX) => {
  if (!progressBarRef.value) return;

  const rect = progressBarRef.value.getBoundingClientRect();
  const offsetX = clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
  const time = percentage * musicPlayerStore.duration;

  previewPosition.value = offsetX;
  previewTime.value = formatTime(time);

  return { percentage, time };
};

// 开始拖拽进度条
const startSeeking = (e) => {
  if (musicPlayerStore.duration <= 0) return;

  e.preventDefault();
  isSeeking.value = true;

  // 计算并设置新位置
  const { time } = calculatePreview(e.clientX);
  musicPlayerStore.seekTo(time);

  // 添加拖拽事件监听
  window.addEventListener('mousemove', handleSeeking);
  window.addEventListener('mouseup', stopSeeking);
};

// 处理拖拽过程
const handleSeeking = (e) => {
  if (!isSeeking.value) return;

  const { time } = calculatePreview(e.clientX); //percentage,
  musicPlayerStore.seekTo(time);
};

// 停止拖拽
const stopSeeking = () => {
  isSeeking.value = false;
  window.removeEventListener('mousemove', handleSeeking);
  window.removeEventListener('mouseup', stopSeeking);
};

// 更新预览位置
const updateSeekPreview = (e) => {
  showPreview.value = true;
  calculatePreview(e.clientX);
};

// 隐藏预览
const hideSeekPreview = () => {
  if (!isSeeking.value) {
    showPreview.value = false;
  }
};

// 监听键盘事件（左右方向键调整进度）
const handleKeyDown = (e) => {
  if (!musicPlayerStore.isPlaying) return;
  if (e.repeat) return; // 防止重复触发
  // // 左箭头：后退5秒
  // if (e.key === 'ArrowLeft') {
  //   const newTime = Math.max(0, musicPlayerStore.currentTime - 5);
  //   musicPlayerStore.seekTo(newTime);
  // }

  // // 右箭头：前进5秒
  // if (e.key === 'ArrowRight') {
  //   const newTime = Math.min(musicPlayerStore.duration, musicPlayerStore.currentTime + 5);
  //   musicPlayerStore.seekTo(newTime);
  // }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  stopSeeking();
});
</script>

<style lang="less" scoped>
.music-progress-bar-container {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  user-select: none;

  .time {
    font-size: 12px;
    color: #ffffff;
    width: 50px;
    text-align: center;
    font-family: 'Comfortaa-Light', sans-serif;
  }

  .current-time {
    opacity: 0.8;
  }

  .duration {
    opacity: 0.6;
  }

  .progress-bar {
    flex: 1;
    height: 6px;
    position: relative;
    margin: 0 10px;
    cursor: pointer;

    .progress-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    .progress-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: linear-gradient(90deg, #44AADD, #ff66ab);
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(255, 102, 171, 0.5);
      transition: width 0.1s linear;
    }

    .progress-handle {
      position: absolute;
      top: 50%;
      width: 12px;
      height: 12px;
      background-color: #ffffff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease;
      z-index: 1;

      &.active,
      &:hover {
        transform: translate(-50%, -50%) scale(1.4);
        box-shadow: 0 0 8px rgba(255, 102, 171, 0.8);
      }
    }

    .seek-preview {
      position: absolute;
      bottom: 15px;
      padding: 2px 8px;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 10px;
      font-size: 10px;
      color: white;
      transform: translateX(-50%);
      pointer-events: none;
      white-space: nowrap;

      &:after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 4px;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.7) transparent transparent transparent;
      }
    }
  }
}
</style>