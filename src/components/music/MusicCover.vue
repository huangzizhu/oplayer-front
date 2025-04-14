<template>
    <div class="music-cover-container">
        <div class="cover">
            <div class="cover-img">

            </div>
            <span class="cover-text">
                Tojita Sekai
            </span>
        </div>
    </div>

</template>

<script setup>

</script>

<style scoped>
.music-cover-container {
    width: 700px;
    height: 500px;
    display: flex;
    background-color: #0000002e;
    overflow: hidden;
    position: relative;
    clip-path: polygon(0px 0, 100% 0, calc(100% - 20px) 100%, 0 100%);
}

.cover {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.cover-img {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0px 0px 4px 50px rgba(255, 255, 255, 1);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

.cover-text {
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    z-index: 2;
    font-family: 'Comfortaa-Light';
}
</style>