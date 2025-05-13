<template>
  <div class="card-wrap"
       @mouseenter="handleMouseEnter"
       @mouseleave="handleMouseLeave"
       ref="card">
    <div class="card" :style="cardStyle">
      <!-- 改用 img 标签 -->
      <img
          class="card-bg"
          :src="image"
          @error="handleImageError"
          alt="cover"
      />
      <div class="card-info">
        <h1 class="title">{{ title }}</h1>
        <p class="content">{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed } from 'vue';
import {useUserStore} from "@/store/User";

const props = defineProps({
  image: String,
  title: String,
  content: String
});

const isHovering = ref(false);

const emit = defineEmits(['image-error']); // 定义事件

const cardStyle = computed(() => ({
  transform: isHovering.value ? 'translateY(-10px) rotateX(10deg)' : 'translateY(0) rotateX(0)',
  transition: isHovering.value ? 'transform 0.3s ease-out' : 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
}));

const handleMouseEnter = () => (isHovering.value = true);
const handleMouseLeave = () => (isHovering.value = false);

// 图片加载失败处理
const handleImageError = (e) => {
  e.target.src = useUserStore().defaultCoverUrl; // 默认图片
  emit('image-error', e); // 向上传递错误事件
};
</script>

<style scoped>
.card-wrap {
  width: 100%;
  aspect-ratio: 3/4;
  perspective: 1000px;
  cursor: pointer;
}

.card {
  width: 100%;
  height: 100%;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transform-origin: center bottom;
  will-change: transform;
  position: relative;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.card:hover .card-bg {
  opacity: 1;
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  color: white;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  transform: translateY(20px);
  transition: transform 0.3s ease;
}
.title{
  font-size: 1.2em;
  font-weight: bold;
  margin: 0;
  color: #fff;
}
.content{
  font-size: 0.9em;
  margin: 0;
  color: #fff;
}
.title, .content {
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  width: 100%; /* 确保元素宽度填满容器 */
  display: block; /* 确保元素是块级元素 */
  margin: 0; /* 移除默认外边距 */
}
</style>