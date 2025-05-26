<template>
  <div class="mini-player-container">
    <div class="song-info">
      <div class="text-artist" :style="{ paddingRight: '15px' }">
        <p class="song-artist">{{ musicCoverStore.songArtist }}</p>
      </div>
      <div class="divider"> -</div>
      <div class="text-title" :style="{ paddingLeft: '15px' }">
        <p class="song-title" :style="titleStyle">{{ musicCoverStore.songTitle }}</p>
      </div>
    </div>
    <div class="music-player-controls" :style="{ paddingTop: '30px' }">
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
    .text-artist{
      max-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .text-title {
      max-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>