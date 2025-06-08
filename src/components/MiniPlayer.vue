<template>
  <div class="mini-player-container">
    <div class="song-info">
      <div class="text-artist-title" :style="{ marginRight: '15px' }">
        <p class="song-artist-title">{{ musicCoverStore.songArtist + '   -   ' + musicCoverStore.songTitle }}</p>
      </div>
      <!-- <div class="divider"> -</div>
      <div class="text-title" :style="{ marginLeft: '15px' }">
        <p class="song-title" :style="titleStyle">{{ musicCoverStore.songTitle }}</p>
      </div> -->
    </div>
    <div class="music-player-controls" :style="{ paddingTop: '32px' }">
      <MusicPlayerControls :playerStyleConfig="configStore.playerContainerStyle"></MusicPlayerControls>
    </div>
  </div>
</template>

<script setup>
import MusicPlayerControls from '@/components/music/MusicPlayerControls.vue';
import { useConfigStore } from '@/store/Config';
import { useMusicCover } from '@/store/MusicCover';
const musicCoverStore = useMusicCover()
const configStore = useConfigStore();
</script>

<style lang="less" scoped>
.mini-player-container {
  position: relative;
  font-family: comfortaa, sans-serif;

  .song-info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;

    // font-size: 16px;
    .text-artist-title {
      max-height: 30px;
      overflow-x: auto;
      overflow-y: hidden;
      text-overflow: clip;
      white-space: nowrap;

      &::-webkit-scrollbar {
        height: 5px;
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        border: 0px solid transparent;
      }

      &::-webkit-scrollbar-button {
        display: none;
      }

      .song-artist-title {
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        margin: 0;
        white-space: pre;
      }
    }

    // .text-title {
    //   max-height: 30px;
    //   overflow-x: auto;
    //   overflow-y: hidden;
    //   text-overflow: clip;
    //   white-space: nowrap;

    //   &::-webkit-scrollbar {
    //     height: 5px;
    //     background: transparent;
    //   }

    //   &::-webkit-scrollbar-thumb {
    //     background: rgba(255, 255, 255, 0.1);
    //     border-radius: 4px;
    //     border: 2px solid transparent;
    //   }

    //   &::-webkit-scrollbar-button {
    //     display: none;
    //   }
    // }


  }
}
</style>