import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useMusicLibrary } from './MusicLibrary'

export const useSearchBar = defineStore('searchBar', () => {
  const searchText = ref('')
  const musicLibraryStore = useMusicLibrary()

  // 搜索结果
  const searchResults = ref([])

  // 当前使用的关键词 
  const currentKeywords = ref([])

  // 搜索是否激活
  const isSearchActive = computed(() => searchText.value.trim() !== '')

  // 监听搜索文本变化，自动执行搜索
  watch(searchText, (newValue) => {
    if (newValue.trim() === '') {
      // 搜索框为空，清空搜索结果
      searchResults.value = []
      currentKeywords.value = []
    } else {
      // 更新当前关键词
      currentKeywords.value = newValue.toLowerCase().split(/\s+/).filter(word => word.length > 0)

      // 执行搜索
      performSearch()
    }
  })

  // 执行搜索
  const performSearch = () => {
    searchResults.value = musicLibraryStore.searchMusic(searchText.value)
  }

  // 清空搜索
  const clearSearch = () => {
    searchText.value = ''
    searchResults.value = []
    currentKeywords.value = []
  }

  return {
    searchText,
    searchResults,
    currentKeywords,
    isSearchActive,
    performSearch,
    clearSearch
  }
})