<script setup>
/* eslint-disable */
import {onMounted, ref, watch} from 'vue';
import PlaylistInfo from "@/components/explore/my/PlaylistInfo.vue";
import ShowCard from "@/components/explore/my/ShowCard.vue";
import {useUserStore} from "@/store/User";
import {getPlayListInfoById,getPlayListSongs} from "@/utils/api/PlayListApi";
import {getUserInfoById} from "@/utils/api/UserApi";
import {checkImage} from "@/utils/UserUtils";
import PlayListForm from "@/components/explore/my/PlayListForm.vue";

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

const getPlayListInfo = async () => {
  try {
    const res = await getPlayListInfoById(props.id)
    if (res.code) {
      playListInfo.value = res.data
      userInfo.value.uid = playListInfo.value.creatorId;
    }
  } catch (error) {
    console.error('获取收藏歌单失败:', error)
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
const getAllSong = async () => {
  try {
    const res = await getPlayListSongs(props.id)
    if (res.code) {
      songList.value = res.data.list
      if(songList.value.length > 0){
        if(songList.value[0].coverUrl){
          if(await checkImage(songList.value[0].coverUrl)){
            alternateCover.value = songList.value[0].coverUrl
          }
        }
      }
    }
  } catch (error) {
    console.error('获取歌单歌曲失败:', error)
  }
}
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
  <div class="songs-container">
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
                  @update:playlist-info="getUserInfoById"
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
}
.songs-list{
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 3%;
  width: 100%;
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