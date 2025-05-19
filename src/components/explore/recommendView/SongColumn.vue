<script setup>
/* eslint-disable */
import SongBar from "@/components/explore/recommendView/SongBar.vue";

const props = defineProps({
  songList: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="song-column">
    <div class="song-list">
      <SongBar
          v-for="(item, index) in songList"
          :key="index"
          :song="item"
          class="song-bar"
      />
    </div>
  </div>
</template>

<style scoped>
.song-column {
  width: 100%;
  height: 100%; /* 确保父容器有明确高度 */
}

.song-list {
  display: flex;
  flex-direction: column;
  height: 100%; /* 重要：容器需要有明确高度 */
}

.song-bar {
  width: 95%;
  flex: 1; /* 关键属性：使每个子项平分空间 */
  min-height: 0; /* 防止内容溢出 */
  margin: 0 auto;
}
</style>