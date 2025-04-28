<template>
  <div
    v-if="staticData"
    class="exams-part"
  >
    <h3 class="t-title">{{ staticData.t1 }}</h3>

    <div class="exams-items">
      <nuxt-link
        class="exam-item item-1"
        :to="`/${StaticTracksRoutersEnum.kudrat}`"
      >
        <nuxt-img
          src="/images/home/test-logo-1.webp"
          alt="اختبار القدرات العامة"
          width="123"
          height="111"
          loading="lazy"
          format="webp"
        />
        <span class="c-label">اختبار القدرات العامة</span>
      </nuxt-link>

      <nuxt-link
        class="exam-item item-2 not-active"
        :to="`/${StaticTracksRoutersEnum.muhiba}`"
      >
        <span class="soon">قريباً</span>
        <nuxt-img
          src="/images/home/test-logo-2.webp"
          alt="اختبار مقياس موهبة"
          width="123"
          height="111"
          format="webp"
          loading="lazy"
        />
        <span class="c-label">اختبار مقياس موهبة</span>
      </nuxt-link>

      <nuxt-link
        class="exam-item item-3"
        :to="`/${StaticTracksRoutersEnum.tahsel}`"
      >
        <nuxt-img
          src="/images/home/test-logo-3.webp"
          alt="اختبار التحصيل الدراسي"
          width="123"
          height="111"
          format="webp"
          loading="lazy"
        />
        <span class="c-label">اختبار التحصيلي</span>
      </nuxt-link>
    </div>

    <h3 class="t-footer">{{ staticData.t5 }}</h3>
  </div>
</template>
<script setup lang="ts">
//composable
import { useGlobalStore } from '~/main/useGlobalStore';
import { StaticTracksRoutersEnum } from '~/main/constants/static-tracks-routers.enum';

const globalStore = useGlobalStore();

//data
const staticData = globalStore.staticState.homeJson;
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.exams-part {
  padding-bottom: 80px;
  padding-top: 80px;
  //background: var(--gray-ff);
  background: white;

  .t-title {
    font-size: 40px;
    font-weight: bold;
    color: var(--gray-63);
    text-align: center;
  }

  .exams-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, 416px);
    column-gap: 36px;
    row-gap: 15px;
    justify-content: center;
    margin-top: 47px;
    margin-bottom: 40px;

    .exam-item {
      width: 392px;
      height: 210px;
      border: 1px solid #46008c40;
      border-radius: 19px;
      display: grid;
      justify-items: center;
      align-content: center;
      row-gap: 14.5px;
      grid-template-rows: 111px auto;
      background: white;
      cursor: pointer;
      position: relative;

      .c-label {
        font-size: 24px;
        color: var(--gray-63);
        font-weight: 500;
        text-align: center;
      }

      &.item-1 {
        border: 1px solid #46008c40;

        &:hover {
          box-shadow: 0px 0px 30px #46008c;
        }
      }

      &.item-2 {
        border: 1px solid #23afff40;

        &:hover {
          box-shadow: 0px 0px 30px #23afff;
        }
      }

      &.item-3 {
        border: 1px solid #00c48c40;

        &:hover {
          box-shadow: 0px 0px 30px #00c48c;
        }
      }

      &.not-active {
        pointer-events: none;

        .soon {
          position: absolute;
          top: 15px;
          left: 15px;
          font-size: 18px;
          color: var(--red-63);
          transform: rotate(-45deg);
          font-weight: bold;
        }

        .c-label,
        img {
          filter: blur(1px);
        }
      }
    }
  }

  .t-footer {
    font-size: 30px;
    color: var(--red-5e);
    font-weight: bold;
    text-align: center;
  }

  @include lg-down() {
    padding: 0 20px 80px;
    .exams-items {
      grid-template-columns: repeat(3, 1fr);
      column-gap: 4%;
      justify-items: center;

      .exam-item {
        width: 100%;
      }
    }
  }
  @include tablet-down() {
    padding: 0 0 40px;
    background: white;
    .t-title {
      font-size: 22px;
    }
    .t-footer {
      font-size: 20px;
    }

    .exams-items {
      grid-template-columns: 330px;
      column-gap: 30px;
      margin-top: 17px;
      margin-bottom: 20px;

      .exam-item {
        width: 330px;
        height: 100px;
        align-items: center;
        grid-template-columns: 77px auto;
        grid-template-rows: unset;
        padding-inline-start: 15px;

        img {
          width: 100%;
        }

        span {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
