<template>
  <div class="playlist-info-container">
    <div class="cover-container">
      <img :src="displayCoverUrl" alt="封面"
           class="cover-image"
           @error="handleImageError"
      />
    </div>

    <div class="cards-container">
      <div class="name-card">
        <div class="creator-info">
          <play-list-name-card :creator-avatar="creatorAvatar"
                                :creator-name="creatorName"
                                :name="name"
          >
          </play-list-name-card>
        </div>
      </div>

      <div class="description-card" v-if="description">
        <p class="description">{{ description }}</p>
      </div>

      <div class="stats-card">
        <play-list-num-card
            :duration="formattedDuration"
            :total="total"
            :update-time="formattedUpdateTime"
        ></play-list-num-card>
      </div>
    </div>
  </div>
</template>


<script setup>
/* eslint-disable */
import {computed, ref} from 'vue'
import PlayListNumCard from "@/components/explore/my/playListInfoPart/PlayListNumCard.vue";
import PlayListNameCard from "@/components/explore/my/playListInfoPart/PlayListNameCard.vue";
const imgIsError = ref(false)


const props = defineProps({
  name: String,              // 名称（"我的收藏"或歌单名称）
  coverUrl: String,          // 封面URL
  description: String,       // 描述
  total: Number,             // 歌曲数量
  duration: Number,          // 总时长（秒）
  updateTime: String,        // 创建时间
  creatorName: String,       // 创建者名称
  creatorAvatar: String ,     // 创建者头像
  alternativeCover: String,    // 替代封面URL
})

// 格式化时间显示
const formattedUpdateTime = computed(() => {
  if (!props.updateTime) return ''
  const date = new Date(props.updateTime)
  return [date.getFullYear(),date.getMonth() + 1,date.getDate()]
})

// 格式化时长显示
const formattedDuration = computed(() => {
  if (!props.duration) return [0,0]
  const minutes = Math.floor(props.duration / 60)
  const seconds = props.duration % 60
  return [minutes,seconds]
})

// 计算属性决定显示的图片URL
const displayCoverUrl = computed(() => {
  return imgIsError.value && props.alternativeCover
      ? props.alternativeCover
      : props.coverUrl
})

// 图片加载错误处理
const handleImageError = () => {
  imgIsError.value = true
}
</script>
<style scoped>
.playlist-info-container {
  display: flex;
  padding: 20px;
  background-color: transparent;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease-in;
  gap: 20px;
  align-items: center;
}

.cover-container {
  flex-shrink: 0;
  width: 254px;
  height: 254px;
  position: relative;
  overflow: hidden;
  border-radius: 1em;
  background-image: linear-gradient(144deg,#AF40FF, #5B42F3 50%,#00DDEB);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.cover-container:hover {
  transform: scale(1.01);
  box-shadow: 0px 0px 5px 2px #5a5a5a;
}

.cards-container {
  display: flex;
  gap: 20px;
  height: 254px;
}

.description-card{
  width: 190px;
  height: 254px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}


.description-card {
  background-color: rgba(245, 245, 245, 0.9); /* 灰白色 */
  overflow-y: auto;
}


.description {
  margin: 0;
  color: #555;
  line-height: 1.6;
  font-size: 14px;
  word-break: break-word;
}

/* 动画效果 */
@keyframes ran {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 2000px 0;
  }
}
</style>