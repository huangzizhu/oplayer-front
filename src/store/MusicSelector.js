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

  // 当前选中的曲目索引 - 随机初始化
  const selectedIndex = ref(1);
  const selectedID = ref(null);
  const hasInitialized = ref(false);

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
    // if (selectedID.value === -1) {
    //   // if (musicLibrary.value.length > 0 && selectedIndex.value < musicLibrary.value.length) {
    //   //   return musicLibrary.value[selectedIndex.value];
    //   // }
    //   // // 如果没有音乐或索引超出范围，返回第一首曲目或空对象
    //   // return musicLibrary.value[0] || {};
    //   return musicLibrary.value[0] || {};
    // }
    // else {
    // }
    return musicLibraryStore.musicLibrary.find(music => music.id === selectedID.value) || {};
  });

  // 监听搜索状态变化，重置选中索引
  watch(() => searchBarStore.isSearchActive, () => {
    // selectedIndex.value = 0;
  });

  // 设置选中的曲目
  // function selectMusic(index) {
  //   if (index >= 0 && index < musicLibrary.value.length) {
  //     selectedIndex.value = index;
  //     selectedID.value = musicLibrary.value[index].id;
  //     if (selectedMusic.value.background) {
  //       bgStore.changeBackground(selectedMusic.value.background);
  //     }
  //   }
  // }
  function selectMusic(index) {
    if (index >= 0 && index < musicLibrary.value.length) {
      selectedIndex.value = index;
      const music = musicLibrary.value[index];
      selectedID.value = music.id;

      // 调用 bgStore 的 changeBackground
      bgStore.changeBackground({
        coverUrl: music.cover,
        backgroundUrl: music.background,
        mode: 'cover' // 默认切换到封面毛玻璃模式
      });
    } else if (musicLibrary.value.length > 0) {
      // 处理索引无效但列表不为空的情况，选中第一个
      selectedIndex.value = 0;
      const music = musicLibrary.value[0];
      selectedID.value = music.id;
      bgStore.changeBackground({
        coverUrl: music.cover,
        backgroundUrl: music.background,
        mode: 'cover'
      });
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

  function initSelectedIndex() {
    if (!hasInitialized.value) {
      hasInitialized.value = true;
      const indexToSelect = Math.floor(Math.random() * (musicLibrary.value.length || 1));
      selectMusic(indexToSelect);
    } else {
      return;
    }
  }

  // 获取可见项目
  const getVisibleItems = () => {
    return musicLibrary.value.slice(
      Math.max(selectedIndex.value - 2, 0),
      Math.min(selectedIndex.value + 3, musicLibrary.value.length)
    );
  };
  // 刷新音乐库和选中状态
  function refreshLibrary() {
    // 重新加载音乐库数据
    const currentLibrary = musicLibraryStore.musicLibrary;

    // 如果当前选中的音乐不存在，则重置选中状态
    if (selectedID.value && !currentLibrary.some(m => m.id === selectedID.value)) {
      if (currentLibrary.length > 0) {
        selectedIndex.value = 0;
        selectedID.value = currentLibrary[0].id;

        // 触发背景更新
        bgStore.changeBackground({
          coverUrl: currentLibrary[0].cover,
          backgroundUrl: currentLibrary[0].background,
          mode: 'cover'
        });
      } else {
        selectedIndex.value = 0;
        selectedID.value = null;
      }
    }

    // 重新初始化
    if (!hasInitialized.value && currentLibrary.length > 0) {
      initSelectedIndex();
    }
  }

  return {
    selectedIndex,
    scrollPosition,
    musicLibrary,
    selectedMusic,
    selectedID,
    selectMusic,
    selectNext,
    selectPrevious,
    updateScrollPosition,
    getVisibleItems,
    initSelectedIndex,
    refreshLibrary,
  };
});