/**
 * IndexedDB 服务 - 用于存储音频文件和封面图
 */

const DB_NAME = 'oplayer-db';
const DB_VERSION = 1;
const AUDIO_STORE = 'audio-files';
const IMAGE_STORE = 'cover-images';

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
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([AUDIO_STORE], 'readwrite');
        const store = transaction.objectStore(AUDIO_STORE);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('删除音频文件失败:', error);
      return false;
    }
  },

  // 删除封面图
  async deleteCoverImage(id) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([IMAGE_STORE], 'readwrite');
        const store = transaction.objectStore(IMAGE_STORE);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('删除封面图失败:', error);
      return false;
    }
  },

  // 获取已使用的存储空间大小（MB）
  async getStorageSize() {
    await this.init();

    // 计算音频文件大小
    const audioSize = await this._getStoreSize(AUDIO_STORE);

    // 计算封面图大小
    const imageSize = await this._getStoreSize(IMAGE_STORE);

    // 总大小（MB）
    return {
      audioSize: Math.round(audioSize / (1024 * 1024)),
      imageSize: Math.round(imageSize / (1024 * 1024)),
      totalSize: Math.round((audioSize + imageSize) / (1024 * 1024))
    };
  },

  // 辅助方法：计算存储大小
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
  }
};