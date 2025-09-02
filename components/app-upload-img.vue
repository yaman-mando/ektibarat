<template>
  <div class="relative">
    <!-- Overlay أثناء الرفع -->
    <div v-if="isUpload" class="absolute inset-0 bg-white bg-opacity-60 z-10 flex items-center justify-center">
      <div class="text-gray-600 text-lg">جاري الرفع...</div>
    </div>

    <!-- صورة مرفوعة -->
    <div v-if="fileUrl && !isUploaderOnly" class="p-4 border border-dashed rounded bg-gray-50">
      <div class="flex items-center justify-center gap-2">
        <img :src="fileUrl" width="75" height="75" alt="" class="rounded" />
        <i class="fa fa-close text-red-500 cursor-pointer text-lg" @click="removePicture"></i>
      </div>
    </div>

    <!-- رفع صورة جديدة -->
    <div
      v-if="!fileUrl"
      class="border border-dashed rounded bg-gray-100 h-36 flex items-center justify-center cursor-pointer"
      @dragover.prevent="isDrop = true"
      @dragleave="isDrop = false"
      @drop.prevent="dropHandler"
      @click="onClickWrapper"
    >
      <input
        ref="fileInput"
        type="file"
        hidden
        :accept="acceptExtModel"
        @input="uploadPhoto"
      />

      <div :class="['text-center', isDrop ? 'opacity-20' : 'opacity-100']">
        <div class="bg-gray-200 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
          <img src="/images/main-icon/upload.webp" alt="" />
        </div>
        <p class="mt-2 text-gray-600">قم بالضغط هنا أو بسحب الصورة</p>
        <p class="text-gray-500 text-sm">الصيغ المتاحة: {{ acceptExtLabelModel }}</p>
        <p v-if="isDrop" class="text-blue-600 mt-1">أفلت هنا</p>
      </div>
    </div>

    
    <client-only>
      <lazy-app-image-cropper
        v-model:openCropper="openCropper"
        :hasDelete="editableImage"
        :img="img"
        @cropImg="cropImg"
        @onDelete="removePicture"
      />
    </client-only>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import {
  dataURLtoFile,
  toBase64,
} from '~/main/utils/shared-utils';
import { useUuid } from '@/composables/useUuid'
import { useNuxtApp } from '#app'
import {LIBRARY_TYPE_LIST,IMAGE_ACCEPT_ENUM,IMAGE_ACCEPT_TYPE,pictureTypesEnum} from '~/main/constants/global.enums.ts'

const props = defineProps({
  isUploaderOnly: Boolean,
  isLibrary: Boolean,
  acceptExt: { type: String, default: 'image/*' },
  type: { type: Number, default: 1 },
  pictureTypePayload: Number,
  fileUrl: { type: String, default: '' },
  file: { type: String, default: '' },
  editableImage: Boolean
})

const emit = defineEmits(['update:fileUrl', 'update:file', 'onRemove', 'onAdded', 'uploaderDone'])

const isDrop = ref(false)
const isUpload = ref(false)
const openCropper = ref(false)
const img = ref('')
const fileInput = ref(null)

const nuxtApp = useNuxtApp()

const modalIdModel = useUuid()

const runtimeConfig = useRuntimeConfig();

const acceptExtModel = computed(() => {
  if (LIBRARY_TYPE_LIST.includes(props.type)) {
    return [...IMAGE_ACCEPT_ENUM.png, ...IMAGE_ACCEPT_ENUM.svg].join(',')
  } else {
    return IMAGE_ACCEPT_ENUM.any.join(',')
  }
})

const acceptExtLabelModel = computed(() => {
  return acceptExtModel.value
    .replace(/image\//g, '')
    .replace(/\+.+/g, '')
    .replace(/,/g, ', ')
})

watch(() => props.file, (newVal) => {
  if (newVal) {
    emit('update:fileUrl', getFileUrl(props.type, newVal))
  }
}, { immediate: true })

function getFileUrl(type, pictureUrl) {
  const part1 = `${runtimeConfig.public.baseImageUrl}/${pictureTypesEnum[type]}/${pictureUrl}`
  return LIBRARY_TYPE_LIST.includes(type) ? part1 : `${part1}-full.jpg`
}

function removePicture() {
  emit('update:file', '')
  emit('update:fileUrl', '')
  emit('onRemove')
}

function showModalLibrary() {
  if (props.isLibrary) {
    nuxtApp.$openModalLibrary(nuxtApp.$bvModal, modalIdModel.value)
  }
}

function onClickWrapper() {
  if (props.isLibrary) {
    showModalLibrary()
  } else {
    fileInput.value?.click()
  }
}

async function isValidFileType(fileType) {
  const list = LIBRARY_TYPE_LIST.includes(props.type)
    ? IMAGE_ACCEPT_TYPE.library
    : IMAGE_ACCEPT_TYPE.default
  return list.includes(fileType)
}

async function uploadPhoto(event) {
  const file = event.target.files[0]
  if (!file) return

  const isValid = await isValidFileType(file.type)
  if (!isValid) return onNotSupportedType()

  img.value = await toBase64(file)
  openCropper.value = true
}

function onNotSupportedType() {
  showToastError(nuxtApp.$bvToast, {}, 'صيغة الملف غير صحيحة')
}

async function dropHandler(event) {
  isDrop.value = false
  const file = event.dataTransfer.items[0].getAsFile()
  const isValid = await isValidFileType(file.type)
  if (!isValid) return onNotSupportedType()

  img.value = await toBase64(file)
  openCropper.value = true
}

async function cropImg(croppedDataUrl) {
  const file = await dataURLtoFile(croppedDataUrl, 'uploaded-img')
  uploadAction(file)
}

function uploadAction(file) {
  isUpload.value = true
  const formData = new FormData()
  formData.append('File', file)
  formData.append('Type', props.pictureTypePayload || props.type)



  const { $axios } = useNuxtApp();

  $axios.post('media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => {
    if (props.isUploaderOnly) {
      emit('uploaderDone', res.data)
    } else {
      emit('update:file', res.data.pictureUrl)
      emit('update:fileUrl', getFileUrl(props.type, res.data.pictureUrl))
      emit('onAdded')
    }
    isUpload.value = false
  })
}
</script>
