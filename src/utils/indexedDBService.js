/**
 * IndexedDB 服务 - 用于存储音频文件和封面图及元数据
 */

const DB_NAME = 'oplayer-db';
const DB_VERSION = 2; 
const AUDIO_STORE = 'audio-files';
const IMAGE_STORE = 'cover-images';
const METADATA_STORE = 'music-metadata';

export const indexedDBService = {
  db: null,

  // 初始化数据库
  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      // 数据库升级事件
      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 创建音频文件存储
        if (!db.objectStoreNames.contains(AUDIO_STORE)) {
          db.createObjectStore(AUDIO_STORE);
        }

        // 创建封面图存储
        if (!db.objectStoreNames.contains(IMAGE_STORE)) {
          db.createObjectStore(IMAGE_STORE);
        }

        // 创建元数据存储
        if (!db.objectStoreNames.contains(METADATA_STORE)) {
          const metadataStore = db.createObjectStore(METADATA_STORE, { keyPath: 'id' });

          // 创建索引用于去重检测
          metadataStore.createIndex('title_artist', ['title', 'artist'], { unique: false });
        }
      };

      // 成功打开数据库
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB 初始化成功');
        resolve(this.db);
      };

      // 打开数据库失败
      request.onerror = (event) => {
        console.error('打开IndexedDB失败:', event.target.error);
        reject(event.target.error);
      };
    });
  },

  // 保存音频文件
  async saveAudioFile(id, audioBlob) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([AUDIO_STORE], 'readwrite');
        const store = transaction.objectStore(AUDIO_STORE);
        const request = store.put(audioBlob, id);

        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('保存音频文件失败:', error);
      return false;
    }
  },

  // 保存封面图
  async saveCoverImage(id, imageBlob) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([IMAGE_STORE], 'readwrite');
        const store = transaction.objectStore(IMAGE_STORE);
        const request = store.put(imageBlob, id);

        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('保存封面图失败:', error);
      return false;
    }
  },

  // 获取音频文件
  async getAudioFile(id) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([AUDIO_STORE], 'readonly');
        const store = transaction.objectStore(AUDIO_STORE);
        const request = store.get(id);

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('获取音频文件失败:', error);
      return null;
    }
  },

  // 获取封面图
  async getCoverImage(id) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([IMAGE_STORE], 'readonly');
        const store = transaction.objectStore(IMAGE_STORE);
        const request = store.get(id);

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('获取封面图失败:', error);
      return null;
    }
  },

  // 删除音频文件
  async deleteAudioFile(id) {
    try {
      await this.init();
      return this._deleteItem(AUDIO_STORE, id);
    } catch (error) {
      console.error('删除音频文件失败:', error);
      return false;
    }
  },

  // 删除封面图
  async deleteCoverImage(id) {
    try {
      await this.init();
      return this._deleteItem(IMAGE_STORE, id);
    } catch (error) {
      console.error('删除封面图失败:', error);
      return false;
    }
  },

  // 获取存储大小
  async getStorageSize() {
    await this.init();

    // 计算音频文件大小
    const audioSize = await this._getStoreSize(AUDIO_STORE);

    // 计算封面图大小
    const imageSize = await this._getStoreSize(IMAGE_STORE);

    // 总大小（MB）
    return {
      audioSize: Math.round(audioSize / 1024 / 1024 * 100) / 100,
      imageSize: Math.round(imageSize / 1024 / 1024 * 100) / 100,
      totalSize: Math.round((audioSize + imageSize) / 1024 / 1024 * 100) / 100
    };
  },

  // 修改 saveMetadata 方法
  async saveMetadata(metadata) {
    if (!metadata || !metadata.id) {
      throw new Error('无效的元数据对象或缺少ID');
    }

    try {
      await this.init();

      // 创建一个干净的可序列化对象
      const cleanMetadata = {
        id: metadata.id,
        title: metadata.title || '',
        artist: metadata.artist || '',
        album: metadata.album || '',
        bpm: Number(metadata.bpm) || 0,
        length: metadata.length || '',
        format: metadata.format || '',
        // 确保标签是简单的字符串数组
        tags: Array.isArray(metadata.tags)
          ? metadata.tags.filter(tag => typeof tag === 'string').map(tag => String(tag))
          : [],
        description: metadata.description || '',
        sourceType: metadata.sourceType || ''
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([METADATA_STORE], 'readwrite');
        const store = transaction.objectStore(METADATA_STORE);

        // 检查是否有相同title+artist的曲目但ID不同
        const index = store.index('title_artist');
        const request = index.getAll([cleanMetadata.title, cleanMetadata.artist]);

        request.onsuccess = (event) => {
          const existingItems = event.target.result || [];
          const duplicates = existingItems.filter(item => item.id !== cleanMetadata.id);

          if (duplicates.length > 0) {
            // 有重复项，进行合并处理
            console.log(`发现 ${duplicates.length} 个重复曲目，进行合并处理`);

            // 保留现有项目ID，但合并元数据
            const mergeId = duplicates[0].id;
            const mergedMetadata = this._mergeMetadata(duplicates[0], cleanMetadata);

            // 保存合并后的元数据
            const saveRequest = store.put(mergedMetadata);

            saveRequest.onsuccess = () => {
              // 然后删除其他重复项
              const deletePromises = duplicates.slice(1).map(dup =>
                this._deleteItem(METADATA_STORE, dup.id)
              );

              Promise.all(deletePromises)
                .then(() => resolve({ merged: true, id: mergeId }))
                .catch(reject);
            };

            saveRequest.onerror = (e) => reject(e.target.error);
          } else {
            // 没有重复项，直接保存
            const saveRequest = store.put(cleanMetadata);
            saveRequest.onsuccess = () => resolve({ merged: false, id: cleanMetadata.id });
            saveRequest.onerror = (e) => reject(e.target.error);
          }
        };

        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('保存元数据失败:', error);
      throw error;
    }
  },

  // 获取音乐元数据
  async getMetadata(id) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([METADATA_STORE], 'readonly');
        const store = transaction.objectStore(METADATA_STORE);
        const request = store.get(id);

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('获取元数据失败:', error);
      return null;
    }
  },

  // 删除音乐元数据
  async deleteMetadata(id) {
    try {
      await this.init();
      return this._deleteItem(METADATA_STORE, id);
    } catch (error) {
      console.error('删除元数据失败:', error);
      return false;
    }
  },

  // 查找重复的曲目
  async findDuplicateSongs() {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([METADATA_STORE], 'readonly');
        const store = transaction.objectStore(METADATA_STORE);
        const request = store.getAll();

        request.onsuccess = (event) => {
          const allMetadata = event.target.result || [];

          // 按title+artist分组
          const groupedByTitleArtist = {};
          allMetadata.forEach(metadata => {
            if (!metadata.title || !metadata.artist) return; // 跳过不完整数据
            const key = `${metadata.title}|${metadata.artist}`.toLowerCase();
            if (!groupedByTitleArtist[key]) {
              groupedByTitleArtist[key] = [];
            }
            groupedByTitleArtist[key].push(metadata);
          });

          // 找出有重复的组
          const duplicateGroups = Object.values(groupedByTitleArtist)
            .filter(group => group.length > 1);

          resolve(duplicateGroups);
        };

        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('查找重复曲目失败:', error);
      return [];
    }
  },

  // 合并重复曲目
  async mergeDuplicates() {
    try {
      const duplicateGroups = await this.findDuplicateSongs();

      // 记录处理结果
      const results = {
        processed: 0,
        merged: 0,
        errors: []
      };

      // 处理每组重复项
      for (const group of duplicateGroups) {
        try {
          results.processed++;

          // 合并元数据，保留第一个ID
          const baseMetadata = group[0];
          const mergedMetadata = group.slice(1).reduce(
            (merged, current) => this._mergeMetadata(merged, current),
            baseMetadata
          );

          // 保存合并后的元数据
          await this.saveMetadata(mergedMetadata);
          results.merged++;

          // 删除其他重复项
          for (let i = 1; i < group.length; i++) {
            await this.deleteMetadata(group[i].id);
            // 同时删除关联的音频和封面
            await this.deleteAudioFile(group[i].id);
            await this.deleteCoverImage(group[i].id);
          }
        } catch (error) {
          results.errors.push({
            group: group.map(g => ({ id: g.id, title: g.title, artist: g.artist })),
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error('合并重复曲目失败:', error);
      throw error;
    }
  },

  // 辅助方法：删除项目
  async _deleteItem(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => {
        console.error(`删除 ${storeName} 中ID为 ${id} 的项目失败:`, e.target.error);
        reject(e.target.error);
      };
    });
  },

  // 辅助方法：获取存储大小
  async _getStoreSize(storeName) {
    return new Promise((resolve) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.openCursor();
      let size = 0;

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const value = cursor.value;
          if (value instanceof Blob) {
            size += value.size;
          } else {
            // 尝试估算其他类型数据大小
            size += JSON.stringify(value).length;
          }
          cursor.continue();
        } else {
          resolve(size);
        }
      };

      request.onerror = () => resolve(0);
    });
  },

  // 修改 _mergeMetadata 方法
  _mergeMetadata(base, toMerge) {
    // 创建基础对象的拷贝
    const merged = {
      id: base.id,
      title: base.title || '',
      artist: base.artist || '',
      album: base.album || '',
      bpm: Number(base.bpm) || 0,
      length: base.length || '',
      format: base.format || '',
      tags: Array.isArray(base.tags) ? [...base.tags] : [],
      description: base.description || '',
      sourceType: base.sourceType || '',
      _hasStoredCover: base._hasStoredCover || false
    };

    // 合并标签 - 确保只有有效的字符串标签
    if (Array.isArray(toMerge.tags) && toMerge.tags.length) {
      if (!Array.isArray(merged.tags)) merged.tags = [];

      // 添加不重复的标签
      toMerge.tags.forEach(tag => {
        if (typeof tag === 'string' && !merged.tags.includes(tag)) {
          merged.tags.push(tag);
        }
      });
    }

    // 如果toMerge有描述而base没有，使用toMerge的
    if (!merged.description && toMerge.description) {
      merged.description = String(toMerge.description);
    }

    // 如果toMerge有专辑而base没有，使用toMerge的
    if (!merged.album && toMerge.album) {
      merged.album = String(toMerge.album);
    }

    // 如果toMerge有BPM而base没有，使用toMerge的
    if (!merged.bpm && toMerge.bpm) {
      merged.bpm = Number(toMerge.bpm) || 0;
    }

    // 对于封面，保留原有的或使用toMerge的
    if (!merged._hasStoredCover && toMerge._hasStoredCover) {
      merged._hasStoredCover = true;
    }

    return merged;
  }
};