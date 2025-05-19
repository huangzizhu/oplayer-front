import axios from "axios";
import {TinyNotify} from "@opentiny/vue";

export const downloadMusic = (song) => {
    // 创建一个新的 axios 实例，用于处理文件下载
    const axiosInstance = axios.create({
        baseURL: '/op', // 如果有基础路径，可以在这里设置
        responseType: 'blob', // 设置响应类型为 blob，用于处理文件流
    });
    // 添加请求拦截器
    axiosInstance.interceptors.request.use(
        (config) => {
            const loginUser = JSON.parse(localStorage.getItem("loginUser"));
            if (loginUser) {
                config.headers.set("token", loginUser);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        })
    // 发起请求
    axiosInstance.get(`/music/download/${song.md5}`)
        .then(response => {
            // 创建一个 a 标签，用于触发下载
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${song.artist} - ${song.name}.mp3`); // 设置下载文件的默认名称
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            TinyNotify({
                message: '下载完成',
                type: 'success',
                duration: 2000,
                position: 'top-right',
            });
        })
        .catch(error => {
            console.error('下载失败:', error);
            TinyNotify({
                message: `下载失败: ${error.message}`,
                type: 'error',
                duration: 2000,
                position: 'top-right',
            });
        });
};