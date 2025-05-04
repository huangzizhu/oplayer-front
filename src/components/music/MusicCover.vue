<template>
  <!-- 模板部分保持不变 -->
  <div class="music-cover-container">
    <div class="cover-glow">
      <div class="cover">
        <div class="cover-img" :style="coverStyle">
          <!-- 添加实际图片 -->
          <!-- <img src="../../../public/images/cover.jpg" alt="Album Cover"> -->
        </div>
        <div class="cover-text-title">
          <p class="cover-song-title" :style="titleStyle">{{ musicCoverStore.songTitle }}</p>
        </div>
        <div class="cover-text-artist">
          <p class="cover-song-artist">{{ musicCoverStore.songArtist }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMusicCover } from '@/store/MusicCover';
const musicCoverStore = useMusicCover()

const coverStyle = computed(() => ({
  backgroundImage: `url(${musicCoverStore.coverImage})`,
  'object-fit': 'cover',
  '-webkit-user-drag': 'none',
  'background-position': 'center',
  'background-repeat': 'no-repeat',
  'background-size': 'cover',
}));

// 根据标题长度自适应字体大小
const titleStyle = computed(() => {
  const title = musicCoverStore.songTitle || '';
  // 默认字体大小
  let fontSize = '22px';

  // 只有当标题超过一定长度时才缩小字体
  if (title.length > 25) {
    fontSize = '18px';
  }
  if (title.length > 35) {
    fontSize = '16px';
  }
  if (title.length > 45) {
    fontSize = '14px';
  }

  return {
    fontSize
  };
});
</script>

<style lang="less" scoped>
@cover-width: 35%;
@cover-height: 350px;
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

      // 修改为分开的标题和艺术家样式
      .cover-text-title {
        position: absolute;
        left: 3%;
        top: 75%;
        width: 94%; // 限制最大宽度
        text-align: left;
        color: @text-color;
        z-index: 2;
        text-shadow: 0 2px 4px @shadow-color-light;

        .cover-song-title {
          margin: 0;
          font-size: 22px; // 默认大小，会被计算属性覆盖
          font-family: 'Comfortaa-Light', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .cover-text-artist {
        position: absolute;
        left: 3%;
        top: 85%;
        width: 94%; // 限制最大宽度
        text-align: left;
        color: @text-color;
        z-index: 2;
        text-shadow: 0 2px 4px @shadow-color-light;

        .cover-song-artist {
          margin: 0;
          font-size: 16px;
          font-family: 'Comfortaa-Light', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>