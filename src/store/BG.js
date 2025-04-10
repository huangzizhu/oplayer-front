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
        currentBgImage.value = bgImages.value[Math.floor(Math.random() * bgImages.value.length)];
    }

    function updateMousePosition(x, y) {
        mouseX.value = x;
        mouseY.value = y;
    }

    function handleResize() {
        windowWidth.value = window.innerWidth;
        windowHeight.value = window.innerHeight;
    }

    function changeBackground(newImage) {
        opacity.value = 0;
        setTimeout(() => {
            currentBgImage.value = newImage || bgImages.value[Math.floor(Math.random() * bgImages.value.length)];
            opacity.value = 1;
        }, 300);
    }

    return {
        currentBgImage,
        mouseX,
        mouseY,
        opacity,
        offsetX,
        offsetY,
        initBackground,
        updateMousePosition,
        handleResize,
        changeBackground
    };
});