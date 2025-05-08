<template>
  <div
    v-if="isCompare && textModel"
    class="math-text compare"
    v-html="textModel"
  ></div>
  <div
    v-else-if="textModel"
    class="math-text"
  >
    <div
      v-if="noPopover"
      :id="key"
      v-html="textModel"
    ></div>
    <template v-else>
      <div
        :id="key"
        class="text-square"
        @mouseover="togglePopover($event)"
        @click="togglePopover($event)"
        v-html="textModel"
      ></div>
      <lazy-prime-popover ref="popover_ref">
        <template #title><div v-html="textModel"></div></template>
      </lazy-prime-popover>
    </template>
  </div>
  <div v-else>
    <template v-if="showNoTextNote">
      <p>لا يوجد نص</p>
    </template>
  </div>
</template>
<script setup lang="ts">
import { deepCloneUtil } from '~/main/utils/lodash.utils';
import {
  convertToMathmlCode,
  useMathJax,
} from '~/main/shared/math-jax/useMathJax';
import { adminRootPathUtil } from '~/main/utils/admin-routes.utils';

const props = withDefaults(
  defineProps<{
    text?: string | null;
    placeholder?: string;
    noPopover?: boolean;
    showNoTextNote?: boolean;
    isCompare?: boolean;
  }>(),
  {
    placeholder: 'المس هنا لرؤية النص',
  }
);

//composable
const mathJaxService = useMathJax();
const route = useRoute();

//refs
const popoverRef = useTemplateRef('popover_ref');

//data
const key = ref<string>('');
const convertText = ref<string | undefined | null>(props.text);

//computed
const textModel = computed(() => {
  if (mathJaxService.state.shouldUseMathJax) {
    return props.text;
  } else {
    return convertText.value;
  }
});

const isControlPanel = computed(() =>
  route.fullPath.includes(adminRootPathUtil())
);

//method
function togglePopover(event: any) {
  popoverRef.value?.toggle(event);
}
//hook
onMounted(async () => {
  const r = (Math.random() + 1).toString(36).substring(7);
  key.value = 'popover-' + r;
  if (!props.text?.includes('<math')) {
    convertText.value = convertToMathmlCode(props.text ?? null);
  }
  const dev = document.createElement('div');
  if (!convertText.value) return;
  dev.innerHTML = deepCloneUtil(convertText.value);
  convertText.value = convertText.value
    ?.replace(/h١/g, 'h1')
    .replace(/h٢/g, 'h2')
    .replace(/h٣/g, 'h3')
    .replace(/h٤/g, 'h4')
    .replace(/h٥/g, 'h5')
    .replace(/h٦/g, 'h6')
    .replace(/٪/g, '%')
    .replace(
      /×/g,
      '<span style="font-size: 16px!important;font-weight: bold !important">X</span>'
    );

  if (!isControlPanel.value) {
    mathJaxService.initMathJaxMixin();
  }
});

//watch
watch(
  () => props.text,
  (newVal) => {
    const r = (Math.random() + 1).toString(36).substring(7);
    key.value = 'popover-' + r;
    if (!newVal?.includes('<math')) {
      convertText.value = convertToMathmlCode(newVal ?? null);
      convertText.value = convertText.value
        ?.replace(/h١/g, 'h1')
        .replace(/h٢/g, 'h2')
        .replace(/h٣/g, 'h3')
        .replace(/h٤/g, 'h4')
        .replace(/h٥/g, 'h5')
        .replace(/h٦/g, 'h6')
        .replace(/٪/g, '%')
        .replace(
          /×/g,
          '<span style="font-size: 16px!important;font-weight: bold !important">X</span>'
        );
    } else {
      convertText.value = newVal;
      convertText.value = convertText.value
        .replace(/h١/g, 'h1')
        .replace(/h٢/g, 'h2')
        .replace(/h٣/g, 'h3')
        .replace(/h٤/g, 'h4')
        .replace(/h٥/g, 'h5')
        .replace(/h٦/g, 'h6')
        .replace(/٪/g, '%')
        .replace(
          /×/g,
          '<span style="font-size: 16px!important;font-weight: bold !important">X</span>'
        );
    }
    if (!isControlPanel.value) {
      mathJaxService.initMathJaxMixin();
    }
  }
);
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

:root .math-popover {
  display: flex;
}
.math-text {
  opacity: 1;
  @include tablet-down() {
    max-width: calc(100vw - 30px);
    :deep(table) {
      max-width: calc(100vw - 30px);
    }
  }
  .math-case {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    column-gap: 2px;
  }
  .text-square {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 43px;
    color: var(--text-subject-card);
  }
}
</style>
