import axios from "axios";

export const downloadMusic = (song) => {
    // 创建一个新的 axios 实例，用于处理文件下载
    const axiosInstance = axios.create({
        baseURL: '/op', // 如果有基础路径，可以在这里设置
        responseType: 'blob', // 设置响应类型为 blob，用于处理文件流
    });

    // 发起请求
    axiosInstance.get(`/music/download/${song.md5}`)
        .then(response => {
            // 创建一个 a 标签，用于触发下载
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `music.mp3`); // 设置下载文件的默认名称
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('下载失败:', error);
        });
};