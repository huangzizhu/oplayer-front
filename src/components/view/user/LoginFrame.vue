<template>
  <div class="login-frame">
    <el-form label-width="80px">
      {{loginForm}}
      <p class="title">Oplay</p>
      <el-form-item label="用户名" prop="username">
        <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            style="width: 200px;"
        ></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            style="width: 200px;"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="button" type="primary" @click="login"
        >登 录</el-button
        >
        <el-button class="button" type="info" @click="clear">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script setup>
import { ref } from 'vue'
const loginForm = ref({ username: "", password: "" });
</script>

<style scoped>
.login-frame {
  width: 60%;
  margin: 0 auto;
  padding-top: 100px;
}
</style>