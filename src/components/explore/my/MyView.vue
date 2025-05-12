<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ShowCard from "@/components/explore/my/ShowCard.vue";
import {getCollectionInfo} from "@/utils/api/CollectionApi";
import {getAllPlayLists} from "@/utils/api/PlayListApi";
import {useUserStore} from "@/store/User";
import {getUserInfo} from "@/utils/UserUtils";

const router = useRouter();
const favoritePlaylist = ref(null);
const playlists = ref([]);
const loading = ref(true);
const error = ref(null);

// 处理图片加载失败
const handleImageError = (event) => {
  event.target.src = useUserStore().defaultCoverUrl;
};

// 获取数据
const fetchData = async () => {
  try {
    await getUserInfo();
    const uid = useUserStore().userInfo.id
    loading.value = true;

    // 并行请求收藏歌单和普通歌单
    const [favoriteRes, playlistsRes] = await Promise.all([
      getCollectionInfo(uid),
      getAllPlayLists(uid)
    ]);

    if (favoriteRes.code === 1) {
      favoritePlaylist.value = favoriteRes.data;
    }

    if (playlistsRes.code === 1) {
      playlists.value = playlistsRes.data.list || [];
    }
  } catch (err) {
    error.value = err.message || '获取歌单失败';
    console.error('Error fetching playlists:', err);
  } finally {
    loading.value = false;
  }
};

// 处理卡片点击
const handleCardClick = (type, id) => {
  if (type === 'favorite') {
    router.push('/explore/my/collection');
  } else {
    router.push({
      name: 'PlaylistDetail',
      params: { id: id }
    });
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="my-content">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="grid-container">
      <!-- 收藏歌单卡片 -->
      <div
          v-if="favoritePlaylist"
          class="playlist-card"
          @click="handleCardClick('favorite')"
      >
        <ShowCard
            title="收藏"
            :image="favoritePlaylist.coverUrl"
            @image-error="handleImageError"
        />
      </div>

      <!-- 普通歌单卡片 -->
      <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist-card"
          @click="handleCardClick('playlist', playlist.id)"
      >
        <ShowCard
            :title="playlist.name"
            :image="playlist.coverUrl"
            @image-error="handleImageError"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-content {
  height: 74vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 3%;
  width: 100%;
}

.playlist-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.playlist-card:hover {
  transform: translateY(-5px);
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2rem;
}

.error {
  color: #ff4d4f;
}

@media (max-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 992px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 576px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>