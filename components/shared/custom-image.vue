<template>
  <div class="block g-im-wrapper">
    <img
      v-if="!hasError"
      v-bind="$attrs"
      alt=""
      loading="lazy"
      :style="{ borderRadius: radius!, border: border! }"
      :width="width"
      :height="height"
      :src="imageUrlModel!"
      @error="onError"
      @click.self="withModal ? openModal() : ''"
    />
    <img
      v-if="hasError"
      v-bind="$attrs"
      loading="lazy"
      src="/images/place-holder.webp"
      :width="width"
      :height="height"
      :style="{ borderRadius: radius!, border: border! }"
      alt="no-img"
    />
    <template v-if="withModal && !hasError">
      <lazy-prime-dialog
        v-model:visible="isOpenModel"
        :modal="true"
        :showHeader="false"
        :dismissableMask="true"
        :closeOnEscape="true"
        :closable="true"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
        class="mx-auto w-container a-wc-m !p-0 mb-2"
      >
        <img
          class="block m-auto p-4"
          :src="imageUrlModel!"
          alt=""
        />
      </lazy-prime-dialog>
    </template>
  </div>
</template>
<script setup lang="ts">
//prop
import { useImageUrl } from '~/composables/useImageUrl';
import { LIBRARY_TYPE_FOLDER_LIST } from '~/main/constants/images-folder-name';

const props = withDefaults(
  defineProps<{
    modalContentClasses?: string;
    withModal?: boolean;
    folderName: string;
    url?: string | null;
    size?: string | number | null;
    ext?: string | null;
    width?: string;
    height?: string;
    radius?: string | number | null;
    border?: string | null;
    otherStyle?: string | null;
  }>(),
  {
    url: null,
    size: null,
    withModal: false,
    width: '100',
    height: '100',
  }
);

//composable
const { getUrl } = useImageUrl();

//data
const isOpenModel = ref(false);
const hasError = ref(false);
const imageUrlModel = computed(() => {
  //cases where there is no size or ext for image
  if (LIBRARY_TYPE_FOLDER_LIST.some((val) => val == props.folderName)) {
    return getUrl(props.folderName, props.url);
  }
  return getUrl(props.folderName, props.url, props.size, props.ext);
});

//method
const onError = () => {
  hasError.value = true;
};
const openModal = () => {
  isOpenModel.value = true;
};
</script>
<style lang="scss" scoped></style>
