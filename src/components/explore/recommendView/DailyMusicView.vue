<script setup>
/* eslint-disable */
import {onMounted, ref} from 'vue';
import PlaylistInfo from "@/components/explore/my/playListInfoPart/PlaylistInfo.vue";
import SongBar from "@/components/explore/recommendView/SongBar.vue";
import {getDailyMusic} from "@/utils/api/MusicApi";
import {getUserInfo} from "@/utils/UserUtils";
import {getSongIdsInCollection} from "@/utils/api/CollectionApi";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const currentDate = new Date();
const coverUrl = ref();
const total = ref(0)
const duration = ref(0)
const updateTime = ref(formatDate(currentDate))
const user = ref({username: '', avatarUrl: '', id: ''})
const dailyList = ref(null)
const alternativeCover = ref()



const getDailyList = async () => {
  try {
    const response = await getDailyMusic(user.value.id);
    if (response.code) {
      const list = response.data.list
      total.value = response.data.total
      for (let i = 1; i < list.length ; i++) {
        duration.value += list[i].duration
        if(i === 1){
          coverUrl.value = list[i].coverUrl;
          alternativeCover.value = list[i].coverUrl;
        }
        if (i === 2){
          alternativeCover.value = list[i].coverUrl;
        }
      }
      await checkIsInCollection(list)
      dailyList.value = list
    }
  } catch (error) {
    console.error('获取每日推荐歌曲失败:', error)
  }
}
const checkIsInCollection = async (list) => {
  const user = await getUserInfo();
  const response = await getSongIdsInCollection(user.id);
  const collectionIds = response.data.list;
  if(response.code){
    for(let i = 0; i < list.length; i++) {
      list[i].isInCollection = collectionIds.includes(list[i].id);
    }
  }
}
onMounted(async () => {
  user.value = await getUserInfo()
  await getDailyList()

})
</script>

<template>
  <div class="playlist-info-container">
    <PlaylistInfo name="每日推荐"
                  :description="user.username + '的每日推荐'"
                  :coverUrl="coverUrl"
                  :total="total"
                  :duration="duration"
                  :updateTime="updateTime"
                  :creatorName="user.username"
                  :creatorAvatar="user.avatarUrl"
                  :alternativeCover="alternativeCover"
    ></PlaylistInfo>
    <div class="song-list-container">
      <div class="song-list" v-if="dailyList">
        <div v-for="(item, index) in dailyList" :key="index" class="song-item">
          <SongBar :song="item"></SongBar>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.playlist-info-container {
  margin: 20px auto;
  width: 90%;
}
.song-list-container {
  width: 90%;
  margin: 20px auto;
}
.song-item {
  height: 80px;
}
</style>