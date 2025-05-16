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
import MusicCover from '@/components/music/MusicCover.vue'
import MusicInfo from '@/components/music/MusicInfo.vue'
import SearchBar from '@/components/music/SearchBar.vue'
import MusicPlayerControls from '@/components/music/MusicPlayerControls.vue'
import MusicSelector from '@/components/music/MusicSelector.vue'
import MusicVisualization from '@/components/music/MusicVisualization.vue'
import { indexedDBService } from "@/utils/indexedDBService";
import { useMusicAnalysis } from '@/store/MusicAnalysis';


import { ref,onMounted } from 'vue'
const musicCover = ref(null)
const musicInfo = ref(null)
const musicAnalysisStore = useMusicAnalysis();
onMounted(async () => {
  // 初始化IndexedDB
  try {
    await indexedDBService.init();
    console.log('IndexedDB 初始化成功');

    // 从本地存储加载音乐
    await musicAnalysisStore.initFromLocalStorage();

  } catch (error) {
    console.error('IndexedDB 初始化失败:', error);
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