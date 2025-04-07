import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'

export const useNavBarStore = defineStore('navBar', () => {
    // 状态 - 使用对象存储多个激活项状态
    const activeItems = reactive({
        settings: false,
        home: false,
        about: false,
        notifications: false,
        profile: false
    });

    const currentTime = ref('00:00');
    let clockInterval = null;

    // 计算属性
    const isSettingsActive = computed(() => activeItems.settings);
    const isHomeActive = computed(() => activeItems.home);
    const isAboutActive = computed(() => activeItems.about);
    const isNotificationsActive = computed(() => activeItems.notifications);
    const isProfileActive = computed(() => activeItems.profile);

    // 方法
    const toggleActiveItem = (item) => {
        // Home 是特殊情况，不会被设置为激活
        if (item === 'home') return;

        // 切换指定项的激活状态
        activeItems[item] = !activeItems[item];
    };

    const setActiveItem = (item, isActive = true) => {
        // Home 是特殊情况，不会被设置为激活
        if (item === 'home') return;

        activeItems[item] = isActive;
    };

    const clearActiveItems = () => {
        Object.keys(activeItems).forEach(key => {
            activeItems[key] = false;
        });
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
    const toggleSettings = (emit) => {
        toggleActiveItem('settings');
        emit('toggleSettings', isSettingsActive.value);
    };

    const toggleAbout = (router, emit) => {
        toggleActiveItem('about');
        emit('toggleAbout', isAboutActive.value);
    };

    const toggleNotifications = () => {
        toggleActiveItem('notifications');
        return isNotificationsActive.value;
    };

    const toggleProfile = () => {
        toggleActiveItem('profile');
        return isProfileActive.value;
    };

    // 检查是否有任何弹出组件处于活动状态
    const hasActiveOverlay = computed(() => {
        return Object.values(activeItems).some(isActive => isActive);
    });

    return {
        // 状态
        activeItems,
        currentTime,

        // 计算属性
        isSettingsActive,
        isHomeActive,
        isAboutActive,
        isNotificationsActive,
        isProfileActive,
        hasActiveOverlay,

        // 方法
        toggleActiveItem,
        setActiveItem,
        clearActiveItems,
        updateTime,
        startClock,
        stopClock,

        // 导航功能
        navigateToHome,

        // 切换功能
        toggleSettings,
        toggleAbout,
        toggleNotifications,
        toggleProfile
    };
});