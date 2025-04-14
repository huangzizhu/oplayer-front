<template>
    <div class="bg-container" ref="bgContainer">
        <div class="bg-image" ref="bgImage" :style="bgStyle"></div>
        <div class="bg-overlay"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount,} from 'vue';
import { useBgStore } from '@/store/BG';
import animations from '@/utils/animations';
import gsap from 'gsap';

const bgStore = useBgStore();
const bgContainer = ref(null);
const bgImage = ref(null);

const bgStyle = computed(() => ({
    backgroundImage: `url(${bgStore.currentBgImage})`,
}));

// 处理鼠标移动事件，但使用GSAP来动画位移
const handleMouseMove = (e) => {
    if (!bgImage.value) return;
    bgStore.updateMousePosition(e.clientX, e.clientY);

    // 根据鼠标位置计算目标位移
    const maxOffset = Math.min(window.innerWidth, window.innerHeight) * 0.04;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const mousePercentX = (e.clientX - centerX) / centerX;
    const mousePercentY = (e.clientY - centerY) / centerY;

    const targetX = -maxOffset * mousePercentX;
    const targetY = -maxOffset * mousePercentY;

    // 使用GSAP动画位移到目标位置，直接对DOM元素进行动画
    gsap.to(bgImage.value, {
        x: targetX,
        y: targetY,
        duration: 1,
        ease: "power2.out",
        overwrite: "auto", // 只覆盖相同属性的动画
    });
};

onMounted(() => {
    bgStore.initBackground();

    // 应用背景淡入动画
    if (bgImage.value) {
        animations.fadeInBackground(bgImage.value);
        animations.pulseBackground(bgImage.value);
    }

    // 将鼠标事件监听添加到document上，确保在任何位置都能捕获
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', bgStore.handleResize);

    // 初始调用一次handleResize以获取正确的窗口尺寸
    bgStore.handleResize();
});

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', bgStore.handleResize);

    // 清除可能正在运行的GSAP动画
    // gsap.killTweensOf(bgImage.value);
});
</script>

<style scoped>
.bg-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;
    user-select: none;
}

.bg-image {
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background-size: cover;
    background-position: center;
    will-change: transform;
    user-select: none;
}

.bg-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(0px);
    user-select: none;
}
</style>