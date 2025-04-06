<template>
    <header class="navbar">
        <div class="navbar-left">
            <div class="logo">OPlayer</div>
        </div>

        <div class="navbar-right">
            <div class="navbar-item" @click="showSettings">
                <!-- <div class="navbar-icon">
                    <i class="icon-settings"></i>
                </div> -->
                <img src="../../assets/images/settings.svg" alt="" width="24" height="24" class="navbar-icon-settings"
                    style="color: white;" />
            </div>

            <div class="navbar-item">
                <!-- <div class="navbar-icon">
                    <i class="icon-clock"></i>
                </div> -->
                <img src="../../assets/images/clock.svg" alt="" width="24" height="24" class="navbar-icon-settings"
                    style="color: white;" />
                <span class="clock">{{ currentTime }}</span>
            </div>


            <div class="navbar-item" @click="showNotifications">
                <div class="navbar-icon">
                    <!-- <i class="icon-notifications"></i> -->
                    <div v-if="notificationCount > 0" class="notification-badge">
                        {{ notificationCount }}
                    </div>
                    <img src="../../assets/images/notification.svg" alt="" width="28" height="28"
                        class="navbar-icon-settings" style="fill: white;" />
                </div>

            </div>

            <div class="navbar-item" @click="showUserProfile">
                <!-- <span>{{ username }}</span> -->
                <div class="navbar-icon user-avatar">
                    <img src="../../assets/images/avatar.jpg" alt="用户头像">
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 用户信息
// const username = ref('用户');
// const userAvatar = ref('../../assets/images/avatar.jpg'); // 默认头像路径
const notificationCount = ref(2);

// 当前时间
const currentTime = ref('00:00');
let clockInterval = null;

// 更新时间的函数
const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    currentTime.value = `${hours}:${minutes}`;
};

// 导航功能
const showSettings = () => {
    router.push('/settings');
};

const showNotifications = () => {
    // 显示通知面板
    // 这里可以触发一个事件或使用状态管理
};

const showUserProfile = () => {
    // 显示用户信息面板
    // 这里可以触发一个事件或使用状态管理
};

onMounted(() => {
    updateTime();
    // 每分钟更新一次时间
    clockInterval = setInterval(updateTime, 60000);
});

onUnmounted(() => {
    if (clockInterval) {
        clearInterval(clockInterval);
    }
});
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 20px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
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
    transition: background-color 0.2s;
}

.navbar-item:hover {
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
    opacity: 0.8;
}

.clock {
    font-weight: 500;
}
</style>
