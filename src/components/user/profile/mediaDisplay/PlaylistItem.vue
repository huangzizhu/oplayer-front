<template>
  <div class="playlist-item-container"
       @mouseenter="isHovered = true"
       @mouseleave="isHovered = false"
       @click="handlePlaylistClick"
       :style="{ '--hover-bg-color': hoverBgColor }">
    <div class="playlist-cover">
      <img
          :src="playlist.coverUrl"
          alt=""
          class="cover-image"
          @error="handleImageError($event)"/>
      <div v-if="isHovered" class="hover-overlay">
        <div class="play-icon"><el-icon><Headset /></el-icon></div>
      </div>
    </div>
    <div class="playlist-info">
      <div class="playlist-name">{{ truncateText(playlist.name, 15) }}</div>
      <div class="playlist-duration">总时长: {{ formatDuration(playlist.totalDuration) }}</div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import {ref, watch} from 'vue';
import { VideoPlay } from '@element-plus/icons-vue';
import {useUserStore} from '@/store/User'
import {getAdaptiveBgColor, getMainColorHex} from "@/utils/UserUtils";

const userStore = useUserStore();

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  }
});
const hoverBgColor = ref('#333333');
watch(() => props.playlist.coverUrl, async (url) => {
  try {
    hoverBgColor.value = getAdaptiveBgColor(await getMainColorHex(url));
  }catch (err){}
}, { immediate: true });
const isHovered = ref(false);

// 截断文本方法
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

// 格式化总时长
const formatDuration = (duration) => {
  if (duration !== 0 && !duration) return '未知';
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 点击事件处理
const handlePlaylistClick = () => {
  console.log(`点击了歌单：${props.playlist.name}`);
};
// 图片加载失败时的处理
const handleImageError = (event) => {
  event.target.src = userStore.defaultCoverUrl; // 默认占位图的路径
};
</script>

<style scoped>
.playlist-item-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 1em;
}

.playlist-cover {
  position: relative;
  margin: 0 auto;
  width: 80%;
  height: 80%;
  align-content: center;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 8px;
}

.play-icon {
  color: white;
  font-size: 24px;
}

.playlist-info {
  width: 80%;
  margin: auto auto;
  text-align: left;
  background: var(--hover-bg-color);
  border-radius: 0 0 8px 8px;
  padding: 4px 0;
}

.playlist-name {
  font-size: 14px; /* 增大字体大小 */
  color: white;
  margin: 4px 0 0 0.5em
}

.playlist-duration {
  font-size: 12px; /* 增大字体大小 */
  color: rgba(255, 255, 255, 0.8);
  margin: 4px 0 0 0.8em
}

</style>