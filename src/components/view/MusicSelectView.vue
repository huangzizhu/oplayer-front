<template>
  <div class="music-select-view">
    <MusicCover ref="musicCover"></MusicCover>
    <MusicInfo ref="musicInfo"></MusicInfo>
    <FFT></FFT>

    <SearchBar></SearchBar>
    <ProgressBar></ProgressBar>

    <MusicSelector></MusicSelector>


    <!-- <FooterBar></FooterBar> -->
  </div>
</template>

<script setup>
import MusicCover from '@/components/music/MusicCover.vue'
import MusicInfo from '@/components/music/MusicInfo.vue'
import FFT from '@/components/music/FFT.vue'
import SearchBar from '@/components/music/SearchBar.vue'
import ProgressBar from '@/components/music/MusicPlayerControls.vue'
import MusicSelector from '@/components/music/MusicSelector.vue'
// import FooterBar from '@/components/FooterBar.vue'

import { ref } from 'vue'
const musicCover = ref(null)
const musicInfo = ref(null)

</script>

<style scoped>
.music-select-view {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>