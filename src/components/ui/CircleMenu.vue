<template>
    <div class="menu-container" ref="menuContainer">
        <!-- 背景遮罩，展开时增加暗度 -->
        <div class="menu-overlay" :class="{ 'active': isExpanded }" @click="toggleMenu"></div>

        <!-- 菜单主按钮 -->
        <div class="menu-button" :class="{ 'expanded': isExpanded }" @click="toggleMenu">
            <!-- <div class="menu-center">
                <div class="logo">OSU!</div>
            </div> -->
            <div class="menu-button-layers">

                <img class="menu-button-layer spinning" src="../../assets/images/osu-logo-triangles.svg"
                    alt="OSU Triangles" />
                <img class="menu-button-layer" src="../../assets/images/osu-logo-white.svg" alt="OSU Logo" />
            </div>
        </div>

        <!-- 菜单项列表 - 水平展开 -->
        <div class="menu-items-container" :class="{ 'expanded': isExpanded }">
            <div v-for="(item, index) in menuItems" :key="item.id" class="menu-item"
                :class="[`menu-item-${item.id}`, { 'visible': isExpanded }]" :style="getItemStyle(index)"
                @click.stop="selectMenuItem(item)">
                <div class="menu-item-background"></div>
                <div class="menu-item-content">
                    <div class="menu-item-icon">
                        <i :class="item.icon"></i>
                    </div>
                    <div class="menu-item-text">{{ item.label }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const menuContainer = ref(null);
const isExpanded = ref(false);

// 菜单项配置
const menuItems = [
    { id: 'music', label: '音乐', icon: 'icon-music', route: '/music', color: '#ff66ab' },
    { id: 'playlists', label: '歌单', icon: 'icon-playlist', route: '/playlist/all', color: '#4CAF50' },
    { id: 'library', label: '音乐库', icon: 'icon-library', route: '/library', color: '#2196F3' },
    { id: 'visualizer', label: '可视化', icon: 'icon-visualizer', route: '/visualizer', color: '#9C27B0' },
    { id: 'settings', label: '设置', icon: 'icon-settings', route: '/settings', color: '#FF9800' }
];

// 切换菜单展开/收起状态
const toggleMenu = () => {
    isExpanded.value = !isExpanded.value;
};

// 选择菜单项
const selectMenuItem = (item) => {
    if (!isExpanded.value) return;

    // 导航到对应路由
    router.push(item.route);

    // 选择后收起菜单
    isExpanded.value = false;

    // 触发选择事件
    emit('menuSelected', item);
};

// 计算每个菜单项的位置和样式
const getItemStyle = (index) => {
    const totalItems = menuItems.length;
    const itemWidth = 150; // 菜单项宽度
    const gap = 20; // 菜单项间距

    // 计算整个菜单的总宽度
    const totalWidth = totalItems * itemWidth + (totalItems - 1) * gap;

    // 计算每个菜单项的X轴偏移量，使其水平居中排列
    const startX = -(totalWidth / 2) + (itemWidth / 2);
    const itemX = startX + (index * (itemWidth + gap));

    return {
        transform: isExpanded.value
            ? `translateX(${itemX}px)`
            : 'translateX(0) scale(0.5)',
        opacity: isExpanded.value ? 1 : 0,
        transitionDelay: isExpanded.value ? `${index * 0.05}s` : `${(totalItems - index - 1) * 0.05}s`
    };
};

const emit = defineEmits(['menuSelected']);
</script>

<style scoped>
.menu-button-layers {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 图层样式 */
.menu-button-layer {
    position: absolute;
    width: 120%;
    /* 调整大小适应按钮 */
    height: 120%;
    object-fit: contain;
}

/* 旋转动画效果 */
.menu-button-layer.spinning {
    animation: spin 20s linear infinite;
}
.menu-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    z-index: 100;
}

/* 背景遮罩 */
/* .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    transition: background 0.3s ease-out;
    pointer-events: none;
    z-index: 90;
} */

.menu-overlay.active {
    background: rgba(0, 0, 0, 0.7);
    pointer-events: auto;
}

.menu-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgb(255, 102, 171);
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 110;
    pointer-events: auto;

}

.menu-button:hover {
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.menu-button.expanded {
    transform: translate(-50%, -50%) scale(0.9);
}

.menu-center {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
}

.logo {
    font-size: 3rem;
    font-weight: bold;
    color: white;
    text-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

/* 菜单项容器 */
.menu-items-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    pointer-events: none;
}

.menu-items-container.expanded {
    pointer-events: auto;
}

/* 菜单项 */
.menu-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    height: 60px;
    transform: translateX(0) scale(0.5);
    transform-origin: center;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    pointer-events: none;
}

.menu-item.visible {
    opacity: 1;
    pointer-events: auto;
}

/* 平行四边形背景 */
.menu-item-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: skewX(-15deg);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: -1;
}

/* 菜单项内容 */
.menu-item-content {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 20px;
    z-index: 2;
}

.menu-item-icon {
    font-size: 1.5rem;
    margin-right: 12px;
    color: white;
    transition: transform 0.3s ease;
}

.menu-item-text {
    font-size: 1rem;
    font-weight: 500;
    color: white;
    transition: transform 0.3s ease;
}

/* 悬停效果 */
.menu-item:hover .menu-item-background {
    width: 110%;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

.menu-item:hover .menu-item-icon {
    transform: scale(1.2) rotate(10deg);
}

.menu-item:hover .menu-item-text {
    transform: translateX(5px);
}

/* 为每个菜单项设置自定义颜色 */
.menu-item-music .menu-item-background {
    background-color: #ff66ab;
}

.menu-item-playlists .menu-item-background {
    background-color: #4CAF50;
}

.menu-item-library .menu-item-background {
    background-color: #2196F3;
}

.menu-item-visualizer .menu-item-background {
    background-color: #9C27B0;
}

.menu-item-settings .menu-item-background {
    background-color: #FF9800;
}
</style>