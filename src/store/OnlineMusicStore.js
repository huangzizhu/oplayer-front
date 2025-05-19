/* eslint-disable */
import {defineStore} from "pinia";
import {ref} from "vue";

export const useOnlineMusicStore = defineStore('onlineMusic', ()=>{
    const isOnlineMode = ref(true);



    return{
        isOnlineMode,
    };
})