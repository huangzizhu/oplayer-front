import { defineStore } from "pinia";
import { ref } from "vue";
import { useMusicLibrary } from "./MusicLibrary";
import { useMusicSelector } from "./MusicSelector";
import { indexedDBService } from "@/utils/indexedDBService";

export const useMusicAnalysis = defineStore("musicAnalysis", () => {
  const musicLibraryStore = useMusicLibrary();
  const musicSelectorStore = useMusicSelector();

  // 导入状态
  const isImporting = ref(false);
  const importProgress = ref(0);
  const importTotal = ref(0);
  const importSuccess = ref(0);
  const importFailed = ref(0);
  const importLog = ref([]);
  const isInitializing = ref(false);

  // 持久化存储相关
  const STORAGE_KEY = "oplayer-local-music";

  // 获取本地存储的音乐列表
  const getLocalMusic = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("读取本地音乐缓存失败:", error);
      return [];
    }
  };

  // 保存音乐到本地存储
  const saveLocalMusic = (musicList) => {
    try {
      const currentMusic = getLocalMusic();
      const newList = [...currentMusic];

      // 添加新音乐，避免重复
      musicList.forEach(music => {
        // 根据ID检查是否存在
        const existingIndex = newList.findIndex(m => m.id === music.id);

        if (existingIndex === -1) {
          // 清除 Blob URLs，只保存引用标识符
          const cleanMusic = { ...music };

          // 替换引用为标识符
          if (cleanMusic.localFile) {
            // 处理audioPath - 替换为索引标识符
            if (cleanMusic.audioPath && cleanMusic.audioPath.startsWith('blob:')) {
              cleanMusic._hasStoredAudio = true;
              delete cleanMusic.audioPath; // 不存储URL，加载时重新创建
            }

            // 处理cover - 替换为索引标识符
            if (cleanMusic.cover && cleanMusic.cover.startsWith('blob:')) {
              cleanMusic._hasStoredCover = true;
              delete cleanMusic.cover; // 不存储URL，加载时重新创建
            }
          }

          newList.push(cleanMusic);
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      return true;
    } catch (error) {
      console.error("保存本地音乐失败:", error);
      return false;
    }
  };
  // 数据结构迁移
  const migrateDataStructure = async () => {
    try {
      // 检查迁移标记
      const hasMigrated = localStorage.getItem('oplayer-data-migrated-v2');
      if (hasMigrated === 'true') {
        console.log('数据已经迁移到v2结构，跳过迁移');
        return true;
      }

      console.log('开始数据结构迁移...');

      // 获取所有本地音乐
      const localMusic = getLocalMusic();
      if (!localMusic || localMusic.length === 0) {
        console.log('没有需要迁移的数据');
        localStorage.setItem('oplayer-data-migrated-v2', 'true');
        return true;
      }

      // 确保IndexedDB初始化
      await indexedDBService.init();

      // 迁移元数据
      for (const music of localMusic) {
        try {
          // 检查是否已经存在元数据
          const existingMetadata = await indexedDBService.getMetadata(music.id);
          if (existingMetadata) {
            console.log(`ID ${music.id} 的元数据已存在，跳过`);
            continue;
          }

          // 构建元数据对象
          const metadata = {
            id: music.id,
            title: music.title,
            artist: music.artist,
            album: music.album || '',
            bpm: music.bpm || 0,
            length: music.length || '0:00',
            format: music.format,
            tags: music.tags || [],
            description: music.description || '',
            sourceType: music.sourceType || (music.localFile ? 'local-file' :
              (music.isRemoteSource ? 'remote-api' : 'unknown'))
          };

          // 保存元数据
          await indexedDBService.saveMetadata(metadata);
        } catch (error) {
          console.error(`迁移ID ${music.id} 的元数据失败:`, error);
        }
      }

      // 标记迁移完成
      localStorage.setItem('oplayer-data-migrated-v2', 'true');
      console.log('数据结构迁移完成');

      return true;
    } catch (error) {
      console.error('数据结构迁移失败:', error);
      return false;
    }
  };

  // 修改 updateMusicMetadata 方法
  const updateMusicMetadata = async (musicId, updatedData) => {
    try {
      // 获取当前的音乐对象
      const music = musicLibraryStore.getMusicById(musicId);

      if (!music) {
        throw new Error(`未找到ID为${musicId}的音乐`);
      }

      // 确保标签是字符串数组
      if (updatedData.tags) {
        updatedData.tags = updatedData.tags.filter(tag => typeof tag === 'string');
      }

      // 更新音乐库中的数据
      const updatedMusic = { ...music, ...updatedData };

      // 准备用于 IndexedDB 的净化数据
      const cleanMetadata = {
        id: updatedMusic.id,
        title: updatedMusic.title || '',
        artist: updatedMusic.artist || '',
        album: updatedMusic.album || '',
        bpm: Number(updatedMusic.bpm) || 0,
        length: updatedMusic.length || '',
        format: updatedMusic.format || '',
        tags: Array.isArray(updatedMusic.tags)
          ? updatedMusic.tags.filter(tag => typeof tag === 'string')
          : [],
        description: updatedMusic.description || '',
        sourceType: updatedMusic.sourceType || ''
      };

      // 保存到 IndexedDB
      await indexedDBService.saveMetadata(cleanMetadata);

      // 更新内存中的音乐库
      musicLibraryStore.updateMusic(updatedMusic);

      // 更新本地存储
      const localMusic = getLocalMusic();
      const updatedLocalMusic = localMusic.map(m =>
        m.id === musicId ? { ...m, ...updatedData } : m
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocalMusic));

      return true;
    } catch (error) {
      console.error('更新音乐元数据失败:', error);
      return false;
    }
  };

  // 添加音乐到库和本地存储 - 修改添加元数据存储
  const addMusicToLibrary = async (musicList) => {
    if (!musicList || !musicList.length) return;

    // 重置导入日志
    importLog.value = [];
    importTotal.value = musicList.length;
    importSuccess.value = 0;
    importFailed.value = 0;
    importProgress.value = 0;

    isImporting.value = true;

    try {
      // 标记正在初始化，防止重复调用
      if (isInitializing.value) return;
      isInitializing.value = true;

      // 确保IndexedDB初始化
      await indexedDBService.init();

      // 执行数据迁移
      await migrateDataStructure();

      // 检查并处理重复项
      await indexedDBService.mergeDuplicates();

      // 处理每首音乐
      for (let i = 0; i < musicList.length; i++) {
        const music = musicList[i];
        try {
          // 生成唯一ID (使用当前最大ID + 1)
          const maxId = Math.max(...musicLibraryStore.musicLibrary.map(m => m.id || 0), 0);
          music.id = music.id || (maxId + i + 1);

          // 修复格式问题
          if (music.format === 'MPEG') {
            music.format = 'MP3';
          }

          // 如果是本地文件，存储二进制数据到IndexedDB
          if (music.localFile) {
            if (music.audioBlob) {
              // 保存音频文件到IndexedDB
              await indexedDBService.saveAudioFile(music.id, music.audioBlob);
              music._hasStoredAudio = true;
              delete music.audioBlob; // 移除临时二进制数据
            }

            if (music.coverBlob) {
              // 保存封面图到IndexedDB
              await indexedDBService.saveCoverImage(music.id, music.coverBlob);
              music._hasStoredCover = true;
              delete music.coverBlob; // 移除临时二进制数据
            }
          }

          // 保存元数据
          const metadata = {
            id: music.id,
            title: music.title,
            artist: music.artist,
            album: music.album || '',
            bpm: music.bpm || 0,
            length: music.length || '0:00',
            format: music.format,
            tags: music.tags || [],
            description: music.description || '',
            sourceType: music.sourceType
          };

          // 检查是否有重复曲目
          const saveResult = await indexedDBService.saveMetadata(metadata);

          // 如果发生了合并，需要更新ID
          if (saveResult.merged) {
            // 处理ID变更
            music.id = saveResult.id;

            // 如果已存在音频和封面，不需要重复存储
            music._hasStoredAudio = true;
            music._hasStoredCover = true;

            importLog.value.push({
              type: 'warning',
              message: `已合并重复曲目: ${music.title} - ${music.artist}`
            });
          }

          // 添加到音乐库
          musicLibraryStore.addMusic(music);

          importSuccess.value++;
          importLog.value.push({ type: 'success', message: `已添加: ${music.title || '未知曲目'}` });
        } catch (err) {
          importFailed.value++;
          importLog.value.push({ type: 'error', message: `添加失败: ${music.title || '未知曲目'} - ${err.message}` });
        }

        // 更新进度
        importProgress.value = Math.round(((i + 1) / musicList.length) * 100);
      }

      // 保存到本地存储
      saveLocalMusic(musicList);

      // 触发MusicSelector更新
      musicSelectorStore.refreshLibrary();

    } catch (error) {
      console.error("批量添加音乐失败:", error);
      importLog.value.push({ type: 'error', message: `批量操作失败: ${error.message}` });
    } finally {
      isImporting.value = false;
    }
  };

  // 删除音乐 - 修改为同时删除元数据
  const removeMusic = async (musicId) => {
    try {
      // 先查找该音乐
      const localMusic = getLocalMusic();
      const musicToRemove = localMusic.find(m => m.id === musicId);

      if (!musicToRemove) {
        console.warn(`未找到ID为${musicId}的音乐`);
        return false;
      }

      // 如果是本地文件，需要从IndexedDB删除
      if (musicToRemove.localFile) {
        // 删除音频数据
        if (musicToRemove._hasStoredAudio) {
          await indexedDBService.deleteAudioFile(musicId);
        }

        // 删除封面图
        if (musicToRemove._hasStoredCover) {
          await indexedDBService.deleteCoverImage(musicId);
        }

        // 删除元数据
        await indexedDBService.deleteMetadata(musicId);

        // 释放可能存在的Blob URL
        if (musicToRemove.audioPath && musicToRemove.audioPath.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(musicToRemove.audioPath);
          } catch (e) {
            console.warn('释放ObjectURL失败:', e);
          }
        }

        if (musicToRemove.cover && musicToRemove.cover.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(musicToRemove.cover);
          } catch (e) {
            console.warn('释放封面ObjectURL失败:', e);
          }
        }
      }

      // 从本地存储移除
      const newLocalMusic = localMusic.filter(m => m.id !== musicId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocalMusic));

      // 从音乐库移除
      musicLibraryStore.removeMusic(musicId);

      // 触发MusicSelector更新
      musicSelectorStore.refreshLibrary();

      return true;
    } catch (error) {
      console.error("删除音乐失败:", error);
      return false;
    }
  };

  // 初始化时从本地存储加载到音乐库
  const initFromLocalStorage = async () => {
    try {
      // 标记正在初始化，防止重复调用
      if (isInitializing.value) return;
      isInitializing.value = true;

      // 确保IndexedDB初始化
      await indexedDBService.init();

      const localMusic = getLocalMusic();
      if (localMusic && localMusic.length) {
        console.log(`从本地存储找到 ${localMusic.length} 首音乐`);

        // 创建已经存在ID的集合，用于去重
        const existingIds = new Set(musicLibraryStore.musicLibrary.map(m => m.id));

        // 仅添加不存在于音乐库中的音乐
        const newMusic = localMusic.filter(lm => !existingIds.has(lm.id));

        // 创建恢复音乐的计数器
        let restoredCount = 0;

        // 先检查并处理重复项
        await indexedDBService.mergeDuplicates();

        for (const music of newMusic) {
          try {
            // 再次检查确保没有重复
            if (existingIds.has(music.id)) continue;

            // 修复格式问题
            if (music.format === 'MPEG') {
              music.format = 'MP3';
            }

            // 先尝试从IndexedDB加载元数据
            const metadata = await indexedDBService.getMetadata(music.id);

            // 如果有元数据，更新音乐对象
            if (metadata) {
              // 合并从IndexedDB获取的元数据
              Object.assign(music, {
                title: metadata.title || music.title,
                artist: metadata.artist || music.artist,
                album: metadata.album || music.album,
                bpm: metadata.bpm || music.bpm,
                tags: metadata.tags || music.tags,
                description: metadata.description || music.description
              });
            } else {
              // 如果没有元数据，将当前音乐信息保存为元数据
              await indexedDBService.saveMetadata({
                id: music.id,
                title: music.title,
                artist: music.artist,
                album: music.album || '',
                bpm: music.bpm || 0,
                length: music.length || '0:00',
                format: music.format,
                tags: music.tags || [],
                description: music.description || '',
                sourceType: music.sourceType
              });
            }

            // 恢复本地文件的资源
            if (music.localFile) {
              // 恢复音频文件 URL
              if (music._hasStoredAudio) {
                const audioBlob = await indexedDBService.getAudioFile(music.id);
                if (audioBlob) {
                  music.audioPath = URL.createObjectURL(audioBlob);
                } else {
                  music.audioPath = '/audio/silent.mp3'; // 音频丢失，使用占位音频
                  music._audioMissing = true;
                }
              }

              // 恢复封面图 URL
              if (music._hasStoredCover) {
                const coverBlob = await indexedDBService.getCoverImage(music.id);
                if (coverBlob) {
                  music.cover = URL.createObjectURL(coverBlob);
                } else {
                  music.cover = '/images/default-cover.jpg'; // 封面丢失，使用默认封面
                }
              }
            }

            // 标记已添加ID
            existingIds.add(music.id);

            // 添加来源标记
            music.sourceType = music.sourceType || (music.localFile ? 'local-file' :
              (music.isRemoteSource ? 'remote-api' : 'unknown'));

            // 添加到音乐库
            musicLibraryStore.addMusic(music);
            restoredCount++;
          } catch (error) {
            console.error(`恢复音乐失败: ${music.title || '未知曲目'}`, error);
          }
        }

        if (restoredCount > 0) {
          console.log(`已从本地存储恢复 ${restoredCount} 首音乐`);

          // 触发MusicSelector更新
          setTimeout(() => {
            musicSelectorStore.refreshLibrary();
          }, 300);
        }
      }
    } catch (error) {
      console.error('初始化音乐库失败:', error);
    } finally {
      isInitializing.value = false;
    }
  };

  // 将非本地文件的URL标记为远程资源
  const markAsRemoteSource = (music) => {
    return {
      ...music,
      isRemoteSource: true,
      sourceType: 'remote-api'
    };
  };

  // 将本地文件标记为本地资源
  const markAsLocalFile = (music) => {
    return {
      ...music,
      localFile: true,
      sourceType: 'local-file'
    };
  };

  // 获取IndexedDB存储使用情况
  const getStorageUsage = async () => {
    try {
      return await indexedDBService.getStorageSize();
    } catch (error) {
      console.error('获取存储使用情况失败:', error);
      return { audioSize: 0, imageSize: 0, totalSize: 0 };
    }
  };

  return {
    isImporting,
    importProgress,
    importTotal,
    importSuccess,
    importFailed,
    importLog,
    isInitializing,
    addMusicToLibrary,
    removeMusic,
    initFromLocalStorage,
    getLocalMusic,
    markAsRemoteSource,
    markAsLocalFile,
    getStorageUsage,
    updateMusicMetadata,
  };
});