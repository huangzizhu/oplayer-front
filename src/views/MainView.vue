<!-- src/views/MainView.vue -->
<template>
    <div class="main-view">
        <div class="background-container">
            <BackgroundBlur />
        </div>
        <div class="content">
            <CircleMenu @menuSelected="handleMenuSelect" />
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss"></style>