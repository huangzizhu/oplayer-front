import {request} from '@/utils/request';

export const getAllPlayLists = (uid,pageSize=10,page=1) => request.post('/list/all', {
    "page": page,
    "pageSize": pageSize,
    "userId": uid,
})
//创建歌单
export const createPlayList = (data) => request.post('/list/create', data);
//添加歌曲到歌单
export const addSongToPlayList = (data) => request.post('/list/music', data);
//获取歌单中所有歌曲
export const getPlayListSongs = (listId, pageSize=10, page=1) => request.post('/list/music/all', {
    "page": page,
    "pageSize": pageSize,
    "playListId": listId,
})
//根据ID获取歌单信息
export const getPlayListInfoById = (listId) => request.get('/list/'+ listId)
//从歌单中删除歌曲
export const deleteSongFromPlayList = (data) => request.delete('/list/music', data);
//删除歌单
export const deletePlayList = (listId,uid) => request.delete('/list',{
    "id": listId,
    "creatorId": uid
})
//更新歌单信息
export const updatePlayListInfo = (data) => request.put('/list', data);
