import {request} from '@/utils/request';

//根据歌曲id获取
export const getCommentBySongId = (songId, pageSize, page) => request.post('/comment/music', {
    "songId": songId,
    "page": page,
    "pageSize": pageSize,
})
//根据用户id获取
export const getCommentByUserId = (userId, pageSize, page) => request.post('/comment/user', {
    "userId": userId,
    "page": page,
    "pageSize": pageSize,
})
//新增评论
export const addComment = (songId, uid, txt) => request.post('/comment', {
    "songId": songId,
    "userId": uid,
    "txt": txt,
})

//点赞
export const likeComment = (commentId) => request.post('/comment/like/' + commentId )
//取消点赞
export const dislikeComment = (commentId) => request.post('/comment/dislike/' + commentId )