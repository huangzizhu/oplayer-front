import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMusicSelector = defineStore('musicSelector', () => {
  // 当前选中的曲目索引
  const selectedIndex = ref(0);

  // 滚动位置
  const scrollPosition = ref(0);

  // 曲目库
  const musicLibrary = ref([
    {
      id: 1,
      title: "Tojita Sekai",
      artist: "Camellia",
      bpm: 175,
      cover: "/images/cover.jpg",
      difficulty: 9.2,
      length: "3:42",
      background: "/images/bg-tojita.jpg"
    },
    {
      id: 2,
      title: "Ghost",
      artist: "Camellia",
      bpm: 220,
      cover: "/images/CyphisoniaEP.jpg",
      difficulty: 8.5,
      length: "4:10",
      background: "/images/bg-ghost.jpg"
    },
    {
      id: 3,
      title: "PLANET//SHAPER",
      artist: "Camellia",
      bpm: 160,
      cover: "/images/PLANETSHAPER.jpg",
      difficulty: 7.8,
      length: "5:05",
      background: "/images/bg-planet.jpg"
    },
    {
      id: 4,
      title: "Exit This Earth's Atomosphere",
      artist: "Camellia",
      bpm: 170,
      cover: "/images/PLANETSHAPER.jpg",
      difficulty: 9.7,
      length: "6:08",
      background: "/images/bg-exit.jpg"
    },
    {
      id: 5,
      title: "Crystallized",
      artist: "Camellia",
      bpm: 174,
      cover: "/images/crystallized.jpg",
      difficulty: 8.9,
      length: "4:55",
      background: "/images/bg-crystallized.jpg"
    },
    {
      id: 6,
      title: "S.A.T.E.L.L.I.T.E.",
      artist: "Camellia",
      bpm: 150,
      cover: "/images/cover.jpg",
    },
    {
      id: 7,
      title: "+ERABY+E CONNEC+10N",
      artist: "Camellia",
      bpm: 120,
      cover: "/images/TEAOIO.jpg",
      difficulty: 7.5,
      length: "3:20",
      background: "/images/bg-lost-woods.jpg"
    },
    {
      id: 8,
      title: "The King of Lions",
      artist: "Camellia",
      bpm: 190,
      cover: "/images/king.jpg",
      difficulty: 9.1,
      length: "3:32",
      background: "/images/bg-king.jpg"
    },
    {
      id: 9,
      title: "Bassdrop Freaks",
      artist: "Camellia",
      bpm: 175,
      cover: "/images/bassdrop.jpg",
      difficulty: 8.2,
      length: "4:44",
      background: "/images/bg-bassdrop.jpg"
    },
    {
      id: 10,
      title: "Crystallized",
      artist: "Camellia",
      bpm: 174,
      cover: "/images/crystallized.jpg",
      difficulty: 8.9,
      length: "4:55",
      background: "/images/bg-crystallized.jpg"
    },
    {
      id: 11,
      title: "Crystallized",
      artist: "Camellia",
      bpm: 174,
      cover: "/images/crystallized.jpg",
      difficulty: 8.9,
      length: "4:55",
      background: "/images/bg-crystallized.jpg"
    },
    {
      id: 12,
      title: "Crystallized",
      artist: "Camellia",
      bpm: 174,
      cover: "/images/crystallized.jpg",
      difficulty: 8.9,
      length: "4:55",
      background: "/images/bg-crystallized.jpg"
    },
    {
      id: 13,
      title: "Crystallized111",
      artist: "Camellia",
      bpm: 174,
      cover: "/images/crystallized.jpg",
      difficulty: 8.9,
      length: "4:55",
      background: "/images/bg-crystallized.jpg"
    },
    {
      id: 14,
      title: "Ghost",
      artist: "Camellia",
      bpm: 220,
      cover: "/images/CyphisoniaEP.jpg",
      difficulty: 8.5,
      length: "4:10",
      background: "/images/bg-ghost.jpg"
    },
    {
      id: 15,
      title: "Ghost",
      artist: "Camellia",
      bpm: 220,
      cover: "/images/CyphisoniaEP.jpg",
      difficulty: 8.5,
      length: "4:10",
      background: "/images/bg-ghost.jpg"
    },
    


  ]);

  // 计算属性：当前选中的曲目
  const selectedMusic = computed(() => {
    return musicLibrary.value[selectedIndex.value];
  });

  // 设置选中的曲目
  function selectMusic(index) {
    // 确保索引在范围内
    if (index >= 0 && index < musicLibrary.value.length) {
      selectedIndex.value = index;

      // 更新背景和封面组件可以在这里触发
      // 如果有其他store，例如背景store，可以在这里调用它的方法
      // bgStore.changeBackground(selectedMusic.value.background);
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

  const getVisibleItems = () => {
    return musicLibrary.value.slice(Math.max(selectedIndex.value - 2, 0), Math.min(selectedIndex.value + 3, musicLibrary.value.length));
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