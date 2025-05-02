// stores/user.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import defaultAvatar from '@/assets/images/avatar.jpg'
import defaultCover from '@/assets/images/cover.jpg'
import defaultBackground from '@/assets/images/test-background.jpg'
import parallaxImg from '@/assets/images/parallax.jpg'

/* eslint-disable */
export const useUserStore = defineStore('user', ()=>{

    const defaultAvatarUrl = ref(defaultAvatar);
    const profilePanel = ref(null);
    const isLoggedIn = ref(false);
    const defaultCoverUrl = ref(defaultCover);
    const defaultBackgroundUrl = ref(defaultBackground);
    const parallaxImgUrl = ref(parallaxImg);
    const activeTab = ref('login');
    const userInfo = ref();
    return{
        defaultAvatarUrl,
        profilePanel,
        isLoggedIn,
        defaultCoverUrl,
        defaultBackgroundUrl,
        parallaxImgUrl,
        activeTab,
        userInfo,
    };
})