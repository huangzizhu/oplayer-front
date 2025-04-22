<template>
  <div class="music-item-container" ref="musicItemRef" :style="backgroundStyle">
    <div class="music-item-info">
      <div class="music-item-title">{{ music.title }}</div>
      <div class="music-item-artist">{{ music.artist }}</div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
// import { useMusicSelector } from '@/store/MusicSelector';

const props = defineProps({
  music: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
});
// const musicSelectorStore = useMusicSelector();
const musicItemRef = ref(null);
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(${props.music.cover})`,
    'object-fit': 'cover',
    '-webkit-user-drag': 'none',
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'opacity': 1,
    'background-image': `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${props.music.cover})`,
  };
});
</script>
<style lang="less" scoped>
.music-item-container {
  background-color: rgba(0, 0, 0, 0.5);
  top: 25%;
  height: 110px !important;
  min-height: 110px;
  max-height: 110px;
  margin: -1px 0;
  width: 105%;
  border-radius: 10px;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
  transform: translateX(calc(var(--parallax-offset, 0) * 1));

  .music-item-info {
    position: absolute;
    color: #fff;
    text-align: left;

    .music-item-title {
      margin-left: 20px;
      margin-top: 10px;
      font-size: 20px;
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      font-family: 'Comfortaa-Light', sans-serif;
    }

    .music-item-artist {
      margin-left: 20px;
      margin-top: 10px;
      font-size: 14px;
      font-weight: normal;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      font-family: 'Comfortaa-Light', sans-serif;
    }
  }
}
</style>