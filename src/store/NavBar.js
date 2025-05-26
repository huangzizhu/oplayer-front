import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { useUserStore } from '@/store/User.js'

export const useNavBarStore = defineStore('navBar', () => {
    // 状态 - 使用对象存储多个激活项状态
    const activeItems = reactive({
        settings: false,
        home: false,
        about: false,
        notifications: false,
        profile: false,
        player: false,
    });

    // const username = ref('Guest');
    const userStore = useUserStore();
    const username = computed(() => {
        return userStore.userInfo ? userStore.userInfo.username : "Guest";
    });

    // 面板显示状态 - 与激活项分开管理
    const panelVisibility = reactive({
        settings: false,
        about: false,
        notifications: false,
        profile: false,
        player: false,
    });

    const currentTime = ref('00:00');
    let clockInterval = null;

    // 计算属性
    const isSettingsActive = computed(() => activeItems.settings);
    const isHomeActive = computed(() => activeItems.home);
    const isAboutActive = computed(() => activeItems.about);
    const isNotificationsActive = computed(() => activeItems.notifications);
    const isProfileActive = computed(() => activeItems.profile);
    const isPlayerActive = computed(() => activeItems.player);

    // 面板显示计算属性
    const isSettingsPanelVisible = computed(() => panelVisibility.settings);
    const isAboutPanelVisible = computed(() => panelVisibility.about);
    const isNotificationsPanelVisible = computed(() => panelVisibility.notifications);
    const isProfilePanelVisible = computed(() => panelVisibility.profile);
    const isPlayerPanelVisible = computed(() => activeItems.player);

    // 方法
    const toggleActiveItem = (item) => {
        // Home 是特殊情况，不会被设置为激活
        if (item === 'home') return;

        // 切换指定项的激活状态
        activeItems[item] = !activeItems[item];

        // 同步面板可见性状态
        panelVisibility[item] = activeItems[item];
    };

    const setActiveItem = (item, isActive = true) => {
        // Home 是特殊情况，不会被设置为激活
        if (item === 'home') return;

        activeItems[item] = isActive;

        // 同步面板可见性状态
        panelVisibility[item] = isActive;
    };

    const clearActiveItems = () => {
        Object.keys(activeItems).forEach(key => {
            activeItems[key] = false;
        });

        // 同步清除面板可见性
        Object.keys(panelVisibility).forEach(key => {
            panelVisibility[key] = false;
        });
    };

    // 直接控制面板可见性而不影响导航栏高亮
    const setPanelVisibility = (panel, isVisible) => {
        if (panel in panelVisibility) {
            panelVisibility[panel] = isVisible;
        }
    };

    const updateTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        currentTime.value = `${hours}:${minutes}`;
    };

    const startClock = () => {
        updateTime();
        // 每分钟更新一次时间
        clockInterval = setInterval(updateTime, 60000);
    };

    const stopClock = () => {
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
    };

    // 导航功能
    const navigateToHome = (router) => {
        // Home不高亮，但可以清除其他高亮
        clearActiveItems();
        router.push('/');
    };

    // 点击功能 - 都具有切换能力
    const toggleSettings = () => {
        toggleActiveItem('settings');
        return isSettingsActive.value;
    };

    const toggleAbout = () => {
        toggleActiveItem('about');
        return isAboutActive.value;
    };

    const toggleNotifications = () => {
        toggleActiveItem('notifications');
        return isNotificationsActive.value;
    };

    const toggleProfile = () => {
        toggleActiveItem('profile');
        return isProfileActive.value;
    };

    const togglePlayer = () => {
        toggleActiveItem('player');
        return isPlayerActive.value;
    };

    // 检查是否有任何弹出组件处于活动状态
    const hasActiveOverlay = computed(() => {
        return Object.values(activeItems).some(isActive => isActive);
    });

    // 检查面板状态
    const hasVisiblePanel = computed(() => {
        return Object.values(panelVisibility).some(isVisible => isVisible);
    });

    return {
        // 状态
        activeItems,
        panelVisibility,
        currentTime,
        username,

        // 计算属性
        isSettingsActive,
        isHomeActive,
        isAboutActive,
        isNotificationsActive,
        isProfileActive,
        isPlayerActive,

        // 面板显示计算属性
        isSettingsPanelVisible,
        isAboutPanelVisible,
        isNotificationsPanelVisible,
        isProfilePanelVisible,
        isPlayerPanelVisible,

        hasActiveOverlay,
        hasVisiblePanel,

        // 方法
        toggleActiveItem,
        setActiveItem,
        clearActiveItems,
        setPanelVisibility,
        updateTime,
        startClock,
        stopClock,

        // 导航功能
        navigateToHome,

        // 切换功能
        toggleSettings,
        toggleAbout,
        toggleNotifications,
        toggleProfile,
        togglePlayer,
    };
});