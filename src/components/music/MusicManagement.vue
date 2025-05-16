<template>
  <div class="music-management-container">
    <div class="input-area">
      <button class="test-btn" @click="clickTestBtn()"> Test-GetMusic</button>
      <input type="text" name="" id="">
    </div>

    <hr class="divider" />
    <div class="music-form">
      <h2 class="section-h2">

      </h2>
      <div class="response-group">
        <label for="title">音乐名称: {{ musicForm.title }}</label>
        <label for="artist">作曲家: {{ musicForm.artist }}</label>
        <label for="album">专辑: {{ musicForm.album }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMusicById } from '@/utils/api/MusicApi.js';
import { ref } from 'vue';
const musicForm = ref({
  title: '',
  artist: '',
  album: '',
  genre: '',
  releaseDate: '',
  duration: '',
  filePath: ''
});
const clickTestBtn = () => {
  console.log('Test button clicked');
  getMusicById(58)
    .then((response) => {
      console.log('Music data:', response.data);
      musicForm.value.title = response.data.title;
      musicForm.value.artist = response.data.artist;
      musicForm.value.album = response.data.albumName;
      musicForm.value.genre = response.data.genre;
      musicForm.value.releaseDate = response.data.releaseDate;
      musicForm.value.duration = response.data.duration;
      musicForm.value.filePath = response.data.filePath;
    })
    .catch((error) => {
      console.error('Error fetching music data:', error);
    });
};

</script>

<style lang="less">
.music-management-container {

  font-family: 'Comfortaa-Light', sans-serif;

  .test-btn {
    background-color: #00000000;
    border: none;
    color: white;
    border: 2px solid white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 10px;
    transition-duration: 0.4s;

    &:hover {
      background-color: #0000009e;
      /* Darker green */
      color: white;

    }
  }

  .response-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;

    .label {
      margin: 0 10px;
      font-size: 16px;
      color: #333;
    }
  }

  .divider {
    border: 0;
    height: 1px;
    background-color: #cccccc4f;
    margin: 20px 0;
  }
}
</style>