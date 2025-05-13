<script setup>
/* eslint-disable */
import {onMounted, onUnmounted, ref, watch} from 'vue';
import PlaylistInfo from "@/components/explore/my/playListInfoPart/PlaylistInfo.vue";
import ShowCard from "@/components/explore/my/ShowCard.vue";
import {useUserStore} from "@/store/User";
import {getPlayListInfoById,getPlayListSongs} from "@/utils/api/PlayListApi";
import {getUserInfoById} from "@/utils/api/UserApi";
import {checkImage, getUserInfo} from "@/utils/UserUtils";
import PlayListForm from "@/components/explore/my/playList/PlayListForm.vue";

// 通过props接收路由参数
const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const playListInfo = ref(null);
const userInfo = ref({ username: '', avatarUrl: '',uid:'' })
const songList = ref([])
const alternateCover = ref(useUserStore().defaultCoverUrl)
const boxVisibility = ref(false)
const playListForm = ref(null)
// 分页相关状态
const loading = ref(true)
const loadingMore = ref(false)
const noMoreData = ref(false)
const currentPage = ref(1)
const pageSize = 24 // 每页条数
const songsContainer = ref(null);

const getPlayListInfo = async () => {
  try {
    const res = await getPlayListInfoById(props.id)
    if (res.code) {
      playListInfo.value = res.data
      userInfo.value.uid = playListInfo.value.creatorId;
    }
  } catch (error) {
    console.error('获取歌单失败:', error)
  }
}

const getUserData = async () => {
  try {
    const response = await getUserInfoById(userInfo.value.uid);
    if (response.code) {
      userInfo.value.username = response.data.username;
      userInfo.value.avatarUrl = response.data.avatarUrl;
    } else {
      console.error('获取用户信息失败:', response.message);
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 获取歌曲列表（带分页）
const getAllSong = async (page = 1, isLoadMore = false) => {
  if (loadingMore.value || noMoreData.value) return;

  try {
    if (isLoadMore) {
      loadingMore.value = true;
    } else {
      loading.value = true;
      songList.value = []; // 重置列表
    }

    const res = await getPlayListSongs(
        props.id,
        pageSize,
        page
    );

    if (res.code) {
      const newItems = res.data.list;

      // 如果没有数据了
      if (newItems.length === 0) {
        noMoreData.value = true;
        return;
      }

      if (isLoadMore) {
        songList.value = [...songList.value, ...newItems];
      } else {
        songList.value = newItems;
      }

      // 检查封面
      if (newItems[0]?.coverUrl) {
        if (await checkImage(newItems[0].coverUrl)) {
          alternateCover.value = newItems[0].coverUrl;
        }
      }

      currentPage.value = page;
    }
  } catch (error) {
    console.error('获取收藏歌单歌曲失败:', error);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// 检查是否滚动到底部
const checkScroll = () => {
  const container = songsContainer.value;
  if (!container) return;

  // 检查是否滚动到底部附近
  const { scrollTop, scrollHeight, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 200 && !loadingMore.value && !noMoreData.value) {
    loadMore();
  }
};

// 加载更多数据
const loadMore = () => {
  getAllSong(currentPage.value + 1, true);
};

const handleEdit= (value) => {
  boxVisibility.value = value
  if (value){
    playListForm.value?.setData()
  }
}
const loadData = async () => {
  await getAllSong();
  await getPlayListInfo();
  await getUserData();
};
onMounted(async ()=>{
  await loadData();

  // 添加滚动事件监听
  const container = songsContainer.value;
  if (container) {
    container.addEventListener('scroll', checkScroll);
  }
});

onUnmounted(() => {
  // 移除滚动事件监听
  const container = songsContainer.value;
  if (container) {
    container.removeEventListener('scroll', checkScroll);
  }
});

watch(() => props.id, (newId) => {
  if (newId) {
    loadData();
  }
}, { immediate: true });

</script>

<template>
  <div class="playlist-detail">
    <PlaylistInfo
        v-if="playListInfo"
        :name="playListInfo.name"
        :cover-url="playListInfo.coverUrl"
        :description="playListInfo.description"
        :total="playListInfo.total"
        :duration="playListInfo.totalDuration"
        :update-time="playListInfo.updateTime"
        :creator-name="userInfo.username"
        :creator-avatar="userInfo.avatarUrl"
        :alternative-cover="alternateCover"
        @click="handleEdit(true)"
    />
  </div>
  <div class="songs-container" ref="songsContainer">
    <div v-if="songList.length > 0" class="songs-list">
      <div v-for="(item, index) in songList" :key="index" class="song-item">
        <ShowCard :image="item.coverUrl"
                  :title="item.name"
                  :content="item.artist"
        ></ShowCard>
      </div>
    </div>
  </div>
  <play-list-form :list-id="props.id"
                  :box-visibility="boxVisibility"
                  :uid="userInfo.uid"
                  @update:playlist-box-visibility="handleEdit"
                  @update:playlist-info="getPlayListInfo"
                  ref="playListForm"
  ></play-list-form>
</template>

<style scoped>
.playlist-detail {
  width: 100%;
}
.songs-container{
  width: 90%;
  margin: 20px auto;
  height: calc(74vh - 320px);
  overflow-y: auto;
}
.songs-list{
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 3%;
  width: 100%;
}

.loading-more,
.no-more-data {
  padding: 20px;
  color: #888;
}
@media (max-width: 1200px) {
  .songs-list {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 992px) {
  .songs-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .songs-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 576px) {
  .songs-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>