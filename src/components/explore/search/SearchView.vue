<script setup>
/* eslint-disable */
import {ref, onMounted, watch, computed, watchEffect} from 'vue';
import {getAllMusic} from "@/utils/api/MusicApi";
import SongBar from "@/components/explore/recommendView/SongBar.vue";
import {useRoute} from "vue-router";
import {getUserInfo} from "@/utils/UserUtils";
import {getSongIdsInCollection} from "@/utils/api/CollectionApi";

// 获取当前路由对象
const route = useRoute();
const list = ref([]);
const total = ref(0);
const isLoading = ref(false);
const isLoadMore = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);
const pageSize = 15; // 每次加载15条数据

const searchQuery = computed(() => {
  return {
    name: route.query?.name || '',
    artist: route.query?.artist || ''
  };
});

const checkIsInCollection = async (list) => {
  try {
    const user = await getUserInfo();
    const response = await getSongIdsInCollection(user.id);
    const collectionIds = response.data.list;
    if(response.code){
      for(let i = 0; i < list.length; i++) {
        list[i].isInCollection = collectionIds.includes(list[i].id);
      }
    }
  } catch (error) {
    console.error("Error checking collection status:", error);
  }
}

// 加载更多数据
const loadMore = async () => {
  if (isLoadMore.value || !hasMore.value) return;

  isLoadMore.value = true;
  try {
    currentPage.value += 1;
    const response = await getAllMusic(
        searchQuery.value.name,
        searchQuery.value.artist,
        pageSize,
        currentPage.value
    );

    if (response.code) {
      const newList = response.data.list;
      await checkIsInCollection(newList);
      list.value = [...list.value, ...newList];

      // 检查是否还有更多数据
      if (newList.length < pageSize || list.value.length >= total.value) {
        hasMore.value = false;
      }
    }
  } catch (error) {
    console.error("Error loading more results:", error);
    currentPage.value -= 1; // 回退页码
  } finally {
    isLoadMore.value = false;
  }
}

// 处理滚动事件
const handleScroll = (e) => {
  const container = e.target;
  // 距离底部100px时加载更多
  const threshold = 100;
  const { scrollHeight, scrollTop, clientHeight } = container;

  if (scrollHeight - (scrollTop + clientHeight) < threshold) {
    loadMore();
  }
}

// 重置搜索状态
const resetSearch = () => {
  list.value = [];
  total.value = 0;
  currentPage.value = 1;
  hasMore.value = true;
  isLoadMore.value = false;
}

// 监听 query 的变化，并在变化时重新获取数据
watchEffect(async () => {
  if (searchQuery.value.name || searchQuery.value.artist) {
    try {
      resetSearch();
      isLoading.value = true;
      const response = await getAllMusic(
          searchQuery.value.name,
          searchQuery.value.artist,
          pageSize,
          currentPage.value
      );

      if (response.code) {
        list.value = response.data.list;
        total.value = response.data.total;
        await checkIsInCollection(list.value);

        // 检查是否还有更多数据
        if (list.value.length >= total.value) {
          hasMore.value = false;
        }
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    resetSearch();
  }
});

// 添加滚动监听
onMounted(() => {
  const container = document.querySelector('.song-list-container');
  if (container) {
    container.addEventListener('scroll', handleScroll);
  }
});
</script>

<template>
  <div class="search-results-container">
    <!-- 搜索结果标题 -->
    <div class="search-header">
      <h1 class="search-title">搜索结果</h1>
      <div v-if="searchQuery.name || searchQuery.artist" class="search-meta">
        <p class="search-query">
          <span v-if="searchQuery.name">搜索歌曲: "{{ searchQuery.name }}"</span>
          <span v-if="searchQuery.artist && searchQuery.name">&nbsp;,&nbsp; </span>
          <span v-if="searchQuery.artist">歌手: "{{ searchQuery.artist }}"</span>
        </p>
        <p v-if="!isLoading" class="search-count">
          共找到 {{ total }} 个结果
        </p>
      </div>
      <hr>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>正在搜索中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!list || list.length === 0" class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h3>没有找到匹配的歌曲</h3>
      <p>请尝试不同的搜索关键词</p>
    </div>

    <!-- 搜索结果列表 -->
    <div v-else class="song-list-container" @scroll="handleScroll">
      <div class="song-list">
        <div v-for="(item, index) in list" :key="index" class="song-item">
          <SongBar :song="item"></SongBar>
        </div>
      </div>

      <!-- 加载更多提示 -->
      <div v-if="isLoadMore" class="loading-more">
        <div class="small-spinner"></div>
        <p>正在加载更多...</p>
      </div>
      <div v-else-if="!hasMore && list.length > 0" class="no-more">
        <p>已经加载全部内容</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-results-container {
  width: 90%;
  min-height: 74vh;
  margin: 30px auto;
  color: #ffffff;
}

.search-header {
  height: 150px;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #2a2a2a;
}

.search-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: #8C66FF;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 2em;
}

.search-query {
  font-size: 1.1rem;
  color: #b3b3b3;
  margin: 0;
}

.search-count {
  font-size: 1rem;
  color: #8C66FF;
  background-color: rgba(230, 224, 255, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  margin: 0;
}

.song-list-container {
  width: 90%;
  max-height: calc(74vh - 180px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #535353 #2a2a2a;
  margin: 0 auto;
}

.song-list-container::-webkit-scrollbar {
  width: 8px;
}

.song-list-container::-webkit-scrollbar-track {
  background: #2a2a2a;
  border-radius: 10px;
}

.song-list-container::-webkit-scrollbar-thumb {
  background-color: #535353;
  border-radius: 10px;
}

.song-list {
  width: 100%;
  margin: 0 auto;
}

.song-item {
  height: 80px;
  transition: background-color 0.2s ease;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(29, 185, 84, 0.2);
  border-radius: 50%;
  border-top-color: #1db954;
  animation: spin 1s ease-in-out infinite;
}

.small-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(29, 185, 84, 0.2);
  border-radius: 50%;
  border-top-color: #1db954;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
}

.loading-more, .no-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  color: #b3b3b3;
  font-size: 0.9rem;
}

.loading-more {
  flex-direction: row;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
  text-align: center;
}

.empty-icon {
  width: 60px;
  height: 60px;
  color: #535353;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #ffffff;
  margin: 0;
}

.empty-state p {
  font-size: 1rem;
  color: #b3b3b3;
  margin: 0;
}

@media (max-width: 768px) {
  .search-results-container {
    padding: 1rem;
  }

  .search-title {
    font-size: 2rem;
  }

  .search-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>