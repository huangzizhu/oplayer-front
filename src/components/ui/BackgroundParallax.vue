<template>
    <div class="background-parallax" ref="backgroundRef" :style="{
        backgroundImage: `url(${backgroundImage})`,
        transform: `translate(${offsetX}px, ${offsetY}px) scale(1.1)`
    }">
        <div class="background-overlay" :class="{ 'dimmed': dimmed }"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue';

const props = defineProps({
    backgroundImage: {
        type: String,
        required: true
    },
    intensity: {
        type: Number,
        default: 20 // 视差效果强度，值越大移动越明显
    },
    dimmed: {
        type: Boolean,
        default: false // 是否暗化背景
    }
});

const backgroundRef = ref(null);
const offsetX = ref(0);
const offsetY = ref(0);

const handleMouseMove = (e) => {
    if (!backgroundRef.value) return;

    // 获取视窗尺寸
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 计算鼠标位置相对于视窗中心的偏移，范围为-0.5到0.5
    const relativeX = (e.clientX / windowWidth - 0.5);
    const relativeY = (e.clientY / windowHeight - 0.5);

    // 根据偏移和强度计算背景位移
    offsetX.value = -relativeX * props.intensity;
    offsetY.value = -relativeY * props.intensity;
};

onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
.background-parallax {
    position: fixed;
    top: -5%;
    left: -5%;
    width: 110%;
    height: 110%;
    background-size: cover;
    background-position: center;
    transition: transform 0.2s ease-out;
    z-index: -2;
}

.background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    /* 半透明黑色遮罩 */
    z-index: -1;
    transition: background 0.3s ease;
}

.background-overlay.dimmed {
    background: rgba(0, 0, 0, 0.7);
    /* 当设置菜单打开时，背景更暗 */
}
</style>