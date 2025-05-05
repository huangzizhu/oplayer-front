<template>
  <div class="music-analyzer">
    <button class="import-button" @click="openFileSelector" :disabled="isImporting">
      <span class="icon">
        <i class="fas fa-file-import"></i>
      </span>
      <span class="text">{{ buttonText }}</span>
    </button>

    <!-- 文件选择器(隐藏) -->
    <input type="file" ref="fileInput" @change="handleFileSelect" style="display: none;" multiple
      accept=".mp3,.flac,.wav,.ogg,.json" />
    <input type="file" ref="dirInput" @change="handleDirSelect" style="display: none;" webkitdirectory directory
      multiple />

    <!-- 导入进度指示器 -->
    <div class="import-progress" v-if="isImporting">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${importProgress}%` }"></div>
      </div>
      <div class="progress-stats">
        {{ importSuccess }}/{{ importTotal }} 已导入
      </div>
    </div>

    <!-- 导入日志弹窗 -->
    <div class="import-log-modal" v-if="showLog">
      <div class="modal-content">
        <div class="modal-header">
          <h3>导入结果</h3>
          <button class="close-button" @click="showLog = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="import-summary">
            <div>总计: {{ importTotal }}</div>
            <div class="success">成功: {{ importSuccess }}</div>
            <div class="error">失败: {{ importFailed }}</div>
          </div>
          <div class="log-list">
            <div v-for="(log, index) in importLog" :key="index" class="log-item" :class="log.type">
              {{ log.message }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-button" @click="showLog = false">关闭</button>
        </div>
      </div>
    </div>

    <!-- 上下文菜单 -->
    <div class="context-menu" v-if="showContextMenu" :style="contextMenuStyle">
      <div class="menu-item" @click="selectFiles">
        <i class="fas fa-file-audio"></i> 选择音乐文件
      </div>
      <div class="menu-item" @click="selectDirectory">
        <i class="fas fa-folder-open"></i> 选择音乐文件夹
      </div>
      <div class="menu-item" @click="selectJson">
        <i class="fas fa-file-code"></i> 导入JSON配置
      </div>
      <div class="menu-item" @click="openDeleteManager" v-if="hasUserMusic">
        <i class="fas fa-trash-alt"></i> 管理音乐库
      </div>
      <div class="menu-item" @click="showLog = true" v-if="importLog.length">
        <i class="fas fa-list-ul"></i> 查看导入日志
      </div>
      <div class="menu-item" @click="showStorageInfo">
        <i class="fas fa-database"></i> 存储空间信息
      </div>
      <div class="menu-item menu-item-collapse" @click="showContextMenu = false">
        <i class="fas fa-times"></i> 收起菜单
      </div>
    </div>
    <!-- 添加存储信息弹窗 -->
    <div class="storage-info-modal" v-if="showStorage">
      <div class="modal-content">
        <div class="modal-header">
          <h3>存储空间使用</h3>
          <button class="close-button" @click="showStorage = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="storage-info">
            <div class="info-item">
              <span>音频文件:</span>
              <span>{{ storageInfo.audioSize }} MB</span>
            </div>
            <div class="info-item">
              <span>封面图像:</span>
              <span>{{ storageInfo.imageSize }} MB</span>
            </div>
            <div class="info-item total">
              <span>总计使用:</span>
              <span>{{ storageInfo.totalSize }} MB</span>
            </div>
          </div>
          <div class="storage-warning" v-if="storageInfo.totalSize > 1024 * 1024">
            <i class="fas fa-exclamation-triangle"></i>
            存储空间使用较大，可能影响性能，请考虑删除不需要的音乐
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-button" @click="showStorage = false">关闭</button>
        </div>
      </div>
    </div>

    <!-- 新增删除管理器弹窗 -->
    <div class="delete-manager-modal" v-if="showDeleteManager">
      <div class="modal-content">
        <div class="modal-header-delete">
          <h3>音乐库管理</h3>
          <!-- <button class="close-button" @click="showDeleteManager = false">&times;</button> -->
        </div>
        <div class="modal-body">
          <div class="music-list">
            <div v-for="music in userAddedMusic" :key="music.id" class="music-item">
              <div class="checkbox">
                <input type="checkbox" :id="`music-${music.id}`" v-model="musicToDelete[music.id]">
                <label :for="`music-${music.id}`"></label>
              </div>
              <div class="music-cover">
                <img :src="music.cover" alt="Cover">
                <div class="source-badge" :class="music.sourceType">
                  {{ sourceTypeText(music.sourceType) }}
                </div>
              </div>
              <div class="music-details">
                <div class="title">{{ music.title }}</div>
                <div class="artist">{{ music.artist }}</div>
                <div class="format">{{ music.format }}</div>
              </div>
              <div class="delete-single" @click.stop="deleteMusic(music.id)">
                <i class="fas fa-times"></i>
              </div>
            </div>
            <div v-if="!userAddedMusic.length" class="no-music">
              未找到用户添加的音乐
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-button danger" @click="deleteSelectedMusic" :disabled="selectedMusicCount === 0">
            删除选中 ({{ selectedMusicCount }})
          </button>
          <button class="action-button" @click="showDeleteManager = false">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMusicAnalysis } from '@/store/MusicAnalysis';
import { useMusicLibrary } from '@/store/MusicLibrary';
import { indexedDBService } from "@/utils/indexedDBService";
// 导入 Buffer polyfill
import { Buffer } from 'buffer';
// 使其在全局可用
window.Buffer = Buffer;
// 导入music-metadata库用于解析音频元数据
import * as mm from 'music-metadata-browser';

const musicAnalysisStore = useMusicAnalysis();
const fileInput = ref(null);
const dirInput = ref(null);
const showContextMenu = ref(false);
const contextMenuStyle = ref({});
const showLog = ref(false);

// 从store获取状态
const isImporting = computed(() => musicAnalysisStore.isImporting);
const importProgress = computed(() => musicAnalysisStore.importProgress);
const importTotal = computed(() => musicAnalysisStore.importTotal);
const importSuccess = computed(() => musicAnalysisStore.importSuccess);
const importFailed = computed(() => musicAnalysisStore.importFailed);
const importLog = computed(() => musicAnalysisStore.importLog);

let initialized = false;

// 按钮文本
const buttonText = computed(() => {
  return isImporting.value ? `导入中 ${importProgress.value}%` : "导入音乐";
});

// 打开文件选择器
const openFileSelector = (e) => {
  e.preventDefault();
  // 显示上下文菜单
  showContextMenu.value = true;

  // 设置上下文菜单位置
  contextMenuStyle.value = {
    top: `${e.clientY}px`,
    left: `${e.clientX - 70}px`
  };
};

// 选择音乐文件
const selectFiles = () => {
  showContextMenu.value = false;
  fileInput.value.click();
};

// 选择目录
const selectDirectory = () => {
  showContextMenu.value = false;
  dirInput.value.click();
};

// 选择JSON文件
const selectJson = () => {
  showContextMenu.value = false;
  fileInput.value.accept = ".json";
  fileInput.value.multiple = false;
  fileInput.value.click();
  // 重置accept属性
  setTimeout(() => {
    fileInput.value.accept = ".mp3,.flac,.wav,.ogg,.json";
    fileInput.value.multiple = true;
  }, 100);
};

// 处理文件选择
const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  // 检查是否为JSON文件
  if (files[0].name.toLowerCase().endsWith('.json')) {
    await processJsonFile(files[0]);
  } else {
    // 处理音频文件
    await processAudioFiles(files);
  }

  // 清除选择，允许重复选择相同文件
  event.target.value = '';
};

// 处理目录选择
const handleDirSelect = async (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  // 过滤出音频文件
  const audioFiles = files.filter(file => {
    const extension = file.name.split('.').pop().toLowerCase();
    return ['mp3', 'flac', 'wav', 'ogg'].includes(extension);
  });

  await processAudioFiles(audioFiles);

  // 清除选择
  event.target.value = '';
};
const showStorage = ref(false);
const storageInfo = ref({ audioSize: 0, imageSize: 0, totalSize: 0 });

// 显示存储信息
const showStorageInfo = async () => {
  showContextMenu.value = false;
  const info = await musicAnalysisStore.getStorageUsage();
  storageInfo.value = info;
  showStorage.value = true;
};

// 处理音频文件
const processAudioFiles = async (files) => {
  const musicList = [];
  const maxSize = 150 * 1024 * 1024;

  for (const file of files) {
    try {
      // 检查文件大小
      if (file.size > maxSize) {
        throw new Error(`文件过大 (${Math.round(file.size / 1024 / 1024)}MB)，最大支持150MB`);
      }

      // 检查文件类型
      const extension = file.name.split('.').pop().toLowerCase();
      if (!['mp3', 'flac', 'wav', 'ogg'].includes(extension)) {
        throw new Error('不支持的文件格式');
      }

      // 创建音频文件的副本
      const audioBlob = file.slice(0, file.size, file.type);

      // 创建本地URL用于界面显示
      const audioUrl = URL.createObjectURL(audioBlob);

      try {
        // 尝试解析元数据
        const metadata = await mm.parseBlob(file);
        const { common, format } = metadata;

        // 处理封面
        let coverUrl = '';
        let coverBlob = null;

        if (common.picture && common.picture[0]) {
          const picture = common.picture[0];
          coverBlob = new Blob([picture.data], { type: picture.format });
          coverUrl = URL.createObjectURL(coverBlob);
        }

        // 修复格式问题
        let audioFormat = format.container || extension.toUpperCase();
        if (audioFormat === 'MPEG') {
          audioFormat = 'MP3';
        }

        // 处理多个艺术家的情况
        let artist = 'Unknown Artist';
        if (common.artist) {
          // 如果是数组，则用斜杠连接
          artist = Array.isArray(common.artist) ? common.artist.join('/') : common.artist;
        } else if (common.artists && common.artists.length > 0) {
          // 有些文件使用 artists 数组字段存储艺术家信息
          artist = common.artists.join('/');
        } else if (common.albumartist) {
          // 尝试使用专辑艺术家
          artist = Array.isArray(common.albumartist) ? common.albumartist.join('/') : common.albumartist;
        }
        // 构建音乐对象
        const music = musicAnalysisStore.markAsLocalFile({
          title: common.title || file.name.replace(/\.[^/.]+$/, ""),
          artist: artist,
          album: common.album || '',
          bpm: common.bpm || 0,
          cover: coverUrl || '/images/default-cover.jpg',
          length: formatDuration(format.duration),
          audioPath: audioUrl,
          format: audioFormat,
          tags: common.genre || [],
          fileName: file.name,
          // 存储二进制数据用于IndexedDB存储
          audioBlob,
          coverBlob
        });

        musicList.push(music);

        // 添加导入提示
        musicAnalysisStore.importLog.push({
          type: 'info',
          message: `成功处理: ${music.title} (${audioFormat})`
        });
      } catch (metadataError) {
        // 元数据解析失败，使用基本信息
        console.warn(`无法解析元数据，使用基本信息:`, metadataError);

        const music = musicAnalysisStore.markAsLocalFile({
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Unknown Artist',
          album: '',
          bpm: 0,
          cover: '/images/default-cover.jpg',
          length: '0:00', // 无法获取实际时长
          audioPath: audioUrl,
          format: extension.toUpperCase(),
          tags: [],
          fileName: file.name,
          // 存储二进制数据用于IndexedDB存储
          audioBlob
        });

        musicList.push(music);

        // 添加警告提示
        musicAnalysisStore.importLog.push({
          type: 'warning',
          message: `元数据解析失败: ${file.name} - 使用基本信息`
        });
      }
    } catch (error) {
      console.error(`处理文件 ${file.name} 失败:`, error);
      musicAnalysisStore.importLog.push({
        type: 'error',
        message: `无法处理 ${file.name}: ${error.message}`
      });
    }
  }

  // 批量添加到库和持久化存储
  if (musicList.length) {
    await musicAnalysisStore.addMusicToLibrary(musicList);
    showLog.value = true;
  }
};
// 处理JSON文件
const processJsonFile = async (file) => {
  try {
    const reader = new FileReader();

    const result = await new Promise((resolve, reject) => {
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });

    const jsonData = JSON.parse(result);
    const musicList = Array.isArray(jsonData) ? jsonData : (jsonData.musicList || []);

    if (!musicList.length) {
      throw new Error('JSON文件中未找到有效的音乐数据');
    }

    // 将JSON中的路径标记为远程资源
    const processedList = musicList.map(music =>
      musicAnalysisStore.markAsRemoteSource(music)
    );

    // 添加到库和持久化存储
    await musicAnalysisStore.addMusicToLibrary(processedList);
    showLog.value = true;

  } catch (error) {
    console.error('解析JSON文件失败:', error);
    musicAnalysisStore.importLog.push({
      type: 'error',
      message: `JSON解析失败: ${error.message}`
    });
    showLog.value = true;
  }
};

// 格式化时长
const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 点击外部区域关闭上下文菜单
const handleOutsideClick = (e) => {
  if (showContextMenu.value && !e.target.closest('.context-menu') && !e.target.closest('.import-button')) {
    showContextMenu.value = false;
  }
};

// 新增状态变量
const musicLibraryStore = useMusicLibrary();
const showDeleteManager = ref(false);
const musicToDelete = ref({});

// 计算属性：用户添加的音乐
const userAddedMusic = computed(() => {
  return musicLibraryStore.musicLibrary.filter(music =>
    music.sourceType === 'local-file' || music.sourceType === 'remote-api'
  );
});

// 计算属性：是否有用户添加的音乐
const hasUserMusic = computed(() => userAddedMusic.value.length > 0);

// 计算属性：选中的音乐数量
const selectedMusicCount = computed(() => {
  return Object.values(musicToDelete.value).filter(Boolean).length;
});

// 来源类型文本
const sourceTypeText = (type) => {
  switch (type) {
    case 'local-file': return '本地';
    case 'remote-api': return '远程';
    default: return '默认';
  }
};

// 打开删除管理器
const openDeleteManager = () => {
  showContextMenu.value = false;
  musicToDelete.value = {}; // 重置选择
  showDeleteManager.value = true;
};

// 删除单个音乐
const deleteMusic = async (id) => {
  if (confirm(`确定要删除这首音乐吗？`)) {
    const success = await musicAnalysisStore.removeMusic(id);
    if (success) {
      if (Object.keys(musicToDelete.value).includes(id.toString())) {
        delete musicToDelete.value[id];
      }
    }
  }
};

// 删除选中的音乐
const deleteSelectedMusic = async () => {
  const selectedIds = Object.entries(musicToDelete.value)
    .filter(([, selected]) => selected)
    .map(([id]) => Number(id));

  if (selectedIds.length === 0) return;

  if (confirm(`确定要删除选中的 ${selectedIds.length} 首音乐吗？`)) {
    for (const id of selectedIds) {
      await musicAnalysisStore.removeMusic(id);
    }
    musicToDelete.value = {}; // 重置选择
    // 可选：关闭弹窗
    // showDeleteManager.value = false;
  }
};


// 生命周期钩子
// onMounted(() => {
//   // 初始化时从本地存储加载音乐
//   // musicAnalysisStore.initFromLocalStorage();

//   // 添加事件监听
//   document.addEventListener('click', handleOutsideClick);
// });
onMounted(async () => {
  if (!initialized) {
    try {
      // 初始化IndexedDB
      await indexedDBService.init();
      console.log('IndexedDB 初始化成功');

      // 从本地存储加载音乐
      await musicAnalysisStore.initFromLocalStorage();

      initialized = true;
    } catch (error) {
      console.error('初始化失败:', error);
    }
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<style lang="less" scoped>
.music-analyzer {
  position: relative;

  .import-button {
    display: flex;
    align-items: center;
    justify-content: center;
    // background: linear-gradient(135deg, #44AADD 0%, #ff66ab 100%);;
    color: white;
    border: 2px solid white;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    min-width: 100px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
    }

    &:active {
      transform: translateY(1px);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .icon {
      margin-right: 8px;
    }
  }

  .context-menu {
    position: fixed;
    background: rgba(40, 40, 40, 0.95);
    border-radius: 8px;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);
    padding: 8px 0;
    min-width: 180px;
    z-index: 1000;

    .menu-item-collapse {
      margin-top: 5px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: white;
      }
      
      i {
        color: white;
        // color: #f44336;
      }
    }

    .menu-item {
      padding: 8px 16px;
      cursor: pointer;
      color: white;
      display: flex;
      align-items: center;

      i {
        margin-right: 8px;
        width: 16px;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .import-progress {
    margin-top: 10px;
    width: 100%;

    .progress-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #44AADD, #ff66ab);
        transition: width 0.3s ease;
      }
    }

    .progress-stats {
      text-align: center;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 5px;
    }
  }

  .import-log-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .modal-content {
      background: #222;
      border-radius: 16px;
      width: 500px;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);

      .modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          margin: 0;
          color: white;
          font-weight: 600;
          font-size: 18px;
          text-align: center;
          width: 100%;
        }

        .close-button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 24px;
          cursor: pointer;

          &:hover {
            color: white;
          }
        }
      }

      .modal-header-delete {
        justify-content: center;
      }

      .modal-body {
        padding: 20px;
        overflow-y: auto;
        max-height: 60vh;

        .import-summary {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;

          .success {
            color: #4caf50;
          }

          .error {
            color: #f44336;
          }
        }

        .log-list {
          .log-item {
            padding: 8px 10px;
            margin-bottom: 5px;
            border-radius: 4px;
            font-size: 13px;

            &.success {
              background: rgba(76, 175, 80, 0.1);
              color: #4caf50;
            }

            &.error {
              background: rgba(244, 67, 54, 0.1);
              color: #f44336;
            }
          }
        }
      }

      .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: flex-end;

        .action-button {
          // background: linear-gradient(135deg, #44AADD 0%, #ff66ab 100%);
          color: white;
          border: 2px solid white;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 500;

          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
  }

  .delete-manager-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .modal-content {
      background: #222;
      border-radius: 16px;
      width: 600px;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);

      // .modal-header {
      //   // 与现有样式相同
      // }

      .modal-body {
        padding: 20px;
        overflow-y: auto;
        max-height: 60vh;

        .music-list {
          .music-item {
            display: flex;
            align-items: center;
            padding: 10px;
            margin-bottom: 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            position: relative;

            &:hover {
              background: rgba(255, 255, 255, 0.1);
            }

            .checkbox {
              margin-right: 15px;

              input[type="checkbox"] {
                width: 18px;
                height: 18px;
              }
            }

            .music-cover {
              width: 48px;
              height: 48px;
              margin-right: 12px;
              border-radius: 6px;
              overflow: hidden;
              position: relative;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              .source-badge {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                font-size: 10px;
                text-align: center;
                padding: 2px 0;
                background: rgba(0, 0, 0, 0.6);
                color: white;

                &.local-file {
                  background-color: rgba(70, 130, 180, 0.8);
                }

                &.remote-api {
                  background-color: rgba(60, 179, 113, 0.8);
                }
              }
            }

            .music-details {
              flex: 1;

              .title {
                font-size: 14px;
                font-weight: 600;
                color: white;
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .artist {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 2px;
              }

              .format {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.5);
                background: rgba(255, 255, 255, 0.1);
                padding: 1px 6px;
                border-radius: 2px;
                display: inline-block;
              }
            }

            .delete-single {
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #f44336;
              cursor: pointer;
              opacity: 0.7;

              &:hover {
                opacity: 1;
                transform: scale(1.1);
              }
            }
          }

          .no-music {
            text-align: center;
            padding: 20px;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }

      .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: flex-end;
        gap: 10px;

        .action-button {
          // 与现有样式相同

          &.danger {
            color: #f44336;

            &:disabled {
              opacity: 0.4;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  // 添加到样式部分
  .storage-info-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .modal-content {
      background: #222;
      border-radius: 16px;
      width: 500px;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);

      .modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          margin: 0;
          color: white;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 24px;
          cursor: pointer;
        }
      }

      .modal-body {
        padding: 20px;

        .storage-info {
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);

            &.total {
              font-weight: bold;
              margin-top: 8px;
              color: #44AADD;
            }
          }
        }

        .storage-warning {
          margin-top: 15px;
          padding: 10px;
          background: rgba(244, 67, 54, 0.1);
          border-radius: 4px;
          color: #f44336;
          display: flex;
          align-items: center;

          i {
            margin-right: 8px;
          }
        }
      }
    }
  }
}
</style>