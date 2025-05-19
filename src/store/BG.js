import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import testBackground from '@/assets/images/test-background.jpg'

export const useBgStore = defineStore('bg', () => {

	// 状态
	const bgImages = ref([
		testBackground,
	]);

	const currentBgImage = ref(bgImages.value[0]);
	const mouseX = ref(0);
	const mouseY = ref(0);
	const windowWidth = ref(window.innerWidth);
	const windowHeight = ref(window.innerHeight);
	const opacity = ref(0.8);

	const currentBackgroundImage = ref(''); // 当前音乐背景 URL 或默认背景
	const currentCoverImage = ref('');
	const backgroundMode = ref('cover'); // 'cover' 或 'background'

	// 计算属性 - 根据鼠标位置计算视差偏移量
	const offsetX = computed(() => {
		// 增加最大偏移量，使视差效果更明显
		const maxOffset = Math.min(windowWidth.value, windowHeight.value) * 0.04; // 相对于屏幕尺寸的4%
		const centerX = windowWidth.value / 2;
		const mousePercentX = (mouseX.value - centerX) / centerX; // -1 到 1
		return -maxOffset * mousePercentX;
	});

	const offsetY = computed(() => {
		// 增加最大偏移量，使视差效果更明显
		const maxOffset = Math.min(windowWidth.value, windowHeight.value) * 0.04; // 相对于屏幕尺寸的4%
		const centerY = windowHeight.value / 2;
		const mousePercentY = (mouseY.value - centerY) / centerY; // -1 到 1
		return -maxOffset * mousePercentY;
	});

	// 方法
	function initBackground() {
		// 随机选择一张背景图
		// currentBgImage.value = bgImages.value[Math.floor(Math.random() * bgImages.value.length)];
		// 随机选择一张默认背景图
		const initialImage = bgImages.value[Math.floor(Math.random() * bgImages.value.length)];
		currentCoverImage.value = initialImage; // 初始封面和背景可以相同
		currentBackgroundImage.value = initialImage;
		backgroundMode.value = 'background'; // 初始设为背景模式
		opacity.value = 1; // 确保初始可见
	}

	function updateMousePosition(x, y) {
		mouseX.value = x;
		mouseY.value = y;
	}

	function handleResize() {
		windowWidth.value = window.innerWidth;
		windowHeight.value = window.innerHeight;
	}

	// function changeBackground(imagePath) {
	// 	// 如果传入的是URL字符串，直接使用
	// 	if (typeof imagePath === 'string') {
	// 		opacity.value = 0;

	// 		setTimeout(() => {
	// 			currentBgImage.value = imagePath;
	// 			opacity.value = 1;
	// 		}, 300);
	// 		return;
	// 	}
	// 	// 原有逻辑 - 随机选择
	// 	opacity.value = 0;
	// 	setTimeout(() => {
	// 		currentBgImage.value = bgImages.value[Math.floor(Math.random() * bgImages.value.length)];
	// 		opacity.value = 1;
	// 	}, 300);
	// }
	// 修改 changeBackground 以接收封面、背景和模式
	function changeBackground({ coverUrl, backgroundUrl, mode }) {
		opacity.value = 0; // 开始淡出

		setTimeout(() => {
			currentCoverImage.value = coverUrl || ''; // 更新封面图 URL
			// 如果没有提供背景图，可以默认使用封面图或保持之前的背景图
			currentBackgroundImage.value = backgroundUrl || coverUrl || currentBackgroundImage.value;
			if (mode) {
				backgroundMode.value = mode; // 更新模式
			}
			// 确保至少有一个有效图像URL
			if (!currentCoverImage.value && !currentBackgroundImage.value) {
				initBackground(); // 如果都没有，则重新初始化
			}

			// 延迟一点再开始淡入，给图片加载留点时间（可选）
			setTimeout(() => {
				opacity.value = 1; // 开始淡入
			}, 50);

		}, 300); // 淡出动画时长
	}

	// 新增：切换背景模式的方法
	function setBackgroundMode(mode) {
		if (mode === 'cover' || mode === 'background') {
			backgroundMode.value = mode;
		}
	}

	return {
		currentBgImage,
		mouseX,
		mouseY,
		opacity,
		offsetX,
		offsetY,
		backgroundMode,
		currentBackgroundImage,
		currentCoverImage,
		initBackground,
		updateMousePosition,
		handleResize,
		changeBackground,
		setBackgroundMode,
	};
});