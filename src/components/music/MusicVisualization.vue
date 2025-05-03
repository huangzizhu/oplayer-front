<template>
  <div class="music-visualization-container">
    <canvas ref="visualizerCanvas" class="visualizer-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useMusicPlayer } from '@/store/MusicPlayer';
import { Howler } from 'howler';
import { debounce } from 'lodash-es';

const visualizerCanvas = ref(null);
const musicPlayerStore = useMusicPlayer();

// --- 音频可视化状态变量 ---
let audioContext = null;
let analyser = null;
let animationFrameId = null;
let canvasCtx = null;
let dataArray = null;
let bufferLength = 0;
let isInitialized = false;
let isActive = false;

// --- 可视化配置 ---
const config = {
  lineColor: 'rgb(68, 170, 221)',  // 线条颜色
  gradientColors: ['rgba(68, 170, 221, 0.6)', 'rgba(255, 102, 171, 0.3)', 'rgba(0, 0, 0, 0)'],  // 渐变色
  lineWidth: 2,  // 线条宽度
  fftSize: 256,  // 减小FFT大小以提高性能
  smoothingTimeConstant: 0.7,  // 平滑系数 (0-1)
  barSpacing: 0.0,  // 柱形间距占柱宽的比例 (0表示无间距)
  curveTension: 0.6,  // 曲线张力系数 (0-1，越大曲线越圆滑)
  barScaleFactor: 1,  // 柱形高度缩放系数 (降低值以减少过高柱形)
  minHeight: 2,  // 最小高度（像素）
  barCount: 256,  // 渲染的柱形数量 (降低以提高性能)
  // 频率响应曲线系数
  freqResponseCurve: [
    { freq: 0.0, gain: 1 },  // 最低频
    { freq: 0.2, gain: 1 },  // 低频
    { freq: 0.4, gain: 1 },  // 中低频
    { freq: 0.6, gain: 1 },  // 中高频
    { freq: 0.8, gain: 1.2 },  // 高频
    { freq: 1.0, gain: 1.5 },  // 最高频
  ],
  frequencyRange: 0.85,  // 只使用0-85%的频谱数据
};

// --- 初始化可视化器 ---
const initializeVisualizer = () => {
  if (isInitialized || !visualizerCanvas.value) return;

  try {
    // 使用Howler的全局AudioContext
    audioContext = Howler.ctx;
    if (!audioContext) {
      console.warn('无法获取Howler的AudioContext');
      return;
    }

    // 创建分析器节点
    analyser = audioContext.createAnalyser();
    analyser.fftSize = config.fftSize;
    analyser.smoothingTimeConstant = config.smoothingTimeConstant;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // 连接到Howler的主增益节点
    if (Howler.masterGain) {
      Howler.masterGain.connect(analyser);
    } else {
      console.warn('Howler.masterGain未找到，可能影响频谱可视化');
      return;
    }

    // 设置Canvas上下文
    const canvas = visualizerCanvas.value;
    canvasCtx = canvas.getContext('2d');

    isInitialized = true;
    console.log('频谱可视化器已初始化');

    // 如果当前正在播放音乐，立即开始绘制
    if (musicPlayerStore.isPlaying) {
      startDrawing();
    }
  } catch (error) {
    console.error('初始化频谱可视化器失败:', error);
    cleanupVisualizer();
  }
};

// --- 清理可视化器资源 ---
const cleanupVisualizer = () => {
  stopDrawing();

  // 断开节点连接
  if (analyser && Howler.masterGain) {
    try {
      Howler.masterGain.disconnect(analyser);
    } catch (e) {
      // 忽略可能的断开错误
    }
  }

  // 重置变量
  analyser = null;
  audioContext = null;
  canvasCtx = null;
  dataArray = null;
  bufferLength = 0;
  isInitialized = false;
  isActive = false;
  console.log('频谱可视化器已清理');
};

// --- 开始绘制 ---
const startDrawing = async () => {
  if (!isInitialized || isActive || !analyser) return;

  // 尝试恢复可能被暂停的AudioContext
  if (audioContext && audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch (e) {
      console.error('恢复AudioContext失败:', e);
    }
  }

  isActive = true;
  console.log('开始频谱绘制');
  requestAnimationFrame(drawSpectrum);
};

// --- 停止绘制 ---
const stopDrawing = () => {
  if (!isActive) return;

  isActive = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  // 清空画布
  if (canvasCtx && visualizerCanvas.value) {
    canvasCtx.clearRect(0, 0, visualizerCanvas.value.width, visualizerCanvas.value.height);
  }

  console.log('停止频谱绘制');
};

// --- 计算频率响应增益 ---
const getFrequencyResponseGain = (percent) => {
  const curve = config.freqResponseCurve;

  // 如果百分比正好匹配某个点，直接返回该点的增益
  for (const point of curve) {
    if (Math.abs(point.freq - percent) < 0.001) {
      return point.gain;
    }
  }

  // 否则进行线性插值
  let lowerPoint = curve[0];
  let upperPoint = curve[curve.length - 1];

  // 找到包含该百分比的区间
  for (let i = 0; i < curve.length - 1; i++) {
    if (curve[i].freq <= percent && curve[i + 1].freq >= percent) {
      lowerPoint = curve[i];
      upperPoint = curve[i + 1];
      break;
    }
  }

  // 线性插值计算增益
  const freqRange = upperPoint.freq - lowerPoint.freq;
  if (freqRange === 0) return lowerPoint.gain;

  const position = (percent - lowerPoint.freq) / freqRange;
  return lowerPoint.gain + position * (upperPoint.gain - lowerPoint.gain);
};

// --- 绘制频谱图 ---
const drawSpectrum = () => {
  if (!isActive || !analyser || !canvasCtx || !dataArray) {
    animationFrameId = null;
    return;
  }
  // 请求下一帧
  animationFrameId = requestAnimationFrame(drawSpectrum);

  analyser.getByteFrequencyData(dataArray);

  const canvas = visualizerCanvas.value;
  const width = canvas.width;
  const height = canvas.height;

  // 同步 canvas 尺寸
  if (canvas.clientWidth > 0 &&
    (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight)) {
    resizeCanvas();
    return;
  }

  canvasCtx.clearRect(0, 0, width, height);

  // 创建渐变
  const grad = canvasCtx.createLinearGradient(0, 0, 0, height);
  config.gradientColors.forEach((c, i) => {
    grad.addColorStop(i / (config.gradientColors.length - 1), c);
  });
  canvasCtx.fillStyle = grad;

  // 计算柱形参数
  const N = config.barCount;
  const barWidth = width / N;
  const gap = barWidth * config.barSpacing;
  const actualBarWidth = barWidth - gap;

  // 绘制频谱柱形
  for (let i = 0; i < N; i++) {
    // 频率百分比
    const percent = (i / (N - 1)) * config.frequencyRange;
    const freqPercent = percent; // 低频左，高频右

    // 映射到 dataArray
    const idx = Math.min(bufferLength - 1, Math.floor(freqPercent * bufferLength));
    let v = dataArray[idx];

    // 应用频响增益
    const gain = getFrequencyResponseGain(freqPercent);
    v = Math.min(255, v * gain);

    // 动态压缩
    if (v > 210) v = 210 + (v - 210) * 0.5;

    // 计算柱高
    const barHeight = Math.max(config.minHeight, (v / 255) * height * config.barScaleFactor);

    // 计算柱形位置
    const x = i * barWidth;
    const y = height - barHeight;

    // 绘制矩形柱形
    canvasCtx.fillRect(x + gap / 2, y, actualBarWidth, barHeight);

    // 为柱形添加顶部描边 (可选)
    if (config.lineWidth > 0) {
      canvasCtx.strokeStyle = config.lineColor;
      canvasCtx.lineWidth = config.lineWidth;
      canvasCtx.beginPath();
      canvasCtx.moveTo(x + gap / 2, y);
      canvasCtx.lineTo(x + gap / 2 + actualBarWidth, y);
      canvasCtx.stroke();
    }
  }
};
// --- 调整Canvas尺寸 ---
const resizeCanvas = () => {
  if (!visualizerCanvas.value) return;

  const canvas = visualizerCanvas.value;
  const container = canvas.parentElement;
  if (!container) return;

  // 获取实际显示尺寸
  const rect = container.getBoundingClientRect();
  const newWidth = Math.floor(rect.width);
  const newHeight = container.clientHeight;

  // 设置Canvas尺寸
  if (canvas.width !== newWidth || canvas.height !== newHeight) {
    canvas.width = newWidth;
    canvas.height = newHeight;
    console.log(`画布已调整为: ${newWidth}x${newHeight}`);
  }
};

// --- 使用防抖处理窗口大小变化 ---
const handleResize = debounce(resizeCanvas, 150);

// --- 生命周期钩子 ---
onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    resizeCanvas();
    initializeVisualizer();
  }, 150);

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cleanupVisualizer();
  window.removeEventListener('resize', handleResize);
  handleResize.cancel?.();
});

// --- 监听播放状态变化 ---
watch(() => musicPlayerStore.isPlaying, (newIsPlaying) => {
  if (!isInitialized && newIsPlaying) {
    initializeVisualizer();
  }

  if (isInitialized) {
    newIsPlaying ? startDrawing() : stopDrawing();
  }
});
</script>

<style lang="less" scoped>
.music-visualization-container {
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  width: 100vw;
  height: 80px;
  overflow: hidden;
  pointer-events: none;
  z-index: 50;

  .visualizer-canvas {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0.75;
    filter: drop-shadow(0 0 6px rgba(68, 170, 221, 0.4));
  }
}
</style>