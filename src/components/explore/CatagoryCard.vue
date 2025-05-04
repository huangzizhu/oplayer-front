<template>
  <div class="card-wrap"
       @mousemove="handleMouseMove"
       @mouseenter="handleMouseEnter"
       @mouseleave="handleMouseLeave"
       ref="card">
    <div
        class="card"
        :class="{ selected: isSelected }"
        :style="cardStyle">
      <div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>
      <div class="card-info">
        <h1>{{ title }}</h1>
        <p>{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  image: String,
  title: String,
  content: String
});

const card = ref(null);
const width = ref(0);
const height = ref(0);
const mouseX = ref(0);
const mouseY = ref(0);
const mouseLeaveDelay = ref(null);

onMounted(() => {
  width.value = card.value.offsetWidth;
  height.value = card.value.offsetHeight;
});

const mousePX = computed(() => mouseX.value / width.value);
const mousePY = computed(() => mouseY.value / height.value);

const cardStyle = computed(() => {
  const rX = mousePX.value * 30;
  const rY = mousePY.value * -30;
  return {
    transform: `rotateY(${rX}deg) rotateX(${rY}deg)`
  };
});

const cardBgTransform = computed(() => {
  const tX = mousePX.value * -40;
  const tY = mousePY.value * -40;
  return {
    transform: `translateX(${tX}px) translateY(${tY}px)`
  };
});

const cardBgImage = computed(() => ({
  backgroundImage: `url(${props.image})`
}));

const isSelected = ref(false);

const handleMouseMove = (e) => {
  mouseX.value = e.pageX - card.value.offsetLeft - width.value/2;
  mouseY.value = e.pageY - card.value.offsetTop - height.value/2;
};

const handleMouseEnter = () => {
  clearTimeout(mouseLeaveDelay.value);
  isSelected.value = true;
};

const handleMouseLeave = () => {
  isSelected.value = false;
  mouseLeaveDelay.value = setTimeout(() => {
    const duration = 1000; // 1 second animation
    const startTime = performance.now();
    const startX = mouseX.value;
    const startY = mouseY.value;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2; // Smooth easing

      mouseX.value = startX * (1 - easeProgress);
      mouseY.value = startY * (1 - easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, 300);
};
</script>

<style scoped>
.card-wrap {
  margin: 10px;
  transform: perspective(800px);
  transform-style: preserve-3d;
  cursor: pointer;
  position: relative;
  overflow: visible; /* Change from hidden to visible */

  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 2px solid transparent;
    border-radius: 12px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    pointer-events: none;
    z-index: 10;
    opacity: 0;
  }

  &.selected::before {
    opacity: 1;
    border-color: rgba(255, 255, 255, 0.9);
    box-shadow:
        0 0 10px rgba(255, 255, 255, 0.8),
        inset 0 0 10px rgba(255, 255, 255, 0.6);
  }


  &:hover {
    .card-info {
      transform: translateY(0);
    }
    .card-info p {
      opacity: 1;
    }
    .card-info, .card-info p {
      transition: 0.6s v-bind('$hoverEasing');
    }
    .card-info:after {
      transition: 5s v-bind('$hoverEasing');
      opacity: 1;
      transform: translateY(0);
    }
    .card-bg {
      transition:
          0.6s v-bind('$hoverEasing'),
          opacity 5s v-bind('$hoverEasing');
      opacity: 0.8;
    }
    .card {
      border: 1px solid white;
      transition:
          0.6s v-bind('$hoverEasing'),
          box-shadow 2s v-bind('$hoverEasing');
      box-shadow:
          rgba(white, 0.2) 0 0 40px 5px,
          rgba(white, 1) 0 0 0 1px,
          rgba(black, 0.66) 0 30px 60px 0,
          inset #333 0 0 0 5px,
          inset white 0 0 0 6px;
    }
  }
}

.card {
  position: relative;
  flex: 0 0 240px;
  width: 240px;
  height: 320px;
  background-color: #333;
  overflow: hidden;
  border-radius: 10px;
  box-shadow:
      rgba(black, 0.66) 0 30px 60px 0,
      inset #333 0 0 0 5px,
      inset rgba(white, 0.5) 0 0 0 6px;
  transition: 1s v-bind('$returnEasing');
}

.card-bg {
  /* Replace existing styles with these */
  opacity: 0.5;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-origin: border-box;
  border-radius: 10px;
  overflow: hidden;
  transition:
      1s $returnEasing,
      opacity 5s 1s $returnEasing;
  pointer-events: none;
}

.card-info {
  margin: 0 2px 2px 2px;
  position: absolute;
  bottom: 0;
  color: #fff;
  transform: translateY(40%);
  transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1);

  p {
    opacity: 0;
    text-shadow: rgba(black, 1) 0 2px 3px;
    transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  * {
    position: relative;
    z-index: 1;
  }
  &:hover {
    transform: translateY(0);
    transition: 5s 1s v-bind('$returnEasing');

    p {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, transparent 0%, rgba(#000, 0.6) 100%);
    background-blend-mode: overlay;
    opacity: 0;
    transform: translateY(100%);
    transition: 5s 1s v-bind('$returnEasing');
  }
}

.card-info h1 {
  font-size: 36px;
  font-weight: 700;
  text-shadow: rgba(black, 0.5) 0 10px 10px;
}
</style>