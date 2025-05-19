import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCircleMenuStore = defineStore('circleMenu', () => {
    // 菜单状态
    const isExpanded = ref(false);
    const isTransitioning = ref(false);
    const exitDirection = ref(null); // 'left' 或 'right'，用于决定菜单退出动画方向
    const activeMenuItem = ref(null);

    // 设置菜单展开状态
    function setExpanded(value) {
        isExpanded.value = value;
    }

    // 设置过渡状态
    function setTransitioning(value) {
        isTransitioning.value = value;
    }

    // 设置退出方向
    function setExitDirection(direction) {
        exitDirection.value = direction;
    }

    // 设置当前激活的菜单项
    function setActiveMenuItem(itemId) {
        activeMenuItem.value = itemId;
    }

    // 切换菜单状态
    function toggleMenu() {
        if (!isTransitioning.value) {
            isExpanded.value = !isExpanded.value;
        }
    }

    return {
        isExpanded,
        isTransitioning,
        exitDirection,
        activeMenuItem,

        setExpanded,
        setTransitioning,
        setExitDirection,
        setActiveMenuItem,
        toggleMenu
    };
});