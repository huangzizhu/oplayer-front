<template>
    <div class="music-select-view">
        <MusicCover></MusicCover>
        <MusicInfo></MusicInfo>
        <FFT></FFT>

        <SearchBar></SearchBar>
        <ProgressBar></ProgressBar>

        <MusicSelector></MusicSelector>


        <FooterBar></FooterBar>
    </div>
</template>

<script setup>
import MusicCover from '@/components/music/MusicCover.vue'
import MusicInfo from '@/components/music/MusicInfo.vue'
import FFT from '@/components/music/FFT.vue'
import SearchBar from '@/components/music/SearchBar.vue'
import ProgressBar from '@/components/music/ProgressBar.vue'
import MusicSelector from '@/components/music/MusicSelector.vue'
import FooterBar from '@/components/FooterBar.vue'

</script>

<style scoped></style>