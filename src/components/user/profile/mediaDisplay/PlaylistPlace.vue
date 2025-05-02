<template>
  <div class="playlist-section" ref="root">
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
/* eslint-disable */
import {onBeforeUnmount, onMounted, ref} from 'vue';
import PlaylistItem from './PlaylistItem.vue';
import {getAllPlayLists} from "@/utils/api/PlayListApi";
const props = defineProps({
  uid: {
    type: Number,
    required: true
  },
});
const playlists = ref([]);

const getAllPlaylistsInfo = async () => {
  const response = await getAllPlayLists(props.uid)
  if (response.code) {
    playlists.value = response.data.list;
  } else {
    console.error('Failed to fetch playlists');
  }
};
//进入视口检测
const root = ref(null) // 模板引用
let observer = null
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        getAllPlaylistsInfo();
      }
    })
  }, {
    threshold: 0.1 // 当10%的元素可见时触发
  })
  if (root.value) {
    observer.observe(root.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
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