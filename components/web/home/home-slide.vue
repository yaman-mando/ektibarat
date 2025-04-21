<template>
  <div
    v-if="staticData"
    class="home-slide"
  >
    <div class="__content">
      <div class="r-part">
        <span class="t1">
          {{ staticData.sliderTitle1 }}
        </span>
        <span class="t2">
          {{ staticData.sliderTitle2 }}
        </span>
        <span class="t3">
          {{ staticData.sliderTitle3 }}
          <span>
            {{ staticData.sliderTitle4 }}
          </span>
        </span>
        <div class="flex flex-wrap justify-center gap-4">
          <app-button
            colorType="warn"
            :isLoading="loadingBtn === GlobalTypes.kudrat"
            label="تدرّب على اختبار القدرات"
            :rounded="true"
            class=""
            @click="navTo(GlobalTypes.kudrat)"
          />
          <app-button
            colorType="warn"
            :isLoading="loadingBtn === GlobalTypes.tahsele"
            :rounded="true"
            label="تدرّب على اختبار التحصيلي"
            @click="navTo(GlobalTypes.tahsele)"
          />
        </div>
      </div>
      <div class="l-part">
        <lazy-web-video-show-modal />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '#shared/useGlobalStore';
import { GlobalTypes } from '#shared/constants/global-types';
import { useRedirectService } from '#shared/useRedirectService';

//composable
const globalStore = useGlobalStore();
const redirectService = useRedirectService();

//data
const staticData = globalStore.state.homeJson.value;
const loadingBtn = ref<GlobalTypes | null>(null);

//method
const navTo = (type: GlobalTypes | null = null) => {
  if (type) {
    loadingBtn.value = type;
    redirectService.trainingRedirectWithGlobalType(type);
  } else {
    redirectService.studentRedirect();
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.home-slide {
  background: var(--gray-ff);
  background-image: url(/images/png/home/slider/main-slider.svg);
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;

  .__content {
    display: grid;
    grid-template-columns: 1.14fr 1fr;
    column-gap: 30px;
    align-items: flex-start;
    justify-content: center;
    padding: 47px 64px 60px 49px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1400px;

    .app-button {
      width: 282px !important;
      height: 60px !important;
      @include tablet-down() {
        height: 40px !important;
      }

      :deep(.app-button-label) {
        font-size: 20px !important;
        font-weight: bold;
        @include tablet-down() {
          font-size: 14px !important;
        }
      }
    }

    .l-part {
      display: grid;
      justify-items: center;
      justify-content: center;
    }

    .r-part {
      display: grid;
      justify-items: center;
      row-gap: 15px;

      .t1 {
        color: var(--purple-8c);
        font-size: 54px;
        font-weight: bold;
        line-height: 80px;
      }

      .t2 {
        color: var(--red-5e);
        font-size: 24px;
        text-align: center;
        font-weight: bold;
        line-height: 45px;
      }

      .t3 {
        color: var(--gray-63);
        font-size: 24px;
        max-width: 830px;
        font-weight: 500;
        line-height: 40px;
        letter-spacing: 0;
        text-align: center;
        padding: 5px 10px;
      }

      .c-actions {
        display: flex;
        column-gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
        row-gap: 10px;
      }
    }
  }

  @include tablet-down() {
    background-image: none;
    background-color: white;
    .__content {
      grid-template-columns: 1fr;
      justify-content: center;
      row-gap: 15px;
      padding: 25px 10px 0;

      .l-part {
        grid-row: 1;
        max-width: 760px;
        margin-right: auto;
        margin-left: auto;
      }

      .r-part {
        row-gap: 8px;

        .t1 {
          font-size: 30px;
          line-height: normal;
        }

        .t2 {
          font-size: 16px;
          line-height: 30px;
          text-align: center;
          padding: 0 30px;
        }

        .t3 {
          font-size: 18px;
          margin-top: 0;
          font-weight: 500;
          line-height: 30px;
          padding: 0 5px;

          span {
            white-space: pre-line;
          }
        }
      }
    }
  }
}
</style>
