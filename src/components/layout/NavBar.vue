<!-- src/components/layout/NavBar.vue -->
<template>
    <header class="navbar">
        <div class="navbar-left">
            <div class="logo">OPlayer</div>
            <div class="navbar-item" @click="showSettings">
                <i class="icon-settings"></i>
            </div>
            <div class="navbar-item" @click="goHome">
                <i class="icon-home"></i>
            </div>
        </div>
        <div class="navbar-right">
            <div class="navbar-item">
                <div class="user">
                    <img :src="userAvatar" alt="User Avatar" class="avatar" />
                    <span class="username">{{ userName }}</span>
                </div>
            </div>
            <div class="navbar-item">
                <div class="clock">{{ currentTime }}</div>
            </div>
            <div class="navbar-item" @click="showNotifications">
                <i class="icon-notifications"></i>
                <div v-if="notificationCount" class="notification-badge">
                    {{ notificationCount }}
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
</script>
