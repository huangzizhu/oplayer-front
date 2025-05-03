import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useMusicLibrary = defineStore("musicLibrary", () => {
  const processAudioPath = (path) => {
    // 确保路径有扩展名
    if (!path.match(/\.(mp3|flac|wav|ogg)$/i)) {
      path += '.mp3'; // 默认添加mp3扩展名
    }
    // 编码URL
    return encodeURI(path);
  };
  // 曲目库数据
  const musicLibrary = ref([
    {
      id: 1,
      title: "Tojita Sekai",
      artist: "Camellia",
      bpm: 175,
      cover: "/images/cover.jpg",
      difficulty: 9.2,
      length: "3:42",
      background: "/images/cover.jpg",
      tags: ["Drumstep", "Qualia", "Melodic", "Dubstep"],
      mapper: "Sotarks",
      origin: "Original",
      format: "FLAC",
      description: "One of the Best of Camellia",
      audioPath: "/audio/かめりあ - Tojita Sekai.mp3",
    },
    {
      id: 2,
      title: "Ghost",
      artist: "Camellia",
      bpm: 220,
      cover: "/images/CyphisoniaEP.jpg",
      difficulty: 8.5,
      length: "4:10",
      background: "/images/CyphisoniaEP.jpg",
      tags: ["Breakcore", "Hardcore", "Electronic"],
      format: "MP3",
      audioPath: "/audio/かめりあ - GHOST.mp3"
    },
    {
      id: 3,
      title: "PLANET//SHAPER",
      artist: "Camellia",
      bpm: 160,
      cover: "/images/PLANETSHAPER.jpg",
      difficulty: 7.8,
      length: "5:05",
      background: "/images/PLANETSHAPER.jpg",
      tags: ["Electronica", "DnB", "Melodic"],
      format: "FLAC",
      audioPath: "/audio/かめりあ - Exit This Earth's Atomosphere.mp3"
    },
    {
      id: 4,
      title: "Exit This Earth's Atomosphere",
      artist: "Camellia",
      bpm: 170,
      cover: "/images/PLANETSHAPER.jpg",
      difficulty: 9.7,
      length: "6:08",
      background: "/images/PLANETSHAPER.jpg",
      format: "MP3",
      audioPath: "/audio/かめりあ - Exit This Earth's Atomosphere.mp3"
    },
    {
      id: 5,
      title: "Crystallized",
      artist: "Camellia",
      bpm: 174,
      cover: "/images/crystallized.jpg",
      difficulty: 8.9,
      length: "4:55",
      background: "/images/crystallized.jpg",
      format: "WAV",
      audioPath: "/audio/かめりあ - crystallized.mp3"
    },
    {
      id: 6,
      title: "S.A.T.E.L.L.I.T.E.",
      artist: "Camellia",
      bpm: 150,
      cover: "/images/cover.jpg",
      length: "4:30",
      format: "MP3",
      audioPath: "/audio/かめりあ - S.A.T.E.L.L.I.T.E.mp3"
    },
    {
      id: 7,
      title: "+ERABY+E CONNEC+10N",
      artist: "Camellia",
      bpm: 120,
      cover: "/images/TEAOIO.jpg",
      difficulty: 7.5,
      length: "3:20",
      background: "/images/TEAOIO.jpg",
      format: "FLAC",
      audioPath: "/audio/かめりあ - +ERABY+E CONNEC+10N.mp3"
    },
    {
      id: 8,
      title: "The King of Lions",
      artist: "Camellia",
      bpm: 190,
      cover: "/images/king.jpg",
      difficulty: 9.1,
      length: "3:32",
      background: "/images/bg-king.jpg",
      format: "MP3",
      audioPath: "/audio/king_of_lions.mp3"
    },
    {
      id: 9,
      title: "Bassdrop Freaks",
      artist: "Camellia",
      bpm: 175,
      cover: "/images/bassdrop.jpg",
      difficulty: 8.2,
      length: "4:44",
      background: "/images/bg-bassdrop.jpg",
      format: "MP3",
      audioPath: "/audio/bassdrop_freaks.mp3"
    },
    {
      id: 10,
      title: "Crystallized",
      artist: "Camellia",
      bpm: 174,
      cover: "/images/crystallized.jpg",
      difficulty: 8.9,
      length: "4:55",
      background: "/images/crystallized.jpg",
      audioPath: "/audio/かめりあ - crystallized.mp3"
    },
    {
      id: 11,
      title: "Crystallized",
      artist: "Camellia",
      bpm: 174,
      cover: "/images/crystallized.jpg",
      difficulty: 8.9,
      length: "4:55",
      background: "/images/crystallized.jpg",
      audioPath: "/audio/かめりあ - crystallized.mp3",
    },
    {
      id: 12,
      title: "Crystallized",
      artist: "Camellia",
      bpm: 174,
      cover: "/images/crystallized.jpg",
      difficulty: 8.9,
      length: "4:55",
      background: "/images/crystallized.jpg",
      audioPath: "/audio/かめりあ - crystallized.mp3",
    },
    {
      id: 13,
      title: "Crystallized111",
      artist: "Camellia",
      bpm: 174,
      cover: "/images/crystallized.jpg",
      difficulty: 8.9,
      length: "4:55",
      background: "/images/crystallized.jpg",
      audioPath: "/audio/かめりあ - crystallized.mp3",
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

  // 获取所有音乐
  const getAllMusic = computed(() => musicLibrary.value);

  // 根据ID查找音乐
  const getMusicById = (id) => {
    return musicLibrary.value.find(music => music.id === id);
  };

  // 根据标签过滤音乐
  const filterByTag = (tag) => {
    return musicLibrary.value.filter(music =>
      music.tags && music.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  };

  // 根据艺术家过滤音乐
  const filterByArtist = (artist) => {
    return musicLibrary.value.filter(music =>
      music.artist.toLowerCase().includes(artist.toLowerCase())
    );
  };

  // 搜索功能 - 支持多关键词搜索(空格分隔)
  const searchMusic = (query) => {
    // 将查询分割为多个关键词
    const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);

    if (keywords.length === 0) return [];

    return musicLibrary.value.filter(music => {
      // 检查所有关键词是否都匹配
      return keywords.every(keyword => {
        return music.title.toLowerCase().includes(keyword) ||
          music.artist.toLowerCase().includes(keyword) ||
          (music.tags && music.tags.some(tag => tag.toLowerCase().includes(keyword)));
      });
    });
  };

  // 添加新音乐到库中
  const addMusic = (music) => {
    musicLibrary.value.push(music);
  };

  // 获取处理过的音频路径
  const getAudioPath = (id) => {
    const music = getMusicById(id);
    if (!music || !music.audioPath) return '';
    return processAudioPath(music.audioPath);
  };

  return {
    musicLibrary,
    getAllMusic,
    getMusicById,
    filterByTag,
    filterByArtist,
    searchMusic,
    addMusic,

    getAudioPath,
    processAudioPath,
  };
});