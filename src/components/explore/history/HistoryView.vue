<script setup>
/* eslint-disable */
import HistoryCard from "@/components/explore/history/HistoryCard.vue";
import { ref, onMounted, computed, onUnmounted } from 'vue';
import {useUserStore} from "@/store/User";
import {getHistory} from "@/utils/api/HistoryApi";
import {getMusicById} from "@/utils/api/MusicApi";
import {getPlayListInfoById} from "@/utils/api/PlayListApi";
import {getUserInfo} from "@/utils/UserUtils";

const colors = ['green', 'blue', 'orange', 'red'];
const playHistory = ref([]);
const processedItems = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const noMoreData = ref(false);
const currentPage = ref(1);
const pageSize = 10; // 每页条数
const userStore = useUserStore();
const uid = ref();
const timelineContainer = ref(null);

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return '刚刚';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return '昨天';
  }
  if (diffInDays === 2) {
    return '前天';
  }
  if (diffInDays <= 7) {
    return `${diffInDays}天前`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks <= 4) {
    return `${diffInWeeks}周前`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths <= 12) {
    return `${diffInMonths}个月前`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}年前`;
};

// 获取歌曲详情
const fetchSongDetails = async (songId) => {
  try {
    const response = await getMusicById(songId);
    return response.data;
  } catch (error) {
    console.error('Error fetching song details:', error);
    return null;
  }
};

// 获取歌单详情
const fetchPlaylistDetails = async (listId) => {
  try {
    const response = await getPlayListInfoById(listId);
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    return null;
  }
};

// 处理播放历史数据
const processHistoryData = async (page = 1, isLoadMore = false) => {
  if (loadingMore.value || noMoreData.value) return;

  try {
    if (isLoadMore) {
      loadingMore.value = true;
    } else {
      loading.value = true;
    }

    const user = await getUserInfo();
    uid.value = user.id;

    // 获取播放历史，添加分页参数
    const historyResponse = await getHistory(uid.value, pageSize, page );

    const historyList = historyResponse.data.list;

    // 如果没有数据了
    if (historyList.length === 0) {
      noMoreData.value = true;
      return;
    }

    const processed = [];

    for (const [index, item] of historyList.entries()) {
      // 获取歌曲详情
      const songDetails = await fetchSongDetails(item.songId);
      if (!songDetails) continue;

      // 获取歌单名称
      let playlistName = "收藏";
      if (item.listType === 1) {
        const playlist = await fetchPlaylistDetails(item.listId);
        playlistName = playlist?.name || "未知歌单";
      }

      // 确定颜色
      const colorIndex = (processedItems.value.length + index) % colors.length;
      const color = colors[colorIndex];

      processed.push({
        ...item,
        songDetails,
        playlistName,
        color,
        daysBefore: formatTimeAgo(item.playTime),
      });
    }

    if (isLoadMore) {
      processedItems.value = [...processedItems.value, ...processed];
    } else {
      processedItems.value = processed;
    }

    currentPage.value = page;
  } catch (error) {
    console.error('Error processing history data:', error);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// 检查是否滚动到底部
const checkScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const windowHeight = window.innerHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  console.log(scrollTop, windowHeight, scrollHeight);
  // 距离底部200px时加载更多
  if (scrollTop + windowHeight >= scrollHeight - 200 && !loadingMore.value && !noMoreData.value) {
    loadMore();
  }
};

// 加载更多数据
const loadMore = () => {
  processHistoryData(currentPage.value + 1, true);
};

onMounted(() => {
  processHistoryData();
  const container = timelineContainer.value;
  if (container) {
    container.addEventListener('scroll', checkScroll);
  }
});

onUnmounted(() => {
  const container = timelineContainer.value;
  if (container) {
    container.removeEventListener('scroll', checkScroll);
  }
});

// 计算对齐方式（交替排列）
const getAlignment = (index) => index % 2 === 0 ? 'left' : 'right';
</script>

<template>
  <div class="timelineContainer" ref="timelineContainer">
    <div v-if="loading">加载中...</div>
    <div v-else>
      <v-timeline align="start" line-color="rgba(255, 255, 255, 0.6)">
        <v-timeline-item
            v-for="(item, index) in processedItems"
            :key="index"
            :dot-color="item.color"
        >
          <template v-slot:opposite>
          <span :style="{ color: item.color }">
            {{ item.playlistName }}
          </span>
          </template>

          <div :class="['history-card', getAlignment(index)]">
            <history-card
                :days-before="item.daysBefore"
                :progress="item.progress"
                :artist="item.songDetails.artist"
                :name="item.songDetails.name"
                :date="item.playTime"
                :color="item.color"
            />
          </div>
        </v-timeline-item>
      </v-timeline>

      <div v-if="loadingMore" class="loading-more">
        加载更多...
      </div>
      <div v-if="noMoreData && processedItems.length > 0" class="no-more-data">
        没有更多数据了
      </div>
    </div>
  </div>
</template>

<style scoped>
.timelineContainer {
  height: 74vh; /* 根据实际需要调整 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* 平滑滚动 */
}

.v-timeline-item__opposite span {
  display: block;
  margin-top: 30px; /* 设置与父元素顶部的距离 */
  font-size: 1.3em;
}
.history-card{
  width: 300px;
  height: 300px;
}
/* 左侧卡片（靠右对齐） */
.history-card.left {
  margin-right: 200px; /* 让卡片紧贴时间线 */
  margin-left: auto; /* 靠右对齐 */
}

/* 右侧卡片（靠左对齐） */
.history-card.right {
  margin-left: 200px; /* 让卡片紧贴时间线 */
  margin-right: auto; /* 靠左对齐 */
}


.loading-more,
.no-more-data {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>