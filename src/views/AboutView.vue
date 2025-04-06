<template>
    <div class="about-view">
        <BackgroundParallax :backgroundImage="backgroundImage" :intensity="30" />
        <NavBar :activeItem="activeNavItem" @settingsClicked="toggleSettings" />
        <div class="about-content">
            <h1>About Oplayer</h1>
            <p>这是一个关于我们页面的示例。</p>
            <p>这里可以放置一些关于应用程序的信息。</p>
        </div>

        <!-- 设置菜单 -->
        <SettingsMenu :isVisible="isSettingsVisible" @close="closeSettings" />
    </div>
</template>

<script setup>
import NavBar from '../components/layout/NavBar.vue';
import BackgroundParallax from '../components/ui/BackgroundParallax.vue';
import testBackground from '../assets/images/test-background.jpg';
import SettingsMenu from '../components/ui/SettingsMenu.vue';
import { ref, defineProps } from 'vue';


defineProps({
    isVisible: {
        type: Boolean,
        default: false
    }
});

const backgroundImage = ref(testBackground);
const isSettingsVisible = ref(false);
const activeNavItem = ref('');

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
.about-view {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.about-content {
    position: absolute;
    top: 60px;
    /* 导航栏高度 */
    left: 0;
    width: 100%;
    height: calc(100vh - 60px);
    padding: 20px;
    box-sizing: border-box;
    color: #fff;
    text-align: center;
}
</style>