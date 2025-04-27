import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useSearchBar = defineStore('searchBar', () => {
  const searchText = ref('')


  return {
    searchText,
  }
})