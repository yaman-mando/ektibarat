<template>
  <div
    v-if="jsonData"
    class="rw-tahsele"
  >
    <span class="text-1">مواد اختبار التحصيلي</span>
    <div class="rw-subjects">
      <nuxt-link
        v-for="sub of tahseleSubjectArr"
        :key="sub.label"
        class="sub-card"
        :class="sub.jsonName"
        :to="
          redirectService.getTrainingRedirectWithGlobalTypeUrl(
            GlobalTypes.tahsele
          )
        "
      >
        <img
          :src="imageUrl.staticImageUrl(jsonData[sub.jsonName])"
          :alt="labelName + ' ' + sub.label"
        />
        <span>{{ sub.label }}</span>
      </nuxt-link>
    </div>
    <div class="rw-blogs">
      <div
        v-for="blogInfo of tahseleBlogsArr"
        :key="blogInfo.label"
        class="blog-card"
        :class="blogInfo.class"
      >
        <img
          :src="imageUrl.staticImageUrl(jsonData[blogInfo.jsonImg])"
          :alt="labelName + blogInfo.label"
        />
        <div class="c-texts">
          <span class="_label">{{ blogInfo.label }}</span>
          <span class="_text">{{ blogInfo.text1 }}</span>
          <span class="_text">{{ blogInfo.text2 }}</span>
        </div>
        <a
          :href="blogInfo.link"
          target="_blank"
        >
          <button class="blog-btn">اقرأ المزيد</button>
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import { useRedirectService } from '~/main/useRedirectService';
import { GlobalTypes } from '~/main/constants/global-types';

//constant
const labelName = 'التحصيلي';
const tahseleSubjectArr = [
  { jsonName: 'math', label: 'الرياضيات' },
  { jsonName: 'physics', label: 'الفيزياء' },
  { jsonName: 'chemistry', label: 'الكيمياء' },
  { jsonName: 'sciences', label: 'الأحياء وعلم البيئة' },
];
const tahseleBlogsArr = [
  {
    index: 1,
    class: '_blue',
    jsonImg: 'tahsele-blue',
    label: 'ما هو اختبار التحصيل الدراسي؟',
    text1: 'تعرف في هذه المقالة على الاختبار التحصيلي',
    text2: 'وأهم موضوعاته وأقسامه وأهدافه',
    link: 'https://blog.ekhtibarat.com/454/%d9%85%d8%a7-%d9%87%d9%88-%d8%a7%d9%84%d8%a7%d8%ae%d8%aa%d8%a8%d8%a7%d8%b1-%d8%a7%d9%84%d8%aa%d8%ad%d8%b5%d9%8a%d9%84%d9%8a/',
  },
  {
    index: 2,
    class: '_green',
    jsonImg: 'tahsele-green',
    label: 'متى موعد اختبار التحصيل الدراسي؟',
    text1: 'تعرف على موعد التسجيل والاختبار',
    text2: 'ورسوم وطريقة التسجيل',
    link: 'https://blog.ekhtibarat.com/461/%d9%85%d9%88%d8%b9%d8%af-%d8%a7%d8%ae%d8%aa%d8%a8%d8%a7%d8%b1-%d8%a7%d9%84%d8%aa%d8%ad%d8%b5%d9%8a%d9%84%d9%8a/',
  },
];

//composable
const globalStore = useGlobalStore();
const redirectService = useRedirectService();
const imageUrl = useImageUrl();

//data
const jsonData = computed(() => globalStore.staticState.tahselJson);
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';
.rw-tahsele {
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 60px;
  .text-1 {
    font-size: 50px;
    font-weight: bold;
    color: var(--purple-8c);
    display: flex;
    justify-content: center;
  }

  .rw-subjects {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 36px;
    row-gap: 15px;
    flex-wrap: wrap;
    margin-top: 18px;
    .sub-card {
      width: 303px;
      height: 210px;
      display: grid;
      row-gap: 15px;
      justify-content: center;
      align-items: center;
      border-radius: 19px;
      justify-items: center;
      align-content: center;
      cursor: pointer;
      span {
        font-size: 24px;
        font-weight: 500;
        color: var(--dark-63);
      }
      &.math {
        border: 1px solid #46008c40;
        &:hover {
          box-shadow: 0px 0px 30px #46008c;
        }
      }
      &.physics {
        border: 1px solid #0266d640;
        &:hover {
          box-shadow: 0px 0px 30px #0266d6;
        }
      }
      &.chemistry {
        border: 1px solid #eab31640;
        &:hover {
          box-shadow: 0px 0px 30px #eab316;
        }
      }
      &.sciences {
        border: 1px solid #00c48c40;
        &:hover {
          box-shadow: 0px 0px 30px #00c48c;
        }
      }
    }
  }

  .rw-blogs {
    margin-top: 60px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    column-gap: 36px;
    row-gap: 20px;
    max-width: 1400px;
    .blog-card {
      border-radius: 19px;
      box-shadow: 0px 0px 40px #0266d666;
      border: 1px solid #e4e4e4;
      img {
        border-radius: 19px 19px 0 0;
        width: auto;
        height: 335px;
      }
      .c-texts {
        margin-top: 20px;
        display: grid;
        margin-inline-start: 23px;
        ._label {
          font-size: 36px;
          font-weight: bold;
          color: var(--purple-8c);
          margin-bottom: 15px;
        }
        ._text {
          font-size: 24px;
          font-weight: 500;
          color: var(--dark-63);
        }
      }
      .blog-btn {
        width: 482px;
        height: 60px;
        border-radius: 30px;
        background: var(--blue-d6);
        color: white;
        font-size: 20px;
        font-weight: bold;
        margin-top: 21px;
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        justify-self: center;
      }
      &._green {
        box-shadow: 0px 0px 40px #00c48c66;
        .blog-btn {
          background: var(--green-8c);
        }
      }
    }
  }

  @include mobile-down() {
    padding-bottom: 30px;
    .text-1 {
      font-size: 35px;
    }
    .rw-subjects {
      margin-top: 20px;
      display: grid;
      row-gap: 15px;
      padding: 0 15px;
      justify-content: unset;
      width: 100%;
      .sub-card {
        width: 100%;
        height: 100px;
        grid-template-columns: 77px 1fr;
        padding-inline-start: 17px;
        img {
          width: 100%;
        }
        span {
          text-align: center;
          font-size: 20px;
        }
      }
    }
    .rw-blogs {
      margin-top: 30px;
      display: grid;
      row-gap: 20px;
      .blog-card {
        box-shadow: none !important;
        img {
          width: 100%;
          height: auto;
        }
        .c-texts {
          margin-top: 15px;
          margin-inline-start: 9px;
          ._label {
            font-size: 20px;
            margin-bottom: 8px;
          }
          ._text {
            font-size: 16px;
            font-weight: 500;
          }
        }
        .blog-btn {
          width: calc(100% - 30px);
          height: 44px;
          margin: 14px 15px 25px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
