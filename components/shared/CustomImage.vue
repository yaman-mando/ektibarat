<template>
  <div />
</template>
<script setup lang="ts">
//prop
import { useImageUrl } from '~/composables/useImageUrl';
import { LIBRARY_TYPE_FOLDER_LIST } from '~/shared/constants/images-folder-name';

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
const openModal = () => {
  isOpenModel.value = true;
};
</script>
<style lang="scss" scoped></style>
