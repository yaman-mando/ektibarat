<template>
  <lazy-prime-dialog
    id="laws-images-modal"
    v-model:visible="isOpen"
    :modal="true"
    :draggable="false"
    :showHeader="false"
  >
    <div class="wl-content">
      <div class="wl-t">
        <span>قوانين مرتبطة بالسؤال</span>
        <i
          class="fa fa-close"
          @click="hideModal"
        ></i>
      </div>
      <div class="wl-c">
        <template v-if="request.status.value === 'pending'">
          <lazy-app-spinner />
        </template>
        <template v-else>
          <template v-if="!!data.length">
            <div class="wl-c__images">
              <div
                v-for="(url, index) in data"
                :key="url"
                class="w-full flex flex-col"
              >
                <lazy-custom-image
                  :url="url"
                  :folderName="ImagesFolderName.laws"
                  width="auto"
                  height="auto"
                  :size="ImageSize.sd"
                  :ext="ImageExt.webp"
                  :withModal="true"
                  modalContentClasses="laws-card-modal-img-content"
                />
                <div
                  v-if="index !== data.length - 1"
                  class="di-el"
                ></div>
              </div>
            </div>
          </template>
          <template v-else>
            <span>لايوجد عناصر</span>
          </template>
        </template>
      </div>
    </div>
  </lazy-prime-dialog>
</template>
<script setup lang="ts">
import { useQuestionsStore } from '~/main/modules/questions/services/useQuestionsStore';
import type { QuestionsCategoriesLawsPicturesDataModel } from '~/main/modules/questions/data-access/models/questions.model';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageSize } from '~/main/constants/image-size';
import { ImageExt } from '~/main/constants/image-ext';

defineExpose({
  showModal,
});

const props = withDefaults(
  defineProps<{
    questionId: string | number;
  }>(),
  {}
);
//composable
const questionsStore = useQuestionsStore();
//data
const isOpen = ref(false);
const data = ref<string[]>([]);

const { request, callApi } = useTypedLazyRequest<
  string,
  QuestionsCategoriesLawsPicturesDataModel
>('qc-request', (param) =>
  questionsStore.getQuestionsCategoriesLawsPictures(param)
);

function showModal() {
  isOpen.value = true;
  callApi(props.questionId as string);
}
function hideModal() {
  isOpen.value = false;
}
</script>
<style lang="scss">
@import '@/assets/scss/mixin';
#laws-images-modal {
  width: 680px;
  margin: 0 auto;
  max-width: 90vw;

  .wl-content {
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 250px;
    @include mobile-down() {
      min-height: 150px;
    }
  }

  .wl-t {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;

    span {
      font-size: 20px;
      display: inline-block;
      font-weight: bold;
      color: var(--purple-8c);
    }

    i {
      font-size: 24px;
      color: var(--purple-8c);
      cursor: pointer;
    }
  }

  .wl-c {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    align-items: center;
    justify-content: flex-start;
    overflow-y: auto;

    &__images {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      img {
        display: block;
        margin: auto;
        width: 100%;
        height: auto;
        //max-height: 150px;
      }

      .di-el {
        display: flex;
        width: 100%;
        margin: 10px 0;
        border-top: 1px solid;
      }
    }
  }
}

.laws-card-modal-img-content {
  img {
    width: 100%;
    height: auto;
  }
}
</style>
