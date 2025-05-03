import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useMusicSelector } from "./MusicSelector";
import { useMusicLibrary } from "./MusicLibrary";
import { Howl } from "howler";

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

  // 加载并播放当前选中的音乐
  const loadAndPlay = () => {
    if (!audioPath.value) {
      hasError.value = true;
      errorMessage.value = "无效的音频路径";
      return;
    }

    // 停止当前播放的音频
    stopAndUnload();

    // 设置加载状态
    isLoading.value = true;
    hasError.value = false;

    try {
      // 创建新的Howl实例
      sound = new Howl({
        src: [audioPath.value],
        html5: false, // 使用HTML5 Audio
        volume: volume.value,
        onload: () => {
          duration.value = sound.duration();
          isLoading.value = false;

          // 自动播放
          play();
        },
        onplay: () => {
          isPlaying.value = true;

          // 设置定时器更新当前时间
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
        onloaderror: () => {
          isLoading.value = false;
          hasError.value = true;
          errorMessage.value = "加载音频失败";
        },
        onplayerror: () => {
          isPlaying.value = false;
          hasError.value = true;
          errorMessage.value = "播放音频失败";

          // 尝试重新加载
          setTimeout(() => {
            loadAndPlay();
          }, 1500);
        }
      });
    } catch (error) {
      isLoading.value = false;
      hasError.value = true;
      errorMessage.value = `播放器错误: ${error.message}`;
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

  // 停止并卸载当前音频
  const stopAndUnload = () => {
    stopTimeUpdate();

    if (sound) {
      sound.stop();
      sound.unload();
      sound = null;
    }

    currentTime.value = 0;
    duration.value = 0;
    isPlaying.value = false;
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