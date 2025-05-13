<template>
  <div class="carousel-container">
    <CarouselView></CarouselView>
  </div>
  <div>
    <SongBar     :is-in-collection="true"  :song="{
      name: 'Song Name',
      artist: 'Artist Name',
      coverUrl: 'https://huangzizhu-java-web.oss-cn-chengdu.aliyuncs.com/2025-05/a2ab49cf-cfb2-4c7b-9b72-8543ddf37bdc'
    }" ></SongBar>
  </div>
</template>

<script setup>
/* eslint-disable */
import CarouselView from "@/components/explore/recommendView/CarouselView.vue";
import SongBar from "@/components/explore/recommendView/SongBar.vue";
import {ref,onMounted} from "vue";


</script>

<style scoped>
.carousel-container {
  width: 80%;
  margin: 20px auto;
}
</style>