<template>
    <div class="main-view">
        <!-- 背景视差效果 -->
        <BackgroundParallax :backgroundImage="backgroundImage" :intensity="30" :dimmed="isSettingsVisible" />


        <!-- 导航栏 -->
        <NavBar :activeItem="activeNavItem" @settingsClicked="toggleSettings" />

        <!-- 中央菜单 -->
        <CircleMenu @menuSelected="handleMenuSelect" />
        <!-- 设置菜单 -->
        <SettingsMenu :isVisible="isSettingsVisible" @close="closeSettings" />
        <!-- 主要内容区域 - 占满全屏 -->
        <div class="content-area">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>


    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '../components/layout/NavBar.vue';
import CircleMenu from '../components/ui/CircleMenu.vue';
import BackgroundParallax from '../components/ui/BackgroundParallax.vue';
import SettingsMenu from '../components/ui/SettingsMenu.vue';


const router = useRouter();

// 使用测试图片作为背景
import testBackground from '../assets/images/test-background.jpg';

const backgroundImage = ref(testBackground);
const isSettingsVisible = ref(false);
const activeNavItem = ref('');
// 处理菜单项选择
const handleMenuSelect = (item) => {
    console.log('选择了菜单项:', item.label);
    router.push(item.route);
};

const toggleSettings = () => {
    isSettingsVisible.value = !isSettingsVisible.value;
    activeNavItem.value = isSettingsVisible.value ? 'settings' : '';
};

const closeSettings = () => {
    isSettingsVisible.value = false;
    activeNavItem.value = '';
};

</script>

<style scoped>
.main-view {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.content-area {
    position: absolute;
    top: 60px;
    /* 导航栏高度 */
    left: 0;
    width: 100%;
    height: calc(100vh - 60px);
    padding: 20px;
    box-sizing: border-box;
    z-index: 5;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>