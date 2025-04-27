<template>
  <div class="favorites-section">
    <div class="section-divider"></div>
    <div class="section-header">
      <h2 class="section-title">我的收藏</h2>
      <button class="more-button" @click="handleMoreFavorites">更多</button>
    </div>
    <div class="favorites-list">
      <div v-for="(song) in songs" :key="song.id" class="song-item">
        <SongItem :song="song" />
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref } from 'vue';
import SongItem from '@/components/view/user/profile/mediaDisplay/SongItem.vue';

const songs = ref([
  {
    id: 19,
    name: "3秒ルール",
    artist: "Tensions",
    albumId: 10,
    albumName: "3秒ルール",
    year: "",
    duration: 216,
    format: "mp3",
    size: 8829852,
    coverUrl: "https://huangzizhu-java-web.oss-cn-chengdu.aliyuncs.com/2025-04/be4ecff1-5818-4947-8d44-9eb4ae819c53",
    bitRate: 320,
    sampleRate: 48000,
    path: null,
    md5: "2ae3eb6ce662181543e0ca24f15d7597",
    isAvailable: true
  },
  {
    id: 20,
    name: "ダンスフロアの果実 (feat. nicamoq)",
    artist: "Yunomi",
    albumId: 11,
    albumName: "ゆのもきゅ",
    year: "",
    duration: 230,
    format: "mp3",
    size: 10973495,
    coverUrl: "https://huangzizhu-java-web.oss-cn-chengdu.aliyuncs.com/2025-04/92ba99f6-f6e9-41ca-9a09-7e58cfb8ca01",
    bitRate: 320,
    sampleRate: 44100,
    path: null,
    md5: "d15388e8394a2703cb4b2ebc8358dada",
    isAvailable: true
  }
]);

const handleMoreFavorites = () => {
  console.log('更多收藏');
};
</script>

<style scoped>
.favorites-section {
  margin-top: 40px;
  padding: 0 20px;
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

.more-button {
  background: rgba(230, 100, 159, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(230, 100, 159, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.more-button:hover {
  background: rgba(230, 100, 159, 0.25);
  color: white;
}

.favorites-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 每行 5 个元素 */
  gap: 0.5em; /* 元素之间的间距 */
  padding-bottom: 8px;
}
</style>