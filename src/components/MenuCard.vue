<template>
  <div class="menu-card" :class="[`card-${item.position}`]"
    :style="{ background: item.backgroundColor || 'rgba(255, 255, 255, 1)' }"
    @mouseenter="$emit('mouseenter', $event)" @mouseleave="$emit('mouseleave', $event)" @click="$emit('click', $event)">
    <div class="menu-card-icon">
      <img :src="iconSrc" :alt="item.label" />
    </div>
    <div class="menu-card-label">{{ item.label }}</div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
// import logo from '@/assets/images/logo.svg';
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

// 从assets目录引入图标
const iconSrc = computed(() => {
  // try {
  //   return new URL(`/images/${props.item.icon}.svg`, import.meta.url).href;
  // } catch (e) {
  //   console.warn(`Icon ${props.item.icon} not found, using default icon`);
  //   return new URL('/images/logo.svg', import.meta.url).href;
  // }
  return `/images/${props.item.icon}.svg`;
  // return 
});

defineEmits(['mouseenter', 'mouseleave', 'click']);
</script>

<style scoped>
.menu-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 180px;
  background: rgba(255, 255, 255, 0.1);
  /* margin: 0 10px; */
  /* padding: 10px; */
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  margin: 0 -10px;
}

.card-left {
  clip-path: polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%);
  transform-origin: right center;
}

.card-right {
  /* clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 100%, 10px 100%); */
  clip-path: polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%);
  transform-origin: left center;
}

.menu-card:hover {
  background: rgba(255, 255, 255, 0.2);
}

.menu-card-icon {
  height: 32px;
  width: 32px;
  margin-bottom: 8px;
  transition: transform 0.2s;
}

.menu-card-icon img {
  height: 100%;
  width: 100%;
  filter: brightness(0) invert(1);
  /* 使图标变成白色 */
  object-fit: contain;
}

.menu-card-label {
  font-size: 14px;
  color: white;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 添加微小的立体感和发光效果 */
.menu-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  /* background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent); */
}

.menu-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10px;
  right: 10px;
  height: 1px;
  background: rgba(0, 0, 0, 0.3);
}
</style>