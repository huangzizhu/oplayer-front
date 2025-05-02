<template>
  <div class="favorites-section" ref="root">
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
import { ref,onMounted,onBeforeUnmount } from 'vue';
import router from "@/router";
import {getCollectionList} from "@/utils/api/CollectionApi";
import SongItem from '@/components/user/profile/mediaDisplay/SongItem.vue';

const props = defineProps({
  uid: {
    type: Number,
    required: true
  },
});
const songs = ref([]);

const handleMoreFavorites = () => {
  router.push('/music')
};
const getCollections = async () => {
  const response = await getCollectionList(props.uid)
  if (response.code) {
    songs.value = response.data.list;
  }
};


const root = ref(null) // 模板引用
let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        getCollections();
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