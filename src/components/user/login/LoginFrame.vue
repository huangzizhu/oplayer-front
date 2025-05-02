<template>

  <div class="login-box">
    <!-- 1. Logo和文字区域 -->
    <div class="logo-section">
      <h2>用户登录</h2>
    </div>

    <!-- 2. 用户名输入 -->
    <div class="input-group" :class="{ 'active': isUsernameActive }">
      <label for="username">用户名</label>
      <input
          id="username"
          type="text"
          v-model="username"
          @focus="isUsernameActive = true"
          @blur="isUsernameActive = false"
          placeholder="请输入用户名"
      >
    </div>

    <!-- 3. 密码输入 -->
    <div class="input-group" :class="{ 'active': isPasswordActive }">
      <label for="password">密码</label>
      <input
          id="password"
          type="password"
          v-model="password"
          @focus="isPasswordActive = true"
          @blur="isPasswordActive = false"
          placeholder="请输入密码"
      >
    </div>

    <!-- 4. 验证码输入和图片 -->
    <div class="input-group" :class="{ 'active': isCaptchaActive }">
      <label for="captcha">验证码</label>
      <div class="captcha-section">
        <input
            id="captcha"
            type="text"
            v-model="captcha"
            @focus="isCaptchaActive = true"
            @blur="isCaptchaActive = false"
            placeholder="请输入验证码"
        >
        <img
            id="image"
            :src="captchaImageSrc"
            alt="验证码"
            @click="handleRefreshCaptcha"
            width="45%"
        />
      </div>
    </div>

    <!-- 5. 登录按钮 -->
    <button class="login-btn" @click="handleLogin">登录</button>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {hashPassword, refreshCaptcha} from '@/utils/UserUtils';
import { useRouter } from 'vue-router';
import {login} from "@/utils/api/UserApi";
import {ElMessage} from "element-plus";
import { defineEmits } from 'vue';

const router = useRouter();

// 定义响应式数据
const emit = defineEmits(['login-success']);
const captchaImageSrc = ref('')
const hashedPassword = ref('');
const username = ref('');
const password = ref('');
const captcha = ref('');
const isUsernameActive = ref(false);
const isPasswordActive = ref(false);
const isCaptchaActive = ref(false);
const uuid = ref('')
const loginForm = ref({
  username: '',
  hashedPassword: '',
  captcha: '',
  uuid: ''
});
// 定义方法
const handleLogin = async () => {
  if(!username.value || !password.value || !captcha.value) {
    ElMessage.error("请填写所有字段");
    return;
  }
  loginForm.value.username = username.value;
  hashPassword(hashedPassword,password);
  loginForm.value.hashedPassword = hashedPassword.value;
  loginForm.value.captcha = captcha.value;
  loginForm.value.uuid = uuid.value;
  const response = await login(loginForm.value);
  console.log(response.code)
  if(response.code){
    ElMessage.success("登陆成功");
    localStorage.setItem("loginUser", JSON.stringify(response.data.token));
    emit('login-success');
    router.push("/user");
  }
  else {
    ElMessage.error(response.msg);
  }

};

const handleRefreshCaptcha = () => {
  refreshCaptcha(uuid,captchaImageSrc);
};

onMounted(() => {
  handleRefreshCaptcha();
});
</script>

<style scoped>
/* This was made with GlassGenerator.netlify.app */
.login-box {
  color: white;
  display: flex;
  gap: 20px;
  border-radius: 21px;
  backdrop-filter: blur(11px);
  background: rgba(35, 36, 42, 0.8);
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
  border: 0px rgba(255,255,255,0.4) solid;
  border-bottom: 0px rgba(40,40,40,0.35) solid;
  border-right: 0px rgba(40,40,40,0.35) solid;
  width: 100%;
  max-width: 400px;
  padding: 30px;
  flex-direction: column;
  position: relative; /* 需要设置为relative以便伪元素定位 */
  overflow: hidden; /* 隐藏超出部分 */
}
/* 边缘流光效果 */
.login-box::before,
.login-box::after {
  content: '';
  position: absolute;
  top: -2px;  /* 调整为刚好超出边框一点 */
  left: -2px;
  right: -2px;
  bottom: -2px;
  z-index: 1;
  animation: animate 8s linear infinite; /* 延长动画时间使过渡更平滑 */
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); /* 更平滑的缓动函数 */
  background: linear-gradient(0deg, transparent, #8C66FF, #8C66FF);
  border-radius: 23px; /* 比容器大1-2px */
}

.login-box::after {
  animation-delay: -4s; /* 调整为动画时间的一半 */
}

/* 添加遮罩层，只显示边缘 */
.login-box::before,
.login-box::after {
  -webkit-mask:
      linear-gradient(#fff, #fff) content-box,
      linear-gradient(#fff, #fff);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 2px; /* 控制流光宽度 */
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
    opacity: 0; /* 起始时透明 */
  }
  5% {
    opacity: 1; /* 快速淡入 */
  }
  95% {
    opacity: 1; /* 保持可见 */
  }
  100% {
    transform: rotate(360deg);
    opacity: 0; /* 结束前淡出 */
  }
}

/* 内部内容 */
.login-box > * {
  position: relative;
  z-index: 2;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.logo-section h2 {
  color: white; /* 设置文字颜色为白色 */
}

.logo-placeholder {
  width: 80px;
  height: 80px;
  background-color: #f0f0f0;
  border-radius: 50%;
  margin-bottom: 15px;
}

h2 {
  color: #333;
  margin: 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 14px;
}

.input-group input {
  color: white;
  background-color: #24222A;
  padding: 1em 1em;
  border: 1px solid #302E38;
  border-radius: 0.5em;
  font-size: 1em;
  outline: none;
  transition: all 0.3s;
}

.input-group.active input {
  background-color: #302E38;
  border-color: #8C66FF;
  box-shadow: 0 0 0 2px rgba(140, 102, 255, 0.2);
}
.captcha-section {
  display: flex;
  height: 40px; /* 设置输入框和图片容器的高度 */
  border-radius: 4px;
  align-items: end; /* 垂直居中对齐 */
}
.input-group  {
  font-size: 14px;
  margin-bottom: 1em;
}
.captcha-section input {
  flex: 1; /* 输入框占据剩余空间 */
}

button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn {
  background-color: #8C66FF;
  color: white;
  margin-top: 10px;
}

.login-btn:hover {
  background-color: #7a5ae0;
}

.register-btn {
  background-color: white;
  color: #8C66FF;
  border: 1px solid #8C66FF;
}

.register-btn:hover {
  background-color: #f5f2ff;
}
</style>