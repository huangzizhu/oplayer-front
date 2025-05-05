<template>
  <div class="music-info-container">
    <!-- 顶部导航栏 -->
    <div class="music-info-navbar">
      <div v-for="tab in tabs" :key="tab.id" class="tab-item" :class="{ 'active': activeTab === tab.id }"
        @click="setActiveTab(tab.id)">
        {{ tab.name }}
      </div>
      <div class="tab-indicator" :style="indicatorStyle"></div>
    </div>
    <hr class="divider" />
    <br>
    <!-- 详情内容面板 -->
    <div class="music-info-panel">
      <!-- 详情页 -->
      <div v-if="activeTab === 'details'" class="tab-content details-content">
        <div class="section-title">曲目信息</div>
        <button class="edit-button" @click="openEditDialog" v-if="isEditable">
          <i class="fas fa-edit"></i> 编辑
        </button>
        <div class="info-grid">
          <div class="info-item">
            <div class="label">艺术家</div>
            <div class="value" @click="handleInfoClick(`artist`, musicSelector.selectedMusic.artist)">{{
              musicSelector.selectedMusic.artist }}</div>
          </div>
          <div class="info-item">
            <div class="label">专辑 </div>
            <div class="value" @click="handleInfoClick(`album`, musicSelector.selectedMusic.album)">{{
              musicSelector.selectedMusic.album
            }}</div>
          </div>
          <div class="info-item">
            <div class="label">时长</div>
            <div class="value" @click="handleInfoClick(`length`, musicSelector.selectedMusic.length)">{{
              musicSelector.selectedMusic.length }}</div>
          </div>
          <div class="info-item">
            <div class="label">来源</div>
            <div class="value" @click="handleInfoClick(`sourceType`, musicSelector.selectedMusic.sourceType)">{{
              musicSelector.selectedMusic.sourceType }}</div>
          </div>
        </div>

        <div class="section-title">标签</div>
        <div class="tags-container">
          <span v-for="(tag, index) in musicSelector.selectedMusic.tags" :key="index" class="tag-item"
            @click="handleTagClick(tag)">{{ tag }}</span>
        </div>

        <div class="section-title">描述</div>
        <div class="description">
          {{ musicSelector.selectedMusic.description || 'No Description' }}
        </div>
      </div>

      <!-- 谱面页 -->
      <div v-else-if="activeTab === 'beatmaps'" class="tab-content beatmaps-content">

        <div class="beatmap-list">
          <div class="beatmap-item">
            <div class="difficulty-badge insane">9.2★</div>
            <div class="beatmap-info">
              <div class="beatmap-name">Extreme</div>
              <div class="mapper">mapped by peppy</div>
              <div class="stats">
                <span>AR9</span>
                <span>CS4.2</span>
                <span>HP6</span>
                <span>OD8.5</span>
              </div>
            </div>
          </div>

          <div class="beatmap-item">
            <div class="difficulty-badge hard">7.5★</div>
            <div class="beatmap-info">
              <div class="beatmap-name">Insane</div>
              <div class="mapper">mapped by RLC</div>
              <div class="stats">
                <span>AR8.5</span>
                <span>CS4</span>
                <span>HP5</span>
                <span>OD8</span>
              </div>
            </div>
          </div>

          <div class="beatmap-item">
            <div class="difficulty-badge normal">4.8★</div>
            <div class="beatmap-info">
              <div class="beatmap-name">Normal</div>
              <div class="mapper">mapped by Sotarks</div>
              <div class="stats">
                <span>AR7</span>
                <span>CS3.5</span>
                <span>HP4</span>
                <span>OD7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 排行榜页 -->
      <div v-else-if="activeTab === 'leaderboard'" class="tab-content leaderboard-content">
        <div class="score-list">
          <div class="score-item">
            <div class="rank">1</div>
            <div class="player">WhiteCat</div>
            <div class="score">9,999,999</div>
            <div class="accuracy">99.87%</div>
          </div>
          <div class="score-item">
            <div class="rank">2</div>
            <div class="player">Vaxei</div>
            <div class="score">9,986,753</div>
            <div class="accuracy">99.42%</div>
          </div>
          <div class="score-item">
            <div class="rank">3</div>
            <div class="player">Mrekk</div>
            <div class="score">9,954,321</div>
            <div class="accuracy">99.21%</div>
          </div>
        </div>
      </div>
    </div>


    <!-- 元信息编辑对话框 -->
    <div class="edit-modal" v-if="showEditDialog">
      <div class="edit-modal-content">
        <div class="modal-header">
          <h3>编辑曲目信息</h3>
          <button class="close-button" @click="showEditDialog = false">&times;</button>
        </div>

        <div class="modal-body">
          <div class="edit-form">
            <!-- 基本信息 -->
            <div class="form-section">
              <h4>基本信息</h4>

              <div class="form-group">
                <label>标题</label>
                <input type="text" v-model="editingMusic.title" placeholder="曲目标题">
              </div>

              <div class="form-group">
                <label>艺术家</label>
                <input type="text" v-model="editingMusic.artist" placeholder="艺术家名称">
              </div>

              <div class="form-group">
                <label>专辑</label>
                <input type="text" v-model="editingMusic.album" placeholder="专辑名称">
              </div>

              <div class="form-group">
                <label>BPM</label>
                <input type="number" v-model="editingMusic.bpm" placeholder="0">
              </div>

              <div class="form-group">
                <label>时长</label>
                <input type="text" v-model="editingMusic.length" placeholder="0:00">
              </div>

              <div class="form-group">
                <label>格式</label>
                <select v-model="editingMusic.format">
                  <option value="MP3">MP3</option>
                  <option value="FLAC">FLAC</option>
                  <option value="WAV">WAV</option>
                  <option value="OGG">OGG</option>
                </select>
              </div>
            </div>

            <!-- 标签管理 -->
            <div class="form-section">
              <h4>标签管理</h4>
              <div class="tags-editor">
                <div class="current-tags">
                  <span v-for="(tag, index) in editingMusic.tags" :key="index" class="tag-pill">
                    {{ tag }}
                    <button @click="removeTag(index)" class="remove-tag">&times;</button>
                  </span>
                </div>

                <div class="add-tag-form">
                  <input type="text" v-model="newTag" @keyup.enter="addTag" placeholder="输入新标签并按回车" class="tag-input">
                  <button @click="addTag" class="add-tag-btn">添加标签</button>
                </div>
              </div>
            </div>

            <!-- 描述编辑 -->
            <div class="form-section">
              <h4>描述</h4>
              <textarea v-model="editingMusic.description" placeholder="输入曲目描述" class="description-editor"
                rows="4"></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="action-button delete" @click="confirmDelete">
            <i class="fas fa-trash-alt"></i> 删除曲目
          </button>
          <div class="footer-right">
            <button class="action-button" @click="saveChanges">保存更改</button>
            <button class="action-button cancel" @click="showEditDialog = false">取消</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 删除确认对话框 -->
    <div class="confirm-delete-modal" v-if="showDeleteConfirm">
      <div class="confirm-modal-content">
        <div class="modal-header">
          <h3>确认删除</h3>
        </div>
        <div class="modal-body">
          <p class="confirm-message">
            <i class="fas fa-exclamation-triangle warning-icon"></i>
            您确定要删除曲目 <strong>{{ editingMusic.title }}</strong> 吗？
          </p>
          <p class="confirm-warning">此操作不可撤销，音乐文件和元数据将被永久删除。</p>
        </div>
        <div class="modal-footer">
          <button class="action-button delete-confirm" @click="deleteMusic">
            确认删除
          </button>
          <button class="action-button cancel" @click="showDeleteConfirm = false">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// {
//   id: 1,
//     title: "Tojita Sekai",
//       artist: "Camellia",
//         bpm: 175,
//           cover: "/images/cover.jpg",
//             album: "heart of android",
//               length: "6:59",
//                 background: "/images/cover.jpg",
//                   tags: ["Drumstep", "Qualia", "Melodic", "Dubstep"],
//                       origin: "Original",
//                         format: "FLAC",
//                           description: "One of the Best of Camellia",
//                             audioPath: "/audio/かめりあ - Tojita Sekai.mp3",
//     },
import { ref, computed } from 'vue';
import { useMusicSelector } from '@/store/MusicSelector.js';
import { useSearchBar } from '@/store/SearchBar';
// import { useMusicLibrary } from '@/store/MusicLibrary';
import { useMusicAnalysis } from '@/store/MusicAnalysis';
// import MusicAnalyzer from '@/components/music/MusicAnalyzer.vue';

const musicSelector = useMusicSelector();
const SearchBar = useSearchBar();
// const musicLibraryStore = useMusicLibrary();
const musicAnalysisStore = useMusicAnalysis();
// 定义标签页
const tabs = [
  { id: 'details', name: 'Details' },
  { id: 'beatmaps', name: 'Beatmaps' },
  { id: 'leaderboard', name: 'Leaderboard' }
];

// 当前激活的标签页
const activeTab = ref('details');

// 设置激活的标签页
const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

// 计算指示器样式
const indicatorStyle = computed(() => {
  const index = tabs.findIndex(tab => tab.id === activeTab.value);
  const width = 100 / tabs.length;

  return {
    width: `${width}%`,
    transform: `translateX(${index * 100}%)`
  };
});

const handleTagClick = (tag) => {
  // 处理标签点击事件
  console.log(`Clicked on tag: ${tag}`);
  SearchBar.searchText = tag
};
const handleInfoClick = (Infotype, info) => {
  // 处理信息点击事件
  console.log(`Clicked on info: ${info}`);
  SearchBar.searchText = `${info}`
};


// 编辑相关状态
const showEditDialog = ref(false);
const editingMusic = ref({});
const newTag = ref('');
// 判断当前音乐是否可编辑
const isEditable = computed(() => {
  const music = musicSelector.selectedMusic;
  // 只允许编辑用户导入的音乐，而不是默认音乐
  return music && (music.sourceType === 'local-file' || music.sourceType === 'remote-api');
});

// 打开编辑对话框
const openEditDialog = () => {
  // 创建一个深拷贝，避免直接修改原始对象
  editingMusic.value = JSON.parse(JSON.stringify(musicSelector.selectedMusic));

  // 确保标签是数组
  if (!editingMusic.value.tags) {
    editingMusic.value.tags = [];
  }

  showEditDialog.value = true;
};

// 添加标签
const addTag = () => {
  const trimmedTag = newTag.value.trim();
  if (trimmedTag) {
    // 确保标签是字符串且不重复
    if (!editingMusic.value.tags) {
      editingMusic.value.tags = [];
    }

    if (!editingMusic.value.tags.includes(trimmedTag)) {
      editingMusic.value.tags.push(trimmedTag);
    }

    newTag.value = ''; // 清空输入框
  }
};

// 移除标签
const removeTag = (index) => {
  editingMusic.value.tags.splice(index, 1);
};

// 保存更改
const saveChanges = async () => {
  try {
    // 更新音乐库中的元信息
    await musicAnalysisStore.updateMusicMetadata(editingMusic.value.id, editingMusic.value);

    // 关闭对话框
    showEditDialog.value = false;
  } catch (error) {
    console.error('保存曲目信息失败:', error);
    // 可以添加错误提示
  }
};


// 删除相关状态
const showDeleteConfirm = ref(false);

// 打开删除确认对话框
const confirmDelete = () => {
  showDeleteConfirm.value = true;
};

// 执行删除操作
const deleteMusic = async () => {
  try {
    // 删除音乐
    const success = await musicAnalysisStore.removeMusic(editingMusic.value.id);

    // 关闭所有对话框
    showDeleteConfirm.value = false;
    showEditDialog.value = false;

    if (success) {
      // 如果有需要，可以显示删除成功的通知
      console.log(`成功删除曲目: ${editingMusic.value.title}`);
    } else {
      // 显示错误提示
      console.error(`删除曲目失败: ${editingMusic.value.title}`);
    }
  } catch (error) {
    console.error('删除曲目出错:', error);
  }
};
</script>

<style lang="less" scoped>
// 颜色变量
@bg-color: rgba(0, 0, 0, 0.75);
@highlight-color: rgb(255, 255, 255);
@text-color: rgba(255, 255, 255, 0.9);
@text-dim: #ffcc22;
@text-link: #44AADD;
@panel-bg: rgba(20, 20, 20, 0.8);
@border-radius: 10px;

// 难度颜色
@color-normal: rgb(88, 215, 100);
@color-hard: rgb(255, 200, 0);
@color-insane: rgb(255, 102, 102);

// 主容器
.music-info-container {
  top: 400px;
  left: 5px;
  width: 33%;
  height: 59%;
  position: absolute;
  // background-color: @bg-color;
  font-family: 'Comfortaa-Light', sans-serif;
  border-radius: @border-radius;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  // 导航栏
  .music-info-navbar {
    height: 50px;
    width: 50%;
    display: flex;
    position: relative;
    // background-color: rgba(0, 0, 0, 0.3);

    .tab-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @text-dim;
      font-size: 12px;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: #ffffff;
      }

      &.active {
        color: #ffffff;
        font-weight: bold;
      }
    }

    // 底部指示器
    .tab-indicator {
      position: absolute;
      bottom: 0;
      height: 3px;
      background-color: @highlight-color;
      transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      box-shadow: 0 0 10px @highlight-color;
    }
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.3);
    margin: 0;
    border: none;
  }

  // 详情面板
  .music-info-panel {
    background-color: rgba(0, 0, 0, 0.4);
    flex: 1;
    overflow-y: auto;
    padding: 20px;

    // 标签内容通用样式
    .tab-content {
      height: 100%;
      animation: fadeIn 0.3s ease-out;
    }

    // 详情页样式
    .details-content {
      .section-title {
        color: @highlight-color;
        font-size: 18px;
        margin-bottom: 10px;
        font-weight: bold;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
        margin-bottom: 20px;
        margin-top: 10px;

        .info-item {
          .label {
            color: @text-color;
            font-size: 14px;
            margin-bottom: 4px;
            font-weight: bold;
          }

          .value {
            color: @text-link;
            font-size: 16px;
            cursor: pointer;

            &:hover {
              color: rgba(68, 170, 250, 0.7);
              transition: color 0.2s ease;
            }
          }

        }
      }

      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
        font-size: 14px;

        .tag-item {
          color: @text-link;
          // padding: 5px 10px;
          border-radius: 15px;
          cursor: pointer;
          // transition: all 0.3s ease;

          &:hover {
            color: rgba(68, 170, 250, 0.7);
            transition: color 0.2s ease;
          }
        }
      }

      .description {
        color: @text-color;
        line-height: 1.6;
        font-size: 15px;
      }
    }

    // 谱面页样式
    .beatmaps-content {
      .beatmap-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .beatmap-item {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 12px;
        transition: transform 0.2s;

        &:hover {
          transform: translateX(5px);
          background-color: rgba(0, 0, 0, 0.4);
        }

        .difficulty-badge {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 15px;

          &.normal {
            background-color: @color-normal;
          }

          &.hard {
            background-color: @color-hard;
          }

          &.insane {
            background-color: @color-insane;
          }
        }

        .beatmap-info {
          flex: 1;

          .beatmap-name {
            font-size: 18px;
            color: white;
          }

          .mapper {
            font-size: 14px;
            color: @text-dim;
            margin-bottom: 5px;
          }

          .stats {
            display: flex;
            gap: 15px;

            span {
              font-size: 13px;
              background-color: rgba(255, 255, 255, 0.1);
              padding: 3px 8px;
              border-radius: 4px;
            }
          }
        }
      }
    }

    // 排行榜页样式
    .leaderboard-content {
      .score-list {
        display: flex;
        flex-direction: column;
      }

      .score-item {
        display: flex;
        align-items: center;
        padding: 15px 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        &:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .rank {
          width: 40px;
          font-weight: bold;
          font-size: 18px;
          color: @highlight-color;
        }

        .player {
          flex: 1;
          font-size: 16px;
          color: white;
        }

        .score {
          width: 120px;
          text-align: right;
          font-weight: bold;
          color: white;
        }

        .accuracy {
          width: 80px;
          text-align: right;
          color: @color-normal;
        }
      }
    }
  }

  // 编辑按钮样式
  .edit-button {
    margin-left: 0px;
    // padding-bottom: 15px;
    background: rgba(68, 170, 221, 0.2);
    border: 1px solid #44AADD;
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 12px;
    color: #44AADD;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(68, 170, 221, 0.4);
    }

    i {
      margin-right: 4px;
    }
  }

  // 编辑对话框样式
  .edit-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .edit-modal-content {
      background: #222;
      border-radius: 16px;
      width: 600px;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          margin: 0;
          color: white;
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
        overflow-y: auto;
        max-height: 60vh;

        .edit-form {
          .form-section {
            color: white;
            margin-bottom: 24px;

            h4 {
              color: #44AADD;
              margin-top: 0;
              margin-bottom: 15px;
              border-bottom: 1px solid rgba(68, 170, 221, 0.2);
              padding-bottom: 8px;
            }

            .form-group {
              margin-bottom: 15px;

              label {
                display: block;
                margin-bottom: 5px;
                color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
              }

              input,
              select,
              textarea {
                width: 100%;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                color: white;
                font-size: 14px;

                &:focus {
                  outline: none;
                  border-color: #44AADD;
                }
              }
            }

            .tags-editor {
              .current-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 10px;

                .tag-pill {
                  background: rgba(68, 170, 221, 0.2);
                  border: 1px solid rgba(68, 170, 221, 0.4);
                  border-radius: 15px;
                  padding: 4px 10px;
                  display: flex;
                  align-items: center;
                  color: #44AADD;

                  .remove-tag {
                    background: none;
                    border: none;
                    color: #44AADD;
                    margin-left: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;

                    &:hover {
                      color: white;
                    }
                  }
                }
              }

              .add-tag-form {
                display: flex;
                gap: 10px;

                .tag-input {
                  color: white !important;
                  flex: 1;
                }

                .add-tag-btn {
                  background: #44AADD;
                  border: none;
                  color: white;
                  padding: 8px 15px;
                  border-radius: 4px;
                  cursor: pointer;

                  &:hover {
                    background: darken(#44AADD, 10%);
                  }
                }
              }
            }

            .description-editor {
              color: white !important;
              width: 100%;
              min-height: 100px;
              resize: vertical;
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
          }
        }
      }

      .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        gap: 10px;

        .footer-right {
          display: flex;
          gap: 10px;
        }

        .action-button {
          background: #44AADD;
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;

          &:hover {
            background: darken(#44AADD, 10%);
          }

          &.cancel {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.3);

            &:hover {
              border-color: rgba(255, 255, 255, 0.5);
            }
          }

          &.delete {
            background: rgba(244, 67, 54, 0.7);

            &:hover {
              background: rgba(244, 67, 54, 0.9);
            }

            i {
              margin-right: 5px;
            }
          }

          &.delete-confirm {
            background: #f44336;

            &:hover {
              background: darken(#f44336, 10%);
            }
          }
        }
      }
    }
  }

  /* 删除确认对话框样式 */
  .confirm-delete-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;

    .confirm-modal-content {
      background: #222;
      border-radius: 16px;
      width: 450px;
      max-width: 90vw;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(244, 67, 54, 0.3);

      .modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid rgba(244, 67, 54, 0.2);

        h3 {
          margin: 0;
          color: white;
        }
      }

      .modal-body {
        padding: 20px;

        .confirm-message {
          margin-top: 0;
          font-size: 16px;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;

          .warning-icon {
            color: #f44336;
            font-size: 20px;
          }

          strong {
            color: #f44336;
          }
        }

        .confirm-warning {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-top: 15px;
        }
      }

      .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid rgba(244, 67, 54, 0.2);
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    }
  }
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 滚动条样式
.music-info-panel::-webkit-scrollbar {
  width: 5px;
}

.music-info-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.music-info-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.music-info-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>