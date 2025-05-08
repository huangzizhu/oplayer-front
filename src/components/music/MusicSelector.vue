<template>
  <div class="music-selector-container" ref="selectorContainerRef">
    <div class="music-list" ref="musicListRef" @wheel="handleWheel">
      <MusicItem v-for="(music, index) in displayedMusicList" :key="music.id" :music="music" :index="index"
        :isActive="music.id === musicSelectorStore.selectedID" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';
import { useMusicSelector } from '@/store/MusicSelector';
import MusicItem from '@/components/music/MusicItem.vue';
import { useSearchBar } from '@/store/SearchBar';
import gsap from 'gsap';
import { throttle } from 'lodash';

const musicSelectorStore = useMusicSelector();
const musicListRef = ref(null);
const selectorContainerRef = ref(null);
const searchBarStore = useSearchBar();
const scrollTarget = ref(0);
const isScrolling = ref(false);

// 虚拟列表优化 - 只显示可见项和部分缓冲区项
const displayedMusicList = computed(() => {
  const fullList = musicSelectorStore.musicLibrary;
  // 返回完整列表，但在大列表时可以优化为虚拟列表
  return fullList;
});

// 节流后的视差更新函数，减少计算频率
const updateParallaxThrottled = throttle(() => {
  if (!selectorContainerRef.value || !musicListRef.value) return;

  const containerRect = selectorContainerRef.value.getBoundingClientRect();
  const centerY = containerRect.top + containerRect.height * 0.58; // 中心点位置
  const viewportHeight = window.innerHeight;
  const containerMidX = containerRect.left + containerRect.width / 2; // 水平中心
  const items = musicListRef.value.querySelectorAll('.music-item-container');

  // 定义视差的最大偏移量和范围
  const maxParallax = 100; // 最大视差效果（像素）
  const effectRange = viewportHeight * 0.6; // 视差效果作用范围

  // 优化：只更新可视区域及周边的元素
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemRect = item.getBoundingClientRect();

    // 更精准的可视区域检测：视口上下各扩展一屏
    if (itemRect.bottom < -viewportHeight ||
      itemRect.top > viewportHeight * 2) {
      // 重置非可见元素的视差，避免滚动回来时的跳跃
      item.style.setProperty('--parallax-offset', '0px');
      continue; // 跳过不在扩展可视区域的元素
    }

    // 计算从中心点的距离
    const distanceFromCenter = Math.abs((itemRect.top + itemRect.height / 2) - centerY);

    // 计算该项目是在中心的左边还是右边（用于决定视差方向）
    const isLeftOfCenter = (itemRect.left + itemRect.width / 2) < containerMidX;

    // 计算基于距离的视差系数 - 中心最大(1.0)，远离中心线性减少到0
    const parallaxFactor = Math.min(1, distanceFromCenter / effectRange);

    // 计算视差值 - 方向取决于元素位置，中心最大，两边线性减小
    const parallaxValue = isLeftOfCenter
      ? -maxParallax * parallaxFactor  // 左侧向左偏移（负值）
      : maxParallax * parallaxFactor;  // 右侧向右偏移（正值）

    // 应用视差效果
    item.style.setProperty('--parallax-offset', `${parallaxValue}px`);
  }
}, 32); // 约 60fps


// 改进的滚轮处理函数
const handleWheel = (e) => {
  e.preventDefault();

  // 增加滚动速度：放大滚动倍数
  const scrollMultiplier = 15; // 滚动速度倍数
  const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * scrollMultiplier, 300);
  const currentScroll = musicListRef.value.scrollTop;

  // 更新滚动目标
  scrollTarget.value = Math.max(
    0,
    Math.min(
      currentScroll + delta,
      musicListRef.value.scrollHeight - musicListRef.value.clientHeight
    )
  );

  // 优化：滚动中不重复创建动画
  if (isScrolling.value) {
    gsap.killTweensOf(musicListRef.value, "scrollTop");
  }

  isScrolling.value = true;

  // 使用更高效的动画设置：减少动画持续时间
  gsap.to(musicListRef.value, {
    scrollTop: scrollTarget.value,
    duration: 0.3, 
    ease: "power2.out", 
    onUpdate: updateParallaxThrottled,
    onComplete: () => {
      isScrolling.value = false;
      // 移除滚动选中功能
      // updateActiveItem();
    }
  });
};

// 监听搜索结果变化
watch(() => searchBarStore.searchResults, () => {
  nextTick(() => {
    if (musicListRef.value) {
      musicListRef.value.scrollTop = 0;
      scrollTarget.value = 0;

      // 延迟调用更新视差，确保列表已渲染
      setTimeout(updateParallaxThrottled, 100);
    }
  });
}, { deep: true });

// 生命周期钩子
onMounted(() => {
  nextTick(() => {
    if (musicListRef.value) {
      // 使用 passive: true 提高滚动性能
      musicListRef.value.addEventListener('scroll', updateParallaxThrottled, { passive: true });
      window.addEventListener('resize', updateParallaxThrottled);

      // 立即初始化视差效果，而不是等待滚动
      setTimeout(() => {
        updateParallaxThrottled();
      }, 100);
    }
    musicSelectorStore.initSelectedIndex();
  });
});

onUnmounted(() => {
  if (musicListRef.value) {
    musicListRef.value.removeEventListener('scroll', updateParallaxThrottled);
  }
  window.removeEventListener('resize', updateParallaxThrottled);
  updateParallaxThrottled.cancel(); // 取消未执行的节流函数
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
    will-change: transform;
    
    &::-webkit-scrollbar {
      width: 6px;
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.4);
      border-radius: 4px;
      border: 2px solid transparent;
    }
    
    &::-webkit-scrollbar-button {
      display: none;
    }
  }
}
</style>