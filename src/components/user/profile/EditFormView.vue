<template>
  <tiny-dialog-box
      :visible="localBoxVisibility"
      title="消息"
      width="30%"
      draggable="true"
      class="custom-dialog"
      :show-close="false"
      dialog-transition="enlarge"
      custom-class="center-dialog"
  >
    <div class="dialog-content-wrapper">
      <div class="dialog-content-container">
        <ProfileForm ref="formRef"></ProfileForm>
      </div>
      <div class="button-spacer"></div>  <!-- 表单和按钮之间的1em间距 -->
    </div>
    <template #footer>
      <div class="custom-footer">
        <div class="btn-container">
          <button class="custom-btn cancel-btn" @click="closeDialog"><span>取 消</span></button>
          <div class="hover-effect cancel-effect"></div>
        </div>
        <div class="btn-container">
          <button class="custom-btn confirm-btn" @click="submitForm"><span>确 定</span></button>
          <div class="hover-effect confirm-effect"></div>
        </div>
      </div>
      <div class="footer-spacer"></div>  <!-- 按钮和底部的5em间距 -->
    </template>
  </tiny-dialog-box>
</template>

<script setup>
/* eslint-disable */
import { ref, watch } from 'vue';
import { TinyDialogBox,TinyNotify } from '@opentiny/vue';
import {getLoginStatus,updateUserInfo} from "@/utils/api/UserApi"
import ProfileForm from "@/components/user/profile/ProfileForm.vue";


const props = defineProps({
  boxVisibility: {
    type: Boolean,
    default: false,
  },
  primaryColor: {
    type: String,
    default: '#409EFF',
  },
});

const emit = defineEmits(['update:box-visibility','update:user-info']);
const localBoxVisibility = ref(props.boxVisibility);
const formRef = ref(null); // 子组件的引用

// 监听对话框打开状态
watch(
    () => props.boxVisibility,
    async (newValue) => {
      localBoxVisibility.value = newValue;
      if (newValue) {
        // 对话框打开时获取数据
        await fetchData();
      }
    }
);

// 获取数据方法
const fetchData = async () => {
  try {
    const response = await getLoginStatus();
    // 调用子组件方法设置数据
    formRef.value?.setFormData(response.data);
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

const closeDialog = () => {
  localBoxVisibility.value = false;
  emit('update:box-visibility', false);
};

// 提交方法
const submitForm = async () => {
  try {
    // 调用子组件方法获取数据
    const formData = formRef.value?.getFormData();
    console.log('提交的数据:', formData);
    // 提交数据
    const response = await updateUserInfo(formData);
    if(response.code){
      TinyNotify({
        message: '提交成功',
        type: 'success',
        duration: 2000,
        position: 'top-right',
      });
    }else {
      TinyNotify({
        message: response.msg,
        type: 'error',
        duration: 2000,
        position: 'top-right',
      });
    }
    closeDialog();
    emit('update:user-info');
  } catch (error) {
    console.error('提交失败:', error);
  }
};
</script>

<style scoped>
.center-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-dialog {
  --tv-DialogBox-bg-color: v-bind('props.primaryColor');
}

.custom-dialog :deep(.tiny-dialog-box) {
  min-width: 700px !important;
  max-width: 900px !important;
  width: 50% !important;
  height: 60vh !important;  /* 固定高度 */
  max-height: 60vh !important;
  margin: auto !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  display: flex !important;
  flex-direction: column !important;
}

.custom-dialog :deep(.tiny-dialog-box__header) {
  background: color-mix(in srgb, var(--tv-DialogBox-bg-color), black 10%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  flex-shrink: 0 !important;  /* 防止头部被压缩 */
}

.custom-dialog :deep(.tiny-dialog-box__body) {
  color: white !important;
  background: color-mix(in srgb, var(--tv-DialogBox-bg-color), black 10%) !important;
  padding: 0 !important;  /* 移除内边距 */
  flex: 1 !important;  /* 填充剩余空间 */
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;  /* 防止内容溢出 */
}

.custom-dialog :deep(.tiny-dialog-box__footer) {
  padding: 0 !important;
  position: relative !important;  /* 改为相对定位 */
  background: transparent !important;
  flex-shrink: 0 !important;  /* 防止底部被压缩 */
}
/* 内容包装器 - 控制滚动区域 */
.dialog-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 内容容器 - 可滚动区域 */
.dialog-content-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-right: 8px; /* 为滚动条留出空间 */
}

/* 表单和按钮之间的1em间距 */
.button-spacer {
  height: 1em;
  flex-shrink: 0;
}

/* 底部按钮区域 */
.custom-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
}

/* 按钮和底部的5em间距 */
.footer-spacer {
  height: 5em;
  width: 100%;
  flex-shrink: 0;
}

.btn-container {
  height: 4.5em;
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
  background: color-mix(in srgb, v-bind('props.primaryColor'), black 50%) !important;
}

.custom-btn {
  position: relative;
  padding: 12px 0;
  width: 70%;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: skewX(-15deg);
  z-index: 2;
}
.custom-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  transition: all 0.3s ease;
}

/* 取消按钮样式 */
.cancel-btn::before {
  background-color: #FF66AA;
}

/* 确认按钮样式 */
.confirm-btn::before {
  background-color: #66CCFF;
}

/* 悬停效果 */
.custom-btn:hover {
  width: 80%;
}

/* 按钮内部文字（取消倾斜效果） */
.custom-btn span {
  display: inline-block;
  transform: skewX(15deg);
}

/* 悬停时的边缘渐变效果 */
.hover-effect {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

/* 取消按钮的不均匀扩散 */
.cancel-effect {
  background:
      linear-gradient(90deg,
      rgba(255, 102, 170, 0.3) -10%,
      rgba(255, 102, 170, 0.1) 20%,
      rgba(255, 102, 170, 0) 50%,
      rgba(255, 102, 170, 0.2) 80%,
      rgba(255, 102, 170, 0.4) 110%
      );
  transform: scaleX(1.1);
}

/* 确认按钮的不均匀扩散 */
.confirm-effect {
  background:
      linear-gradient(90deg,
      rgba(102, 204, 255, 0.4) -10%,
      rgba(102, 204, 255, 0.1) 20%,
      rgba(102, 204, 255, 0) 50%,
      rgba(102, 204, 255, 0.3) 100%
      );
  transform: scaleX(1.1);
}

.btn-container:hover .hover-effect {
  opacity: 1;
}


.dialog-content-container {
  max-height: calc(60vh - 120px); /* 减去头部和底部高度 */
  overflow-y: auto; /* 添加滚动条 */
  padding-right: 8px; /* 为滚动条留出空间 */
}

/* 修改对话框主体样式 */
.custom-dialog :deep(.tiny-dialog-box__body) {
  padding-bottom: 0 !important; /* 移除原来的padding */
  display: flex;
  flex-direction: column;
  height: auto !important;
}

</style>