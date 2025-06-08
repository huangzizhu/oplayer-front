<template>
  <div class="search-bar-container">
    <div class="select-button">
      <SelectButton></SelectButton>
    </div>
    <div class="music-analyer-button" v-if="!onlineMusicStore.isOnlineMode">
      <MusicAnalyzer></MusicAnalyzer>
    </div>
    <div class="input-box">
      <input type="text" placeholder="输入以搜索" class="search-input" ref="searchInput" v-model="searchBarStore.searchText"
        @blur="handleBlur" />
      <div class="icon-container" @click="clearSearch" v-if="searchBarStore.isSearchActive">
        <img src="@/assets/images/exit.svg" alt="清除" class="search-icon" />
      </div>
      <div class="icon-container" v-else>
        <img src="@/assets/images/search.svg" alt="搜索" class="search-icon" />
      </div>
    </div>

    <!-- 搜索结果统计 -->
    <div class="search-results-info" v-if="true">
      <div class="result-count" v-if="!searchBarStore.isSearchActive">
        {{ musicLibraryStore.musicLibrary.length + " " }} matches
      </div>

      <div class="result-count" v-else-if="searchBarStore.searchResults.length > 0">
        {{ searchBarStore.searchResults.length + " " }} matches
      </div>

      <div class="no-results" v-else>
        Not found
      </div>
    </div>
    <hr class="divider" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
// import gsap from 'gsap';
import { useSearchBar } from '@/store/SearchBar';
import {useOnlineMusicStore} from '@/store/OnlineMusicStore'
import MusicAnalyzer from '@/components/music/MusicAnalyzer.vue'
import SelectButton from "@/components/music/onlineMusic/SelectButton.vue";
import { useMusicLibrary } from '@/store/MusicLibrary';
const searchBarStore = useSearchBar();
const onlineMusicStore = useOnlineMusicStore();
const musicLibraryStore = useMusicLibrary();
const searchInput = ref(null);

// 清除搜索
const clearSearch = () => {
  searchBarStore.clearSearch();
  setTimeout(() => {
    searchInput.value?.focus();
  }, 10);
};

// 聚焦方法
const focusInput = () => {
  setTimeout(() => {
    searchInput.value?.focus();
  }, 100);
};

// 失焦时处理
const handleBlur = () => {
  // 可以选择是否保持焦点
  // setTimeout(() => {
  //   searchInput.value?.focus();
  // }, 10);
};

// 组件挂载时添加键盘快捷键
onMounted(() => {
  // 添加键盘快捷键
  window.addEventListener('keydown', handleKeyDown);
});
// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// 处理键盘快捷键
const handleKeyDown = (e) => {
  // Ctrl+F 或 / 触发搜索
  if ((e.ctrlKey && e.key === 'f') || (!e.target.matches('input, textarea') && e.key === '/')) {
    e.preventDefault();
    focusInput();
  }

  // Esc 清除搜索
  if (e.key === 'Escape' && searchBarStore.isSearchActive) {
    e.preventDefault();
    clearSearch();
  }

  // Alt+L 定位到当前选中项
  if (e.altKey && e.key === 'l') {
    e.preventDefault();
    scrollToSelected();
  }
};

const scrollToSelected = () => {
  nextTick(() => {
    searchBarStore.scrollToSelected();
  });
};

</script>

<style lang="less" scoped>
.search-bar-container {
  top: 45px;
  left: 30%;
  width: 100%;
  height: 150px;
  position: absolute;
  z-index: 10;
  background-color: rgba(10, 10, 10, 0.80);
  font-family: "Comfortaa-Light", sans-serif;

  .select-button {
    position: absolute;
    top: 20px;
    right: calc(31% + 8%);
    width: 5%;
    height: 45px;
  }
  .music-analyer-button {
    position: absolute;
    top: 20px;
    right: 31%;
    z-index: 11;
  }

  .input-box {
    width: 55%;
    height: 80px;
    display: flex;
    padding-left: 200px;
    padding-top: 15px;
    position: relative;

    .search-input {
      width: 100%;
      height: 48px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      padding-left: 20px;
      padding-right: 40px;
      font-size: 18px;
      border: none;
      outline: none;
      box-shadow: inset -15px 0 10px 15px rgba(0, 0, 0, 0.5),
        inset 0 0 20px 15px rgba(0, 0, 0, 0.5);
      font-family: "Comfortaa-Light", sans-serif;
    }

    .icon-container {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      height: 30px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .search-icon {
        width: 25px;
        height: 25px;
      }

      &:hover .search-icon {
        transform: scale(1.1);
      }
    }
  }

  .search-results-info {
    position: absolute;
    top: 70px;
    left: 210px;
    font-size: 14px;

    .result-count {
      // color: #44AADD;
      color: rgb(255, 200, 0);
    }

    .no-results {
      color: #ff6666;
    }
  }

  .divider {
    position: absolute;
    top: 100px;
    left: 200px;
    width: 75%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 0;
    padding: 0;
    border: none;
  }
}
</style>