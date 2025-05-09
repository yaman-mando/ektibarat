<template>
  <div class="view-media-files">
    <!-- img  -->
    <div
      v-if="mediaType == questionTypes.photo"
      class="img-type"
    >
      <template v-if="!hasError && emptyUrl[mediaType]">
        <lazy-app-overlay v-if="isLoadImg" />
        <img
          v-if="!isExternalLink(emptyUrl[mediaType])"
          :class="[{ 'cursor-pointer': withModal }]"
          :width="width"
          :height="height"
          :style="{
            'border-radius': radius + 'px',
            'max-height': maxHeight,
            'max-width': maxWidth,
          }"
          :src="getFileUrl(emptyUrl[mediaType])"
          alt=""
          :loading="questionAnimateConfig.disableLazyImage ? 'eager' : 'lazy'"
          @error="hasError = true"
          @click.prevent="
            withModal ? openModal('image', getFileUrl(emptyUrl[mediaType])) : ''
          "
        />
        <img
          v-else
          :width="width"
          :height="height"
          :style="{
            'border-radius': radius + 'px',
            'max-height': maxHeight,
            'max-width': maxWidth,
          }"
          :src="emptyUrl[mediaType]!"
          alt=""
          :loading="questionAnimateConfig.disableLazyImage ? 'eager' : 'lazy'"
          @error="hasError = true"
          @click.prevent="
            withModal ? openModal('image', emptyUrl[mediaType]!, true) : ''
          "
        />
      </template>
      <template v-else>
        <img
          src="/images/place-holder.webp"
          :width="width"
          :height="height"
          :style="{
            'border-radius': radius + 'px',
            'max-height': maxHeight,
            'max-width': maxWidth,
          }"
          alt=""
          :loading="questionAnimateConfig.disableLazyImage ? 'eager' : 'lazy'"
        />
      </template>

      <client-only>
        <mx-admin-image-cropper
          v-model:openCropper="openCropper"
          :hasDelete="editableImage"
          :img="modalData.url"
          @cropImg="cropImg"
          @onDelete="deleteImg"
        />
      </client-only>
    </div>

    <!-- video  -->
    <div
      v-if="mediaType == questionTypes.video"
      class="video-type"
    >
      <template v-if="emptyUrl[mediaType]">
        <video
          v-if="!isExternalLink(emptyUrl[mediaType])"
          :controls="!withModal"
          :width="width"
          :height="height"
          :style="{
            'border-radius': radius + 'px',
            'max-height': maxHeight,
            'max-width': maxWidth,
          }"
          @click.prevent="
            withModal ? openModal('video', getFileUrl(emptyUrl[mediaType])) : ''
          "
        >
          <source
            :src="getFileUrl(emptyUrl[mediaType])"
            type="video/webm"
          />

          <source
            :src="getFileUrl(emptyUrl[mediaType])"
            type="video/mp4"
          />

          <source
            :src="getFileUrl(emptyUrl[mediaType])"
            type="video/mpg"
          />

          Sorry, your browser doesn't support embedded videos.
        </video>
        <div
          v-else
          class="rw-iframe"
          style="position: relative"
        >
          <button
            v-if="withModal"
            @click.prevent="openModal('video', emptyUrl[mediaType]!, true)"
          ></button>
          <iframe
            :width="width"
            :height="height"
            :style="{
              'border-radius': radius + 'px',
              'max-height': maxHeight,
              'max-width': maxWidth,
            }"
            :src="emptyUrl[mediaType]!"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            :allowfullscreen="!withModal"
          ></iframe>
        </div>
      </template>

      <template v-else>
        <div class="no-video">
          <i class="em-icon-Group-3402"></i>
        </div>
      </template>
    </div>

    <!-- audio -->
    <div
      v-if="mediaType == questionTypes.audio"
      class="audio-type"
    >
      <template v-if="emptyUrl[mediaType]">
        <audio
          v-if="!isExternalLink(emptyUrl[mediaType])"
          :style="{ width: width, 'min-width': '150px' }"
          controls
        >
          <source
            :src="getFileUrl(emptyUrl[mediaType])"
            type="audio/ogg"
          />
          <source
            :src="getFileUrl(emptyUrl[mediaType])"
            type="audio/mpeg"
          />
          <source
            :src="getFileUrl(emptyUrl[mediaType])"
            type="audio/mp3"
          />
          Your browser does not support the audio element.
        </audio>
        <audio
          v-else
          :style="{ width: width, 'min-width': '150px' }"
          controls
        >
          <source
            :src="emptyUrl[mediaType]!"
            type="audio/ogg"
          />
          <source
            :src="emptyUrl[mediaType]!"
            type="audio/mpeg"
          />
          <source
            :src="emptyUrl[mediaType]!"
            type="audio/mp3"
          />
          Your browser does not support the audio element.
        </audio>
      </template>
      <template v-else>
        <div class="no-audio">
          <i class="em-icon-Group-3398"></i>
        </div>
      </template>
    </div>

    <lazy-app-view-media-modal
      v-model:isOpenModal="modalData.isOpenModal"
      :type="modalData.type"
      :url="modalData.url"
      :isExternalLink="modalData.isExternal"
    />
  </div>
</template>
<script lang="ts" setup>
import { QUESTION_ANIMATE_DEFAULT_CONFIG } from '~/main/utils/question-animate.utils';
import { ImageExt } from '~/main/constants/image-ext';
import { ImageSize } from '~/main/constants/image-size';
import { pictureTypes } from '~/main/constants/picture-types';
import { dataURLtoFile } from '~/main/utils/shared-utils';
import { $t } from '@primeuix/styled';
import { questionTypes } from '~/main/modules/questions/data-access/constats/question-types';

const questionAnimateConfig = inject(
  'questionAnimateConfig',
  QUESTION_ANIMATE_DEFAULT_CONFIG
);

const emit = defineEmits<{
  (e: 'getFileUrl', val: string): void;
  (e: 'croppedImg', val: File): void;
  (e: 'update:url', val: string): void;
  (e: 'onDeleteImg'): void;
}>();
//props
const props = withDefaults(
  defineProps<{
    url?: string | null;
    defaultUrl?: string | null;
    mediaType?: number;
    defaultType?: number;
    requestType?: number;
    width?: string;
    height?: string;
    radius?: string;
    maxHeight?: string;
    maxWidth?: string;
    ext?: string;
    size?: string;
    withModal?: boolean;
    editableImage?: boolean;
  }>(),
  {
    mediaType: 0,
    defaultType: 0,
    requestType: 0,
    width: 'auto',
    height: 'auto',
    radius: 'auto',
    maxHeight: '100%',
    maxWidth: '100%',
    ext: ImageExt.webp,
    size: ImageSize.hd,
  }
);

//data
const hasError = ref(false);
const emptyUrl = ref<Array<string | null>>([null, null, null, null]);
const modalData = ref({
  type: '',
  url: '',
  isExternal: false,
  isOpenModal: false,
});
const openCropper = ref(false);
const isLoadImg = ref(false);

//hook
onMounted(() => {
  handleEmptyUrl();
});

//method
function handleEmptyUrl() {
  if (props.defaultType == props.mediaType && props.defaultUrl == props.url) {
    emptyUrl.value[props.defaultType] = props.defaultUrl ?? null;
  } else {
    if (props.defaultUrl != props.url) {
      emptyUrl.value[props.mediaType] = props.url ?? null;
    }
  }
}
function isExternalLink(url: string | null | undefined) {
  return !!url?.includes('http');
}
function getFileUrl(fileUrl: string | null | undefined) {
  if (fileUrl) {
    if (
      props.requestType == pictureTypes.questions ||
      props.requestType == pictureTypes.answers
    ) {
      if (props.mediaType == 1) {
        return (
          process.env.baseImageUrl +
          '/' +
          $t(`pictureTypes.${props.requestType}`) +
          '/' +
          $t(`mediaTypeListLink.${props.mediaType}`) +
          '/' +
          fileUrl +
          `-${props.size}.${props.ext}`
        );
      } else {
        return (
          process.env.baseImageUrl +
          '/' +
          $t(`pictureTypes.${props.requestType}`) +
          '/' +
          $t(`mediaTypeListLink.${props.mediaType}`) +
          '/' +
          fileUrl
        );
      }
    } else {
      return (
        process.env.baseImageUrl +
        '/' +
        $t(`pictureTypes.${props.requestType}`) +
        '/' +
        fileUrl +
        `-${props.size}.${props.ext}`
      );
    }
  } else {
    return '/images/place-holder.webp';
  }
}

function openModal(type: string, url: string, isExternalLink = false) {
  modalData.value.type = type;
  modalData.value.url = url;
  modalData.value.isExternal = isExternalLink;
  if (type == 'image' && props.editableImage) {
    openCropper.value = true;
  } else {
    modalData.value.isOpenModal = true;
  }
}

function cropImg(img: string) {
  isLoadImg.value = true;
  const file = dataURLtoFile(img, 'uploaded-img');
  emit('croppedImg', file);
}

function deleteImg() {
  emit('update:url', '');
  emit('onDeleteImg');
}

//watch
watch(
  () => props.url,
  (newVal) => {
    emptyUrl.value.splice(props.mediaType, 1, newVal ?? null);
    isLoadImg.value = false;
  }
);
</script>
<style lang="scss" scoped>
.img-type {
  .no-photo {
    width: 60px;
    height: 46px;
    background: var(--gray-f7);
    border-radius: 5px;
    border: 1px solid var(--gray-c7);
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 24px;
    }
  }
  img {
    background: transparent;
  }
}

.video-type {
  display: flex;
  align-items: center;
  .no-video {
    width: 60px;
    height: 46px;
    background: var(--gray-f7);
    border-radius: 5px;
    border: 1px solid var(--gray-c7);
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 24px;
    }
  }

  .rw-iframe {
    position: relative;
    button {
      width: 100%;
      height: 100%;
      position: absolute;
      background: transparent;
      border: none;
      box-shadow: none;
    }
  }
}

.audio-type {
  .no-audio {
    width: 60px;
    height: 46px;
    background: var(--gray-f7);
    border-radius: 5px;
    border: 1px solid var(--gray-c7);
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 24px;
    }
  }
}
</style>
