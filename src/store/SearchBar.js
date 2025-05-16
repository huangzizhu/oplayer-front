import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useMusicLibrary } from './MusicLibrary';
import { gsap } from 'gsap';
import { nextTick } from 'vue';

export const useSearchBar = defineStore('searchBar', () => {
  const searchText = ref('');
  const musicLibraryStore = useMusicLibrary();

  // 搜索结果
  const searchResults = ref([]);

  // 当前使用的关键词
  const currentKeywords = ref([]);

  // 当前字段查询
  const currentFieldQueries = ref([]);

  // 搜索是否激活
  const isSearchActive = computed(() => searchText.value.trim() !== '');

  // 监听搜索文本变化，自动执行搜索
  watch(searchText, (newValue) => {
    if (newValue.trim() === '') {
      // 搜索框为空，清空搜索结果
      searchResults.value = [];
      currentKeywords.value = [];
      currentFieldQueries.value = [];
    } else {
      // 执行搜索
      performSearch();
    }
  });

  // 执行搜索
  const performSearch = () => {
    // 使用增强版的搜索函数
    searchResults.value = musicLibraryStore.searchMusic(searchText.value);

    // 提取查询信息（用于显示和记录）
    parseSearchTerms();
  };

  // 解析搜索词，分离关键字和字段查询
  const parseSearchTerms = () => {
    const query = searchText.value.trim();
    if (!query) return;

    const parts = [];
    let currentPart = '';
    let inQuotes = false;

    // 简单的分词
    for (let i = 0; i < query.length; i++) {
      const char = query[i];

      if (char === '"') {
        inQuotes = !inQuotes;
        currentPart += char;
      } else if (char === ' ' && !inQuotes) {
        if (currentPart) {
          parts.push(currentPart);
          currentPart = '';
        }
      } else {
        currentPart += char;
      }
    }

    if (currentPart) {
      parts.push(currentPart);
    }

    // 分离字段查询和一般关键字
    const fieldQueries = [];
    const keywords = [];

    parts.forEach(part => {
      const fieldMatch = part.match(/^([a-zA-Z]+)=(?:"([^"]+)"|([^"]\S*))$/);

      if (fieldMatch) {
        fieldQueries.push({
          field: fieldMatch[1],
          value: fieldMatch[2] || fieldMatch[3]
        });
      } else {
        // 处理引号内的短语
        const phraseMatch = part.match(/^"([^"]+)"$/);
        if (phraseMatch) {
          keywords.push(phraseMatch[1]);
        } else {
          keywords.push(part);
        }
      }
    });

    currentKeywords.value = keywords;
    currentFieldQueries.value = fieldQueries;
  };

  // 清空搜索
  const clearSearch = () => {
    searchText.value = '';
    searchResults.value = [];
    currentKeywords.value = [];
    currentFieldQueries.value = [];
  };

  const scrollToSelected = () => {
    nextTick(() => {
      // 找到音乐列表容器
      const musicList = document.querySelector('.music-list');
      if (!musicList) return;

      // 找到激活的音乐项
      const activeItem = musicList.querySelector('.music-item-container.active');
      if (!activeItem) return;

      // 计算滚动位置，使选中项居中显示
      const listRect = musicList.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      // 计算相对滚动位置
      const targetScroll = musicList.scrollTop + (itemRect.top - listRect.top) - (listRect.height / 2) + (itemRect.height / 2);

      // 使用GSAP平滑滚动
      gsap.to(musicList, {
        scrollTop: targetScroll,
        duration: 0.4,
        ease: "power2.out"
      });
    });
  };

  return {
    searchText,
    searchResults,
    currentKeywords,
    currentFieldQueries,
    isSearchActive,
    performSearch,
    clearSearch,
    parseSearchTerms,
    scrollToSelected,
  };
});