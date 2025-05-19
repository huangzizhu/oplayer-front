<template>
  <div class="music-select-view">
    <MusicCover ref="musicCover"></MusicCover>
    <MusicInfo ref="musicInfo"></MusicInfo>

    <SearchBar></SearchBar>
    <MusicVisualization></MusicVisualization>
    <MusicPlayerControls></MusicPlayerControls>


    <MusicSelector></MusicSelector>

  </div>
</template>

<script setup>
/* eslint-disable */
import MusicCover from '@/components/music/MusicCover.vue'
import MusicInfo from '@/components/music/MusicInfo.vue'
import SearchBar from '@/components/music/SearchBar.vue'
import MusicPlayerControls from '@/components/music/MusicPlayerControls.vue'
import MusicSelector from '@/components/music/MusicSelector.vue'
import MusicVisualization from '@/components/music/MusicVisualization.vue'
import { indexedDBService } from "@/utils/indexedDBService";
import { useMusicAnalysis } from '@/store/MusicAnalysis';
import {useOnlineMusicStore} from '@/store/OnlineMusicStore'
import { useMusicPlayer } from '@/store/MusicPlayer';
import {useMusicLibrary} from "@/store/MusicLibrary";
import {getLastPlayList,translateMusicInfo} from "@/utils/MusicUtils";


import {ref, onMounted, computed, watchEffect, watch, nextTick} from 'vue'
import {useMusicSelector} from "@/store/MusicSelector";
const musicCover = ref(null)
const musicInfo = ref(null)
const musicAnalysisStore = useMusicAnalysis();
const onlineMusicStore = useOnlineMusicStore();
const isOnlineMode = computed(()=>onlineMusicStore.isOnlineMode);
const musicLibraryStore = useMusicLibrary();
const musicSelectorStore = useMusicSelector();
const loadDataBase = async () => {
  try {
    await indexedDBService.init();
    console.log('IndexedDB 初始化成功');

    // 从本地存储加载音乐
    await musicAnalysisStore.initFromLocalStorage();

  } catch (error) {
    console.error('IndexedDB 初始化失败:', error);
  }
}
const  loadOnlineMusic = async () => {
  const data = await getLastPlayList();
  console.log(data);
  for (let song of data.list) {
    musicLibraryStore.addMusic(translateMusicInfo(song));
  }
}
watch(isOnlineMode, (newVal, oldVal) => {
  musicLibraryStore.clearList();
  musicSelectorStore.refreshLibrary();
  useMusicPlayer().stopAndUnload();
  if(newVal){
    loadOnlineMusic();
  }
});



onMounted(async () => {
  if(!isOnlineMode.value){
    await loadDataBase();
  }
  else {
    await loadOnlineMusic();
  }
});

</script>

<style scoped>
.music-select-view {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>