<template>
  <div class="search-bar-container">
    <div class="input-box">
      <input type="text" placeholder="输入以搜索" class="search-input" @blur="handleBlur" ref="searchInput"
        v-model="searchBarStore.searchText" />
      <div class="icon-container">
        <img src="@/assets/images/search.svg" alt="搜索" class="search-icon" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSearchBar } from '@/store/SearchBar';
const searchBarStore = useSearchBar();


// import { ref, onMounted, onUnmounted } from 'vue';
// // 创建对input元素的引用
// const searchInput = ref(null);

// // 聚焦方法
// const focusInput = () => {
//   setTimeout(() => {
//     searchInput.value?.focus();
//   }, 100);
// };

// // 失焦时处理（可以根据需要决定是否保持focus）
// const handleBlur = () => {
//   // 如果点击的不是搜索相关元素，可以重新获取焦点
//   setTimeout(() => {
//     searchInput.value?.focus();
//   }, 10);
// };

// // 组件挂载时自动聚焦
// onMounted(() => {
//   focusInput();

//   // 添加全局点击监听
//   document.addEventListener('click', focusInput);
// });

// // 组件卸载时移除监听器
// onUnmounted(() => {
//   document.removeEventListener('click', focusInput);
// });
</script>

<style lang="less" scoped>
.search-bar-container {
  top: 45px;
  left: 30%;
  width: 100%;
  height: 200px;
  position: absolute;
  z-index: 10;
  background-color: rgba(10, 10, 10, 0.95);
  font-family: "Comfortaa-Light", sans-serif;

  .input-box {
    width: 60%;
    height: 40%;
    display: flex;
    padding-left: 200px;
    padding-top: 15px;
    position: relative;

    .search-input {
      width: 100%;
      height: 48px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      padding-left: 20px;
      padding-right: 40px;
      font-size: 18px;
      border: none;
      outline: none;
      box-shadow: inset -15px 0 10px 15px rgba(0, 0, 0, 0.5),
        inset 0 0 20px 15px rgba(0, 0, 0, 0.5);
      font-family: "Comfortaa-Light", sans-serif;
    }

    .icon-container {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      height: 30px;
      display: flex;
      align-items: center;

      .search-icon {
        width: 25px;
        height: 25px;
      }
    }
  }
}
</style>