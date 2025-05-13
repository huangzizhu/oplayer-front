<template>
  <div class="profile-container">
    <!-- 背景层 -->
    <div class="background-layer"></div>
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 上半部分：用户信息 -->
      <div class="upper-section" ref="upperSection" >
        <div class="left-space"></div>
        <div class="profile-card-wrapper">
          <UserCard
              :avatar-url="avatarUrl"
              :username="username"
              :description="description"
              :email="email"
              :phone="phone"
              :background="background"
              @avatar-error="handleAvatarError"
              @update:box-visibility="handleEdit"
          />
        </div>


        <!-- 中间分隔空间 -->
        <div class="divider-space"></div>

        <!-- 信息展示区 -->
        <div class="info-display">
        <UserInfo :birth-date="birthDate"
                  :gender="gender"
                  :reg-time="regTime"
                  :phone="phone"
                  :uid="id"
                  :play-count="playCount"
                  :duration="duration"
        ></UserInfo>
        </div>

        <div class="right-space"></div>
      </div>

      <!-- 下半部分：收藏和歌单 (初始隐藏，滚动时显示) -->
        <div  class="lower-section" ref="lowerSection">
          <CollectionPlace :uid="id"/>
          <PlaylistPlace :uid="id"/>
        </div>
    </div>
  </div>
  <div>
    <EditFormView :box-visibility="showEditForm" :primary-color="primaryColor" @update:box-visibility="handleEdit" @update:user-info="getUser"></EditFormView>
  </div>
</template>



<script setup>
/* eslint-disable */
import {onMounted, ref} from 'vue'
import {useBgStore} from '@/store/BG'
import {useRouter} from 'vue-router'
import CollectionPlace from "@/components/user/profile/mediaDisplay/CollectionPlace.vue";
import PlaylistPlace from "@/components/user/profile/mediaDisplay/PlaylistPlace.vue";
import UserCard from "@/components/user/profile/UserCard.vue";
import {useUserStore} from "@/store/User";
import {formatDuration, getMainColorHex, getUserInfo} from "@/utils/UserUtils";
import UserInfo from "@/components/user/profile/UserInfo.vue";
import EditFormView from "@/components/user/profile/EditFormView.vue";

const router = useRouter()
const bgStore = useBgStore()
const userStore = useUserStore()

// 用户数据使用 ref 管理
const background = ref('')
const avatarUrl = ref('')
const username = ref('音乐爱好者')
const description = ref('')
const email = ref('user@example.com')
const phone = ref('')
const gender = ref('')
const birthDate = ref('')
const regTime = ref('2023-01-01')
const id = ref(0);
const playCount = ref(0);
const duration = ref('');
//触发是否显示对话框
const showEditForm = ref(false);
//对话框主色调
const primaryColor = ref('#221A21');

const handleEdit = async (value) => {
  showEditForm.value = value;
  if(value) {
    try {
      primaryColor.value = await getMainColorHex(background.value);
    }catch(err) {
      console.error('获取主色调失败:', err);
      primaryColor.value = '#221A21'; // 设置默认值
    }
  }
}

//获取用户数据
const getUser = async () => {
  const user = await getUserInfo();
  background.value = user.background;
  avatarUrl.value = user.avatarUrl;
  username.value = user.username;
  description.value = user.description;
  email.value = user.email;
  phone.value = user.phone;
  birthDate.value = user.birthDate;
  regTime.value = user.regTime;
  gender.value = user.gender;
  id.value = user.id;
  playCount.value = user.userBehavior.totalPlayCount;
  duration.value = formatDuration(user.userBehavior.totalPlayDuration);
}

const handleAvatarError = () => {
  avatarUrl.value = userStore.userAvatarUrl
}


const upperSection = ref(null); // 上半部分的引用
const lowerSection = ref(null); // 下半部分的引用


// 监听滚动事件
const handleScroll = (e) => {
  const container = document.querySelector('.profile-container');
  const deltaY = e.deltaY; // 获取滚动的距离

  // 检测滚动位置
  if (deltaY < 0) {
    // 滚动到上半部分
    container.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else if (deltaY > 0) {
    // 滚动到下半部分
    container.scrollTo({
      top: upperSection.value.offsetHeight, // 滚动到上半部分的高度
      behavior: 'smooth',
    });
  }
};

onMounted(() => {
  getUser();
  const container = document.querySelector('.profile-container');
  container.addEventListener('wheel', (e)=> {
    handleScroll(e);
    setTimeout(() => handleScroll(e),300)
  });
});


</script>

<style scoped>
/* 主容器样式 */
.profile-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-y: auto;
  scroll-snap-type: y proximity; /* 使用 proximity 模式 */
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) var(--secondary-color);
}

/* 防止程序滚动时闪烁 */
.profile-container {
  scroll-behavior: smooth;
  transition: scroll-top 0.3s ease-out;
}

/* 添加滚动过渡效果 */
.profile-container {
  scroll-behavior: smooth;
  transition: transform 0.5s ease; /* 添加平滑过渡效果 */
}

/* 背景层样式 */
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--bg-color) 100%);
  z-index: -1;
  pointer-events: none;
}

/* 主内容区样式 */
.main-content {
  width: 100%;
  height: 200vh; /* 改为固定200vh (100vh + 100vh) */
  position: relative;
}

/* 上半部分样式 */
.upper-section {
  height: 100vh;
  width: 100%;
  scroll-snap-align: start;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5%;
  box-sizing: border-box;
}

.lower-section {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 100vh; /* 定位在第二个视口 */
  left: 0;
  background: var(--bg-color);
  z-index: 2;
  scroll-snap-align: start;
  transform: translateY(0);
  will-change: transform;
  padding: 40px 10%;
  box-sizing: border-box;
  overflow-y: auto; /* 允许内部滚动 */
  transition: transform 0.5s ease; /* 添加平滑过渡效果 */
}

/* 布局辅助样式 */
.left-space, .right-space {
  width: 15%;
}

.divider-space {
  width: 10%;
}

.profile-card-wrapper {
  margin: 5% auto 0;
  width: 20%;
  position: relative;
  z-index: 2;
  height: 70%;
}

.info-display {
  margin: 5% auto 0;
  width: 40%;
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}


/* 滚动条样式 */
.profile-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.profile-container::-webkit-scrollbar-track {
  background: var(--secondary-color);
}

.profile-container::-webkit-scrollbar-thumb {
  background-color: var(--primary-color);
  border-radius: 3px;
}

.profile-container::-webkit-scrollbar-thumb:hover {
  background-color: #f500a0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .upper-section {
    flex-direction: column;
    align-items: center;
    padding-top: 10%;
  }

  .left-space, .right-space, .divider-space {
    display: none;
  }

  .profile-card-wrapper, .info-display {
    width: 80%;
    margin-bottom: 30px;
  }
}

@media (max-width: 768px) {
  .profile-container {
    scroll-snap-type: none;
  }

  .lower-section {
    padding: 20px 5%;
    height: 100vh;
  }

  .collection-place,
  .playlist-place {
    height: calc(100vh - 40px); /* 移动端减小padding */
  }

  .main-content {
    height: auto;
  }
}

/* 性能优化 */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 防止滚动时出现闪烁 */
body {
  overflow-x: hidden;
}

/* 确保内容可访问性 */
[aria-hidden="true"] {
  display: none;
}
</style>