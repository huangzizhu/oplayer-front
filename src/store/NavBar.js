import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNavBarStore = defineStore('navBar', () => {
    // 状态
    const activeItem = ref('');
    const currentTime = ref('00:00');
    let clockInterval = null;

    // 计算属性
    const isSettingsActive = computed(() => activeItem.value === 'settings');
    const isHomeActive = computed(() => activeItem.value === 'home');
    const isAboutActive = computed(() => activeItem.value === 'about');
    const isNotificationsActive = computed(() => activeItem.value === 'notifications');
    const isProfileActive = computed(() => activeItem.value === 'profile');

    // 方法
    const setActiveItem = (item) => {
        activeItem.value = item;
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
        setActiveItem('home');
        router.push('/');
    };

    const navigateToAbout = (router, emit) => {
        setActiveItem('about');
        if (emit) emit('aboutClicked');
        router.push('/about');
    };

    const showNotifications = () => {
        setActiveItem('notifications');
        // 显示通知面板的逻辑
    };

    const showUserProfile = () => {
        setActiveItem('profile');
        // 显示用户信息面板的逻辑
    };

    const onSettingsClick = (emit) => {
        setActiveItem('settings');
        if (emit) emit('settingsClicked');
    };

    return {
        // 状态
        activeItem,
        currentTime,

        // 计算属性
        isSettingsActive,
        isHomeActive,
        isAboutActive,
        isNotificationsActive,
        isProfileActive,

        // 方法
        setActiveItem,
        updateTime,
        startClock,
        stopClock,
        navigateToHome,
        navigateToAbout,
        showNotifications,
        showUserProfile,
        onSettingsClick
    };
});