<template>
  <div class="music-visualization-container">
    <canvas ref="visualizerCanvas" class="visualizer-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, defineExpose } from 'vue';
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

// 创建全局连接注册表，确保在组件重新挂载时不会丢失连接信息
if (!window._audioSystem) {
  window._audioSystem = {
    sourceRegistry: new WeakMap(),
    activeAnalysers: new Set(),
    isHowlerConnected: false,
    connectCount: 0 // 追踪连接次数以便调试
  };
}

// --- 可视化配置 ---
const config = {
  lineColor: 'rgb(68, 170, 221)',  // 线条颜色
  gradientColors: ['rgba(68, 170, 221, 0.6)', 'rgba(255, 102, 171, 0.3)', 'rgba(0, 0, 0, 0)'],  // 渐变色
  lineWidth: 2,  // 线条宽度
  fftSize: 32768,  // 减小FFT大小以提高性能
  smoothingTimeConstant: 0.70,  // 平滑系数 (0-1)
  barSpacing: 0.1,  // 柱形间距占柱宽的比例 (0表示无间距)
  barScaleFactor: 0.90,  // 柱形高度缩放系数 (降低值以减少过高柱形)
  minHeight: 2,  // 最小高度（像素）
  barCount: 256,  // 渲染的柱形数量 (降低以提高性能)

  // 频率响应曲线系数
  frequencyRange: 0.9,  // 使用频谱数据的90%（覆盖大部分可听频率）
  freqScaleFactor: 0.95,  // 频率压缩系数: 1=完全对数分布，0=线性分布
  useLogFrequency: true,  // 启用对数频率映射
  minFreq: 1,    // 最低频率 Hz
  maxFreq: 20000, // 最高频率 Hz

  // 频率响应曲线
  freqResponseCurve: [
    { freq: 0.0, gain: 1.0 },  // 极低频（20-100Hz）
    { freq: 0.0001, gain: 1.02 },
    { freq: 0.001, gain: 1.0 },
    { freq: 0.005, gain: 1.20 },
    { freq: 0.01, gain: 1.20 },
    { freq: 0.05, gain: 1.20 },
    { freq: 0.1, gain: 1.20 },  // 低频（100-500Hz）
    { freq: 0.125, gain: 1.3 },
    { freq: 0.15, gain: 1.5 },
    { freq: 0.2, gain: 1.5 },  // 中低频（200-500Hz）
    { freq: 0.3, gain: 1.55 },  // 中频（500-2000Hz）
    { freq: 0.6, gain: 1.6 },  // 中高频（2-8kHz）
    { freq: 0.8, gain: 1.7 }, // 高频（8-14kHz）
    { freq: 1.0, gain: 1.7 },  // 极高频（14-20kHz）
  ],
  // 动态效果增强参数
  dynamicRange: 3.5,         // 动态范围增强因子 (越大对比越强)
  dynamicThreshold: 40,      // 动态阈值 (低于此值的信号会被进一步压低)
  lowGainFactor: 1.0,        // 低频信号增益因子 (低于阈值的信号会乘以此因子)
  highGainFactor: 1.0,       // 高频信号增益因子 (高于阈值的信号会乘以此因子)
  normalizeOutput: false,     // 是否归一化输出 (确保有柱形达到最大高度)

  visualizationMode: 'bars', // 'bars'或'curve'
};
const setVisualizationMode = (mode) => {
  if (!['bars', 'curve'].includes(mode)) return;

  // 如果当前正在绘制，需要先停止
  const wasActive = isActive;
  if (isActive) {
    stopDrawing();
  }

  // 更改模式
  config.visualizationMode = mode;
  console.log(`可视化模式已切换为: ${mode}`);

  // 如果之前是激活状态，重新开始绘制
  if (wasActive) {
    startDrawing();
  }
};

// 暴露方法
defineExpose({
  setVisualizationMode
});

// --- 初始化可视化器 ---
const initializeVisualizer = () => {
  if (isInitialized || !visualizerCanvas.value) return;

  try {
    console.log('初始化可视化器开始...');
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

    // 跟踪分析器
    window._audioSystem.activeAnalysers.add(analyser);

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // 获取当前播放实例
    const currentSound = musicPlayerStore.getSound();
    console.log('当前音频实例:', currentSound ? '有效' : '无效',
      currentSound?._html5 ? '(HTML5模式)' : '',
      currentSound?._sounds?.[0]?._node ? '音频节点有效' : '音频节点无效');

    // 尝试连接到合适的音频源
    if (Howler.masterGain) {
      let connected = false;

      // === HTML5 模式处理 ===
      if (currentSound && currentSound._html5 && currentSound._sounds && currentSound._sounds.length > 0) {
        try {
          // 获取HTML5音频元素
          const audioNode = currentSound._sounds[0]?._node;
          const soundId = currentSound._sounds[0]?._id || 'unknown';

          if (audioNode) {
            console.log(`找到HTML5音频节点 [ID: ${soundId}]`);

            // 检查是否已经建立过连接
            if (window._audioSystem.sourceRegistry.has(audioNode)) {
              console.log(`从注册表找到已存在的音频连接 [ID: ${soundId}]`);

              // 获取已存在的源节点
              const existingSource = window._audioSystem.sourceRegistry.get(audioNode);

              try {
                // 断开所有现有连接并重建唯一路径
                console.log(`重建音频连接路径 [ID: ${soundId}]...`);
                existingSource.disconnect();
                existingSource.connect(analyser);
                analyser.connect(audioContext.destination);

                connected = true;
                console.log(`音频连接路径重建成功 [ID: ${soundId}]`);
              } catch (e) {
                console.warn(`重建音频连接失败 [ID: ${soundId}]:`, e);
              }
            } else {
              // 尝试创建全新连接
              console.log(`为HTML5音频节点创建新连接 [ID: ${soundId}]...`);

              try {
                // 尝试创建媒体源节点
                const source = audioContext.createMediaElementSource(audioNode);
                source.connect(analyser);
                analyser.connect(audioContext.destination);

                // 存储到全局注册表
                window._audioSystem.sourceRegistry.set(audioNode, source);

                connected = true;
                console.log(`创建新HTML5音频连接成功 [ID: ${soundId}]`);
              } catch (e) {
                if (e.name === 'InvalidStateError') {
                  console.warn(`音频节点已被连接到其他地方 [ID: ${soundId}], 将使用备选方案`);

                  // 当无法创建新连接时，使用Howler主增益作为备选
                  try {
                    console.log(`尝试使用Howler主增益作为备选 [ID: ${soundId}]...`);
                    // 重置并使用Howler主增益
                    Howler.masterGain.disconnect();
                    Howler.masterGain.connect(analyser);
                    analyser.connect(audioContext.destination);
                    window._audioSystem.isHowlerConnected = true;

                    connected = true;
                    console.log(`使用Howler主增益作为备选成功 [ID: ${soundId}]`);
                  } catch (innerE) {
                    console.error(`连接备选音频源失败 [ID: ${soundId}]:`, innerE);
                  }
                } else {
                  console.error(`创建HTML5媒体源失败 [ID: ${soundId}]:`, e);
                }
              }
            }
          } else {
            console.warn('HTML5模式但找不到有效的音频节点');
          }
        } catch (e) {
          console.error('连接HTML5音频元素失败:', e);
        }
      }

      // === 非HTML5模式或HTML5连接失败时，使用Howler主增益节点 ===
      if (!connected) {
        console.log('使用Howler主增益节点进行连接...');
        try {
          // 重置所有Howler主增益节点连接，确保干净的音频路径
          Howler.masterGain.disconnect();

          // 建立唯一的连接路径
          Howler.masterGain.connect(analyser);
          analyser.connect(audioContext.destination);
          window._audioSystem.isHowlerConnected = true;

          connected = true;
          console.log('Howler主增益节点连接成功');
        } catch (e) {
          console.error('连接Howler主增益节点失败:', e);
        }
      }

      if (!connected) {
        console.error('所有音频连接方法均失败，可视化将不可用');
        return;
      }
    } else {
      console.warn('Howler.masterGain未找到，可能影响频谱可视化');
      return;
    }

    // 设置Canvas上下文
    const canvas = visualizerCanvas.value;
    canvasCtx = canvas.getContext('2d');

    isInitialized = true;
    console.log('频谱可视化器初始化完成');

    // 如果当前正在播放音乐，立即开始绘制
    if (musicPlayerStore.isPlaying) {
      startDrawing();
    }
  } catch (error) {
    console.error('初始化频谱可视化器失败:', error);
    cleanupVisualizer();
  }
};

const cleanupVisualizer = () => {
  console.log('彻底清理可视化资源...');
  stopDrawing();

  if (analyser) {
    try {
      // 从全局跟踪中移除当前分析器
      window._audioSystem.activeAnalysers.delete(analyser);

      // 断开分析器的所有连接
      analyser.disconnect();
      console.log('已断开分析器连接');

      // 如果是HTML5模式，需要重新构建直接连接
      const currentSound = musicPlayerStore.getSound();
      if (currentSound && currentSound._html5 && currentSound._sounds && currentSound._sounds.length > 0) {
        const audioNode = currentSound._sounds[0]?._node;
        if (audioNode && window._audioSystem.sourceRegistry.has(audioNode)) {
          const source = window._audioSystem.sourceRegistry.get(audioNode);

          // 彻底重置连接
          try {
            source.disconnect(); // 先断开所有连接
            source.connect(audioContext.destination); // 然后只建立到输出的直接连接
            console.log('已重置音频节点连接');
          } catch (e) {
            console.warn('重置直接连接失败:', e);
          }
        }
      }
      // 重置Howler的主增益连接
      else if (Howler.masterGain) {
        try {
          // 彻底重置Howler连接
          Howler.masterGain.disconnect();
          Howler.masterGain.connect(audioContext.destination);
          window._audioSystem.isHowlerConnected = false;
          console.log('已重置Howler主增益连接');
        } catch (e) {
          console.warn('重置Howler连接失败:', e);
        }
      }
    } catch (e) {
      console.warn('清理分析器连接失败:', e);
    }
  }

  // 重置变量但保留全局连接注册表
  analyser = null;
  audioContext = null;
  canvasCtx = null;
  dataArray = null;
  bufferLength = 0;
  isInitialized = false;
  isActive = false;
  console.log('可视化器已彻底清理，音频连接已重置');
};

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
  console.log(`开始频谱绘制 (模式: ${config.visualizationMode})`);

  // 根据可视化模式选择绘制函数
  if (config.visualizationMode === 'curve') {
    requestAnimationFrame(drawSpectrumCurve);
  } else {
    requestAnimationFrame(drawSpectrum);
  }
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

// --- 生命周期钩子 ---
onMounted(async () => {
  window.addEventListener('resize', handleResize);

  await nextTick();
  resizeCanvas();
  initializeVisualizer();
});

onUnmounted(() => {
  // 彻底清理可视化资源
  cleanupVisualizer();
  window.removeEventListener('resize', handleResize);
  handleResize.cancel?.();

  // 额外的保护措施：确保音频质量
  try {
    // 重建有效的Howler连接
    if (Howler.ctx && Howler.masterGain) {
      Howler.masterGain.disconnect();
      Howler.masterGain.connect(Howler.ctx.destination);
      console.log('组件卸载时已重置Howler音频连接');
    }
  } catch (e) {
    console.warn('卸载时重置音频连接失败', e);
  }
});
// --- 监听播放状态变化 ---
watch(() => musicPlayerStore.isPlaying, (newIsPlaying) => {
  if (!isInitialized && newIsPlaying) {
    initializeVisualizer();
    return;
  }

  if (isInitialized) {
    newIsPlaying ? startDrawing() : stopDrawing();
  }
});
// 生成对数分布的频率边界
const generateLogFrequencyBands = (minFreq, maxFreq, bandCount) => {
  const logMin = Math.log10(minFreq);
  const logMax = Math.log10(maxFreq);
  const bands = [];

  for (let i = 0; i <= bandCount; i++) {
    // 计算归一化索引 [0,1]
    const t = i / bandCount;

    // 混合线性和对数映射
    // freqScaleFactor=1 时为完全对数分布
    // freqScaleFactor=0 时为完全线性分布
    let freq;
    if (config.useLogFrequency) {
      const logFreq = Math.pow(10, logMin + t * (logMax - logMin));
      const linearFreq = minFreq + t * (maxFreq - minFreq);

      // 使用缩放因子混合对数和线性分布
      freq = linearFreq * (1 - config.freqScaleFactor) + logFreq * config.freqScaleFactor;
    } else {
      // 线性分布
      freq = minFreq + t * (maxFreq - minFreq);
    }

    bands.push(freq);
  }

  return bands;
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

  // 计算奈奎斯特频率（采样率的一半，即频谱最高频率）
  const nyquistFreq = audioContext.sampleRate / 2;

  // 计算柱形参数
  const barCount = config.barCount;
  const barWidth = width / barCount;
  const bands = generateLogFrequencyBands(config.minFreq, config.maxFreq, barCount);
  const gap = barWidth * config.barSpacing;
  const actualBarWidth = barWidth - gap;

  // 提前计算所有柱形的值，用于可能的归一化处理
  const barValues = [];

  // 第一次循环：计算每个柱形的原始值
  for (let i = 0; i < barCount; i++) {
    // 获取当前柱形对应的频率下边界和上边界
    const lowerFreq = bands[i];
    const upperFreq = i < barCount - 1 ? bands[i + 1] : config.maxFreq;

    // 将频率转换为频谱数据索引
    const lowerIndex = Math.floor((lowerFreq / nyquistFreq) * bufferLength);
    const upperIndex = Math.min(
      bufferLength - 1,
      Math.ceil((upperFreq / nyquistFreq) * bufferLength)
    );

    // 计算当前频段的平均能量
    let sum = 0;

    for (let j = lowerIndex; j <= upperIndex; j++) {
      sum += dataArray[j] * (j - lowerIndex + 1); // 线性加权
    }
    let value = sum / ((upperIndex - lowerIndex + 1) * (upperIndex - lowerIndex + 2) / 2);

    // 应用频响增益
    const freqPercent = (lowerFreq + upperFreq) / (2 * nyquistFreq);
    const gain = getFrequencyResponseGain(freqPercent * config.frequencyRange);
    value = Math.min(255, value * gain);

    // 应用动态范围增强 - 对比度增强处理
    // 使用幂函数放大差异
    value = Math.pow(value / 255, config.dynamicRange) * 255;

    // 高低频增益分离处理，增强动态范围
    if (value < config.dynamicThreshold) {
      // 低值进一步压低
      value = value * config.lowGainFactor;
    } else {
      // 高值进一步增强
      const boost = config.highGainFactor;
      value = Math.min(255, value * boost);
    }

    barValues.push(value);
  }

  // 如果需要归一化，找到最高柱形并归一化
  if (config.normalizeOutput) {
    const maxValue = Math.max(...barValues, 1); // 避免除以零
    if (maxValue > 0) {
      const scaleFactor = 255 / maxValue;
      barValues.forEach((_, idx) => {
        barValues[idx] = barValues[idx] * scaleFactor;
      });
    }
  }

  // 第二次循环：绘制柱形
  for (let i = 0; i < barCount; i++) {
    const value = barValues[i];

    // 计算柱高 - 确保最小高度
    const barHeight = Math.max(config.minHeight, (value / 255) * height * config.barScaleFactor);

    // 计算柱形位置
    const x = i * barWidth;
    const y = height - barHeight;

    // 绘制矩形柱形
    canvasCtx.fillRect(x + gap / 2, y, actualBarWidth, barHeight);

    // 为柱形添加顶部描边
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

// --- 绘制频谱曲线 ---
const drawSpectrumCurve = () => {
  if (!isActive || !analyser || !canvasCtx || !dataArray) {
    animationFrameId = null;
    return;
  }

  // 请求下一帧 - 确保始终请求自身
  animationFrameId = requestAnimationFrame(drawSpectrumCurve);

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

  // 计算奈奎斯特频率（采样率的一半，即频谱最高频率）
  const nyquistFreq = audioContext.sampleRate / 2;

  // 计算参数
  const barCount = config.barCount;
  const bands = generateLogFrequencyBands(config.minFreq, config.maxFreq, barCount);

  // 提前计算所有点的值，用于可能的归一化处理和曲线绘制
  const points = [];

  // 第一次循环：计算每个点的原始值和位置
  for (let i = 0; i < barCount; i++) {
    // 获取当前柱形对应的频率下边界和上边界
    const lowerFreq = bands[i];
    const upperFreq = i < barCount - 1 ? bands[i + 1] : config.maxFreq;

    // 将频率转换为频谱数据索引
    const lowerIndex = Math.floor((lowerFreq / nyquistFreq) * bufferLength);
    const upperIndex = Math.min(
      bufferLength - 1,
      Math.ceil((upperFreq / nyquistFreq) * bufferLength)
    );

    // 计算当前频段的平均能量
    let sum = 0;
    for (let j = lowerIndex; j <= upperIndex; j++) {
      sum += dataArray[j] * (j - lowerIndex + 1); // 线性加权
    }
    let value = sum / ((upperIndex - lowerIndex + 1) * (upperIndex - lowerIndex + 2) / 2);

    // 应用频响增益
    const freqPercent = (lowerFreq + upperFreq) / (2 * nyquistFreq);
    const gain = getFrequencyResponseGain(freqPercent * config.frequencyRange);
    value = Math.min(255, value * gain);

    // 应用动态范围增强 - 对比度增强处理
    value = Math.pow(value / 255, config.dynamicRange) * 255;

    // 高低频增益分离处理
    if (value < config.dynamicThreshold) {
      value = value * config.lowGainFactor;
    } else {
      const boost = config.highGainFactor;
      value = Math.min(255, value * boost);
    }

    // 计算x坐标和y坐标
    const x = (i / (barCount - 1)) * width;
    const y = height - Math.max(config.minHeight, (value / 255) * height * config.barScaleFactor);

    points.push({ x, y, value });
  }

  // 如果需要归一化，调整所有点的y坐标
  if (config.normalizeOutput) {
    const maxValue = Math.max(...points.map(p => p.value), 1);
    if (maxValue > 0) {
      const scaleFactor = 255 / maxValue;
      points.forEach(point => {
        point.y = height - Math.max(config.minHeight, (point.value * scaleFactor / 255) * height * config.barScaleFactor);
      });
    }
  }

  // 创建填充渐变
  const grad = canvasCtx.createLinearGradient(0, 0, 0, height);
  config.gradientColors.forEach((color, i) => {
    grad.addColorStop(i / (config.gradientColors.length - 1), color);
  });
  canvasCtx.fillStyle = grad;

  // 设置曲线样式
  canvasCtx.strokeStyle = config.lineColor;
  canvasCtx.lineWidth = config.lineWidth;
  canvasCtx.lineJoin = 'round';

  // 开始绘制路径
  canvasCtx.beginPath();

  // 移动到第一个点
  canvasCtx.moveTo(points[0].x, points[0].y);

  // 使用三次贝塞尔曲线连接点
  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];

    // 计算控制点 - 默认平滑度0.5
    const smoothing = config.curveSmoothing !== undefined ? config.curveSmoothing : 0.5;
    const cpX1 = currentPoint.x + (nextPoint.x - currentPoint.x) * smoothing;
    const cpX2 = nextPoint.x - (nextPoint.x - currentPoint.x) * smoothing;

    canvasCtx.bezierCurveTo(
      cpX1, currentPoint.y,
      cpX2, nextPoint.y,
      nextPoint.x, nextPoint.y
    );
  }

  // 闭合路径并填充
  canvasCtx.lineTo(points[points.length - 1].x, height);
  canvasCtx.lineTo(points[0].x, height);
  canvasCtx.closePath();
  canvasCtx.fill();

  // 再次绘制曲线以显示边框
  canvasCtx.beginPath();
  canvasCtx.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];

    const smoothing = config.curveSmoothing !== undefined ? config.curveSmoothing : 0.5;
    const cpX1 = currentPoint.x + (nextPoint.x - currentPoint.x) * smoothing;
    const cpX2 = nextPoint.x - (nextPoint.x - currentPoint.x) * smoothing;

    canvasCtx.bezierCurveTo(
      cpX1, currentPoint.y,
      cpX2, nextPoint.y,
      nextPoint.x, nextPoint.y
    );
  }

  canvasCtx.stroke();
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


</script>

<style lang="less" scoped>
.music-visualization-container {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  width: 100vw;
  height: 90px;
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