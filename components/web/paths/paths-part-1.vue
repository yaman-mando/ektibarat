<template>
  <div
    v-if="jsonData"
    class="rw-1"
  >
    <div class="cl-1">
      <div class="contents">
        <span class="text-1">{{ jsonData.slide1 }}</span>
        <span class="text-2">{{ jsonData.slide2 }}</span>
        <span class="text-3">
          {{ jsonData.slide3 }}
          <br />
          {{ jsonData.slide4 }}
          <br />
          {{ jsonData.slide5 }}
        </span>
        <nuxt-link :to="navLink">
          <button class="red-white-btn">تدرّب على اختبار القدرات</button>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '~/main/useGlobalStore';
import { useRedirectService } from '~/main/useRedirectService'; //props

//props
const props = withDefaults(
  defineProps<{
    isTahsel?: boolean;
  }>(),
  {
    isTahsel: false,
  }
);

//composable
const globalStore = useGlobalStore();
const redirectService = useRedirectService();

//data
const jsonData = computed(() =>
  props.isTahsel
    ? globalStore.staticState.tahselJson
    : globalStore.staticState.kudratJson
);
const navLink = redirectService.getStudentRedirectUrl();

//method
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.rw-1 {
  width: 100%;
  background-image: url(/images/track/slide-bg.png);
  background-size: cover;
  background-color: #210042;
  .cl-1 {
    padding: 70px 64px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    max-width: 1400px;
    .contents {
      display: grid;
      width: 612px;
      justify-items: center;

      .text-1 {
        font-size: 40px;
        color: var(--green-da);
        text-align: center;
        line-height: 56px;
      }

      .text-2 {
        font-size: 60px;
        color: var(--green-da);
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
        line-height: 89px;
      }

      .text-3 {
        font-size: 22px;
        text-align: center;
        color: white;
        margin-bottom: 25px;
        line-height: 36.68px;
        font-weight: 500;
      }

      @include red-white-btn() {
        width: 282px;
        box-shadow: 7px 14px 51px #00000040;
      }
    }
  }
  @include lg-down() {
    .cl-1 {
      // justify-content: center;
    }
  }
  @include tablet-down() {
    background-position: 16%;
    .cl-1 {
      padding: 94px 0 93px;
      justify-content: center;
      .contents {
        width: 100%;

        .text-1 {
          font-size: 35px;
          height: 49px;
        }

        .text-2 {
          font-size: 45px;
          margin-bottom: 15px;
          height: 66px;
        }

        .text-3 {
          font-size: 14px;
          font-weight: normal;
          margin-bottom: 30px;
          line-height: 40px;
          height: 105px;
        }

        @include red-white-btn() {
          width: 280px;
        }
      }
    }
  }
}
</style>
