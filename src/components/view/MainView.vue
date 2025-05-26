<template>
    <div class="main-view">
        <CircleMenu></CircleMenu>
        <MusicVisualization :visualStyleConfig="configStore.mainVisualStyle"></MusicVisualization>
    </div>
</template>

<script setup>
import CircleMenu from '@/components/CircleMenu.vue';
import MusicVisualization from '@/components/music/MusicVisualization.vue';
import { useConfigStore } from '@/store/Config';
const configStore = useConfigStore();

</script>

<style scoped lang="less"></style>