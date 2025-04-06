<!-- src/views/MusicSelectView.vue -->
<template>
    <div class="music-select-view">
        <!-- 背景为当前选中曲目的封面 -->
        <div class="background-container">
            <BackgroundBlur :image="currentTrack.coverUrl" />
        </div>

        <div class="content">
            <!-- 左上方卡片 - 曲目封面及基本信息 -->
            <div class="track-cover-card">
                <TrackInfo :track="currentTrack" :simple="true" />
            </div>

            <!-- 右上方搜索导航 -->
            <div class="search-container">
                <SearchBar @search="handleSearch" />
                <FilterOptions @filterChange="handleFilterChange" />
            </div>

            <!-- 左下方卡片 - 曲目详细信息 -->
            <div class="track-details-card">
                <TrackInfo :track="currentTrack" :simple="false" />
                <FFTSpectrum v-if="isPlaying" :audioData="audioData" />
                <div class="track-tags">
                    <!-- 自定义tag显示区域 -->
                </div>
                <div class="track-edit" v-if="isEditMode">
                    <!-- 编辑曲目信息区域 -->
                </div>
            </div>

            <!-- 右侧选曲转轮 -->
            <div class="track-selection">
                <SelectWheel :tracks="filteredTracks" :currentIndex="currentTrackIndex" @select="handleTrackSelect" />
            </div>
        </div>

        <!-- 底部栏 -->
        <FooterBar :showBackButton="true" @back="goBack" @openPlaySettings="openPlaySettings"
            @toggleRandom="toggleRandom" @openOptions="openOptions" />
    </div>
</template>

<script setup lang="ts">
</script>