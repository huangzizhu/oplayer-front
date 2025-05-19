<script setup>
/* eslint-disable */
import SongColumn from "@/components/explore/recommendView/SongColumn.vue";
import {onMounted, ref} from "vue";
import {getRandomMusic} from "@/utils/api/MusicApi";
import {getUserInfo} from "@/utils/UserUtils";
import {getSongIdsInCollection} from "@/utils/api/CollectionApi";

const list1 = ref([]);
const list2 = ref([]);
const list3 = ref([]);

const fillList = async () => {
  const response = await getRandomMusic(15);
  if(response.code){
    const list = response.data.list;
    await checkIsInCollection(list);
    list1.value = list.slice(0, 5);
    list2.value = list.slice(5, 10);
    list3.value = list.slice(10, 15);
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
  await fillList();
})
</script>

<template>
  <div class="song-column-container">
    <SongColumn :song-list="list1" class="song-column"></SongColumn>
    <SongColumn :song-list="list2" class="song-column"></SongColumn>
    <SongColumn :song-list="list3" class="song-column"></SongColumn>
  </div>
  <hr>
</template>

<style scoped>
.song-column-container {
  width: 90%;
  height: 600px;
  margin: 20px auto;
  display: flex;
  align-items: center;
}
.song-column {
  flex: 1;
}
.song-column:not(:last-child) {
  border-right: 1px solid white;
}
hr {
  width: 80%;
  height: 1px;
  background-color: white;
  margin: 20px auto;
}
</style>