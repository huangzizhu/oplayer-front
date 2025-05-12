<template>
  <tiny-carousel
      height="300px"
      type="card"
      autoplay
      v-if="randomSongsList"
      show-title
      arrow="hover"
      loop
  >
    <tiny-carousel-item class="carousel-item" v-for="item in randomSongsList" :key="item" :title="item.name+' - '+item.artist">
      <img class="card-img" :src="item.coverUrl" alt="">
    </tiny-carousel-item>
  </tiny-carousel>
</template>

<script setup>
/* eslint-disable */
import { TinyCarousel, TinyCarouselItem } from '@opentiny/vue'
import {getRandomMusic} from "@/utils/api/MusicApi";
import {ref,onMounted} from "vue";

const randomSongsList = ref(null)

const getRandomSongs = async () => {
  const response = await getRandomMusic(5);
  if(response.code){
    randomSongsList.value = response.data.list
  }
}

onMounted(() => {
  getRandomSongs();
})

</script>

<style scoped>
.tiny-carousel__item {
  backdrop-filter: blur(6px);
  background-image: linear-gradient(45deg, rgba(66,60,90,0.35), rgba(66,60,90,0.35));
  border-radius: 10px;
}

.tiny-carousel__item img {
  width: 250px;
  height: 250px;
  display: block; /* 确保图片是块级元素 */
  margin: auto; /* 水平居中 */
}

.carousel-item:nth-child(2n) {
  background-color: rgba(221, 221, 221, 0.2);
}

.carousel-item:nth-child(2n + 1) {
  background-color: rgba(221, 221, 221, 0.1);
}
</style>