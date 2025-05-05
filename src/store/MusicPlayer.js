import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useMusicSelector } from "./MusicSelector";
import { useMusicLibrary } from "./MusicLibrary";
import { Howl } from "howler";
import { indexedDBService } from "@/utils/indexedDBService";
import { Howler } from "howler";

export const useMusicPlayer = defineStore("musicPlayer", () => {
  // 引入音乐选择器
  const musicSelectorStore = useMusicSelector();
  const musicLibraryStore = useMusicLibrary();
  // 播放器状态
  const isPlaying = ref(false);
  const isLoading = ref(false);
  const isMuted = ref(false);
  const volume = ref(0.3);
  const currentTime = ref(0);
  const duration = ref(0);
  const hasError = ref(false);
  const errorMessage = ref("");

  // 播放模式: "repeat" | "repeat-one" | "shuffle"
  const playMode = ref("shuffle");

  // 音频实例
  let sound = null;

  // 计算属性：当前选中的音乐
  const currentMusic = computed(() => musicSelectorStore.selectedMusic);

  // 计算属性：音频路径
  const audioPath = computed(() => {

    const currentMusic = musicSelectorStore.selectedMusic;
    const audioPath = musicLibraryStore.getAudioPath(currentMusic.id);
    // return currentMusic.value?.audioPath || ""
    return audioPath
  });

  // 计算属性：格式化的当前时间
  const formattedCurrentTime = computed(() => formatTime(currentTime.value));

  // 计算属性：格式化的总时长
  const formattedDuration = computed(() => formatTime(duration.value));

  // 格式化时间（秒 -> 分:秒）
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds) return "0:00";

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // 监听音乐变化，自动加载和播放
  watch(
    () => musicSelectorStore.selectedIndex,
    () => {
      loadAndPlay();
    }
  );

  // 添加这些变量用于追踪加载状态
  const currentLoadingId = ref(null);  // 当前正在加载的音频ID
  const isLoadingLocked = ref(false);  // 加载锁定状态

  // 加载并播放当前选中的音乐
  const loadAndPlay = async () => {
    const music = currentMusic.value;
    if (!music) {
      hasError.value = true;
      errorMessage.value = "无效的音乐";
      return;
    }

    // 强制立即卸载上一个实例 - 确保没有多个实例并行
    stopAndUnload();

    // 如果正在加载相同的曲目，则避免重复加载
    if (isLoadingLocked.value && currentLoadingId.value === music.id) {
      console.log(`已经在加载: ${music.title}`);
      return;
    }

    // 设置加载锁和当前加载ID
    isLoadingLocked.value = true;
    currentLoadingId.value = music.id;

    // 记录当前加载的音乐ID用于后续检查
    const currentMusicId = music.id;

    // 设置加载状态
    isLoading.value = true;
    hasError.value = false;

    try {
      // 对于本地文件，从IndexedDB加载
      if (music.localFile && (!music.audioPath || !music.audioPath.startsWith('blob:')) && music._hasStoredAudio) {
        // 从IndexedDB加载音频
        const audioBlob = await indexedDBService.getAudioFile(music.id);

        // 检查是否在加载过程中切换了曲目
        if (currentLoadingId.value !== currentMusicId) {
          console.log('加载过程中切换了曲目，取消加载');
          isLoadingLocked.value = false;
          return;
        }

        if (audioBlob) {
          // 释放旧URL (如果存在)
          if (music.audioPath && music.audioPath.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(music.audioPath);
            } catch (e) {
              console.warn('释放旧URL失败:', e);
            }
          }

          // 创建新的Blob URL
          music.audioPath = URL.createObjectURL(audioBlob);

          // 更新音乐库中的对象
          musicLibraryStore.updateMusicPath(music.id, music.audioPath);
        } else {
          isLoading.value = false;
          hasError.value = true;
          errorMessage.value = "无法加载本地音频文件";
          isLoadingLocked.value = false;
          return;
        }
      }

      // 确保有音频路径
      const finalAudioPath = audioPath.value;
      if (!finalAudioPath) {
        isLoading.value = false;
        hasError.value = true;
        errorMessage.value = "无效的音频路径";
        isLoadingLocked.value = false;
        return;
      }

      // 确保旧的实例被彻底销毁
      if (sound) {
        sound.off(); // 移除所有事件监听
        sound.stop();
        sound.unload();
        sound = null;
      }

      // 创建新的Howl实例 - 注意不使用HTML5模式
      sound = new Howl({
        src: [finalAudioPath],
        html5: false, // 坚持使用Web Audio API，不使用HTML5 Audio
        format: music.format ? [music.format.toLowerCase()] : undefined,
        volume: volume.value,
        onload: () => {
          // 检查加载完成时，当前音乐ID是否仍与加载开始时相同
          if (currentLoadingId.value !== currentMusicId) {
            console.log('音频加载完成，但已切换到其他曲目，不播放');

            // 立即卸载此实例
            if (sound) {
              sound.off();
              sound.unload();
              sound = null;
            }

            isLoadingLocked.value = false;
            return;
          }

          // 加载成功
          duration.value = sound.duration();
          isLoading.value = false;
          isLoadingLocked.value = false;

          // 检查是否还有其他实例在播放
          if (Howler._howls.length > 1) {
            console.warn('发现多个Howl实例，正在停止其他实例');

            // 获取当前实例ID
            const currentId = sound._id;

            // 停止其他实例
            Howler._howls.forEach(howl => {
              if (howl._id !== currentId) {
                howl.stop();
                howl.unload();
              }
            });
          }

          // 自动播放
          play();
        },
        onplay: () => {
          // 确保这是当前加载的曲目
          if (currentLoadingId.value !== currentMusicId) {
            sound.stop();
            return;
          }

          isPlaying.value = true;
          startTimeUpdate();
        },
        onpause: () => {
          isPlaying.value = false;
        },
        onstop: () => {
          isPlaying.value = false;
          currentTime.value = 0;
        },
        onend: () => {
          handleTrackEnd();
        },
        onloaderror: (id, err) => {
          console.error('音频加载错误:', err);

          // 检查是否仍是当前请求的音乐
          if (currentLoadingId.value !== currentMusicId) {
            isLoadingLocked.value = false;
            return;
          }

          isLoading.value = false;
          hasError.value = true;
          errorMessage.value = "加载音频失败";
          isLoadingLocked.value = false;

          // 删除失败的实例
          if (sound) {
            sound.off();
            sound.unload();
            sound = null;
          }
        },
        onplayerror: (id, err) => {
          console.error('音频播放错误:', err);
          isPlaying.value = false;
          hasError.value = true;
          errorMessage.value = "播放音频失败";
          isLoadingLocked.value = false;
        }
      });
    } catch (error) {
      console.error('创建播放器实例失败:', error);
      isLoading.value = false;
      hasError.value = true;
      errorMessage.value = `播放器错误: ${error.message}`;
      isLoadingLocked.value = false;
    }
  };
  // 时间更新定时器
  let timeUpdateInterval = null;

  // 开始定时更新当前时间
  const startTimeUpdate = () => {
    // 清除可能存在的旧定时器
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
    }

    // 创建新定时器
    timeUpdateInterval = setInterval(() => {
      if (sound && isPlaying.value) {
        currentTime.value = sound.seek();
      }
    }, 1000 / 60); // 约60fps，保持进度条流畅
  };

  // 停止定时更新
  const stopTimeUpdate = () => {
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
      timeUpdateInterval = null;
    }
  };

  // 加强停止和卸载函数
  const stopAndUnload = () => {
    stopTimeUpdate();

    // 停止所有可能的Howl实例
    Howler.stop();

    if (sound) {
      try {
        sound.off(); // 移除所有事件监听
        sound.stop();
        sound.unload();
      } catch (e) {
        console.warn('停止音频时出错:', e);
      }
      sound = null;
    }

    // 清理额外的howl实例
    if (Howler._howls && Howler._howls.length > 0) {
      console.log(`清理 ${Howler._howls.length} 个额外的Howl实例`);
      for (let i = Howler._howls.length - 1; i >= 0; i--) {
        try {
          Howler._howls[i].stop();
          Howler._howls[i].unload();
        } catch (e) {
          console.warn('清理额外实例时出错:', e);
        }
      }
    }

    currentTime.value = 0;
    duration.value = 0;
    isPlaying.value = false;
    isLoading.value = false;
  };

  // 处理音轨结束
  const handleTrackEnd = () => {
    switch (playMode.value) {
      case "repeat":
        playNext();
        break;
      case "repeat-one":
        sound.seek(0);
        sound.play();
        break;
      case "shuffle":
        playRandomTrack();
        break;
      default:
        // 默认停止播放
        isPlaying.value = false;
        currentTime.value = 0;
    }
  };

  // 播放
  const play = () => {
    if (sound) {
      sound.play();
      isPlaying.value = true;
    } else if (audioPath.value) {
      loadAndPlay();
    }
  };

  // 暂停
  const pause = () => {
    if (sound) {
      sound.pause();
      isPlaying.value = false;
    }
  };

  // 切换播放/暂停
  const togglePlay = () => {
    if (isPlaying.value) {
      pause();
    } else {
      play();
    }
  };

  // 跳转到指定时间
  const seekTo = (time) => {
    if (sound) {
      sound.seek(time);
      currentTime.value = time;
    }
  };

  // 跳转到指定百分比
  const seekToPercentage = (percentage) => {
    if (sound && duration.value > 0) {
      const time = (percentage / 100) * duration.value;
      seekTo(time);
    }
  };

  // 设置音量
  const setVolume = (val) => {
    volume.value = Math.max(0, Math.min(1, val));
    if (sound) {
      sound.volume(volume.value);
    }
  };

  // 静音切换
  const toggleMute = () => {
    isMuted.value = !isMuted.value;
    if (sound) {
      sound.mute(isMuted.value);
    }
  };

  // 设置播放模式
  const setPlayMode = (mode) => {
    playMode.value = mode;
  };

  // 播放下一首
  const playNext = () => {
    // 如果是随机播放模式，则播放随机歌曲
    if (playMode.value === "shuffle") {
      playRandomTrack();
    } else {
      // 否则按顺序播放下一首
      musicSelectorStore.selectNext();
    }
    // loadAndPlay会通过watch自动触发
  };

  // 播放上一首
  const playPrevious = () => {
    // 如果是随机播放模式，则播放随机歌曲
    if (playMode.value === "shuffle") {
      playRandomTrack();
    } else {
      musicSelectorStore.selectPrevious();
    }
    // loadAndPlay会通过watch自动触发
  };

  // 播放随机歌曲
  const playRandomTrack = () => {
    const totalTracks = musicSelectorStore.musicLibrary.length;
    if (totalTracks <= 1) return;

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * totalTracks);
    } while (randomIndex === musicSelectorStore.selectedIndex);

    musicSelectorStore.selectMusic(randomIndex);
  };

  // 组件卸载时清理
  const cleanup = () => {
    stopAndUnload();
  };

  const getSound = () => {
    return sound;
  };

  return {
    // 状态
    isPlaying,
    isLoading,
    isMuted,
    volume,
    currentTime,
    duration,
    hasError,
    errorMessage,
    playMode,

    // 计算属性
    currentMusic,
    formattedCurrentTime,
    formattedDuration,

    // 方法
    play,
    pause,
    togglePlay,
    seekTo,
    seekToPercentage,
    setVolume,
    toggleMute,
    setPlayMode,
    playNext,
    playPrevious,
    playRandomTrack,
    cleanup,
    loadAndPlay,
    stopAndUnload,
    getSound,
  };
});