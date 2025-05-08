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
    position: 'left',
    backgroundColor: 'rgba(85, 85, 85, 1)',
  },
]);

const rightMenuItems = reactive([
  {
    id: 'music',
    icon: 'music',
    label: '音乐',
    route: '/music',
    position: 'right',
    backgroundColor: 'rgba(102, 68, 204, 1)',
  },
  {
    id: 'userSystem',
    icon: 'user',
    label: '用户系统',
    route: '/user',
    position: 'right',
    backgroundColor: 'rgba(238, 170, 0, 1)',
  },
  {
    id: 'discover',
    icon: 'search',
    label: '发现',
    route: '/explore',
    position: 'right',
    backgroundColor: 'rgba(165,204,0,1)',
  },
  {
    id: 'exit',
    icon: 'exit',
    label: '退出',
    route: '/',
    position: 'right',
    backgroundColor: 'rgb(238,51,153,1)',
  }
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
  gsap.set(menuStrip.value, { scaleY: 0, opacity: 0, background: 'rgba(255, 255, 255, 1)' });
  gsap.to(menuStrip.value, {
    scaleY: 1,
    opacity: 1,
    duration: 0.15,
    background: 'rgba(35, 35, 35, 1)',
    ease: "power2.out"
  });

  // 2. 粉饼缩小并移到左侧
  gsap.to(pinkDisc.value, {
    scale: 0.7,
    x: -window.innerWidth * 0.15,
    duration: 0.15,
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
          duration: 0.15,
          ease: "power2.inOut"
        });

        // 3. 收起条带
        gsap.to(menuStrip.value, {
          scaleY: 0,
          opacity: 0,
          duration: 0.15,
          background: 'rgba(255, 255, 255, 1)',
          ease: "power2.inOut",
          onComplete: () => {
            circleMenuStore.setExpanded(false);
            circleMenuStore.setTransitioning(false);
          }
        });
      }
    });
    //-window.innerWidth * 0.4
    tl.to(leftItemsArray, {
      x: -window.innerWidth * 0.20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.3,
      ease: "power2.in"
    }, 0);

    tl.to(rightItemsArray, {
      x: window.innerWidth * 0.20,
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
    gsap.set(leftItemsArray, { x: -window.innerWidth * 0.20, opacity: 0 });
    gsap.set(rightItemsArray, { x: window.innerWidth * 0.10, opacity: 0 });

    // 创建时间线
    const tl = gsap.timeline({
      onComplete: () => {
        circleMenuStore.setTransitioning(false);
      }
    });

    // 从左到右依次显示左侧菜单项
    tl.to(leftItemsArray, {
      x: -window.innerWidth * 0.15,
      opacity: 1,
      stagger: 0.1,
      duration: 0.15,
      ease: "power2.out"
    });

    // 从左到右依次显示右侧菜单项
    tl.to(rightItemsArray, {
      x: -window.innerWidth * 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.15,
      ease: "power2.out"
    }, "-=0.15"); // 稍微提前开始右侧动画
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
    duration: 0.4,
    ease: "bounce",
    overwrite: true,
  });

  // 获取所有同侧卡片
  const sideItems = side === 'left' ?
    Array.from(leftItems.value.children) :
    Array.from(rightItems.value.children);

  // 为其他卡片腾出空间
  sideItems.forEach(otherCard => {
    if (otherCard !== card) {
      gsap.to(otherCard, {
        // x: side === 'left' ? -0 : 0,
        duration: 0.5,
        ease: "bounce"
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
    ease: "power2.out",
    overwrite: true,
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
        ease: "power2.out",
        overwrite: true,
      });
    }
  });
};
// 引入NavBarStore
import { useNavBarStore } from '@/store/NavBar';
// 初始化store
const navBarStore = useNavBarStore();
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

  // 根据路由方向，设置退出方向
  circleMenuStore.setExitDirection(item.position);
  if (item.id === 'settings') {
    // 显示设置面板而不是跳转路由
    event.stopPropagation(); 
    navBarStore.toggleSettings();
    circleMenuStore.setTransitioning(false);
    return;
  }


  // 点击的卡片放大并淡出
  gsap.to(targetCard, {
    scale: 1,
    opacity: 0,
    duration: 0.2,
    ease: "power2.in"
  });

  // 左侧卡片向左移动并淡出
  gsap.to(otherLeftItems, {
    x: -window.innerWidth * 0.20,
    opacity: 0,
    stagger: 0.05,
    duration: 0.1,
    ease: "power2.in"
  });

  // 右侧卡片向右移动并淡出
  gsap.to(otherRightItems, {
    x: window.innerWidth * 0.20,
    opacity: 0,
    stagger: 0.05,
    duration: 0.1,
    ease: "power2.in",
    onComplete: () => {
      // 直接执行收起操作，确保条带动画先完成
      // 执行粉饼回中心和条带收起
      gsap.to(pinkDisc.value, {
        scale: 0,
        x: -window.innerWidth * 0.30,
        duration: 0.1,
        ease: "power2.inOut"
      });

      gsap.to(menuStrip.value, {
        scaleY: 0,
        opacity: 0,
        duration: 0.1,
        background: 'rgba(255, 255, 255, 1)',
        ease: "power2.inOut",
        onComplete: () => {
          // 所有动画完成后，再跳转路由
          circleMenuStore.setExpanded(false);
          circleMenuStore.setTransitioning(false);
          // 其他菜单项正常跳转路由
          router.push(item.route);
        }
      });
    }
  });
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
  font-family: 'Comfortaa-Light'
}


/* 粉饼样式 */
.pink-disc {
  position: absolute;
  width: 360px;
  height: 360px;
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
  transition: transform 0.2s ease;
  font-family: 'Comfortaa-Light'
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
  -webkit-user-drag: none;
}

.image-tri {
  user-select: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0%;
  left: 0%;
  z-index: 902;
  -webkit-user-drag: none;
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
  height: 120px;
  z-index: 901;
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
  z-index: 901;
  position: absolute;
}

.left-items {
  position: absolute;
  right: 54%;
  justify-content: flex-end;
  z-index: 901;
}

.right-items {
  position: absolute;
  left: 39%;
  justify-content: flex-start;
  z-index: 901;
}
</style>