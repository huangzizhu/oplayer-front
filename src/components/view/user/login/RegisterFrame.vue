<template>
  <div class="register-container">
    <div class="register-box">
      <!-- 1. Logo和文字区域 -->
      <div class="logo-section">
        <h2>用户注册</h2>
      </div>

      <!-- 2. 用户名输入 -->
      <div class="input-group" :class="{ 'active': isUsernameActive, 'error': usernameError }">
        <label for="username">用户名</label>
        <input
            id="username"
            type="text"
            v-model="username"
            @focus="isUsernameActive = true"
            @blur="validateUsername"
            placeholder="请输入用户名"
        >
        <span class="error-message" v-if="usernameError">{{ usernameError }}</span>
      </div>

      <!-- 9.新增：手机号输入-->
      <div class="input-group" :class="{ 'active': isPhoneActive, 'error': phoneError }">
        <label for="phone">手机号</label>
        <input
            id="phone"
            type="text"
            v-model="phone"
            @focus="isPhoneActive = true"
            @blur="validatePhone"
            placeholder="请输入手机号"
        >
        <span class="error-message" v-if="phoneError">{{ phoneError }}</span>
      </div>

      <!-- 3. 密码输入 -->
      <div class="input-group" :class="{ 'active': isPasswordActive, 'error': passwordError }">
        <label for="password">密码</label>
        <div class="password-input">
          <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              @focus="isPasswordActive = true"
              @blur="validatePassword"
              placeholder="请输入密码"
          >
        </div>
        <span class="error-message" v-if="passwordError">{{ passwordError }}</span>
      </div>

      <!-- 4. 密码确认 -->
      <div class="input-group" :class="{ 'active': isConfirmPasswordActive, 'error': confirmPasswordError }">
        <label for="confirmPassword">确认密码</label>
        <div class="password-input">
          <input
              id="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              @focus="isConfirmPasswordActive = true"
              @blur="validateConfirmPassword"
              placeholder="请再次输入密码"
          >
        </div>
        <span class="error-message" v-if="confirmPasswordError">{{ confirmPasswordError }}</span>
      </div>

      <!-- 5. 邮箱输入 -->
      <div class="input-group" :class="{ 'active': isEmailActive, 'error': emailError }">
        <label for="email">邮箱</label>
        <div class="email-input">
          <input
              id="email"
              type="email"
              v-model="email"
              @focus="isEmailActive = true"
              @blur="validateEmail"
              placeholder="请输入邮箱"
          >
          <button class="send-code-btn" @click="sendEmailCode" :disabled="isSending">
            {{ isSending ? `${countdown}s后重试` : '发送验证码' }}
          </button>
        </div>
        <span class="error-message" v-if="emailError">{{ emailError }}</span>
      </div>

      <!-- 6. 邮箱验证码输入 -->
      <div class="input-group" :class="{ 'active': isEmailCodeActive, 'error': emailCodeError }">
        <label for="emailCode">邮箱验证码</label>
        <input
            id="emailCode"
            type="text"
            v-model="emailCode"
            @focus="isEmailCodeActive = true"
            @blur="validateEmailCode"
            placeholder="请输入邮箱验证码"
        >
        <span class="error-message" v-if="emailCodeError">{{ emailCodeError }}</span>
      </div>

      <!-- 7. 图片验证码 -->
      <div class="input-group" :class="{ 'active': isCaptchaActive, 'error': captchaError }">
        <label for="captcha">图片验证码</label>
        <div class="captcha-section">
          <input
              id="captcha"
              type="text"
              v-model="captcha"
              @focus="isCaptchaActive = true"
              @blur="validateCaptcha"
              placeholder="请输入图片验证码"
          >
          <img
              id="image"
              :src="captchaImageSrc"
              alt="验证码"
              @click="handleRefreshCaptcha"
              width="45%"
          />
        </div>
        <span class="error-message" v-if="captchaError">{{ captchaError }}</span>
      </div>

      <!-- 8. 注册按钮 -->
      <button class="register-btn" @click="handleRegister">注册</button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, defineEmits} from 'vue';
import {hashPassword, refreshCaptcha} from '@/utils/UserUtils';
import {ElMessage} from "element-plus";
import {sendEmail} from "@/utils/api/OtherApi";
import {register} from "@/utils/api/UserApi";
import {useRouter} from "vue-router";
const router = useRouter();

// 定义响应式数据
const username = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const emailCode = ref('');
const captcha = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isUsernameActive = ref(false);
const isPhoneActive = ref(false);
const isPasswordActive = ref(false);
const isConfirmPasswordActive = ref(false);
const isEmailActive = ref(false);
const isEmailCodeActive = ref(false);
const isCaptchaActive = ref(false);
const isSending = ref(false);
const countdown = ref(60);
const uuid = ref('');
const captchaImageSrc = ref('');
const hashedPassword = ref('');
const emit = defineEmits(['reg-success']);

// 错误信息
const usernameError = ref('');
const phoneError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const emailError = ref('');
const emailCodeError = ref('');
const captchaError = ref('');

const sendEmailForm = ref({
  uuid: '',
  email: '',
  captcha: ''
});
const regForm = ref({
  username: '',
  hashedPassword: '',
  email: '',
  emailCode: '',
  imageCode: '',
  uuid: '',
  phone: ''
});

// 验证方法
const validateUsername = () => {
  isUsernameActive.value = false;
  if (!username.value) {
    usernameError.value = '用户名不能为空';
    return false;
  }
  if (username.value.length < 4 || username.value.length > 16) {
    usernameError.value = '用户名长度应在4-16个字符之间';
    return false;
  }
  usernameError.value = '';
  return true;
};

const validatePhone = () => {
  isPhoneActive.value = false;
  if (!phone.value) {
    phoneError.value = '手机号不能为空';
    return false;
  }
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone.value)) {
    phoneError.value = '请输入有效的手机号码';
    return false;
  }
  phoneError.value = '';
  return true;
};

const validatePassword = () => {
  isPasswordActive.value = false;
  if (!password.value) {
    passwordError.value = '密码不能为空';
    return false;
  }
  if (password.value.length < 8 || password.value.length > 20) {
    passwordError.value = '密码长度应在8-20个字符之间';
    return false;
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,20}$/;
  if (!passwordRegex.test(password.value)) {
    passwordError.value = '密码必须包含大小写字母和数字';
    return false;
  }
  passwordError.value = '';
  return true;
};

const validateConfirmPassword = () => {
  isConfirmPasswordActive.value = false;
  if (!confirmPassword.value) {
    confirmPasswordError.value = '请再次输入密码';
    return false;
  }
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = '两次输入的密码不一致';
    return false;
  }
  confirmPasswordError.value = '';
  return true;
};

const validateEmail = () => {
  isEmailActive.value = false;
  if (!email.value) {
    emailError.value = '邮箱不能为空';
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = '请输入有效的邮箱地址';
    return false;
  }
  emailError.value = '';
  return true;
};

const validateEmailCode = () => {
  isEmailCodeActive.value = false;
  if (!emailCode.value) {
    emailCodeError.value = '验证码不能为空';
    return false;
  }
  emailCodeError.value = '';
  return true;
};

const validateCaptcha = () => {
  isCaptchaActive.value = false;
  if (!captcha.value) {
    captchaError.value = '验证码不能为空';
    return false;
  }
  captchaError.value = '';
  return true;
};

const validateAll = () => {
  const validations = [
    validateUsername(),
    validatePhone(),
    validatePassword(),
    validateConfirmPassword(),
    validateEmail(),
    validateEmailCode(),
    validateCaptcha()
  ];
  return validations.every(v => v);
};

const sendEmailCode = async () => {
  if (!validateEmail() || !validateCaptcha()) return;

  sendEmailForm.value.email = email.value;
  sendEmailForm.value.captcha = captcha.value;
  sendEmailForm.value.uuid = uuid.value;
  const response = await sendEmail(sendEmailForm.value)
  if (response.code === 1) {
    ElMessage.success('验证码已发送至邮箱，请查收');
    isSending.value = true;
    const interval = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(interval);
        isSending.value = false;
        countdown.value = 60;
      }
    }, 1000);
  } else {
    ElMessage.error(response.msg);
  }
};

const handleRefreshCaptcha = () => {
  refreshCaptcha(uuid,captchaImageSrc)
};

const handleRegister = async () => {
  if (!validateAll()) return;

  hashPassword(hashedPassword,password);
  regForm.value.uuid = uuid.value;
  regForm.value.username = username.value;
  regForm.value.hashedPassword = hashedPassword.value;
  regForm.value.email = email.value;
  regForm.value.emailCode = emailCode.value;
  regForm.value.imageCode = captcha.value;
  regForm.value.phone = phone.value;

  const response = await register(regForm.value)
  if (response.code === 1) {
    ElMessage.success('注册成功');
    emit('reg-success');
    router.push('/user');
  } else {
    ElMessage.error(response.msg);
  }
};

onMounted(()=>{
  handleRefreshCaptcha()
})
</script>

<style scoped>
/* 原有样式保持不变，添加以下错误样式 */
.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.input-group.error input {
  border-color: #ff4d4f;
}

.input-group.error.active input {
  border-color: #ff4d4f;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

.backGround {
  z-index: 50;
}
.register-box {
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
  padding: 30px;
  flex-direction: column;
  position: relative; /* 新增 */
  overflow-y: hidden;
}
.register-box::before,
.register-box::after {
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
/* 添加遮罩层，只显示边缘 */
.register-box::before,
.register-box::after {
  -webkit-mask:
      linear-gradient(#fff, #fff) content-box,
      linear-gradient(#fff, #fff);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 2px; /* 控制流光宽度 */
}

.register-box::after {
  animation-delay: -4s;
}

.register-box > * {
  position: relative;
  z-index: 2;
}

/* 复用登录页面的动画关键帧 */
@keyframes animate {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0;
  }
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
.password-input {
  display: flex; /* 确保父容器是 flex 布局 */
  align-items: center; /* 垂直居中对齐 */
}

.password-input input {
  flex: 1; /* 让输入框占满剩余空间 */
}
.email-input {
  position: relative;
}


.email-input input {
  padding-right: 120px;
}

.send-code-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 12px;
  background-color: #8C66FF;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.send-code-btn:hover {
  background-color: #7a5ae0;
}

.send-code-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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


.register-btn {
  padding: 12px;
  background-color: #8C66FF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.register-btn:hover {
  background-color: #7a5ae0;
}

.login-link {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.login-link span {
  color: #8C66FF;
  cursor: pointer;
  text-decoration: underline;
}

.login-link span:hover {
  color: #7a5ae0;
}
</style>