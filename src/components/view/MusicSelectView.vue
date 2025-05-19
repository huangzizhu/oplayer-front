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
import {useMusicLibrary} from "@/store/MusicLibrary";


import {ref, onMounted, computed, watchEffect, watch} from 'vue'
const musicCover = ref(null)
const musicInfo = ref(null)
const musicAnalysisStore = useMusicAnalysis();
const onlineMusicStore = useOnlineMusicStore();
const isOnlineMode = computed(()=>onlineMusicStore.isOnlineMode);

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
watch(isOnlineMode, (newVal, oldVal) => {
  console.log(`isOnlineMode changed from ${oldVal} to ${newVal}`);
  // 在这里执行你需要的操作
});

onMounted(async () => {
  if(!isOnlineMode.value){
    await loadDataBase();
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