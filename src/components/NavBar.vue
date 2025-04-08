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
            <div class="navbar-item-clock" ref="clockBtn" @mouseenter="handleMouseEnter(clockBtn, false)"
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
        <div v-if="navBarStore.hasVisiblePanel" ref="overlay" class="navbar-overlay" @click="handleOverlayClick"></div>
    </header>

    <!-- 将面板组件直接放入NavBar中 -->
    <div class="overlay-components">
        <!-- 设置面板 -->
        <div ref="settingsPanel" class="settings-panel panel" v-if="navBarStore.isSettingsPanelVisible" @click.stop>
            <h3>设置面板</h3>
            <div class="panel-content">
                <!-- 设置面板内容 -->
                <p>这里是设置面板内容</p>
            </div>
        </div>

        <!-- 关于面板 -->
        <div ref="aboutPanel" class="about-panel panel" v-if="navBarStore.isAboutPanelVisible" @click.stop>
            <h3>关于面板</h3>
            <div class="panel-content">
                <!-- 关于面板内容 -->
                <p>这里是关于面板内容</p>
            </div>
        </div>

        <!-- 通知面板 -->
        <div ref="notificationsPanel" class="notifications-panel panel" v-if="navBarStore.isNotificationsPanelVisible"
            @click.stop>
            <h3>通知面板</h3>
            <div class="panel-content">
                <!-- 通知面板内容 -->
                <p>这里是通知面板内容</p>
            </div>
        </div>

        <!-- 用户资料面板 -->
        <div ref="profilePanel" class="profile-panel panel" v-if="navBarStore.isProfilePanelVisible" @click.stop>
            <h3>用户资料</h3>
            <div class="panel-content">
                <!-- 用户资料内容 -->
                <p>这里是用户资料内容</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, defineProps, ref, watch, nextTick } from 'vue';
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

// 面板引用
const settingsPanel = ref(null);
const aboutPanel = ref(null);
const notificationsPanel = ref(null);
const profilePanel = ref(null);

// 定义属性和事件
const props = defineProps({
    activeItem: {
        type: String,
        default: ''
    }
});

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
    const isActive = navBarStore.toggleSettings();

    // 根据切换结果决定是显示还是隐藏面板
    if (isActive) {
        nextTick(() => {
            if (settingsPanel.value) {
                animations.showPanelLeft(settingsPanel.value);
            }
        });
    } else {
        if (settingsPanel.value) {
            animations.hidePanelLeft(settingsPanel.value);
        }
    }
};

const handleHomeClick = () => {
    animations.buttonPress(homeBtn.value);
    navBarStore.navigateToHome(router);
};

const handleAboutClick = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    animations.buttonPress(aboutBtn.value);
    const isActive = navBarStore.toggleAbout();

    // 根据切换结果决定是显示还是隐藏面板
    if (isActive) {
        nextTick(() => {
            if (aboutPanel.value) {
                animations.showPanelLeft(aboutPanel.value);
            }
        });
    } else {
        if (aboutPanel.value) {
            animations.hidePanelLeft(aboutPanel.value);
        }
    }
};

const handleNotificationsClick = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    animations.buttonPress(notificationsBtn.value);
    const isActive = navBarStore.toggleNotifications();

    // 根据切换结果决定是显示还是隐藏面板
    if (isActive) {
        nextTick(() => {
            if (notificationsPanel.value) {
                animations.showPanelRight(notificationsPanel.value);
            }
        });
    } else {
        if (notificationsPanel.value) {
            animations.hidePanelRight(notificationsPanel.value);
        }
    }
};

const handleUserProfileClick = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    animations.buttonPress(profileBtn.value);
    const isActive = navBarStore.toggleProfile();

    // 根据切换结果决定是显示还是隐藏面板
    if (isActive) {
        nextTick(() => {
            if (profilePanel.value) {
                animations.showPanelRight(profilePanel.value);
            }
        });
    } else {
        if (profilePanel.value) {
            animations.hidePanelRight(profilePanel.value);
        }
    }
};

// 处理遮罩层点击 - 关闭所有面板
const handleOverlayClick = (event) => {
    // 检查点击是否发生在面板内部
    const panels = [settingsPanel.value, aboutPanel.value, notificationsPanel.value, profilePanel.value];

    // 如果点击了某个面板或其子元素，不关闭面板
    if (panels.some(panel => panel && panel.contains(event.target))) {
        return;
    }

    // 否则关闭所有面板
    navBarStore.clearActiveItems();
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
watch(() => navBarStore.hasVisiblePanel, (newVal) => {
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
    // 添加全局点击事件，用于检测点击外部区域而不是面板内部
    document.addEventListener('click', handleOverlayClick);
});

onUnmounted(() => {
    navBarStore.stopClock();
    // 移除全局点击事件
    document.removeEventListener('click', handleOverlayClick);
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
    z-index: 989;
    /* 低于面板的层级 */
    backdrop-filter: blur(2px);
    opacity: 0;
}

/* 覆盖组件容器 */
.overlay-components {
    position: fixed;
    top: 45px;
    left: 0;
    width: 100%;
    height: calc(100vh - 45px);
    pointer-events: none;
    /* 默认允许点击穿透 */
    z-index: 990;
}

/* 通用面板样式 */
.panel {
    position: absolute;
    pointer-events: auto;
    /* 重新启用面板内部的点击 */
    background: rgba(35, 35, 35, 0.9);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    padding: 20px;
    color: white;
    backdrop-filter: blur(10px);
}

/* 每个面板的位置和大小 */
.settings-panel {
    top: 10px;
    left: 10px;
    width: 300px;
    height: 500px;
}

.about-panel {
    top: 10px;
    left: 10px;
    width: 400px;
    height: 300px;
}

.notifications-panel {
    top: 10px;
    right: 10px;
    width: 300px;
    height: 400px;
}

.profile-panel {
    top: 10px;
    right: 10px;
    width: 350px;
    height: 450px;
}

.panel-content {
    margin-top: 15px;
}
</style>