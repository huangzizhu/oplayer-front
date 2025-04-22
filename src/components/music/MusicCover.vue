<template>
  <!-- 模板部分保持不变 -->
  <div class="music-cover-container">
    <div class="cover-glow">
      <div class="cover">
        <div class="cover-img">
          <!-- 添加实际图片 -->
          <img src="../../../public/images/cover.jpg" alt="Album Cover">
        </div>
        <div class="cover-text">
          <p class="cover-song-title">{{ songTitle }}</p>
          <p class="cover-song-artist">{{ songArtist }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const songTitle = ref('Tojita Sekai')
const songArtist = ref('Camellia')
</script>

<style lang="less" scoped>
@cover-width: 720px;
@cover-height: 300px;
@cover-bg-color: rgba(35, 35, 35, 0.7);
@text-color: #fff;
@glow-color-primary: rgba(255, 255, 255, 1);
@glow-color-secondary: rgb(81, 149, 245);
@shadow-color-dark: rgba(0, 0, 0, 0);
@shadow-color-light: rgba(0, 0, 0, 0.5);

.music-cover-container {
  top: 45px;
  left: 0px;
  width: @cover-width;
  height: @cover-height;
  position: absolute;
  z-index: 20;

  .cover-glow {
    width: 100%;
    height: 100%;
    position: relative;
    filter:
      drop-shadow(1px 1px 8px @glow-color-primary) drop-shadow(0 0 20px @glow-color-secondary);

    .cover {
      width: 100%;
      height: 100%;
      display: flex;
      position: relative;
      clip-path: polygon(0px 0, 100% 0, calc(100% - 30px) 100%, 0 100%);
      background-color: @cover-bg-color;
      box-shadow:
        inset -15px 0 10px 15px @shadow-color-dark,
        inset 0 0 20px 15px @shadow-color-light;

      .cover-img {
        width: 100%;
        height: 100%;
        opacity: 0.7;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          -webkit-user-drag: none;
          user-select: none;
        }
      }

      .cover-text {
        position: absolute;
        left: 3%;
        top: 75%;
        text-align: left;
        color: @text-color;
        font-size: 24px;
        font-family: 'Comfortaa-Light', sans-serif;
        z-index: 2;
        text-shadow: 0 2px 4px @shadow-color-light;

        .cover-song-title {
          font-size: 24px;

        }

        .cover-song-artist {
          font-size: 16px;

        }
      }
    }
  }
}
</style>