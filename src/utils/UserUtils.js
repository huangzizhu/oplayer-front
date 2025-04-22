import {getCaptcha} from "@/utils/api/OtherApi";
import {ElMessage} from "element-plus";
import CryptoJS from "crypto-js";
import {v4 as uuidv4} from "uuid";

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