<template>
  <div class="app">

    <!-- 导航栏 -->
    <NavBar></NavBar>

    <!-- 主页面 -->
    <router-view></router-view>

  </div>
</template>

<script setup>
import  NavBar  from '@/components/NavBar.vue';


</script>

<style>

</style>
