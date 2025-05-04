<template>
  <div class="music-item-container" ref="musicItemRef" :style="backgroundStyle"
    :class="{ 'active': isActive, 'hover': isHover }" @mouseenter="isHover = true" @mouseleave="isHover = false"
    @click="handleClick">
    <div class="music-item-info">
      <div class="music-item-title">{{ music.name }}</div>
      <div class="music-item-artist">{{ music.artist }}</div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import { useMusicSelector } from '@/store/MusicSelector';
const musicSelectorStore = useMusicSelector();
const isHover = ref(false);

const handleClick = () => {
  musicSelectorStore.selectMusic(props.index);
};
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
@glow-color-primary: rgba(255, 255, 255, 1);
@glow-color-secondary: rgb(81, 149, 245);

.music-item-container {
  background-color: rgba(0, 0, 0, 0.5);
  top: 25%;
  height: 105px !important;
  min-height: 105px;
  max-height: 105px;
  margin: 0px 0;
  width: 115%;
  border-radius: 10px;
  position: relative;
  transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 0.3s ease,
    margin 0.5s ease;
  ;
  // transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  // border: 2px solid transparent;
  transform: translateX(calc(var(--parallax-offset, 0) * 1));
  cursor: pointer;

  &.active {
    padding-left: 0px;
    margin: 15px;
    transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1),
      box-shadow 0.4s ease,
      margin 0.5s ease;
    filter:
      drop-shadow(-2px 0px 10px @glow-color-primary) drop-shadow(0 0 20px @glow-color-secondary);
    transform: translateX(calc(var(--parallax-offset, 0) * 1 - 100px));
  }

  &.hover:not(.active) {
    filter: brightness(1.2);
    box-shadow: 0 0 0px rgba(255, 255, 255, 0.5);
    position: relative;
    z-index: 10;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
      border-radius: 10px;
      pointer-events: none;
      animation: highlight 0.3s ease-in-out;
      // transition: opacity 0.3s ease-in-out;
    }
  }

  @keyframes highlight {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

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