<template>
    <div class="music-cover-container">
        <div class="cover">
            <div class="cover-img">

            </div>
            <div class="cover-text">
                <p>Tojita Sekai</p>
            </div>
        </div>
    </div>

</template>

<script setup>

</script>

<style scoped>
.music-cover-container {
    top: 45px;
    width: 700px;
    height: 450px;
    /* display: flex; */
    /* background-color: rgba(0, 0, 0, 0.4); */
    /* overflow: hidden; */
    position: absolute;
    clip-path: polygon(0px 0, 100% 0, calc(100% - 20px) 100%, 0 100%);
}

.cover {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    box-shadow: 0px 0px 15px 15px rgba(255, 255, 255, 1);
}

.cover-img {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    
    position: absolute;
    top: 0;
    left: 0;
}

.cover-text {
    position: absolute;
    left: 4%;
    top: 85%;
    text-align: left;
    color: #fff;
    font-size: 24px;
    font-family: 'Comfortaa-Light';
}
</style>