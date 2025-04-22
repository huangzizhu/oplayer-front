// stores/user.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import defaultAvatar from '@/assets/images/avatar.jpg'
/* eslint-disable */
export const useUserStore = defineStore('user', ()=>{
    const userAvatarUrl = ref(defaultAvatar)




    return{
        userAvatarUrl,

    };
})