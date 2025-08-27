<template>
  <div
    v-if="jsonData"
    class="rw-4"
  >
    <div class="cl-4">
      <span class="text-1">{{ jsonData.p2rw1t }}</span>
      <div class="static-parts">
        <div class="static-group">
          <div class="r-1">
            <img
              :src="getImageUrl(jsonData.p2rw2cl1img)"
              alt="green-1"
            />
            <span>{{ jsonData.p2rw2cl1t1 }}</span>
          </div>
          <span class="r-2">
            {{ jsonData.p2rw2cl1t2 }}
          </span>
        </div>
        <div class="static-group">
          <div class="r-1">
            <img
              :src="getImageUrl(jsonData.p2rw2cl2img)"
              alt="green-2"
            />
            <span>{{ jsonData.p2rw2cl2t1 }}</span>
          </div>
          <span class="r-2">
            {{ jsonData.p2rw2cl2t2 }}
          </span>
        </div>
        <div class="static-group">
          <div class="r-1">
            <img
              :src="getImageUrl(jsonData.p2rw3cl1img)"
              alt="green-3"
            />
            <span>{{ jsonData.p2rw3cl1t1 }}</span>
          </div>
          <span class="r-2">
            {{ jsonData.p2rw3cl1t2 }}
          </span>
        </div>
        <div class="static-group">
          <div class="r-1">
            <img
              :src="getImageUrl(jsonData.p2rw3cl2img)"
              alt="green-4"
            />
            <span>{{ jsonData.p2rw3cl2t1 }}</span>
          </div>
          <span class="r-2">
            {{ jsonData.p2rw3cl2t2 }}
          </span>
        </div>
      </div>
      <div class="cl-btn">
        <nuxt-link :to="webUserDashboard()">
          <button class="red-white-btn cursor-pointer">انضم إلى اختبارات الآن</button>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
//props
import { useGlobalStore } from '~/main/useGlobalStore';
import { useRedirectService } from '~/main/useRedirectService';
import { webUserDashboard } from '~/main/utils/web-routes.utils';

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
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;
.rw-4 {
  background: #f4f4f9;
  .cl-4 {
    max-width: 1400px;
    margin: 0 auto;
    padding: 50px 40px 41px;
    display: grid;
    justify-items: center;
    .text-1 {
      font-size: 50px;
      font-weight: bold;
      text-align: center;
      color: var(--purple-8c);
      margin-bottom: 40px;
    }
    .static-parts {
      display: grid;
      grid-template-columns: repeat(2, 502px);
      column-gap: 158px;
      row-gap: 60px;
      margin-bottom: 60px;
      .static-group {
        display: grid;
        justify-items: center;
        row-gap: 14px;
        .r-1 {
          display: grid;
          grid-template-columns: auto auto;
          column-gap: 15px;
          align-items: center;
          span {
            font-weight: bold;
            font-size: 30px;
            color: var(--red-5e);
          }
        }
        .r-2 {
          font-size: 24px;
          font-weight: 500;
          color: var(--gray-63);
          line-height: 40px;
          height: 73px;
        }
      }
    }
    .cl-btn {
      display: flex;
      justify-items: center;
      @include red-white-btn() {
        box-shadow: 7px 14px 51px #00000073;
        width: 400px;
      }
    }
  }

  @include lg-down() {
    .cl-4 {
      .static-parts {
        grid-template-columns: repeat(2, 1fr);
        max-width: 1073px;
        column-gap: 100px;
        justify-items: center;
      }
    }
  }

  @include tablet-down() {
    .cl-4 {
      margin: 0 auto;
      padding: 30px 15px 40px;
      .text-1 {
        font-size: 30px;
        margin-bottom: 35.5px;
        line-height: 50px;
      }
      .static-parts {
        grid-template-columns: 330px;
        row-gap: 25.5px;
        margin-bottom: 30px;
        .static-group {
          row-gap: 10px;
          .r-1 {
            grid-template-columns: auto auto;
            column-gap: 12px;
            span {
              font-size: 20px;
            }
            img {
              height: 35px;
              width: auto;
            }
          }
          .r-2 {
            font-size: 16px;
            line-height: 28px;
            text-align: center;
            height: auto;
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
}
</style>
