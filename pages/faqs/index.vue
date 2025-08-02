<template>
  <div class="faqs-page">
    <h2 class="title">الأسئلة الشائعة</h2>

    <template v-if="listRequest.error.value"><lazy-error-block /></template>
    <template v-else>
      <template v-if="listRequest.status.value === 'pending'">
        <lazy-app-spinner />
      </template>
      <template v-else>
        <div class="faqs-section">
          <div class="faqs-list">
            <div class="search-bar">
              <input
                v-model="search"
                placeholder="بحث ..."
              />
              <i class="fa fa-search"></i>
            </div>
            <template v-if="filteredList.length">
              <template
                v-for="(item, index) of filteredList"
                :key="item.title"
              >
                <lazy-prime-accordion v-model:value="activeIndex">
                  <lazy-prime-accordion-panel :value="index">
                    <lazy-prime-accordion-header>
                      {{ item.title }}
                    </lazy-prime-accordion-header>
                    <lazy-prime-accordion-content>
                      <div v-html="item.answer"></div>
                    </lazy-prime-accordion-content>
                  </lazy-prime-accordion-panel>
                </lazy-prime-accordion>
              </template>
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

//composable
const commonQuestionsStore = useCommonQuestionsStore();

//data
const search = ref<string | null>('');
const activeIndex = ref<number | null>(null);
const listRequest = useLazyAsyncData(
  'common-questions-all',
  () => commonQuestionsStore.getAll(),
  { immediate: false }
);

const filteredList = computed(() => {
  const searchVal = search.value;
  const list = listRequest.data.value;
  if (!list?.length) return [];

  if (!searchVal) return list;

  return (
    list.filter((post) => {
      return post.title?.toLowerCase().includes(searchVal);
    }) ?? []
  );
});

//hook
onMounted(() => {
  listRequest.execute();
});
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.faqs-page {
  background-color: #fbfcfe;
  padding-top: 50px;
  padding-bottom: 100px;
  .title {
    font-size: 40px;
    font-weight: bold;
    color: var(--purple-8d);
    text-align: center;
    margin: 0;
  }
  .faqs-section {
    margin-top: 36px;

    .search-bar {
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--red-63);
      padding-bottom: 5px;
      margin-bottom: 50px;
      input {
        border: none;
        width: 100%;
      }
      i {
        font-size: 14px;
        color: var(--red-63);
      }
    }

    .faqs-list {
      max-width: 1000px;
      background: white;
      box-shadow: 10px 24px 54px #0000000a;
      border-radius: 30px;
      padding: 40px 60px;
      margin: auto;

      .accordion {
        border-bottom: 1px solid rgba(139, 139, 139, 0.3);
        padding-bottom: 15px;
        margin-bottom: 40px;

        .question {
          .accordion-head {
            display: flex;
            align-items: center;
            cursor: pointer;

            span {
              font-size: 16px;
              color: var(--dark-1e);
            }

            i {
              font-size: 12px;
              padding: 12px 6px;
              margin-inline-end: 16px;
              color: var(--red-63);
            }
          }
        }

        .answer {
          margin-top: 20px;
          margin-inline-start: 40px;

          p {
            margin: 0;
            font-size: 16px;
            color: rgba(139, 139, 139, 0.6);
            padding-inline-start: 13px;
            border-inline-start: 1px solid #ea5455;
          }
        }
      }
    }
  }

  @include tablet-down() {
    padding-top: 30px;
    .title {
      font-size: 30px;
    }
    .faqs-section {
      .search-bar {
        margin-bottom: 30px;
      }
      .faqs-list {
        padding: 25px 15px;
      }
    }
  }
}
</style>
