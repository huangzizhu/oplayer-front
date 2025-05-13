<template>
  <div class="user-form-container">
    <div class="avatar-upload-container">
      <tiny-file-upload class="upload-demo"
                        :action="action"
                        :headers="headers"
                        @success="handleAvatarSuccess"
                        :before-upload="beforeUpload"
                        :show-file-list="false">
        <img v-if="formData.avatarUrl" :src="formData.avatarUrl" class="avatar-image" />
        <div v-else class="avatar-placeholder">
          <tiny-icon-plus class="upload-icon" />
        </div>
      </tiny-file-upload>
    </div>

    <!-- 基本信息表单 -->
    <tiny-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
      <div class="form-grid">
        <!-- 第一行：邮箱和手机号 -->
        <tiny-form-item label="邮箱" prop="email">
          <tiny-input v-model="formData.email" placeholder="请输入邮箱"></tiny-input>
        </tiny-form-item>

        <tiny-form-item label="手机号" prop="phone">
          <tiny-input v-model="formData.phone" placeholder="请输入手机号"></tiny-input>
        </tiny-form-item>

        <!-- 第二行：性别和生日 -->
        <tiny-form-item label="性别" prop="gender">
          <tiny-radio-group v-model="formData.gender">
            <tiny-radio :label="1">男</tiny-radio>
            <tiny-radio :label="2">女</tiny-radio>
          </tiny-radio-group>
        </tiny-form-item>

        <tiny-form-item label="生日" prop="birthDate">
          <tiny-date-picker v-model="formData.birthDate" type="date" placeholder="选择日期"></tiny-date-picker>
        </tiny-form-item>
      </div>

      <!-- 个人介绍 -->
      <tiny-form-item label="个人介绍" prop="description">
        <tiny-input
            type="textarea"
            v-model="formData.description"
            placeholder="请介绍一下自己"
            :autosize="{ minRows: 3, maxRows: 6 }"
        ></tiny-input>
      </tiny-form-item>

      <!-- 背景图上传 -->
      <tiny-form-item label="背景图" prop="background">
        <tiny-file-upload
            :action="action"
            :headers="headers"
            :before-upload="beforeUpload"
            :show-file-list="false"
            @success="handleBGSuccess"
        >
          <tiny-button type="primary">点击上传</tiny-button>
        </tiny-file-upload>
        <div class="upload-tip" v-if="backgroundFile">已选择文件: {{ backgroundFile.name }}</div>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>

<script setup>
/*eslint-disable*/
import { ref, reactive } from 'vue'
import {
  TinyForm,
  TinyFormItem,
  TinyInput,
  TinyRadio,
  TinyRadioGroup,
  TinyDatePicker,
  TinyFileUpload,
  TinyButton,
  TinyNotify
} from '@opentiny/vue'
import { iconPlus } from '@opentiny/vue-icon'

// 表单数据
const formData = reactive({
  email: '',
  phone: '',
  gender: 1,
  birthDate: '',
  avatarUrl: '',
  description: '',
  background: ''
})

const backgroundFile = ref(null)
const formRef = ref(null)
const token = ref('')
const action = '/op/upload/img'
const headers = {}
const TinyIconPlus = iconPlus()

// 验证规则
const rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  birthDate: [
    { required: true, message: '请选择生日', trigger: 'change' }
  ],
  description: [
    { max: 500, message: '长度不能超过500个字符', trigger: 'blur' }
  ]
}

// 头像上传处理
const beforeUpload = (rawFile) => {
  token.value = JSON.parse(localStorage.getItem('loginUser'))
  headers.token = token.value

  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    TinyNotify({ message: '只能上传 JPG/PNG 格式的图片', position: 'top-right', duration: 1000 })
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    TinyNotify({ message: '上传头像图片大小不能超过 10MB', position: 'top-right', duration: 1000 })
    return false
  }
  return true
}

const handleAvatarSuccess = (res, file) => {
  formData.avatarUrl = res.data;
}
const handleBGSuccess =  (res, file) => {
  backgroundFile.value = file;
  formData.background = res.data;
}
const setFormData = (data) => {
  Object.assign(formData, data);
};

const getFormData = () => {
  return {...formData};
};

// 暴露方法给父组件
defineExpose({
  setFormData,
  getFormData
});
</script>

<style scoped>
.user-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* 表单输入组样式 */
:deep(.tiny-form-item) {
  margin-bottom: 20px;
}

:deep(.tiny-form-item__content) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.tiny-form-item__label) {
  font-size:16px;
  color: #A0A0A0;
  padding-bottom: 0;
}

/* 输入框基础样式 */
:deep(.tiny-input .tiny-input__inner),
:deep(.tiny-textarea .tiny-textarea__inner),
:deep(.tiny-date-editor .tiny-input__inner) {
  color: white !important;
  background-color: #24222A !important;
  border: 1px solid #302E38 !important;
  transition: all 0.3s !important; /* 确保过渡效果 */
  height: 3em !important;
}

/* 输入框聚焦状态 - 提高选择器优先级 */
:deep(.tiny-input.is-active .tiny-input__inner),
:deep(.tiny-input .tiny-input__inner:focus),
:deep(.tiny-textarea.is-active .tiny-textarea__inner),
:deep(.tiny-textarea .tiny-textarea__inner:focus),
:deep(.tiny-date-editor.active .tiny-input__inner),
:deep(.tiny-date-editor .tiny-input__inner:focus) {
  background-color: #302E38 !important;
  border-color: #8C66FF !important;
  box-shadow: 0 0 0 2px rgba(140, 102, 255, 0.2) !important;
  outline: none !important; /* 移除默认的outline */
}

/* 单选按钮组样式 */
:deep(.tiny-radio-group) {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

:deep(.tiny-radio__label) {
  color: white !important;
  font-size: 14px;
}

:deep(.tiny-radio__input.is-checked .tiny-radio__inner) {
  background-color: #8C66FF !important;
  border-color: #8C66FF !important;
}

:deep(.tiny-radio__inner) {
  border: 1px solid #302E38;
}

/* 文本域样式 */
:deep(.tiny-textarea__inner) {
  min-height: 100px;
  resize: vertical;
}

/* 上传按钮样式 */
:deep(.tiny-button--primary) {
  background-color: #8C66FF !important;
  border-color: #8C66FF !important;
  color: white !important;
  padding: 0.8em 1.5em !important;
  border-radius: 0.5em !important;
  transition: all 0.3s !important;
}

:deep(.tiny-button--primary:hover) {
  background-color: #7A55E6 !important;
  border-color: #7A55E6 !important;
}

/* 重置按钮样式 */
:deep(.tiny-button:not(.tiny-button--primary)) {
  background-color: transparent !important;
  border-color: #8C66FF !important;
  color: #8C66FF !important;
  padding: 0.8em 1.5em !important;
  border-radius: 0.5em !important;
  transition: all 0.3s !important;
}

:deep(.tiny-button:not(.tiny-button--primary):hover) {
  background-color: rgba(140, 102, 255, 0.1) !important;
}

/* 其他原有样式保持不变 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.avatar-upload-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.upload-demo :deep(.tiny-upload) {
  width: 6em;
  height: 6em;
  border-radius: 50%;
  border: 2px dashed #d9d9d9;
  background: var(--tv-color-bg);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  padding: 0;
  margin: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: var(--tv-color-text-secondary);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>