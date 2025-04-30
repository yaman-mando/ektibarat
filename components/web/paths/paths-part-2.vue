<template>
  <div
    v-if="jsonData"
    class="rw-2"
  >
    <span class="text-1">{{ jsonData.p1rw1t1 }}</span>
    <span class="text-2">
      {{ jsonData.p1rw2t1 }}
    </span>
    <div class="cl-items">
      <div class="c-item">
        <img
          :src="getImageUrl(jsonData.p1rw3cl1img)"
          alt="icon-1"
        />
        <span class="txt-1">{{ jsonData.p1rw3cl1t1 }}</span>
        <span class="txt-2">
          {{ jsonData.p1rw3cl1t2 }}
        </span>
      </div>
      <div class="c-item">
        <img
          :src="getImageUrl(jsonData.p1rw3cl2img)"
          alt="icon-2"
        />
        <span class="txt-1">{{ jsonData.p1rw3cl2t1 }}</span>
        <span class="txt-2">
          {{ jsonData.p1rw3cl2t2 }}
        </span>
      </div>
      <div class="c-item">
        <img
          :src="getImageUrl(jsonData.p1rw3cl3img)"
          alt="icon-3"
        />
        <span class="txt-1">{{ jsonData.p1rw3cl3t1 }}</span>
        <span class="txt-2">
          {{ jsonData.p1rw3cl3t2 }}
        </span>
      </div>
    </div>
    <div class="cl-btn">
      <nuxt-link :to="navLink">
        <button class="red-white-btn">انضم إلى اختبارات الآن</button>
      </nuxt-link>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '~/main/useGlobalStore';
import { useRedirectService } from '~/main/useRedirectService';

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
const imageUrl = useImageUrl();

//data
const jsonData = computed(() =>
  props.isTahsel
    ? globalStore.staticState.tahselJson
    : globalStore.staticState.kudratJson
);
const getImageUrl = imageUrl.staticImageUrl;
const navLink = redirectService.getStudentRedirectUrl();

//method
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.rw-2 {
  padding: 40px 40px 80px;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  .text-1 {
    font-size: 40px;
    font-weight: bold;
    color: var(--purple-8c);
    line-height: 40px;
    margin-bottom: 12px;
  }
  .text-2 {
    font-size: 24px;
    font-weight: 500;
    color: var(--gray-63);
    line-height: 40px;
    margin-bottom: 35px;
  }
  .cl-items {
    display: grid;
    grid-template-columns: repeat(3, 392px);
    column-gap: 48px;
    row-gap: 30px;
    align-items: center;
    margin-bottom: 60px;
    .c-item {
      display: grid;
      row-gap: 10px;
      .txt-1 {
        font-size: 24px;
        font-weight: bold;
        color: var(--gray-63);
      }
      .txt-2 {
        font-size: 20px;
        color: var(--gray-63);
      }
    }
  }
  .cl-btn {
    display: flex;
    justify-content: center;
    width: 100%;
    @include red-white-btn() {
      width: 400px;
      box-shadow: 7px 14px 51px #00000073;
    }
  }

  @include lg-down() {
    .cl-items {
      grid-template-columns: repeat(3, 1fr);
      column-gap: 3%;
      align-items: baseline;
    }
  }

  @include tablet-down() {
    padding: 25px 15px 50px 10px;
    justify-items: center;
    .text-1 {
      font-size: 20px;
      margin-bottom: 8px;
    }
    .text-2 {
      font-size: 16px;
      line-height: 26px;
      margin-bottom: 25px;
    }
    .cl-items {
      grid-template-columns: 330px;
      margin-bottom: 30px;
      .c-item {
        display: grid;
        row-gap: 10px;
        img {
          margin-bottom: 2px;
          height: 60px;
          width: auto;
        }
        .txt-1 {
          font-size: 20px;
        }
        .txt-2 {
          font-size: 16px;
          line-height: 28px;
        }
      }
    }
    .cl-btn {
      @include red-white-btn() {
        width: 280px;
      }
    }
  }
}
</style>
