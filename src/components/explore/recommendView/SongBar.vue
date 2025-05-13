<template>
  <div
      class="song-item"
      :style="{ '--cover-url': `url(${song.coverUrl})` }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
  >
    <div class="cover"></div>
    <div class="info">
      <h3 class="song-name">{{ song.name }}</h3>
      <p class="artist">{{ song.artist }}</p>
    </div>

    <div class="actions" v-show="isHovered">
      <svg-icon
          type="mdi"
          :path="mdiPlayCircleOutline"
          class="action-icon"
          @click="handlePlay"
      />
      <svg-icon
          type="mdi"
          :path="isInCollection ? mdiHeart : mdiHeartOutline"
          class="action-icon"
          :class="{ 'favorite': isInCollection }"
          @click="handleToggleFavorite"
      />
      <svg-icon
          type="mdi"
          :path="mdiDownloadCircleOutline"
          class="action-icon"
          @click="handleDownload"
      />
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import {
  mdiPlayCircleOutline,
  mdiDownloadCircleOutline,
  mdiHeart,
  mdiHeartOutline
} from '@mdi/js';

const props = defineProps({
  song: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'name' in value && 'artist' in value && 'coverUrl' in value;
    }
  },
  isInCollection: {
    type: Boolean,
    default: false
  }
});


const isHovered = ref(false);

const handlePlay = () => {
  console.log("Playing song:", props.song.name);
};

const handleDownload = () => {
  console.log("Downloading song:", props.song.name);
};

const handleToggleFavorite = () => {
  console.log("Toggling favorite for song:", props.song.name);
};
</script>

<style scoped>
.song-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: transparent;
  position: relative;
}

.song-item:hover {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.song-item:hover .song-name,
.song-item:hover .artist {
  color: #333;
}

.cover {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background-image: var(--cover-url);
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
}

.song-name {
  font-family: "SimHei", "黑体", sans-serif;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: white;
}

.artist {
  font-size: 14px;
  margin: 0;
  color: #aaa;
}

.actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
  padding-right: 8px;
}

.action-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.action-icon:hover {
  transform: scale(1.1);
  color: #333;
}

.action-icon.favorite {
  color: #ff4d4f;
}

.action-icon.favorite:hover {
  color: #ff7875;
}
</style>