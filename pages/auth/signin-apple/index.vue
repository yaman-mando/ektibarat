<template>
  <div class="google-page-redirect">
    <lazy-prime-block-u-i :blocked="isLoading">
      <div class="logo-part">
        <p class="title-1">مرحبا بكم في</p>
        <p class="title-2">اختبارات</p>
        <p class="title-3">تعلم بذكاء</p>
        <div class="logo">
          <img
            src="/images/png/collection/login_logo.webp"
            alt=""
          />
        </div>
        <p class="copyRight">© Copyright {{ currentYear }}. By اختبارات</p>
      </div>
    </lazy-prime-block-u-i>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'auth-layout',
});

const currentYear = new Date().getFullYear();

//data
const isLoading = ref(false);
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.google-page-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #ffcfcc;
  min-height: 100vh;

  .b-overlay-wrap {
    width: 100%;
    height: 100%;
  }

  .logo-part {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    text-align: center;
    background: #ffcfcc;
    display: grid;
    align-content: center;
    justify-content: center;
    @include tablet-down() {
      //display: none;
    }

    .title-1 {
      font-size: 55px;
      color: var(--purple-8d);
      font-weight: bold;
      padding-top: 52px;
      margin-bottom: 0;
      text-align: center;
    }

    .title-2 {
      font-size: 40px;
      color: var(--red-63);
      font-weight: bold;
      margin-top: 5px;
      margin-bottom: 0;
      text-align: center;
    }

    .title-3 {
      font-size: 45px;
      color: var(--purple-8d);
      margin-top: 5px;
      opacity: 60%;
      margin-bottom: 0;
      text-align: center;
    }

    .logo {
      margin-top: 45px;

      img {
        max-height: 52vh;
      }
    }

    .copyRight {
      margin-top: 45px;
      font-size: 16px;
      font-weight: bold;
      color: var(--purple-8d);
      direction: ltr;
      text-align: center;
    }

    @include mobile-down() {
      .title-1 {
        font-size: 30px;
      }
      .title-2 {
        font-size: 20px;
      }
      .title-3 {
        font-size: 16px;
      }
      .logo {
        img {
          max-width: 100vw;
        }
      }
    }
  }
}
</style>
