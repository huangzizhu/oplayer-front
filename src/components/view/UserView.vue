<template>
  <div class="user-view-container">
    <LoginFrame></LoginFrame>
  </div>
</template>

<script setup>
import LoginFrame from "@/components/view/user/LoginFrame.vue";

</script>
<style scoped>
.user-view-container {
  width: 50%;
  height: 100%;
  margin: 20% auto;
  z-index: 9999;
}
</style>