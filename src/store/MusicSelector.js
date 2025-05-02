import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useBgStore } from './BG';
import { useMusicLibrary } from './MusicLibrary';
import { useSearchBar } from './SearchBar';

export const useMusicSelector = defineStore('musicSelector', () => {
  // 引入音乐库和搜索栏
  const musicLibraryStore = useMusicLibrary();
  const searchBarStore = useSearchBar();
  const bgStore = useBgStore();

  // 当前选中的曲目索引
  const selectedIndex = ref(0);

  // 滚动位置
  const scrollPosition = ref(0);

  // 计算属性：音乐库 - 考虑搜索结果
  const musicLibrary = computed(() => {
    // 如果有搜索结果且搜索激活，则显示搜索结果
    if (searchBarStore.isSearchActive && searchBarStore.searchResults.length > 0) {
      return searchBarStore.searchResults;
    }
    // 否则显示完整音乐库
    return musicLibraryStore.musicLibrary;
  });

  // 计算属性：当前选中的曲目
  const selectedMusic = computed(() => {
    if (musicLibrary.value.length > 0 && selectedIndex.value < musicLibrary.value.length) {
      return musicLibrary.value[selectedIndex.value];
    }
    // 如果没有音乐或索引超出范围，返回第一首曲目或空对象
    return musicLibrary.value[0] || {};
  });

  // 监听搜索状态变化，重置选中索引
  watch(() => searchBarStore.isSearchActive, () => {
    // selectedIndex.value = 0;
  });

  // 设置选中的曲目
  function selectMusic(index) {
    if (index >= 0 && index < musicLibrary.value.length) {
      selectedIndex.value = index;
      if (selectedMusic.value.background) {
        bgStore.changeBackground(selectedMusic.value.background);
      }
    }
  }

  // 选择下一首
  function selectNext() {
    const nextIndex = (selectedIndex.value + 1) % musicLibrary.value.length;
    selectMusic(nextIndex);
  }

  // 选择上一首
  function selectPrevious() {
    const prevIndex = (selectedIndex.value - 1 + musicLibrary.value.length) % musicLibrary.value.length;
    selectMusic(prevIndex);
  }

  // 更新滚动位置
  function updateScrollPosition(position) {
    scrollPosition.value = position;
  }

  // 获取可见项目
  const getVisibleItems = () => {
    return musicLibrary.value.slice(
      Math.max(selectedIndex.value - 2, 0),
      Math.min(selectedIndex.value + 3, musicLibrary.value.length)
    );
  };

  return {
    selectedIndex,
    scrollPosition,
    musicLibrary,
    selectedMusic,
    selectMusic,
    selectNext,
    selectPrevious,
    updateScrollPosition,
    getVisibleItems,
  };
});