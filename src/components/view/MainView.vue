<template>
    <div class="main-view">
        <CircleMenu></CircleMenu>
        <MusicVisualization :visualStyleConfig="configStore.mainVisualStyle"></MusicVisualization>
        <!-- <MusicPlayerControls :playerStyleConfig="playerContainerStyle"></MusicPlayerControls> -->
    </div>
</template>

<script setup>
import CircleMenu from '@/components/CircleMenu.vue';
import MusicVisualization from '@/components/music/MusicVisualization.vue';
import { useConfigStore } from '@/store/Config';
// import MusicPlayerControls from '@/components/music/MusicPlayerControls.vue';
const configStore = useConfigStore();

</script>

<style scoped lang="less"></style>