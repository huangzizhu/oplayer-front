<template>
  <div class="explore-container">
    <v-card>
      <v-layout>
        <v-navigation-drawer expand-on-hover rail>
          <v-list>
            <v-list-item :prepend-avatar="info.avatarUrl" :title="info.username"></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>

            <router-link to="/explore/recommend" class="custom-router-link">
              <v-list-item class="custom-list-item">
                <template v-slot:prepend>
                  <svg-icon type="mdi" :path="mdiMusicCircleOutline" class="custom-icon"></svg-icon>
                </template>
                <v-list-item-title class="custom-title">推荐</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/explore/history" class="custom-router-link">
              <v-list-item class="custom-list-item">
                <template v-slot:prepend>
                  <svg-icon type="mdi" :path="mdiHistory" class="custom-icon"></svg-icon>
                </template>
                <v-list-item-title class="custom-title">历史</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link to="/explore/my" class="custom-router-link">
              <v-list-item class="custom-list-item">
                <template v-slot:prepend>
                  <svg-icon type="mdi" :path="mdiPlaylistMusic" class="custom-icon"></svg-icon>
                </template>
                <v-list-item-title class="custom-title">我的</v-list-item-title>
              </v-list-item>
            </router-link>

          </v-list>
        </v-navigation-drawer>

        <div class="content-wrapper">
          <search-bar class="search-bar"></search-bar>
          <v-main class="main-content"><router-view></router-view></v-main>
        </div>
      </v-layout>
    </v-card>
  </div>
</template>

<script setup>
/* eslint-disable */
import SearchBar from "@/components/explore/SearchBar.vue";
import { mdiMusicCircleOutline, mdiHistory, mdiPlaylistMusic } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';
import { useUserStore } from "@/store/User";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getUserInfo } from "@/utils/UserUtils";

const info = ref({
  username: "",
  avatarUrl: useUserStore().defaultAvatarUrl,
});

watch(
  () => useUserStore().userInfo,
  (newValue) => {
    info.value.username = newValue.username;
    info.value.avatarUrl = newValue.avatarUrl;
  },
);
onMounted(() => {
  getUserInfo();
});

</script>

<style scoped>
.v-card {
  position: absolute;
  top: calc(5% + 45px);
  left: 10%;
  width: 80%;
  height: 85vh;
  background: rgba(0, 0, 0, 0.6);
  border: 3px solid #8C66FF;
  border-radius: 20px;
}

.custom-router-link {
  text-decoration: none;
  /* 移除下划线 */
  color: inherit;
  /* 继承父级颜色，避免默认蓝色 */
}

.custom-router-link:hover {
  text-decoration: none;
  /* 鼠标悬停时也不显示下划线 */
  color: inherit;
  /* 鼠标悬停时颜色不变 */
}

.v-list-item--nav {
  padding-inline: 0;
}

.custom-list-item {
  /* 默认样式 */
  background-color: transparent;
  /* 默认无背景 */
  border-radius: 5px;
  /* 圆角 */
  transition: background-color 0.3s ease;
  /* 平滑过渡效果 */
  display: flex;
  /* 使用 Flexbox 布局 */
  align-items: center;
  /* 垂直居中 */
  gap: 2em;
  /* 图标和文字之间的间距 */
  margin-top: 5px;
}

.custom-list-item:hover {
  /* 鼠标悬停时的样式 */
  background-color: rgba(200, 200, 200, 0.5);
  /* 灰色半透明背景 */
}

.custom-icon {
  width: 40px;
  /* 图标宽度 */
  height: 40px;
  /* 图标高度 */
}

.custom-title {
  font-size: 800px;
  /* 文字大小 */
  font-weight: bold;
  /* 文字加粗 */
}

.v-navigation-drawer {
  height: 50% !important;
  margin: auto 0 auto 11%;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.search-bar {
  width: 60%;
  max-width: 600px;
  height: 5vh;
}

.v-main {
  margin: 0 3% 3% 5%;
  height: 75vh;
  background: rgba(30, 30, 30, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 0px !important;
}
</style>