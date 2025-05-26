<template>
  <div class="mini-player-container">
    <MusicPlayerControls :playerStyleConfig="configStore.playerContainerStyle"></MusicPlayerControls>
  </div>
</template>

<script setup>
import MusicPlayerControls from '@/components/music/MusicPlayerControls.vue';
import { useConfigStore } from '@/store/Config';
const configStore = useConfigStore();
</script>

<style lang="less" scoped>
.mini-player-container {
  position: relative;
  
}
</style>