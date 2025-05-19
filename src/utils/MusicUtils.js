import axios from "axios";
import {TinyNotify} from "@opentiny/vue";
import {getUserInfo} from "@/utils/UserUtils";
import {getHistory} from "@/utils/api/HistoryApi";
import {getCollectionList} from "@/utils/api/CollectionApi";
import {getPlayListSongs} from "@/utils/api/PlayListApi";
import {useOnlineMusicStore} from "@/store/OnlineMusicStore";
import {ref} from "vue";
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
    export const downloadMusic = (song) => {
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
/**
 * 获取音频流并返回 Blob URL
 * @param {string} md5 - 音频文件的 MD5 值
 * @returns {Promise<string>} - 返回一个 Promise，解析为 Blob URL
 */
export const getAudioBlobUrl = (md5) => {

    // 发起请求
    return axiosInstance.get(`/music/stream/${md5}`)
        .then(response => {
            // 将响应数据转换为 Blob
            const blob = new Blob([response.data], { type: 'audio/mpeg' });

            // 创建一个对象 URL
            const url = URL.createObjectURL(blob);
            // 返回对象 URL
            return url;
        })
        .catch(error => {
            console.error('获取音频流失败:', error);
            throw new Error(`获取音频流失败: ${error.message}`);
        });
};
//获取上次播放的
export const getLastPlayList = async () =>{
    const user = await getUserInfo();
    if (user === undefined) {
        useOnlineMusicStore().isOnlineMode = false;
        TinyNotify({
            message: '未登录，处于离线模式',
            type: 'info',
            duration: 2000,
            position: 'top-right',
        })
        return;
    }
    const HisResponse = await getHistory(user.id,1,1);
    console.log(HisResponse)
    if(HisResponse.code) {
        const emptyHistory = ref(false)
        if (HisResponse.data.list.length === 0) emptyHistory.value = true
        const lastPlay = HisResponse.data.list[0];
        //0收藏，1歌单
        if (lastPlay.listType === 0 || emptyHistory.value) {
            //获取收藏
            const collectionResponse = await getCollectionList(user.id);
            if (collectionResponse.code) return collectionResponse.data;
            else {
                const playListResponse = await getPlayListSongs(lastPlay.listId);
                if (playListResponse.code) return playListResponse.data;
            }

        }
    }
    return null;
}
export const lengthFormat = (duration)=>{
    let minutes = Math.floor(duration/60) ;
    let seconds = duration % 60;
    return `${minutes}:${seconds}`;
}

//将后端返回数据转为前端数据
export const translateMusicInfo = (music) => {
    return {
        ...music,
        title: music.name,
        album: music.albumName,
        length: lengthFormat(music.duration),
        cover: music.coverUrl,
        sourceType: "remote-api",
    };
}