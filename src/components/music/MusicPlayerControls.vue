<template>
  <div class="music-player-controls-container">
    <!-- 播放器进度条 -->
    <MusicProgressBar />

    <!-- 播放控制区域 -->
    <div class="controls-area">
      <!-- 播放模式切换 -->
      <div class="control-button mode-button" @click="cyclePlayMode">
        <div class="icon" :class="playModeIconClass"></div>
        <div class="tooltip">{{ playModeTooltip }}</div>
      </div>

      <!-- 上一首 -->
      <div class="control-button prev-button" @click="playPrevious">
        <div class="icon icon-prev"></div>
      </div>

      <!-- 播放/暂停 -->
      <div class="control-button play-button" @click="togglePlay">
        <div class="icon" :class="isPlaying ? 'icon-pause' : 'icon-play'"></div>
      </div>

      <!-- 下一首 -->
      <div class="control-button next-button" @click="playNext">
        <div class="icon icon-next"></div>
      </div>

      <!-- 音量控制 -->
      <div class="volume-control">
        <div class="control-button volume-button" @click="toggleMute">
          <div class="icon" :class="volumeIconClass"></div>
        </div>

        <div class="volume-slider-container">
          <input type="range" class="volume-slider" min="0" max="100" step="1" :value="volume * 100"
            @input="updateVolume" />
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-indicator" v-if="isLoading">
      <div class="spinner"></div>
    </div>

    <!-- 错误提示 -->
    <div class="error-message" v-if="hasError">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMusicPlayer } from '@/store/MusicPlayer';
import MusicProgressBar from './MusicProgressBar.vue';

const musicPlayerStore = useMusicPlayer();

// 从store中获取状态
const isPlaying = computed(() => musicPlayerStore.isPlaying);
const isLoading = computed(() => musicPlayerStore.isLoading);
const hasError = computed(() => musicPlayerStore.hasError);
const errorMessage = computed(() => musicPlayerStore.errorMessage);
const volume = computed(() => musicPlayerStore.volume);
const isMuted = computed(() => musicPlayerStore.isMuted);
const playMode = computed(() => musicPlayerStore.playMode);

// 播放控制方法
const togglePlay = () => {
  musicPlayerStore.togglePlay();
};

const playNext = () => {
  musicPlayerStore.playNext();
};

const playPrevious = () => {
  musicPlayerStore.playPrevious();
};

// 音量控制
const updateVolume = (e) => {
  const value = parseInt(e.target.value);
  musicPlayerStore.setVolume(value / 100);
};

const toggleMute = () => {
  musicPlayerStore.toggleMute();
};

// 播放模式控制
const cyclePlayMode = () => {
  const modes = ['repeat', 'repeat-one', 'shuffle'];
  const currentIndex = modes.indexOf(playMode.value);
  const nextIndex = (currentIndex + 1) % modes.length;
  musicPlayerStore.setPlayMode(modes[nextIndex]);
};

// 计算音量图标样式
const volumeIconClass = computed(() => {
  if (isMuted.value) return 'icon-volume-mute';
  if (volume.value > 0.5) return 'icon-volume-high';
  if (volume.value > 0) return 'icon-volume-low';
  return 'icon-volume-mute';
});

// 计算播放模式图标样式
const playModeIconClass = computed(() => {
  switch (playMode.value) {
    case 'repeat': return 'icon-repeat';
    case 'repeat-one': return 'icon-repeat-one';
    case 'shuffle': return 'icon-shuffle';
    default: return 'icon-repeat';
  }
});

// 计算播放模式提示文本
const playModeTooltip = computed(() => {
  switch (playMode.value) {
    case 'repeat': return '循环播放';
    case 'repeat-one': return '单曲循环';
    case 'shuffle': return '随机播放';
    default: return '循环播放';
  }
});
</script>

<style lang="less" scoped>
.music-player-controls-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.85);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0px 0;
  z-index: 100;

  // 控制区域样式
  .controls-area {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px 0;
    position: relative;
  }

  // 按钮通用样式
  .control-button {
    width: 40px;
    height: 40px;
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);

      .tooltip {
        opacity: 1;
        transform: translateY(0px);
      }
    }

    // 播放按钮特殊样式
    &.play-button {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #44AADD 0%, #ff66ab 100%);
      box-shadow: 0 0 15px rgba(255, 102, 171, 0.7);

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(255, 102, 171, 0.9);
      }

      &:active {
        transform: scale(0.95);
      }

      .icon {
        font-size: 24px;
      }
    }

    // 工具提示
    .tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: all 0.2s ease;
    }

    // 图标样式
    .icon {
      color: #ffffff;
      font-size: 24px;

      // 各种图标的具体样式（可以使用字体图标或SVG）
      &.icon-play:before {
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('@/assets/images/play.svg');
        background-size: contain;
        background-position: center;
      }

      &.icon-pause:before {
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('@/assets/images/pause.svg');
        background-size: contain;
        background-position: center;
      }

      &.icon-prev:before {
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('@/assets/images/arrowPrevious.svg');
        background-size: contain;
        background-position: center;
      }

      &.icon-next:before {
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('@/assets/images/arrowNext.svg');
        background-size: contain;
        background-position: center;
      }

      &.icon-repeat:before {
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('@/assets/images/arrowRepeat.svg');
        background-size: contain;
        background-position: center;
      }

      &.icon-repeat-one:before {
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('@/assets/images/arrowLoop.svg');
        background-size: contain;
        background-position: center;
      }

      &.icon-shuffle:before {
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('@/assets/images/shuffle.svg');
        background-size: contain;
        background-position: center;
      }

      &.icon-volume-high:before {
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('@/assets/images/volumeMedium.svg');
        background-size: contain;
        background-position: center;
      }

      &.icon-volume-low:before {
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('@/assets/images/volumeLow.svg');
        background-size: contain;
        background-position: center;
      }

      &.icon-volume-mute:before {
        content: "";
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('@/assets/images/volumeMute.svg');
        background-size: contain;
        background-position: center;
      }
    }
  }

  // 音量控制
  .volume-control {
    display: flex;
    align-items: center;
    margin-left: 15px;

    .volume-slider-container {
      width: 80px;
      margin-left: 10px;
      opacity: 0.7;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 1;
      }

      .volume-slider {
        width: 100%;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        outline: none;

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ff66ab;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            transform: scale(1.2);
          }
        }

        &::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ff66ab;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;

          &:hover {
            transform: scale(1.2);
          }
        }
      }
    }
  }

  // 加载指示器
  .loading-indicator {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ff66ab;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  // 错误消息
  .error-message {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    color: #ff4444;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 4px 10px;
    border-radius: 4px;
  }

  // 旋转动画
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>