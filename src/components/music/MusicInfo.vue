<template>
  <div class="music-info-container">
    <!-- 顶部导航栏 -->
    <div class="music-info-navbar">
      <div v-for="tab in tabs" :key="tab.id" class="tab-item" :class="{ 'active': activeTab === tab.id }"
        @click="setActiveTab(tab.id)">
        {{ tab.name }}
      </div>
      <div class="tab-indicator" :style="indicatorStyle"></div>
    </div>
    <hr class="divider" />
    <br>
    <!-- 详情内容面板 -->
    <div class="music-info-panel">
      <!-- 详情页 -->
      <div v-if="activeTab === 'details'" class="tab-content details-content">
        <div class="section-title">曲目信息</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="label">艺术家</div>
            <div class="value" @click="handleInfoClick(`artist`, musicSelector.selectedMusic.artist)">{{
              musicSelector.selectedMusic.artist }}</div>
          </div>
          <div class="info-item">
            <div class="label">BPM</div>
            <div class="value" @click="handleInfoClick(`bpm`, musicSelector.selectedMusic.bpm)">{{
              musicSelector.selectedMusic.bpm
            }}</div>
          </div>
          <div class="info-item">
            <div class="label">来源</div>
            <div class="value" @click="handleInfoClick(`origin`, musicSelector.selectedMusic.origin)">{{
              musicSelector.selectedMusic.origin }}</div>
          </div>
          <div class="info-item">
            <div class="label">音频格式</div>
            <div class="value" @click="handleInfoClick(`format`, musicSelector.selectedMusic.format)">{{
              musicSelector.selectedMusic.format }}</div>
          </div>
        </div>

        <div class="section-title">标签</div>
        <div class="tags-container">
          <span v-for="(tag, index) in musicSelector.selectedMusic.tags" :key="index" class="tag-item"
            @click="handleTagClick(tag)">{{ tag }}</span>
        </div>

        <div class="section-title">描述</div>
        <div class="description">
          {{ musicSelector.selectedMusic.description || 'No Description' }}
        </div>
      </div>

      <!-- 谱面页 -->
      <div v-else-if="activeTab === 'beatmaps'" class="tab-content beatmaps-content">
        <div class="beatmap-list">
          <div class="beatmap-item">
            <div class="difficulty-badge insane">9.2★</div>
            <div class="beatmap-info">
              <div class="beatmap-name">Extreme</div>
              <div class="mapper">mapped by peppy</div>
              <div class="stats">
                <span>AR9</span>
                <span>CS4.2</span>
                <span>HP6</span>
                <span>OD8.5</span>
              </div>
            </div>
          </div>

          <div class="beatmap-item">
            <div class="difficulty-badge hard">7.5★</div>
            <div class="beatmap-info">
              <div class="beatmap-name">Insane</div>
              <div class="mapper">mapped by RLC</div>
              <div class="stats">
                <span>AR8.5</span>
                <span>CS4</span>
                <span>HP5</span>
                <span>OD8</span>
              </div>
            </div>
          </div>

          <div class="beatmap-item">
            <div class="difficulty-badge normal">4.8★</div>
            <div class="beatmap-info">
              <div class="beatmap-name">Normal</div>
              <div class="mapper">mapped by Sotarks</div>
              <div class="stats">
                <span>AR7</span>
                <span>CS3.5</span>
                <span>HP4</span>
                <span>OD7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 排行榜页 -->
      <div v-else-if="activeTab === 'leaderboard'" class="tab-content leaderboard-content">
        <div class="score-list">
          <div class="score-item">
            <div class="rank">1</div>
            <div class="player">WhiteCat</div>
            <div class="score">9,999,999</div>
            <div class="accuracy">99.87%</div>
          </div>
          <div class="score-item">
            <div class="rank">2</div>
            <div class="player">Vaxei</div>
            <div class="score">9,986,753</div>
            <div class="accuracy">99.42%</div>
          </div>
          <div class="score-item">
            <div class="rank">3</div>
            <div class="player">Mrekk</div>
            <div class="score">9,954,321</div>
            <div class="accuracy">99.21%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMusicSelector } from '@/store/MusicSelector.js';
import { useSearchBar } from '@/store/SearchBar';

const musicSelector = useMusicSelector();
const SearchBar = useSearchBar();

// 定义标签页
const tabs = [
  { id: 'details', name: 'Details' },
  { id: 'beatmaps', name: 'Beatmaps' },
  { id: 'leaderboard', name: 'Leaderboard' }
];

// 当前激活的标签页
const activeTab = ref('details');

// 设置激活的标签页
const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

// 计算指示器样式
const indicatorStyle = computed(() => {
  const index = tabs.findIndex(tab => tab.id === activeTab.value);
  const width = 100 / tabs.length;

  return {
    width: `${width}%`,
    transform: `translateX(${index * 100}%)`
  };
});

const handleTagClick = (tag) => {
  // 处理标签点击事件
  console.log(`Clicked on tag: ${tag}`);
  SearchBar.searchText = tag
};
const handleInfoClick = (Infotype, info) => {
  // 处理信息点击事件
  console.log(`Clicked on info: ${info}`);
  SearchBar.searchText = `${Infotype}=${info}`
};
</script>

<style lang="less" scoped>
// 颜色变量
@bg-color: rgba(0, 0, 0, 0.75);
@highlight-color: rgb(255, 255, 255);
@text-color: rgba(255, 255, 255, 0.9);
@text-dim: #ffcc22;
@text-link: #44AADD;
@panel-bg: rgba(20, 20, 20, 0.8);
@border-radius: 10px;

// 难度颜色
@color-normal: rgb(88, 215, 100);
@color-hard: rgb(255, 200, 0);
@color-insane: rgb(255, 102, 102);

// 主容器
.music-info-container {
  top: 400px;
  left: 5px;
  width: 33%;
  height: 59%;
  position: absolute;
  // background-color: @bg-color;
  font-family: 'Comfortaa-Light', sans-serif;
  border-radius: @border-radius;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  // 导航栏
  .music-info-navbar {
    height: 50px;
    width: 50%;
    display: flex;
    position: relative;
    // background-color: rgba(0, 0, 0, 0.3);

    .tab-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @text-dim;
      font-size: 12px;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: #ffffff;
      }

      &.active {
        color: #ffffff;
        font-weight: bold;
      }
    }

    // 底部指示器
    .tab-indicator {
      position: absolute;
      bottom: 0;
      height: 3px;
      background-color: @highlight-color;
      transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      box-shadow: 0 0 10px @highlight-color;
    }
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.3);
    margin: 0;
    border: none;
  }

  // 详情面板
  .music-info-panel {
    background-color: rgba(0, 0, 0, 0.4);
    flex: 1;
    overflow-y: auto;
    padding: 20px;

    // 标签内容通用样式
    .tab-content {
      height: 100%;
      animation: fadeIn 0.3s ease-out;
    }

    // 详情页样式
    .details-content {
      .section-title {
        color: @highlight-color;
        font-size: 18px;
        margin-bottom: 10px;
        font-weight: bold;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
        margin-bottom: 20px;

        .info-item {
          .label {
            color: @text-color;
            font-size: 14px;
            margin-bottom: 4px;
            font-weight: bold;
          }

          .value {
            color: @text-link;
            font-size: 16px;
            cursor: pointer;

            &:hover {
              color: rgba(68, 170, 250, 0.7);
              transition: color 0.2s ease;
            }
          }

        }
      }

      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
        font-size: 14px;

        .tag-item {
          color: @text-link;
          padding: 5px 10px;
          border-radius: 15px;
          cursor: pointer;
          // transition: all 0.3s ease;

          &:hover {
            color: rgba(68, 170, 250, 0.7);
            transition: color 0.2s ease;
          }
        }
      }

      .description {
        color: @text-color;
        line-height: 1.6;
        font-size: 15px;
      }
    }

    // 谱面页样式
    .beatmaps-content {
      .beatmap-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .beatmap-item {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 12px;
        transition: transform 0.2s;

        &:hover {
          transform: translateX(5px);
          background-color: rgba(0, 0, 0, 0.4);
        }

        .difficulty-badge {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 15px;

          &.normal {
            background-color: @color-normal;
          }

          &.hard {
            background-color: @color-hard;
          }

          &.insane {
            background-color: @color-insane;
          }
        }

        .beatmap-info {
          flex: 1;

          .beatmap-name {
            font-size: 18px;
            color: white;
          }

          .mapper {
            font-size: 14px;
            color: @text-dim;
            margin-bottom: 5px;
          }

          .stats {
            display: flex;
            gap: 15px;

            span {
              font-size: 13px;
              background-color: rgba(255, 255, 255, 0.1);
              padding: 3px 8px;
              border-radius: 4px;
            }
          }
        }
      }
    }

    // 排行榜页样式
    .leaderboard-content {
      .score-list {
        display: flex;
        flex-direction: column;
      }

      .score-item {
        display: flex;
        align-items: center;
        padding: 15px 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        &:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .rank {
          width: 40px;
          font-weight: bold;
          font-size: 18px;
          color: @highlight-color;
        }

        .player {
          flex: 1;
          font-size: 16px;
          color: white;
        }

        .score {
          width: 120px;
          text-align: right;
          font-weight: bold;
          color: white;
        }

        .accuracy {
          width: 80px;
          text-align: right;
          color: @color-normal;
        }
      }
    }
  }
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 滚动条样式
.music-info-panel::-webkit-scrollbar {
  width: 5px;
}

.music-info-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.music-info-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.music-info-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>