<script setup>
/*eslint-disable*/
<<<<<<< HEAD
import PlaylistInfo from "@/components/explore/my/playListInfoPart/PlaylistInfo.vue";
=======
import PlaylistInfo from "@/components/explore/my/PlaylistInfo.vue";
>>>>>>> 0068755b159fe41c72e3619e4318008d81234b55
import ShowCard from "@/components/explore/my/ShowCard.vue";
import CollectionForm from "@/components/explore/my/collection/CollectionForm.vue";
import {ref, onMounted, onUnmounted} from "vue";
import {getCollectionInfo, getCollectionList} from "@/utils/api/CollectionApi";
import {useUserStore} from "@/store/User";
import {checkImage} from "@/utils/UserUtils"
import {getUserInfo} from "@/utils/UserUtils";

const favoriteData = ref(null)
const userInfo = ref({ username: '', avatarUrl: '',uid:'' })
const songList = ref([])
const alternateCover = ref(useUserStore().defaultCoverUrl)
const collectionForm = ref(null)
const boxVisibility = ref(false)

// 分页相关状态
const loading = ref(true)
const loadingMore = ref(false)
const noMoreData = ref(false)
const currentPage = ref(1)
<<<<<<< HEAD
const pageSize = 24 // 每页条数
=======
const pageSize = 12 // 每页条数
>>>>>>> 0068755b159fe41c72e3619e4318008d81234b55
const songsContainer = ref(null);


const getFavoriteData = async () => {
  try {
    const res = await getCollectionInfo(useUserStore().userInfo.id)
    if (res.code) {
      favoriteData.value = res.data
    }
  } catch (error) {
    console.error('获取收藏歌单失败:', error)
  }
}

const getUserData = async () => {
  try {
    const userStore = useUserStore()
    userInfo.value.username = userStore.userInfo.username
    userInfo.value.avatarUrl = userStore.userInfo.avatarUrl
    userInfo.value.uid = userStore.userInfo.id
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

    const res = await getCollectionList(
        userInfo.value.uid,
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

const handleEdit = (value) => {
  boxVisibility.value = value
  if(value){
    collectionForm.value?.setData()
  }
}

onMounted(async ()=>{
  await getUserInfo();
  await getFavoriteData()
  await getUserData()
  await getAllSong()

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
</script>

<template>
  <div class="playlist-detail">
    <PlaylistInfo
        v-if="favoriteData"
        name="我的收藏"
        :cover-url="favoriteData.coverUrl"
        :description="favoriteData.description"
        :total="favoriteData.total"
        :duration="favoriteData.duration"
        :update-time="favoriteData.updateTime"
        :creator-name="userInfo.username"
        :creator-avatar="userInfo.avatarUrl"
        :alternative-cover="alternateCover"
        @click="handleEdit(true)"
    />
  </div>
  <div class="songs-container" ref="songsContainer">
    <div v-if="loading && !loadingMore">加载中...</div>
    <div v-else-if="songList.length > 0" class="songs-list">
      <div v-for="(item, index) in songList" :key="index" class="song-item">
        <ShowCard
            :image="item.coverUrl"
            :title="item.name"
            :content="item.artist"
        />
      </div>
    </div>
    <div v-else-if="!loading">暂无歌曲</div>

    <div v-if="loadingMore" class="loading-more">
      正在加载更多...
    </div>
    <div v-if="noMoreData && songList.length > 0" class="no-more-data">
      没有更多数据了
    </div>
  </div>

  <CollectionForm
      :box-visibility="boxVisibility"
      ref="collectionForm"
      @update:collection-box-visibility="handleEdit"
      @update:collection-info="getFavoriteData"
  />
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
<<<<<<< HEAD

.loading-more,
=======
.loading-more,

>>>>>>> 0068755b159fe41c72e3619e4318008d81234b55
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