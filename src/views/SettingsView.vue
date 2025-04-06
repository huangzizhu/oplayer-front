<template>
    <div class="settings-view">
        <BackgroundParallax :backgroundImage="backgroundImage" :intensity="30" />
        <NavBar />
    </div>
</template>

<script setup>
import NavBar from '../components/layout/NavBar.vue';
import BackgroundParallax from '../components/ui/BackgroundParallax.vue';
import testBackground from '../assets/images/test-background.jpg';
import { ref } from 'vue';

const backgroundImage = ref(testBackground);

</script>

<style></style>