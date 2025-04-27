<template>
  <div class="playlist-section">
    <div class="section-divider"></div>
    <div class="section-header">
      <h2 class="section-title">我的歌单</h2>
    </div>
    <div class="playlist-list">
      <div v-for="playlist in playlists" :key="playlist.id" class="playlist-item">
        <PlaylistItem :playlist="playlist" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PlaylistItem from './PlaylistItem.vue';

const playlists = ref([
  {
    id: 2,
    name: "夏日精选",
    creatorId: 1,
    createTime: "2025-04-06T15:11:29",
    updateTime: "2025-04-06T15:11:29",
    description: "适合夏天听的清爽歌曲合集",
    coverUrl: "https://huangzizhu-java-web.oss-cn-chengdu.aliyuncs.com/2025-04/be4ecff1-5818-4947-8d44-9eb4ae819c53",
    totalDuration: 0,
    total: null
  },
  {
    id: 1,
    name: "夏日精选",
    creatorId: 1,
    createTime: "2025-04-06T15:10:48",
    updateTime: "2025-04-06T15:10:48",
    description: "适合夏天听的清爽歌曲合集",
    coverUrl: "https://huangzizhu-java-web.oss-cn-chengdu.aliyuncs.com/2025-04/be4ecff1-5818-4947-8d44-9eb4ae819c53",
    totalDuration: 0,
    total: null
  },
]);
</script>

<style scoped>
.playlist-section {
  margin-top: 40px;
  padding: 0 20px;
  min-height: auto;
}

.section-divider {
  height: 1px;
  background-color: #E6649F;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  color: #E6649F;
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.playlist-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 每行 5 个元素 */
  gap: 0.5em; /* 元素之间的间距 */
  padding-bottom: 8px;
}
</style>