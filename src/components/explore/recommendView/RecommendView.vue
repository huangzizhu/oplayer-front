<template>
  <div class="recommend-container">
    <div class="carousel-container">
      <CarouselView></CarouselView>
    </div>
    <div class="random-recommend-container">
     <RandomMusicColumns></RandomMusicColumns>
    </div>
    <div class="daily-music-container">
      <DailyMusicView></DailyMusicView>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import CarouselView from "@/components/explore/recommendView/CarouselView.vue";
import RandomMusicColumns from "@/components/explore/recommendView/RandomMusicColumns.vue";
import DailyMusicView from "@/components/explore/recommendView/DailyMusicView.vue";
import {ref,onMounted} from "vue";

</script>

<style scoped>
.recommend-container {
  height: 74vh;
  overflow-y: auto;
}
.carousel-container {
  width: 80%;
  margin: 20px auto;
}
.random-recommend-container {
  width: 100%;
}

</style>