<template>
    <header class="navbar">
        <div class="navbar-left">
            <div class="navbar-item" ref="settingsBtn" :class="{ 'active': navBarStore.isSettingsActive }"
                @click="handleSettingsClick" @mouseenter="handleMouseEnter(settingsBtn, navBarStore.isSettingsActive)"
                @mouseleave="handleMouseLeave(settingsBtn, navBarStore.isSettingsActive)">
                <img src="@/assets/images/settings.svg" alt="" width="24" height="24" class="navbar-icon-settings" />
            </div>

            <div class="navbar-item" ref="homeBtn" @click="handleHomeClick"
                @mouseenter="handleMouseEnter(homeBtn, false)" @mouseleave="handleMouseLeave(homeBtn, false)">
                <img src="@/assets/images/home.svg" alt="" width="24" height="24" class="navbar-icon-home" />
            </div>

            <div class="navbar-item" ref="aboutBtn" :class="{ 'active': navBarStore.isAboutActive }"
                @click="handleAboutClick" @mouseenter="handleMouseEnter(aboutBtn, navBarStore.isAboutActive)"
                @mouseleave="handleMouseLeave(aboutBtn, navBarStore.isAboutActive)">
                <img src="@/assets/images/info.svg" alt="" width="24" height="24" class="navbar-icon-info" />
            </div>
        </div>

        <div class="navbar-right">
            <!-- 同样的模式应用到其他导航项目... -->
            <div class="navbar-item-clock" ref="clockBtn" 
                @mouseenter="handleMouseEnter(clockBtn, false)"
                @mouseleave="handleMouseLeave(clockBtn, false)">
                <img src="@/assets/images/clock.svg" alt="" width="25" height="25" class="navbar-icon-clock" />
                <span class="clock">{{ navBarStore.currentTime }}</span>
            </div>

            <div class="navbar-item" ref="notificationsBtn" :class="{ 'active': navBarStore.isNotificationsActive }"
                @click="handleNotificationsClick"
                @mouseenter="handleMouseEnter(notificationsBtn, navBarStore.isNotificationsActive)"
                @mouseleave="handleMouseLeave(notificationsBtn, navBarStore.isNotificationsActive)">
                <div class="navbar-icon">
                    <img src="@/assets/images/notification.svg" alt="" width="24" height="24"
                        class="navbar-icon-settings" />
                </div>
            </div>

            <div class="navbar-item" ref="profileBtn" :class="{ 'active': navBarStore.isProfileActive }"
                @click="handleUserProfileClick" @mouseenter="handleMouseEnter(profileBtn, navBarStore.isProfileActive)"
                @mouseleave="handleMouseLeave(profileBtn, navBarStore.isProfileActive)">
                <div class="navbar-icon user-avatar">
                    <img src="@/assets/images/avatar.jpg" alt="用户头像">
                </div>
            </div>
        </div>

        <!-- 遮罩层 - 用于点击外部区域关闭弹出组件 -->
        <div v-if="navBarStore.hasActiveOverlay" ref="overlay" class="navbar-overlay" @click="handleOverlayClick"></div>
    </header>
</template>

<script setup>
import { onMounted, onUnmounted, defineProps, defineEmits, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useNavBarStore } from '@/store/NavBar';
import animations from '@/utils/animations';

// 按钮引用
const settingsBtn = ref(null);
const homeBtn = ref(null);
const aboutBtn = ref(null);
const notificationsBtn = ref(null);
const clockBtn = ref(null);
const profileBtn = ref(null);
const overlay = ref(null);

// 定义属性和事件
const props = defineProps({
    activeItem: {
        type: String,
        default: ''
    }
});

// 定义可能的事件
const emit = defineEmits([
    'toggleSettings',   // 当设置面板切换时
    'toggleAbout',      // 当关于面板切换时
    'toggleNotifications', // 当通知面板切换时
    'toggleProfile'     // 当个人资料面板切换时
]);

// 初始化 router 和 store
const router = useRouter();
const navBarStore = useNavBarStore();

// 如果通过属性传入了激活的选项，则设置它
if (props.activeItem) {
    navBarStore.setActiveItem(props.activeItem);
}

// 处理点击事件
const handleSettingsClick = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    animations.buttonPress(settingsBtn.value);
    navBarStore.toggleSettings(emit);
};

const handleHomeClick = () => {
    animations.buttonPress(homeBtn.value);
    navBarStore.navigateToHome(router);
};

const handleAboutClick = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    animations.buttonPress(aboutBtn.value);
    navBarStore.toggleAbout(router, emit);
};

const handleNotificationsClick = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    animations.buttonPress(notificationsBtn.value);
    const isActive = navBarStore.toggleNotifications();
    emit('toggleNotifications', isActive);
};

const handleUserProfileClick = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    animations.buttonPress(profileBtn.value);
    const isActive = navBarStore.toggleProfile();
    emit('toggleProfile', isActive);
};

// 处理遮罩层点击 - 关闭所有面板
const handleOverlayClick = () => {
    navBarStore.clearActiveItems();
    emit('toggleSettings', false);
    emit('toggleAbout', false);
    emit('toggleNotifications', false);
    emit('toggleProfile', false);
};

const handleMouseEnter = (element, isActive) => {
    if (isActive) return; // 如果元素已激活，不执行悬停动画
    animations.hoverNavItem(element);
};

const handleMouseLeave = (element, isActive) => {
    animations.leaveNavItem(element, isActive);
};

// 监视激活状态并应用动画
watch(() => navBarStore.isSettingsActive, (newVal) => {
    if (newVal) {
        animations.highlightNavItem(settingsBtn.value);
    } else {
        animations.removeHighlight(settingsBtn.value);
    }
});

watch(() => navBarStore.isAboutActive, (newVal) => {
    if (newVal) {
        animations.highlightNavItem(aboutBtn.value);
    } else {
        animations.removeHighlight(aboutBtn.value);
    }
});

watch(() => navBarStore.isNotificationsActive, (newVal) => {
    if (newVal) {
        animations.highlightNavItem(notificationsBtn.value);
    } else {
        animations.removeHighlight(notificationsBtn.value);
    }
});

watch(() => navBarStore.isProfileActive, (newVal) => {
    if (newVal) {
        animations.highlightNavItem(profileBtn.value);
    } else {
        animations.removeHighlight(profileBtn.value);
    }
});

// 监视遮罩层状态
watch(() => navBarStore.hasActiveOverlay, (newVal) => {
    if (newVal && overlay.value) {
        animations.showOverlay(overlay.value);
    } else if (overlay.value) {
        animations.hideOverlay(overlay.value);
    }
});

// 组件生命周期钩子
onMounted(() => {
    // 确保DOM已经准备好
    nextTick(() => {
        console.log("NavBar mounted, elements ready:", {
            settings: !!settingsBtn.value,
            home: !!homeBtn.value,
            about: !!aboutBtn.value,
            notifications: !!notificationsBtn.value,
            profile: !!profileBtn.value
        });

        // 应用任何初始状态
        if (navBarStore.isSettingsActive && settingsBtn.value) {
            animations.highlightNavItem(settingsBtn.value);
        }
        if (navBarStore.isAboutActive && aboutBtn.value) {
            animations.highlightNavItem(aboutBtn.value);
        }
        if (navBarStore.isNotificationsActive && notificationsBtn.value) {
            animations.highlightNavItem(notificationsBtn.value);
        }
        if (navBarStore.isProfileActive && profileBtn.value) {
            animations.highlightNavItem(profileBtn.value);
        }
    });

    navBarStore.startClock();
    // 添加全局点击事件，用于检测点击组件外部
    window.addEventListener('click', handleOverlayClick);
});

onUnmounted(() => {
    navBarStore.stopClock();
    // 移除全局点击事件
    window.removeEventListener('click', handleOverlayClick);
});
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding: 0 20px;
    background: rgba(25, 25, 25, 1);
    backdrop-filter: blur(10px);
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.navbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, #ff66ab, #ff99cc);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.navbar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    cursor: pointer;
    border-radius: 8px;
}

.navbar-item-clock {
    display: flex;
    align-items: center;
    padding: 5px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 12px;
    gap: 5px;
}

.navbar-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.navbar-item-clock:hover {
    background: rgba(255, 255, 255, 0.1);
}

.navbar-icon {
    position: relative;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    margin-bottom: 2px;
}

.notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 16px;
    height: 16px;
    background: #ff66ab;
    border-radius: 50%;
    font-size: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-avatar {
    overflow: hidden;
    border-radius: 50%;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.navbar-item span {
    font-size: 0.7rem;
}

.clock {
    font-weight: 500;
    user-select: none;
}

/* OSU! Lazer 风格的遮罩层 */
.navbar-overlay {
    position: fixed;
    top: 45px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    backdrop-filter: blur(2px);
    opacity: 0;
}
</style>