<script setup>
/* eslint-disable */
import {TinyButton, TinyDialogBox, TinyFileUpload, TinyFormItem, TinyForm, TinyInput, TinyNotify,} from '@opentiny/vue'
import {ref, watch, computed, reactive,onMounted} from "vue";
import {getCollectionInfo, updateCollection} from "@/utils/api/CollectionApi";
import {useUserStore} from "@/store/User";


const emit = defineEmits(['update:collection-box-visibility','update:collection-info']);
const props = defineProps({
  boxVisibility: {
    type: Boolean,
    default: false
  }
})
const localBoxVisibility = computed({
  get: () => props.boxVisibility,
  set: (value) => emit('update:collection-box-visibility', value)
})
const action = '/op/upload/img'
const headers = {}
const token = ref('')
const coverFile = ref(null)
// 表单数据
const formData = reactive({
  description: '',
  coverUrl: ''
})
// 封面上传处理
const beforeUpload = (rawFile) => {
  token.value = JSON.parse(localStorage.getItem('loginUser'))
  headers.token = token.value

  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    TinyNotify({ message: '只能上传 JPG/PNG 格式的图片', position: 'top-right', duration: 1000 })
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    TinyNotify({ message: '上传图片大小不能超过 10MB', position: 'top-right', duration: 1000 })
    return false
  }
  return true
}
const handleCoverSuccess =  (res, file) => {
  coverFile.value = file;
  formData.coverUrl = res.data;
}

const setData= async () => {
  const response = await getCollectionInfo(useUserStore().userInfo.id);
  if (response.code) {
    formData.description = response.data.description
    formData.coverUrl = response.data.coverUrl
  }
}
const handleSubmit = async () => {
  const response = await updateCollection(useUserStore().userInfo.id,formData.description,formData.coverUrl);
  if (response.code) {
    localBoxVisibility.value = false
    emit('update:collection-info')
    TinyNotify({ message: '修改成功', position: 'top-right', duration: 1000 })
  } else {
    TinyNotify({ message: response.msg, position: 'top-right', duration: 1000 })
  }
}
defineExpose({
  setData,
});
</script>

<template>
  <tiny-dialog-box :modal="false" v-model:visible="localBoxVisibility" title="编辑" width="30%">
    <tiny-form v-model="formData" label-position='top'>
      <tiny-form-item label="收藏介绍" prop="description">
        <tiny-input
            type="textarea"
            v-model="formData.description"
            placeholder="介绍一下你的收藏吧"
            :autosize="{ minRows: 3, maxRows: 6 }"
        ></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="收藏封面" prop="background">
        <tiny-file-upload
            :action="action"
            :headers="headers"
            :before-upload="beforeUpload"
            :show-file-list="false"
            @success="handleCoverSuccess"
        >
          <tiny-button type="primary">点击上传</tiny-button>
        </tiny-file-upload>
        <div class="upload-tip" v-if="coverFile">已选择文件: {{ coverFile.name }}</div>
      </tiny-form-item>
    </tiny-form>


    <template #footer>
      <tiny-button @click="localBoxVisibility=false" round>取 消</tiny-button>
      <tiny-button type="primary" @click="handleSubmit" round>确 定</tiny-button>
    </template>
  </tiny-dialog-box>
</template>

<style scoped>

</style>