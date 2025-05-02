<template>
  <div class="song-item-container"
       @mouseenter="isHovered = true"
       @mouseleave="isHovered = false"
       @click="handleSongClick">
    <div class="song-cover">
      <img
          :src="song.coverUrl"
          alt="歌曲封面"
          class="cover-image"
          @error="handleImageError($event)"
      />
      <div v-if="isHovered" class="hover-overlay">
        <div class="play-icon"><el-icon><VideoPlay /></el-icon></div>
      </div>
    </div>
    <div class="song-info">
      <div class="song-name">{{ truncateText(song.name, 15) }}</div>
      <div class="song-artist">{{ truncateText(song.artist, 15) }}</div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref } from 'vue';
import { VideoPlay } from '@element-plus/icons-vue';
import {useUserStore} from '@/store/User'

const userStore = useUserStore();

const props = defineProps({
  song: {
    type: Object,
    required: true
  }
});

// 方法：截断文本
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

// 点击事件处理
const handleSongClick = () => {
  console.log("跳转的逻辑");
};

// 鼠标悬停状态
const isHovered = ref(false);

// 图片加载失败时的处理
const handleImageError = (event) => {
  event.target.src = userStore.defaultCoverUrl; // 默认占位图的路径
};
</script>

<style scoped>
.song-item-container {
  position: relative;
  width: 100%; /* 增大元素宽度 */
  height: 100%; /* 增大元素高度 */
  margin: 0 1em; /* 减少元素之间的间距 */
}

.song-cover {
  position: relative;
  margin: auto auto;
  width: 80%; /* 增大封面宽度 */
  height: 80%; /* 增大封面高度 */
  align-content: center;
  overflow: hidden;
  border-radius: 8px;
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

.song-info {
  width: 80%;
  margin: auto auto;
  text-align: left;
}

.song-name {
  font-size: 14px; /* 增大字体大小 */
  color: white;
  margin-bottom: 4px;
}

.song-artist {
  font-size: 12px; /* 增大字体大小 */
  color: rgba(255, 255, 255, 0.8);
}

.song-item-container:hover .song-info {
  background: rgba(230, 100, 159, 0.6);
  border-radius: 8px;
  padding: 4px 0;
}
</style>