<template>
  <div
      class="song-item"
      @mouseenter="isHovered = true"
      @mouseleave="onSongItemLeave"
      :class="{ hovered: isHovered }"
  >
    <div class="cover">
      <img :src="song.coverUrl" class="cover-img" />
    </div>
    <div class="info">
      <h3 class="song-name">{{ song.name }}</h3>
      <p class="artist">{{ song.artist }}</p>
    </div>

    <div class="actions" v-show="isHovered">
      <svg-icon
          type="mdi"
          :path="mdiPlayCircleOutline"
          class="action-icon"
          @click="handlePlay"
      />
      <svg-icon
          type="mdi"
          :path="song.isInCollection ? mdiHeart : mdiHeartOutline"
          class="action-icon"
          :class="{ 'favorite': song.isInCollection }"
          @click="handleToggleFavorite"
      />
      <svg-icon
          type="mdi"
          :path="mdiDownloadCircleOutline"
          class="action-icon"
          @click="handleDownload"
      />
      <div class="playlist-plus-wrapper">
        <svg-icon
            type="mdi"
            :path="mdiPlaylistPlus"
            class="action-icon"
            @mouseenter="handleMenuMouseEnter"
            @mouseleave="handleMenuMouseLeave"
        />
        <!-- 安全过渡区域 -->
        <div
            class="safe-zone"
            v-if="showPlaylistDropdown"
            @mouseenter="cancelMenuClose"
        ></div>
      </div>
    </div>

    <!-- 歌单选择 -->
    <transition name="menu-fade">
      <div
          v-if="showPlaylistDropdown"
          class="playlist-dropdown"
          @mouseenter="cancelMenuClose"
          @mouseleave="scheduleMenuClose"
          @click.stop
          ref="dropdownMenu"
          @scroll="handleScroll"
      >
        <div class="dropdown-header">添加至歌单</div>
        <div
            v-for="playlist in playlists"
            :key="playlist.id"
            class="dropdown-item"
            @click="addToPlaylist(playlist.id)"
        >
          <div class="playlist-item">
            <img :src="playlist.coverUrl" class="cover-img" @error="handleCoverError"/>
            <span>{{playlist.name}}</span>
          </div>
        </div>
        <div v-if="loadingMore" class="dropdown-item loading">加载中...</div>
        <div v-else-if="noMoreData" class="dropdown-item no-more">已展示所有歌单</div>
        <div class="dropdown-item create-new" @click="createNewPlaylist">
          + 创建歌单
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
/* eslint-disable */
import {ref, onUnmounted,onMounted} from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import {
  mdiPlayCircleOutline,
  mdiDownloadCircleOutline,
  mdiHeart,
  mdiHeartOutline,
  mdiPlaylistPlus
} from '@mdi/js';
import {downloadMusic} from '@/utils/MusicUtils';
import {deleteMusicFromCollection,addMusicToCollection} from "@/utils/api/CollectionApi";
import {getAllPlayLists,addSongToPlayList} from "@/utils/api/PlayListApi";
import {getUserInfo} from "@/utils/UserUtils";
import {Notify} from "@opentiny/vue";
import {useUserStore} from "@/store/User";

const props = defineProps({
  song: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'name' in value && 'artist' in value && 'coverUrl' in value;
    }
  }
});

// 菜单状态
const isHovered = ref(false);
const showPlaylistDropdown = ref(false);
const playlists = ref([]);
const menuCloseTimer = ref(null);
const dropdownMenu = ref(null);

// 分页相关状态
const loadingMore = ref(false);
const noMoreData = ref(false);
const currentPage = ref(1);
const pageSize = 5; // 每次加载5个歌单


const handleCoverError = (event) =>{
    event.target.onerror = null; // 防止再次触发
    event.target.src = useUserStore().defaultCoverUrl;
  }


const handleMenuMouseEnter = async () => {
  // 重置分页状态
  currentPage.value = 1;
  noMoreData.value = false;
  playlists.value = [];

  const user = await getUserInfo();
  await loadPlaylists(user.id);

  if (menuCloseTimer.value) {
    clearTimeout(menuCloseTimer.value);
    menuCloseTimer.value = null;
  }
  showPlaylistDropdown.value = true;
};

// 加载歌单数据
const loadPlaylists = async (userId, isLoadMore = false) => {
  if (loadingMore.value || noMoreData.value) return;

  try {
    loadingMore.value = true;

    const response = await getAllPlayLists(userId,pageSize,currentPage.value);

    if (response.code) {
      const newPlaylists = response.data.list;

      if (newPlaylists.length === 0) {
        noMoreData.value = true;
        return;
      }

      if (isLoadMore) {
        playlists.value = [...playlists.value, ...newPlaylists];
      } else {
        playlists.value = newPlaylists;
      }

      currentPage.value += 1;
    }
  } catch (error) {
    console.error('Failed to load playlists:', error);
  } finally {
    loadingMore.value = false;
  }
};

// 处理滚动事件
const handleScroll = async () => {
  const menu = dropdownMenu.value;
  if (!menu) return;

  // 检查是否滚动到底部
  const { scrollTop, scrollHeight, clientHeight } = menu;
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20;

  if (isNearBottom && !loadingMore.value && !noMoreData.value) {
    const user = await getUserInfo();
    await loadPlaylists(user.id, true);
  }
};


const onSongItemLeave = () => {
  isHovered.value = false;
  if (showPlaylistDropdown.value) {
    if (menuCloseTimer.value) clearTimeout(menuCloseTimer.value);
    showPlaylistDropdown.value = false;
  }
};

const cancelMenuClose = () => {
  clearTimeout(menuCloseTimer.value);
};

const scheduleMenuClose = () => {
  handleMenuMouseLeave();
};

const handleMenuMouseLeave = () => {
  if (menuCloseTimer.value) clearTimeout(menuCloseTimer.value);
  menuCloseTimer.value = setTimeout(() => {
    showPlaylistDropdown.value = false;
    menuCloseTimer.value = null;
  }, 300);
};


// 功能方法
const user = ref();
const handlePlay = () => {
  console.log("Playing song:", props.song.name);
};

const handleDownload = () => {
  downloadMusic(props.song);
};

const handleToggleFavorite = async () => {
  user.value = await getUserInfo();
  if(props.song.isInCollection) {
    console.log("Removing from favorites:", props.song.name);
    const response = await deleteMusicFromCollection(user.value.id,props.song.id)
    if(response.code) {
      props.song.isInCollection = false
      Notify({
        type: 'success',
        message: '已从收藏中移除',
        duration: 2000,
        position: 'top-right',
      })
    } else {
      console.error("Failed to remove from favorites:", response.msg);
      Notify({
        type: 'error',
        message: '移除失败'+ response.msg,
        duration: 2000,
        position: 'top-right',
      })
    }
  } else {
    const response = await addMusicToCollection(user.value.id,props.song.id)
    if(response.code) {
      props.song.isInCollection = true
      Notify({
        type: 'success',
        message: '已添加至收藏',
        duration: 2000,
        position: 'top-right',
      })
    } else {
      console.error("Failed to add to favorites:", response.msg);
      Notify({
        type: 'error',
        message: '添加失败：'+ response.msg,
        duration: 2000,
        position: 'top-right',
      })
    }
  }
};

const addToPlaylist = async (playlistId) => {
  console.log(`Adding song ${props.song.name} to playlist ${playlistId}`);
  const user = await getUserInfo();
  const response = await addSongToPlayList({
    "songId": props.song.id,
    "userId": user.id,
    "listId": playlistId,
  })
  if (response.code) {
    Notify({
      type: 'success',
      message: '已添加至歌单',
      duration: 2000,
      position: 'top-right',
    })
  } else {
    console.error("Failed to add to playlist:", response.msg);
    Notify({
      type: 'error',
      message: '添加失败：'+ response.msg,
      duration: 2000,
      position: 'top-right',
    })
  }
  handleMenuMouseLeave();
};

const createNewPlaylist = () => {
  console.log("Creating new playlist for song:", props.song.name);
  showPlaylistDropdown.value = false;
};

onMounted(()=>{

// 添加滚动事件监听
  const container = dropdownMenu.value;
  if (container) {
    container.addEventListener('scroll', handleScroll);
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (menuCloseTimer.value) {
    clearTimeout(menuCloseTimer.value);
  }
  // 移除滚动事件监听
  const container = dropdownMenu.value;
  if (container) {
    container.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.song-item {
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.1);
  position: relative;
  border: 1px solid white;
}

.song-item:hover {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.song-item.hovered .song-name {
  color: #333 ;
}

.cover {
  height: 100%;
  aspect-ratio: 1 / 1; /* 保持1:1的宽高比 */
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}
.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1; /* 保持1:1的宽高比 */
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;

}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
}

.song-name {
  font-family: "SimHei", "黑体", sans-serif;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: white;
}

.artist {
  font-size: 14px;
  margin: 0;
  color: #aaa;
}

.actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
  padding-right: 8px;
}

.action-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.action-icon:hover {
  transform: scale(1.1);
  color: #333;
}

.action-icon.favorite {
  color: #ff4d4f;
}

.action-icon.favorite:hover {
  color: #ff7875;
}

.playlist-plus-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.safe-zone {
  position: absolute;
  top: 100%;
  width: 100%;
  height: 10px;
  background: transparent;
}

/* 菜单动画 */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}


.playlist-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
  min-width: 200px;
  height: 20vh;
  overflow-y: auto; /* 启用垂直滚动 */
}

.playlist-item {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 水平方向上两端对齐 */
  width: 100%;
  height: 50px;
}
.playlist-item span {
  margin-left: 10px;
  flex: 1; /* 让标题占据剩余空间 */
}
.playlist-item img {
  width: 50px; /* 设置图片的宽度 */
  height: 50px; /* 设置图片的高度 */
  object-fit: cover; /* 保证图片填充整个区域 */
  border-radius: 5px;
}


.dropdown-item.loading,
.dropdown-item.no-more {
  color: #888;
  font-size: 12px;
  text-align: center;
  padding: 8px;
}


.dropdown-header {
  padding: 8px 12px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.create-new {
  color: #1db954;
  font-weight: bold;
  border-top: 1px solid #eee;
}
</style>