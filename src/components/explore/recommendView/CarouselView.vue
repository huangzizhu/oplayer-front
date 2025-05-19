<template>
  <tiny-carousel height="300px" type="card" autoplay v-if="randomSongsList" show-title arrow="hover" loop
    interval="5000">
    <tiny-carousel-item class="carousel-item" v-for="item in randomSongsList" :key="item">
      <template v-slot:default>
        <div class="img-container">
          <img class="card-img" :src="item.coverUrl" alt="">
        </div>

        <div class="item-title">
          <span>{{ `${item.name} - ${item.artist}` }}</span>
        </div>
      </template>
    </tiny-carousel-item>
  </tiny-carousel>
  <hr>
</template>

<script setup>
/* eslint-disable */
import { TinyCarousel, TinyCarouselItem } from '@opentiny/vue'
import { getRandomMusic } from "@/utils/api/MusicApi";
import { ref, onMounted } from "vue";

const randomSongsList = ref(null)

const getRandomSongs = async () => {
  const response = await getRandomMusic(6);
  if (response.code) {
    randomSongsList.value = response.data.list
  }
}

onMounted(() => {
  getRandomSongs();
})

</script>

<style scoped>
.tiny-carousel__item {
  width: 40%;
  margin-left: 5%;
  backdrop-filter: blur(6px);
  background-image: linear-gradient(45deg, rgba(66, 60, 90, 0.35), rgba(66, 60, 90, 0.35));
  border-radius: 10px;
}

.card-img {
  width: 250px;
  height: 250px;
  display: block;
  /* 确保图片是块级元素 */
  margin: auto;
  /* 水平居中 */
}

.carousel-item:nth-child(2n) {
  background-color: rgba(205, 92, 92, 0.95);
}

.carousel-item:nth-child(2n + 1) {
  background-color: rgba(173, 216, 255, 0.95);
}

.item-title span {
  color: #ffffff;
  font-size: 1em;
  width: 80%;
  font-weight: bold;
  margin: 1px auto 1px 5px;
}
</style>