<template>
  <div
    v-if="text"
    class="exam-part-article"
    :class="{ 'is-img': forImage }"
  >
    <div class="exam-part-article-iw">
      <span
        v-if="title"
        class="ep-title"
      >
        {{ title }}
      </span>
      <client-only>
        <div
          class="ep-ren"
          v-html="trimmedTextModel"
        ></div>
        <div
          v-if="hasShowMore"
          class="ep-show-more"
        >
          <div
            class="ep-show-more__content"
            @click="toggleExpandState"
          >
            <i
              class="ep-show-more__content__icon"
              :class="[
                { 'fa-solid fa-chevron-down': !isExpanded },
                { 'fa-solid fa-chevron-up': isExpanded },
              ]"
            ></i>
            <span class="ep-show-more__content__label">
              {{ isExpanded ? 'اخفاء' : 'قراءة المزيد' }}
            </span>
          </div>
        </div>
      </client-only>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title?: string;
    text?: string;
    forImage?: boolean;
    noReadMore?: boolean;
  }>(),
  {}
);

//data
const isExpanded = ref(false);

//method
function toggleExpandState() {
  isExpanded.value = !isExpanded.value;
}

//computed
const textModel = computed(() => {
  if (!props.text) return '';
  const regex = /\(([^)]+)\)/;
  const matches = regex.exec(props.text);
  if (!matches) return props.text ?? '';

  const val = props.text.replace(matches?.[0], '');
  return val ?? '';
});
const innerHtmlLength = computed(() => {
  if (!textModel.value) return 0;
  return textModel.value.length;
});
const innerTextLength = computed(() => {
  if (import.meta.client) {
    if (!textModel.value) return 0;
    const doc = new DOMParser().parseFromString(textModel.value, 'text/html');
    return doc?.body?.textContent?.length ?? 0;
  }

  return 0;
});

const hasShowMore = computed(() => {
  return innerTextLength.value > 250 && !props.noReadMore;
});

const trimmedTextModel = computed(() => {
  if (hasShowMore.value) {
    const numberOfShownChar =
      250 + innerHtmlLength.value - innerTextLength.value;
    return isExpanded.value
      ? textModel.value
      : textModel.value.substring(0, numberOfShownChar) + '...';
  } else {
    return textModel.value;
  }
});
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';
.exam-part-article {
  display: block;
  margin-top: 15px;
  margin-bottom: 15px;
  @include web-desktop-up() {
    margin-top: 30px;
    margin-bottom: 0;
  }
  .exam-part-article-iw {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    background-color: var(--white-ff);
    box-shadow: 0 0 2px #ffffff;
    padding: 15px 10px;
    @include web-desktop-up() {
      border-radius: 15px;
      padding: 12px 25px 16px;
    }

    .ep-title {
      font-size: 26px;
      color: var(--dark-2b);
    }

    .ep-t {
      display: block;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 4px;
      @include web-desktop-up() {
        font-size: 24px;
      }
    }
  }

  .ep-ren {
    ::v-deep {
      * {
        font-family: var(--web-font) !important;
        font-size: 18px !important;
        @include web-desktop-up() {
          font-size: 24px !important;
        }
      }
    }
  }

  .ep-show-more {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 5px;
    &__content {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      &__label {
        display: block;
        font-size: 14px;
        line-height: 1;
        @include web-desktop-up() {
          font-size: 20px;
        }
        font-weight: bold;
        color: var(--blue-d6);
      }
      &__icon {
        color: var(--blue-d6);
        font-size: 14px;
        @include web-desktop-up() {
          font-size: 20px;
        }
      }
    }
  }

  &.is-img {
    .exam-part-article-iw {
      border: 1px solid #00000038;
      border-radius: 14px;
      box-shadow: none;
    }
  }
}
</style>
