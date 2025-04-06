<template>
    <div class="settings-view">
        <BackgroundParallax :backgroundImage="backgroundImage" :intensity="90" />
        <NavBar />
        <div class="settings-content">
            <h1>Settings</h1>
            <p>这是一个设置页面的示例。</p>
            <p>这里可以放置一些设置选项。</p>
        </div>
    </div>
</template>

<script setup>
import NavBar from '../components/layout/NavBar.vue';
import BackgroundParallax from '../components/ui/BackgroundParallax.vue';
import testBackground from '../assets/images/test-background.jpg';
import { ref } from 'vue';

const backgroundImage = ref(testBackground);

</script>

<style>
.settings-view {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.settings-content {
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