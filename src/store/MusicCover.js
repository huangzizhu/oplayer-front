import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useMusicSelector } from './MusicSelector';

export const useMusicCover = defineStore('musicCover', () => {
  const musicSelectorStore = useMusicSelector();

  // Use computed properties to sync with selected music
  const songTitle = computed(() => musicSelectorStore.selectedMusic.title);
  const songArtist = computed(() => musicSelectorStore.selectedMusic.artist);
  const coverImage = computed(() => musicSelectorStore.selectedMusic.cover);

  return {
    songTitle,
    songArtist,
    coverImage,
  }
});