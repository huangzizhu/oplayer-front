import {getCaptcha} from "@/utils/api/OtherApi";
import {ElMessage} from "element-plus";
import CryptoJS from "crypto-js";
import {v4 as uuidv4} from "uuid";
import {getLoginStatus} from "@/utils/api/UserApi";
import { useRouter } from 'vue-router'
import {useUserStore} from "@/store/User";
import {useBgStore} from "@/store/BG";

const router = useRouter();

export const loadCaptcha = async (uuid, captchaImageSrcRef) => {
    try {
        const response = await getCaptcha(uuid);
        captchaImageSrcRef.value = URL.createObjectURL(response);
        // 存储uuid到sessionStorage
        sessionStorage.setItem('captcha_uuid', uuid);
    } catch (error) {
        ElMessage.error('加载验证码失败');
    }
};
export const hashPassword = (hashedPasswordRef, passwordRef) => {
    // 使用 SHA-256 哈希算法
    hashedPasswordRef.value = CryptoJS.SHA256(passwordRef.value).toString();
}

export const refreshCaptcha = (uuidRef,captchaImageSrcRef) => {
    uuidRef.value = uuidv4()
    loadCaptcha(uuidRef.value,captchaImageSrcRef)
};
export const getUserInfo = async () => {
    const userStore = useUserStore();
    try {
        const response = await getLoginStatus();
        if (response.code === 1) {
            userStore.isLoggedIn = true;
            console.log(response.data);
            try {
                await checkBackgroundImage(response.data.background);
                useBgStore().currentBgImage = response.data.background;
            } catch (error) {
                console.error(error.message);
                useBgStore().currentBgImage = userStore.defaultBackgroundUrl;
                response.data.background = userStore.defaultBackgroundUrl;
            }
            return response.data;
        } else {
            ElMessage.error(response.msg)
            userStore.isLoggedIn = false;
        }
    } catch (error) {
        if(error.status !== 401){
            userStore.isLoggedIn = false;
            router.push('/user')
            ElMessage.error("检查登录状态失败");
        }
    }
}
export const formatDate = (dateString) => {
    // 创建 Date 对象
    const date = new Date(dateString);

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
        return 'unknown'; // 如果日期无效，返回 'unknown'
    }
    // 获取年、月、日
    const year = date.getFullYear(); // 获取年份
    const month = date.getMonth() + 1; // 获取月份，注意：getMonth() 返回的月份是从 0 开始的
    const day = date.getDate(); // 获取日期
    // 格式化为 "xxxx年xx月xx日"
    return `${year}年${month}月${day}日`;
}
const checkBackgroundImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => resolve(true); // 图片加载成功
        img.onerror = () => reject(new Error("背景图片加载失败")); // 图片加载失败
    });
};
