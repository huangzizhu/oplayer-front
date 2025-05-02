<template>
  <div class="music-visualization-container">
    <canvas ref="visualizerCanvas" class="visualizer-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useMusicPlayer } from '@/store/MusicPlayer';
import { Howler } from 'howler';

const visualizerCanvas = ref(null);
const musicPlayerStore = useMusicPlayer();

// 音频可视化相关变量
let audioContext = null;
let analyser = null;
let gainNode = null; // 添加增益节点作为中间连接
let animationFrame = null;
let canvasCtx = null;
let isActive = false;

// 可视化配置参数
const config = {
  lineColor: 'rgb(68, 170, 221)',
  gradientColors: ['rgba(68, 170, 221, 0.8)', 'rgba(255, 102, 171, 0.4)', 'rgba(0, 0, 0, 0)'],
  lineWidth: 2,
  smoothingTimeConstant: 0.85, // 增加平滑度
  fftSize: 1024,
};

// 初始化可视化器
const initVisualizer = () => {
  if (!visualizerCanvas.value) return;

  // 停止可能存在的之前的可视化
  stopVisualization();

  // 获取当前播放的Howl实例
  const sound = musicPlayerStore.getSound();
  if (!sound) return;

  try {
    // 使用Howler的音频上下文
    audioContext = Howler.ctx;

    // 创建分析器节点
    analyser = audioContext.createAnalyser();
    analyser.fftSize = config.fftSize;
    analyser.smoothingTimeConstant = config.smoothingTimeConstant;

    // 创建增益节点作为中间连接
    gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0; // 不改变音量

    // 重要：要让分析器节点可以捕获音频数据，需要插入到音频链路中
    // 1. 取消直接连接分析器（这是之前错误的原因）
    // 2. 改用正确的连接方式：masterGain -> gainNode -> analyser -> destination
    gainNode.connect(analyser);

    // 这一步是关键：从Howler获取当前的声音节点并连接到我们的增益节点
    // 注意：这需要修改MusicPlayer.js中的getSound方法来返回正确的节点
    const nodeToTap = Howler.masterGain;
    nodeToTap.connect(gainNode);
    analyser.connect(audioContext.destination);

    // 设置Canvas
    const canvas = visualizerCanvas.value;
    canvasCtx = canvas.getContext('2d');

    // 调整Canvas尺寸以匹配显示尺寸
    resizeCanvas();

    // 开始可视化
    isActive = true;
    drawWaveform();
  } catch (error) {
    console.error('初始化可视化器失败:', error);
    console.log('错误详情:', error.message);
  }
};

// 停止可视化
const stopVisualization = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  // 断开所有连接
  if (analyser) {
    try {
      analyser.disconnect();
    } catch (e) {
      // 忽略可能的断开错误
    }
    analyser = null;
  }

  if (gainNode) {
    try {
      gainNode.disconnect();
    } catch (e) {
      // 忽略可能的断开错误
    }
    gainNode = null;
  }

  isActive = false;
};

// 调整Canvas尺寸
const resizeCanvas = () => {
  if (!visualizerCanvas.value || !canvasCtx) return;

  const canvas = visualizerCanvas.value;
  const container = canvas.parentElement;

  // 设置Canvas尺寸为容器尺寸
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
};

// 绘制波形
const drawWaveform = () => {
  if (!isActive || !analyser || !canvasCtx) {
    animationFrame = null;
    return;
  }

  // 请求下一帧
  animationFrame = requestAnimationFrame(drawWaveform);

  // 获取频域数据 (使用频率数据而不是时域数据)
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray); // 修改为频率数据

  // 清除Canvas
  const width = visualizerCanvas.value.width;
  const height = visualizerCanvas.value.height;
  canvasCtx.clearRect(0, 0, width, height);

  // 创建渐变背景
  const gradient = canvasCtx.createLinearGradient(0, 0, 0, height);
  config.gradientColors.forEach((color, i) => {
    gradient.addColorStop(i / (config.gradientColors.length - 1), color);
  });

  // 设置波形样式
  canvasCtx.lineWidth = config.lineWidth;
  canvasCtx.strokeStyle = config.lineColor;
  canvasCtx.fillStyle = gradient;

  // 开始绘制路径
  canvasCtx.beginPath();

  // 计算每步的宽度
  const sliceWidth = width / bufferLength;

  // 从左侧开始
  let x = 0;

  // 先移动到第一个点 (对于频率数据，值范围是0-255)
  const firstValue = dataArray[0] / 255.0;
  const firstY = height - (firstValue * height);

  // 填充区域起点
  canvasCtx.moveTo(0, height);
  canvasCtx.lineTo(0, firstY);

  // 绘制波形路径
  for (let i = 1; i < bufferLength; i++) {
    const value = dataArray[i] / 255.0;
    const y = height - (value * height); // 映射到Canvas高度

    // 使用平滑的曲线
    if (i % 4 === 0) { // 每隔几个点使用曲线连接，减少计算量
      const prevX = x - sliceWidth * 3;
      const prevValue = dataArray[i - 3] / 255.0;
      const prevY = height - (prevValue * height);
      canvasCtx.bezierCurveTo(
        prevX + sliceWidth, prevY,
        x - sliceWidth, y,
        x, y
      );
    }

    x += sliceWidth;
  }

  // 完成填充区域
  canvasCtx.lineTo(width, height);
  canvasCtx.closePath();

  // 填充渐变色
  canvasCtx.fill();

  // 再次绘制波形线条，使其更明显
  canvasCtx.beginPath();
  x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const value = dataArray[i] / 255.0;
    const y = height - (value * height);

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else if (i % 4 === 0) { // 同样每隔几个点使用曲线
      const prevX = x - sliceWidth * 3;
      const prevValue = dataArray[i - 3] / 255.0;
      const prevY = height - (prevValue * height);
      canvasCtx.bezierCurveTo(
        prevX + sliceWidth, prevY,
        x - sliceWidth, y,
        x, y
      );
    }

    x += sliceWidth;
  }

  // 描边波形线
  canvasCtx.stroke();
};

// 监听播放状态变化 - 延迟初始化以确保Howler已准备好
watch(() => musicPlayerStore.isPlaying, (isPlaying) => {
  if (isPlaying) {
    // 延迟初始化可视化，确保Howler已完全设置
    setTimeout(() => {
      initVisualizer();
    }, 100);
  } else {
    stopVisualization();
  }
});

// 监听当前音乐变化
watch(() => musicPlayerStore.currentMusic, () => {
  // 当音乐变化时，延长等待时间
  setTimeout(() => {
    if (musicPlayerStore.isPlaying) {
      initVisualizer();
    }
  }, 500); // 增加延时，确保音频已完全加载
});

// 组件挂载
onMounted(() => {
  // 如果已经在播放，延迟初始化可视化
  setTimeout(() => {
    if (musicPlayerStore.isPlaying) {
      initVisualizer();
    }
  }, 300);

  // 添加窗口大小变化监听
  window.addEventListener('resize', resizeCanvas);
});

// 组件卸载
onUnmounted(() => {
  // 停止可视化并清理资源
  stopVisualization();

  // 移除事件监听
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<style lang="less" scoped>
.music-visualization-container {
  position: absolute;
  bottom: 100px;
  left: 0;
  width: 100%;
  height: 100px;
  overflow: hidden;
  pointer-events: none;
  z-index: 50;

  .visualizer-canvas {
    width: 100%;
    height: 100%;
    opacity: 0.8; // 稍微提高不透明度
    filter: drop-shadow(0 0 5px rgba(68, 170, 221, 0.7));
  }
}
</style>