import { getCaptcha } from "@/utils/api/OtherApi";
import { ElMessage } from "element-plus";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { getLoginStatus } from "@/utils/api/UserApi";
import { useRouter } from 'vue-router'
import {useUserStore} from "@/store/User";
import {useBgStore} from "@/store/BG";
import ColorThief from 'colorthief';

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

export const refreshCaptcha = (uuidRef, captchaImageSrcRef) => {
    uuidRef.value = uuidv4()
    loadCaptcha(uuidRef.value, captchaImageSrcRef)
};
export const getUserInfo = async () => {
    const userStore = useUserStore();
    try {
        const response = await getLoginStatus();
        if (response.code === 1) {
            userStore.isLoggedIn = true;
            try {
                await checkImage(response.data.background);
                useBgStore().currentBgImage = response.data.background;
            } catch (error) {
                console.error(error.message);
                useBgStore().currentBgImage = userStore.defaultBackgroundUrl;
                response.data.background = userStore.defaultBackgroundUrl;
            }
            try {
                await checkImage(response.data.avatarUrl);
            } catch (error) {
                console.error(error.message);
                response.data.avatarUrl = userStore.defaultAvatarUrl;
            }
            userStore.userInfo = response.data;
            return response.data;
        } else {
            ElMessage.error(response.msg)
            userStore.isLoggedIn = false;
        }
    } catch (error) {
        if (error.status !== 401) {
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
export const checkImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => resolve(true); // 图片加载成功
        img.onerror = () => reject(new Error("图片加载失败")); // 图片加载失败
    });
};

// 格式化时长
export const formatDuration = (minutes) => {
    if (minutes === null || minutes === undefined) minutes = 0;
    const mins = parseInt(minutes)
    if (mins < 60) return `${mins}min`

    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    return `${hours}h${remainingMins > 0 ? `${remainingMins}min` : ''}`
}


export async function getMainColorHex(img) {
    return new Promise((resolve, reject) => {
        let image;
        if (typeof img === 'string') {
            console.log(img)
            // 如果传入的是图片 URL
            image = new Image();
            image.crossOrigin = 'Anonymous'; // 防止跨域问题
            image.onload = () => handleImageLoaded(image);
            image.onerror = () => reject(new Error('Failed to load image'));
            image.src = img;
        } else if (img instanceof HTMLImageElement) {
            // 如果传入的是图片 DOM 元素
            image = img;
            handleImageLoaded(image);
        } else {
            reject(new Error('Invalid input: must be a URL or HTMLImageElement'));
        }

        function handleImageLoaded(imgElement) {
            try {
                const colorThief = new ColorThief();
                const rgb = colorThief.getColor(imgElement); // 获取主色调的 RGB 值
                const hex = rgbToHex(rgb[0], rgb[1], rgb[2]); // 转换为十六进制
                resolve(hex);
            } catch (error) {
                reject(error);
            }
        }
    });
}

/**
 * 将 RGB 颜色值转换为十六进制字符串
 * @param {Number} r - 红色值
 * @param {Number} g - 绿色值
 * @param {Number} b - 蓝色值
 * @returns {String} 十六进制颜色值（如 #AABBCC）
 */
function rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
export function getAdaptiveBgColor(hexColor) {
    // 1. 将十六进制颜色转换为 RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // 2. 计算亮度（范围 0~1）
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // 3. 如果背景太亮（>70%亮度），返回深灰色；否则返回原始颜色
    return luminance > 0.9 ? "#333333" : hexColor;
}