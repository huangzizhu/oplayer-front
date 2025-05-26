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
    // {
    //   id: 1,
    //   title: "Tojita Sekai",
    //   artist: "Camellia",
    //   bpm: 175,
    //   cover: "/images/cover.jpg",
    //   album: "heart of android",
    //   length: "6:59",
    //   background: "/images/cover.jpg",
    //   tags: ["Drumstep", "Qualia", "Melodic", "Dubstep"],
    //   mapper: "Sotarks",
    //   origin: "Original",
    //   format: "FLAC",
    //   description: "One of the Best of Camellia",
    //   audioPath: "/audio/かめりあ - Tojita Sekai.mp3",
    // },
    // {
    //   id: 2,
    //   title: "Ghost",
    //   artist: "Camellia",
    //   bpm: 220,
    //   cover: "/images/CyphisoniaEP.jpg",
    //   album: "Cyphisonia EP",
    //   length: "4:10",
    //   background: "/images/CyphisoniaEP.jpg",
    //   tags: ["Breakcore", "Hardcore", "Electronic"],
    //   format: "MP3",
    //   audioPath: "/audio/かめりあ - GHOST.mp3"
    // },
    // {
    //   id: 3,
    //   title: "PLANET//SHAPER",
    //   artist: "Camellia",
    //   bpm: 160,
    //   cover: "/images/PLANETSHAPER.jpg",
    //   album: "PLANET//SHAPER",
    //   length: "5:05",
    //   background: "/images/PLANETSHAPER.jpg",
    //   tags: ["Electronica", "DnB", "Melodic"],
    //   format: "FLAC",
    //   audioPath: "/audio/かめりあ - PLANET   SHAPER.mp3"
    // },
    // {
    //   id: 4,
    //   title: "Exit This Earth's Atomosphere",
    //   artist: "Camellia",
    //   bpm: 170,
    //   cover: "/images/PLANETSHAPER.jpg",
    //   length: "6:08",
    //   background: "/images/PLANETSHAPER.jpg",
    //   format: "MP3",
    //   audioPath: "/audio/かめりあ - Exit This Earth's Atomosphere.mp3"
    // },
    // {
    //   id: 5,
    //   title: "Crystallized",
    //   artist: "Camellia",
    //   bpm: 174,
    //   cover: "/images/crystallized.jpg",
    //   length: "4:55",
    //   background: "/images/crystallized.jpg",
    //   format: "WAV",
    //   audioPath: "/audio/かめりあ - crystallized.mp3"
    // },
    // {
    //   id: 6,
    //   title: "S.A.T.E.L.L.I.T.E.",
    //   artist: "Camellia",
    //   bpm: 150,
    //   cover: "/images/cover.jpg",
    //   length: "4:30",
    //   format: "MP3",
    //   audioPath: "/audio/かめりあ - S.A.T.E.L.L.I.T.E.mp3"
    // },
    // {
    //   id: 7,
    //   title: "+ERABY+E CONNEC+10N",
    //   artist: "Camellia",
    //   bpm: 222,
    //   cover: "/images/TEAOIO.jpg",
    //   length: "5:11",
    //   background: "/images/TEAOIO.jpg",
    //   format: "FLAC",
    //   audioPath: "/audio/かめりあ - +ERABY+E CONNEC+10N.mp3"
    // },
  ]);
  //清空列表
  const clearList = () => {
    musicLibrary.value = [];
  }

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

  // 增强型搜索功能 - 支持多关键词搜索和特定字段搜索
  const searchMusic = (query) => {
    // 原始查询保存，用于日志或调试
    // const originalQuery = query;
    query = query.trim();

    if (!query) return [];

    // 特定字段搜索规则匹配 (如 "artist=Camellia")
    const fieldQueries = [];
    const generalKeywords = [];

    // 解析查询字符串
    const queryParts = parseQueryString(query);

    // 分离特定字段查询和一般关键字
    queryParts.forEach(part => {
      if (part.isFieldQuery) {
        fieldQueries.push(part);
      } else {
        generalKeywords.push(part.term.toLowerCase());
      }
    });

    // 过滤音乐库
    return musicLibrary.value.filter(music => {
      // 先检查特定字段查询条件
      const passesFieldQuery = fieldQueries.length === 0 || fieldQueries.every(q => {
        const fieldValue = getFieldValue(music, q.field);

        // 字段不存在
        if (fieldValue === undefined) return false;

        // 数组字段特殊处理（如tags）
        if (Array.isArray(fieldValue)) {
          return fieldValue.some(value =>
            String(value).toLowerCase().includes(q.value.toLowerCase())
          );
        }

        // 普通字段
        return String(fieldValue).toLowerCase().includes(q.value.toLowerCase());
      });

      if (!passesFieldQuery) return false;

      // 然后检查一般关键字
      if (generalKeywords.length === 0) return true;

      return generalKeywords.every(keyword => {
        // 扩展搜索范围到更多字段
        return (
          includesIgnoreCase(music.title, keyword) ||
          includesIgnoreCase(music.artist, keyword) ||
          includesIgnoreCase(music.album, keyword) ||
          includesIgnoreCase(music.format, keyword) ||
          includesIgnoreCase(music.fileName, keyword) ||
          includesIgnoreCase(music.description, keyword) ||
          includesIgnoreCase(music.sourceType, keyword) ||
          (music.tags && music.tags.some(tag => includesIgnoreCase(tag, keyword))) ||
          includesIgnoreCase(String(music.bpm), keyword) ||
          includesIgnoreCase(String(music.length), keyword)
        );
      });
    });
  };

  // 辅助函数：解析查询字符串，支持特定字段语法
  const parseQueryString = (queryStr) => {
    const parts = [];
    let currentPart = '';
    let inQuotes = false;

    // 分词解析，保留引号内的空格
    for (let i = 0; i < queryStr.length; i++) {
      const char = queryStr[i];

      if (char === '"') {
        inQuotes = !inQuotes;
        currentPart += char;
      } else if ((char === ' ' || char === '/') && !inQuotes) {
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

    // 处理字段语法和引号
    return parts.map(part => {
      // 匹配字段查询语法 field=value 或 field="value with spaces"
      const fieldMatch = part.match(/^([a-zA-Z]+)=(?:"([^"]+)"|([^"]\S*))$/);

      if (fieldMatch) {
        return {
          isFieldQuery: true,
          field: fieldMatch[1].toLowerCase(),
          value: fieldMatch[2] || fieldMatch[3], // 引号内的值或无引号的值
          term: part
        };
      }

      // 处理普通引号包裹的短语
      const phraseMatch = part.match(/^"([^"]+)"$/);
      if (phraseMatch) {
        return {
          isFieldQuery: false,
          term: phraseMatch[1] // 去掉引号
        };
      }

      // 普通关键字
      return {
        isFieldQuery: false,
        term: part
      };
    });
  };

  // 辅助函数：安全地获取字段值，支持嵌套属性
  const getFieldValue = (obj, field) => {
    if (!obj || !field) return undefined;

    // 处理嵌套属性 (如 "album.year")
    const fields = field.split('.');
    let value = obj;

    for (const f of fields) {
      if (value === null || value === undefined) return undefined;
      value = value[f];
    }

    return value;
  };

  // 辅助函数：不区分大小写的包含检查
  const includesIgnoreCase = (str, substr) => {
    if (str === undefined || str === null) return false;
    return String(str).toLowerCase().includes(substr.toLowerCase());
  };

  // 添加新音乐到库中
  const addMusic = (music) => {
    // 修复格式问题
    if (music.format === 'MPEG') {
      music.format = 'MP3';
    }

    // 添加来源类型标记（如果没有）
    if (!music.sourceType) {
      if (music.localFile) {
        music.sourceType = 'local-file';
      } else if (music.isRemoteSource) {
        music.sourceType = 'remote-api';
      } else {
        music.sourceType = 'default';
      }    }

    musicLibrary.value.push(music);
  };

  // 从库中删除音乐
  const removeMusic = (id) => {
    const index = musicLibrary.value.findIndex(music => music.id === id);
    if (index !== -1) {
      musicLibrary.value.splice(index, 1);
      return true;
    }
    return false;
  };

  // 获取处理过的音频路径
  const getAudioPath =  (id) => {
    const music = getMusicById(id);
    if (music.sourceType) {
      if (music.sourceType === "remote-api") {
        return `/op/music/stream/${music.md5}`
      }
    }
        if (!music || !music.audioPath) return '';
    // 如果音乐存在但没有audioPath，这可能是刚刚加载的本地音乐
    if (!music.audioPath && music._hasStoredAudio) {
      return ''; // 返回空，让播放器等待加载
    }

    if (!music.audioPath) return '';

    // 处理和返回正确的音频路径
    return music.audioPath.startsWith('blob:')
        ? music.audioPath // 如果已经是Blob URL，直接返回
        : processAudioPath(music.audioPath);
  };

  // 更新音乐的音频路径
  const updateMusicPath = (id, audioPath) => {
    const index = musicLibrary.value.findIndex(music => music.id === id);
    if (index !== -1) {
      musicLibrary.value[index].audioPath = audioPath;
      return true;
    }
    return false;
  };

  // 更新音乐的封面路径
  const updateMusicCover = (id, coverPath) => {
    const index = musicLibrary.value.findIndex(music => music.id === id);
    if (index !== -1) {
      musicLibrary.value[index].cover = coverPath;
      return true;
    }
    return false;
  };

  // 更新音乐
  const updateMusic = (updatedMusic) => {
    const index = musicLibrary.value.findIndex(music => music.id === updatedMusic.id);
    if (index !== -1) {
      musicLibrary.value[index] = { ...musicLibrary.value[index], ...updatedMusic };
      return true;
    }
    return false;
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
    clearList,
    removeMusic,

    updateMusicPath,
    updateMusicCover,
    updateMusic,

  };
});