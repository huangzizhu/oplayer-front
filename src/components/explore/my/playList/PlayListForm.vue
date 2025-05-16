<script setup>
/* eslint-disable */
import {TinyButton, TinyDialogBox, TinyFileUpload, TinyFormItem, TinyForm, TinyInput, TinyNotify,} from '@opentiny/vue'
import {ref, watch, computed, reactive,onMounted} from "vue";
import {useUserStore} from "@/store/User";
import {getPlayListInfoById, updatePlayListInfo} from "@/utils/api/PlayListApi";


const emit = defineEmits(['update:playlist-box-visibility','update:playlist-info']);
const props = defineProps({
  boxVisibility: {
    type: Boolean,
    default: false
  },
  listId:{
    type: Number,
    required: true
  },
  uid:{
    type: Number,
    required: true
  }
})
const localBoxVisibility = computed({
  get: () => props.boxVisibility,
  set: (value) => emit('update:playlist-box-visibility', value)
})
const action = '/op/upload/img'
const headers = {}
const token = ref('')
const coverFile = ref(null)
// 表单数据
const formData = reactive({
  name: '',
  description: '',
  coverUrl: '',
  id: computed(() => props.listId),
  creatorId: computed(() => props.uid)
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
  console.log("exec")
  const response = await getPlayListInfoById(props.listId);
  if (response.code) {
    formData.name = response.data.name
    formData.description = response.data.description
    formData.coverUrl = response.data.coverUrl
    console.log(formData,"11")
  }
}
const handleSubmit = async () => {
  const response = await updatePlayListInfo(formData);
  if (response.code) {
    localBoxVisibility.value = false
    emit('update:playlist-info')
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
      <tiny-form-item label="歌单名称" prop="name">
        <tiny-input v-model="formData.name" placeholder="给歌单取个好听的名字吧"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="歌单介绍" prop="description">
        <tiny-input
            type="textarea"
            v-model="formData.description"
            placeholder="介绍一下你的歌单吧"
            :autosize="{ minRows: 3, maxRows: 6 }"
        ></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="歌单封面" prop="cover">
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