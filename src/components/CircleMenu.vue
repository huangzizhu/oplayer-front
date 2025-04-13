<template>
  <div class="circle-menu-container" ref="menuContainer" :class="{ 'menu-expanded': circleMenuStore.isExpanded }">
    <!-- 粉饼主菜单按钮 -->
    <div ref="pinkDisc" class="pink-disc" @click="toggleMenu" :class="{ 'expanded': circleMenuStore.isExpanded }">
      <div class="disc-inner">
        <div class="disc-logo">
          <img src="@/assets/images/osu-logo-triangles.svg" alt="Logo" class="image-tri" />
          <img src="@/assets/images/logo.svg" alt="Logo" class="image-logo" />
        </div>
      </div>
    </div>

    <!-- 菜单条带背景 -->
    <div ref="menuStrip" class="menu-strip" :class="{ 'expanded': circleMenuStore.isExpanded }"></div>

    <!-- 菜单项容器 -->
    <div class="menu-items-container" v-show="circleMenuStore.isExpanded">
      <!-- 左侧菜单项 -->
      <div ref="leftItems" class="left-items">
        <menu-card v-for="item in leftMenuItems" :key="item.id" :item="item" @click="handleMenuItemClick(item)"
          @mouseenter="handleMenuItemHover(item, $event, 'left')"
          @mouseleave="handleMenuItemLeave(item, $event, 'left')" />
      </div>

      <!-- 右侧菜单项 -->
      <div ref="rightItems" class="right-items">
        <menu-card v-for="item in rightMenuItems" :key="item.id" :item="item" @click="handleMenuItemClick(item)"
          @mouseenter="handleMenuItemHover(item, $event, 'right')"
          @mouseleave="handleMenuItemLeave(item, $event, 'right')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import gsap from 'gsap';
import MenuCard from './MenuCard.vue';
import { useCircleMenuStore } from '@/store/CircleMenu';

// 路由
const router = useRouter();
const route = useRoute();

// Store
const circleMenuStore = useCircleMenuStore();

// 引用DOM元素
const menuContainer = ref(null);
const pinkDisc = ref(null);
const menuStrip = ref(null);
const leftItems = ref(null);
const rightItems = ref(null);

// 菜单项定义
const leftMenuItems = reactive([
  {
    id: 'settings',
    icon: 'settings',
    label: '设置',
    route: '/settings',
    position: 'left'
  },
]);

const rightMenuItems = reactive([
  {
    id: 'music',
    icon: 'music',
    label: '音乐',
    route: '/music',
    position: 'right'
  },
  {
    id: 'playlists',
    icon: 'playlist',
    label: '播放列表',
    route: '/playlists',
    position: 'right'
  },
  // {
  //   id: 'favorites',
  //   icon: 'heart',
  //   label: '收藏',
  //   route: '/favorites',
  //   position: 'right'
  // },
  // {
  //   id: 'explore',
  //   icon: 'explore',
  //   label: '发现',
  //   route: '/explore',
  //   position: 'right'
  // }
]);

// 菜单切换方法
const toggleMenu = () => {
  if (circleMenuStore.isTransitioning) return;
  circleMenuStore.setTransitioning(true);

  if (circleMenuStore.isExpanded) {
    // 折叠菜单
    collapseMenu();
  } else {
    // 展开菜单
    expandMenu();
  }
};

// 展开菜单动画
const expandMenu = () => {
  // 1. 首先显示条带
  gsap.set(menuStrip.value, { scaleY: 0, opacity: 0 });
  gsap.to(menuStrip.value, {
    scaleY: 1,
    opacity: 1,
    duration: 0.1,
    ease: "power2.out"
  });

  // 2. 粉饼缩小并移到左侧
  gsap.to(pinkDisc.value, {
    scale: 0.7,
    x: -window.innerWidth * 0.15,
    duration: 0.2,
    ease: "power2.out",
    onComplete: () => {
      circleMenuStore.setExpanded(true);
      // 3. 显示菜单项
      showMenuItems();
    }
  });
};

// 折叠菜单动画
const collapseMenu = () => {
  // 1. 隐藏菜单项
  if (leftItems.value && rightItems.value) {
    const leftItemsArray = Array.from(leftItems.value.children);
    const rightItemsArray = Array.from(rightItems.value.children);

    const tl = gsap.timeline({
      onComplete: () => {
        // 2. 粉饼回到中心
        gsap.to(pinkDisc.value, {
          scale: 1,
          x: 0,
          duration: 0.2,
          ease: "power2.inOut"
        });

        // 3. 收起条带
        gsap.to(menuStrip.value, {
          scaleY: 0,
          opacity: 0,
          duration: 0.2,
          ease: "power2.inOut",
          onComplete: () => {
            circleMenuStore.setExpanded(false);
            circleMenuStore.setTransitioning(false);
          }
        });
      }
    });

    tl.to(leftItemsArray, {
      x: -window.innerWidth * 0.4,
      opacity: 0,
      stagger: 0.05,
      duration: 0.3,
      ease: "power2.in"
    }, 0);

    tl.to(rightItemsArray, {
      x: window.innerWidth * 0.3,
      opacity: 0,
      stagger: 0.05,
      duration: 0.3,
      ease: "power2.in"
    }, 0);
  }
};

// 显示菜单项动画
const showMenuItems = () => {
  if (leftItems.value && rightItems.value) {
    const leftItemsArray = Array.from(leftItems.value.children);
    const rightItemsArray = Array.from(rightItems.value.children);

    // 初始设置
    gsap.set(leftItemsArray, { x: -window.innerWidth * 0.3, opacity: 0 });
    gsap.set(rightItemsArray, { x: window.innerWidth * 0.15, opacity: 0 });

    // 创建时间线
    const tl = gsap.timeline({
      onComplete: () => {
        circleMenuStore.setTransitioning(false);
      }
    });

    // 从左到右依次显示左侧菜单项
    tl.to(leftItemsArray, {
      x: -window.innerWidth * 0.2,
      opacity: 1,
      stagger: 0.1,
      duration: 0.2,
      ease: "power2.out"
    });

    // 从左到右依次显示右侧菜单项
    tl.to(rightItemsArray, {
      x: -window.innerWidth * 0.1,
      opacity: 1,
      stagger: 0.1,
      duration: 0.2,
      ease: "power2.out"
    }, "-=0.3"); // 稍微提前开始右侧动画
  }
};

// 卡片悬停效果
const handleMenuItemHover = (item, event, side) => {
  if (circleMenuStore.isTransitioning) return;

  const card = event.currentTarget;
  const icon = card.querySelector('.menu-card-icon');

  // 设置当前活动项
  circleMenuStore.setActiveMenuItem(item.id);

  // 图标跳动效果
  gsap.timeline()
    .to(icon, {
      scale: 1.3,
      duration: 0.2,
      ease: "power1.out"
    })
    .to(icon, {
      scale: 1,
      duration: 0.2,
      ease: "elastic.out(1, 0.2)"
    });

  // 卡片扩展效果
  gsap.to(card, {
    width: '250px',
    duration: 0.2,
    ease: "power2.out"
  });

  // 获取所有同侧卡片
  const sideItems = side === 'left' ?
    Array.from(leftItems.value.children) :
    Array.from(rightItems.value.children);

  // 为其他卡片腾出空间
  sideItems.forEach(otherCard => {
    if (otherCard !== card) {
      gsap.to(otherCard, {
        x: side === 'left' ? -20 : 20,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  });
};

// 卡片离开效果
const handleMenuItemLeave = (item, event, side) => {
  if (circleMenuStore.isTransitioning) return;

  const card = event.currentTarget;

  // 清除当前活动项
  if (circleMenuStore.activeMenuItem === item.id) {
    circleMenuStore.setActiveMenuItem(null);
  }

  // 恢复卡片原始尺寸
  gsap.to(card, {
    width: '180px',
    duration: 0.2,
    ease: "power2.out"
  });

  // 获取所有同侧卡片
  const sideItems = side === 'left' ?
    Array.from(leftItems.value.children) :
    Array.from(rightItems.value.children);

  // 恢复其他卡片位置
  sideItems.forEach(otherCard => {
    if (otherCard !== card) {
      gsap.to(otherCard, {
        x: 0,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  });
};

// 处理卡片点击
const handleMenuItemClick = (item) => {
  if (circleMenuStore.isTransitioning) return;
  circleMenuStore.setTransitioning(true);

  // 获取所有卡片
  const allLeftItems = Array.from(leftItems.value.children);
  const allRightItems = Array.from(rightItems.value.children);

  // 点击的卡片
  const targetCard = item.position === 'left'
    ? allLeftItems[leftMenuItems.findIndex(i => i.id === item.id)]
    : allRightItems[rightMenuItems.findIndex(i => i.id === item.id)];

  // 其他卡片
  const otherLeftItems = allLeftItems.filter(card => card !== targetCard);
  const otherRightItems = allRightItems.filter(card => card !== targetCard);

  // 动画时间线
  const tl = gsap.timeline({
    onComplete: () => {
      // 根据路由方向，执行菜单淡出动画
      circleMenuStore.setExitDirection(item.position);

      // 跳转路由
      setTimeout(() => {
        router.push(item.route);
        // 折叠菜单
        collapseMenu();
      }, 300);
    }
  });

  // 点击的卡片放大并淡出
  tl.to(targetCard, {
    scale: 1.2,
    opacity: 0,
    duration: 0.2,
    ease: "power2.in"
  });

  // 左侧卡片向左移动并淡出
  tl.to(otherLeftItems, {
    x: -100,
    opacity: 0,
    stagger: 0.05,
    duration: 0.2,
    ease: "power2.in"
  }, "-=0.2");

  // 右侧卡片向右移动并淡出
  tl.to(otherRightItems, {
    x: 100,
    opacity: 0,
    stagger: 0.05,
    duration: 0.2,
    ease: "power2.in"
  }, "-=0.2");
};

// 监听路由变化，特殊处理音乐页面
onMounted(() => {
  // 检查当前路由，如果是特殊页面（如音乐页），应用相应的入场动画
  if (route.path === '/music') {
    circleMenuStore.setExitDirection('right');
  }
});

onBeforeUnmount(() => {
  // 清理可能的动画
  gsap.killTweensOf([pinkDisc.value, menuStrip.value]);

  if (leftItems.value && rightItems.value) {
    const leftItemsArray = Array.from(leftItems.value.children);
    const rightItemsArray = Array.from(rightItems.value.children);
    gsap.killTweensOf([...leftItemsArray, ...rightItemsArray]);
  }
});
</script>

<style scoped>
.circle-menu-container {
  position: fixed;
  bottom: 50%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 900;
  width: 100%;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}


/* 粉饼样式 */
.pink-disc {
  position: absolute;
  width: 300px;
  height: 300px;
  /* background: linear-gradient(135deg, #ff66ab, #ff1744); */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* box-shadow: 0 4px 20px rgba(255, 255, 255, 0.4); */
  cursor: pointer;
  z-index: 902;
  pointer-events: auto;
  /* transition: transform 0.2s ease; */
}

.pink-disc:hover {
  transform: scale(1.05);
}


.disc-inner {
  position: absolute;
  width: 120%;
  height: 120%;
  background: rgba(35, 35, 35, 0);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.disc-logo {
  width: 345px;
  height: 345px;
  user-select: none;
}

/* .disc-logo img {
  width: 300px;
  height: 300px;
} */
.image-logo {
  /* width: 100%;
  height: 100%; */
  top: 0%;
  left: 0%;
  position: absolute;
  object-fit: contain;
  transition: transform 0.2s ease;
  z-index: 903;
  user-select: none;
}

.image-tri {
  user-select: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0%;
  left: 0%;
  z-index: 902;
  /* filter: brightness(0) invert(1); */
}

.disc-inner:hover {
  transform: scale(1.1);
  /* hover时放大 */
}

/* 菜单条带 */
.menu-strip {
  position: absolute;
  height: 100px;
  width: 100%;
  background: rgba(35, 35, 35, 1);
  transform-origin: center;
  z-index: 901;
  opacity: 0;
  transform: scaleY(0);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  pointer-events: auto;
}

/* 菜单项容器 */
.menu-items-container {
  position: absolute;
  width: 100%;
  height: 80px;
  z-index: 1002;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.left-items,
.right-items {
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: auto;
}

.left-items {
  position: absolute;
  right: 50%;
  margin-right: 60px;
  justify-content: flex-end;
}

.right-items {
  position: absolute;
  left: 50%;
  margin-left: 60px;
  justify-content: flex-start;
}
</style>