<template>

  <div class="music-selector-container" ref="selectorContainerRef">
    <div class="music-list" ref="musicListRef" @wheel="handleWheel">
      <MusicItem v-for="(music, index) in musicSelectorStore.musicLibrary" :key="music.id" :music="music" :index="index"
        :isActive="index === musicSelectorStore.selectedIndex"
         />
    </div>
  </div>

</template>
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useMusicSelector } from '@/store/MusicSelector';
import MusicItem from '@/components/music/MusicItem.vue';
import gsap from 'gsap';

const musicSelectorStore = useMusicSelector();

const musicListRef = ref(null);
const selectorContainerRef = ref(null);


// 添加滚动控制逻辑
const scrollTarget = ref(0);

const handleWheel = (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 1 : -1;
  scrollTarget.value = Math.max(0, Math.min(scrollTarget.value + delta * 100, musicListRef.value.scrollHeight - musicListRef.value.clientHeight));

  // 立即停止当前动画以实现连续滚动
  if (gsap.isTweening(musicListRef.value)) {
    gsap.killTweensOf(musicListRef.value);
  }

  // 使用更流畅的动画曲线
  gsap.to(musicListRef.value, {
    scrollTop: scrollTarget.value,
    duration: 0.6,
    ease: "expo.out",
    onUpdate: updateParallax, // 在滚动过程中持续更新视差
    onComplete: updateActiveItem
  });
};

// 添加视差效果计算
const updateParallax = () => {
  if (!selectorContainerRef.value || !musicListRef.value) return;

  const containerRect = selectorContainerRef.value.getBoundingClientRect();

  const centerY = containerRect.top + containerRect.height * 0.58;

  musicListRef.value.querySelectorAll('.music-item-container').forEach(item => {
    const itemRect = item.getBoundingClientRect();
    const distanceFromCenter = Math.abs((itemRect.top + itemRect.height / 2) - centerY);
    item?.style?.setProperty('--parallax-offset', `${distanceFromCenter * 0.2}px`);
  });
};

// 更新选中项逻辑
const updateActiveItem = () => {
  const visibleItems = Array.from(musicListRef.value.querySelectorAll('.music-item-container'));
  const containerCenter = selectorContainerRef.value.getBoundingClientRect().top + selectorContainerRef.value.clientHeight / 2;

  visibleItems.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const distance = Math.abs((itemRect.top + itemRect.height / 2) - containerCenter);
    if (distance < 50) { // 阈值范围
      
    }
  });
};

// 添加滚动监听
onMounted(() => {
  nextTick(() => {
    if (musicListRef.value) {
      updateParallax(); // 立即初始化视差
      musicListRef.value.addEventListener('scroll', updateParallax);
      window.addEventListener('resize', updateParallax);
    }
  });
});

onUnmounted(() => {
  if (musicListRef.value) {
    musicListRef.value.removeEventListener('scroll', updateParallax);
  }
  window.removeEventListener('resize', updateParallax);
});
</script>

<style lang="less" scoped>
.music-selector-container {
  position: absolute;
  top: 0%;
  left: 35%;
  right: 0px;
  height: 100%;
  bottom: -15px;
  background-color: rgba(10, 10, 10, 0);
  z-index: 5;
  // overflow-y: overlay;

  .music-list {
    position: absolute;
    padding-left: 38%;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    scroll-behavior: smooth;
    overflow-y: overlay;
    width: calc(100%);
    // z-index: 2;

    &::-webkit-scrollbar {
      width: 6px;
      background: transparent;
      // z-index: 1; 
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.4);
      border-radius: 4px;
      border: 2px solid transparent;
      // background-clip: content-box;
    }

    // 隐藏上下箭头
    &::-webkit-scrollbar-button {
      display: none;
    }
  }
}
</style>