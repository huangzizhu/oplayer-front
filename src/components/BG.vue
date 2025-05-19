<template>
	<div class="bg-container" ref="bgContainer">
		<!-- 层 1: 模糊背景 或 标准背景 -->
		<div class="bg-image-layer bg-blur-layer" ref="bgBlurLayer" :style="blurLayerStyle" :class="bgModeClass"></div>
		<!-- 层 2: 清晰前景 (仅在 cover 模式下可见) -->
		<div class="bg-image-layer bg-clear-layer" ref="bgClearLayer" :style="clearLayerStyle" :class="bgModeClass"></div>
		<!-- 遮罩层 -->
		<div class="bg-overlay"></div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useBgStore } from '@/store/BG';
import gsap from 'gsap';
import { getUserInfo } from "@/utils/UserUtils";

const bgStore = useBgStore();
const bgContainer = ref(null);
const bgBlurLayer = ref(null); // Ref for blur layer
const bgClearLayer = ref(null); // Ref for clear layer

// 计算背景模式类 (可用于容器或层)
const bgModeClass = computed(() => `mode-${bgStore.backgroundMode}`);

// 计算模糊层的样式
const blurLayerStyle = computed(() => {
	const style = {
		opacity: bgStore.opacity, // 应用透明度
		'--bg-image-url-cover': `url(${bgStore.currentCoverImage || ''})`,
		'--bg-image-url-background': `url(${bgStore.currentBackgroundImage || bgStore.currentCoverImage || ''})`,
	};
	// 在 background 模式下，模糊层显示背景图且不模糊
	// 在 cover 模式下，模糊层显示封面图且模糊 (通过 CSS 控制)
	return style;
});

// 计算清晰层的样式
const clearLayerStyle = computed(() => {
	const style = {
		// 清晰层只在 cover 模式下完全可见，且使用封面图
		opacity: bgStore.backgroundMode === 'cover' ? bgStore.opacity : 0,
		'--bg-image-url-cover': `url(${bgStore.currentCoverImage || ''})`,
	};
	return style;
});


// 处理鼠标移动事件，动画作用于容器
const handleMouseMove = (e) => {
	// 确保容器存在再执行动画
	if (!bgContainer.value) return;
	bgStore.updateMousePosition(e.clientX, e.clientY);

	const maxOffset = Math.min(window.innerWidth, window.innerHeight) * 0.04;
	const centerX = window.innerWidth / 2;
	const centerY = window.innerHeight / 2;
	// 避免除以零
	if (centerX === 0 || centerY === 0) return;

	const mousePercentX = (e.clientX - centerX) / centerX;
	const mousePercentY = (e.clientY - centerY) / centerY;

	const targetX = -maxOffset * mousePercentX;
	const targetY = -maxOffset * mousePercentY;

	// 将 GSAP 动画应用到容器上
	gsap.to(bgContainer.value, {
		x: targetX,
		y: targetY,
		duration: 1,
		ease: "power2.out",
		overwrite: "auto",
	});
};

onMounted(() => {
	bgStore.initBackground();
	getUserInfo();
	document.addEventListener('mousemove', handleMouseMove);
	window.addEventListener('resize', bgStore.handleResize);
	bgStore.handleResize();
});

onBeforeUnmount(() => {
	document.removeEventListener('mousemove', handleMouseMove);
	window.removeEventListener('resize', bgStore.handleResize);
	// 清除容器上的动画
	if (bgContainer.value) {
		gsap.killTweensOf(bgContainer.value);
	}
});
</script>

<style lang="less" scoped>
.bg-container {
	position: fixed;
	// 将位移相关的样式移到这里，因为 GSAP target 是它
	top: -10%;
	left: -10%;
	width: 120%;
	height: 120%;
	overflow: hidden; // 隐藏容器外的内容
	z-index: -1;
	user-select: none;
	background-color: #000; // 背景色防止闪烁
	will-change: transform; // 优化 GSAP 动画性能
	transform-origin: center center; // 确保变换中心正确

	.bg-image-layer {
		position: absolute;
		// 层相对于容器定位，覆盖整个容器
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-position: center center;
		background-repeat: no-repeat;
		will-change: opacity; // 优化透明度过渡
		transition: opacity 0.3s ease-in-out;
		transform-origin: center center; // 确保内部变换（如果需要）中心正确
	}

	// 模糊层 / 背景层
	.bg-blur-layer {
		// 默认显示背景图，不模糊
		background-image: var(--bg-image-url-background);
		background-size: cover;
		filter: none;
		transition: opacity 0.3s ease-in-out, filter 0.3s ease-in-out; // 添加 filter 过渡

		// Cover 模式下: 显示封面图并模糊
		&.mode-cover {
			background-image: var(--bg-image-url-cover);
			background-size: cover; // 模糊层总是 cover
			filter: blur(60px) brightness(0.7);
		}

		// Background 模式下: 确保不模糊 (虽然是默认值，但明确写出)
		&.mode-background {
			background-image: var(--bg-image-url-background);
			filter: none;
		}
	}

	// 清晰层
	.bg-clear-layer {
		width: 900px; // 设置固定宽度
		height: 900px; // 设置固定高度
		// 定位到容器中心
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-image: var(--bg-image-url-cover);
		background-size: contain; // 清晰层总是 contain
		filter: none; // 确保清晰层不模糊
		// 透明度由 style 控制，这里无需额外设置 opacity: 0;
		pointer-events: none; // 确保不阻挡下方元素的鼠标事件（如果需要）
	}

	.bg-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.35);
		user-select: none;
		z-index: 1; // 确保覆盖在两个图像层之上
	}
}
</style>