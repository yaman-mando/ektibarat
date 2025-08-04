<template>
  <div class="faqs-page">
    <h2 class="title md:visible hidden">الأسئلة الشائعة</h2>

    <template v-if="listRequest.error.value">
      <lazy-error-block />
    </template>

    <template v-else>
      <template v-if="listRequest.status.value === 'pending'">
        <lazy-app-spinner />
      </template>

      <template v-else>
        <div class="faqs-section">
          <div class="faqs-list">
            <template v-if="filteredList.length">
              <div
                v-for="(item, index) in filteredList"
                :key="item.title"
                class="accordion-item space-y-[15px]"
              >
                <div
                  class="accordion-header"
                  @click="toggleAccordion(index)"
                >
                  <i
                    class="fa"
                    :class="activeIndex === index ? 'fa-minus' : 'fa-plus'"
                  ></i>
                  <span class="question-text">{{ item.title }}</span>
                </div>
                <div
                  v-show="activeIndex === index"
                  class="accordion-body"
                  v-html="item.answer"
                ></div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
//meta
import { useCommonQuestionsStore } from '~/main/modules/common-questions/services/useCommonQuestionsStore';

definePageMeta({
  layout: 'website-layout',
});

useHead({
  bodyAttrs: {
    class: 'no-background',
  },
});

// store
const commonQuestionsStore = useCommonQuestionsStore();

// data
const search = ref<string | null>(null);
const activeIndex = ref<number | null>(null);
const listRequest = useLazyAsyncData(
  'common-questions-all',
  () => commonQuestionsStore.getAll(),
  { immediate: false }
);

const filteredList = computed(() => {
  const list = listRequest.data.value;
  if (!list?.length) return [];
  if (!search.value) return list;
  return list.filter((post) =>
    post.title?.toLowerCase().includes(search.value?.toLowerCase() ?? '')
  );
});

const toggleAccordion = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

onMounted(() => {
  listRequest.execute();
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/mixin' as *;

.faqs-page {
  padding: 15px;

  @include tablet-up() {
    padding: 0 15px;
  }

  //max-width: 800px;
  margin: auto;

  .title {
    font-size: 24px;
    font-weight: bold;
    color: #4b5363;
    margin-bottom: 24px;
    text-align: right;
  }

  .accordion-item {
    background: white;
    border-radius: 8px;
    box-shadow: 0px 0px 10px 0px #00000026;
    padding: 0 15px;
    //cursor: pointer;
    transition: all 0.3s ease;

    .accordion-header {
      display: flex;
      align-items: center;
      column-gap: 10px;
      height: 64px;

      .question-text {
        font-size: 18px;
        font-weight: bold;
        color: black;
      }

      i {
        font-size: 18px;
        color: #24a7f1;
        cursor: pointer;
      }
    }

    .accordion-body {
      font-size: 14px;
      color: #666;
      line-height: 1.7;
      text-align: right;
      padding-bottom: 15px;
    }
  }
}
</style>
