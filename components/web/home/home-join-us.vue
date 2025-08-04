<template>
  <div
    v-if="staticData"
    class="join-us"
  >
    <span class="p-text">{{ staticData.homeCaption1 }}</span>
    <button
      class="normal-btn"
      @click="navTo(null)"
    >
      وش تنتظر؟ انضم لاختبارات الآن
    </button>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import { useRedirectService } from '~/main/useRedirectService';
import type { GlobalTypes } from '~/main/constants/global-types';

//composable
const globalStore = useGlobalStore();
const redirectService = useRedirectService();

//data
const staticData = globalStore.staticState.homeJson;

//method
const navTo = (type: GlobalTypes | null = null) => {
  if (type) {
    redirectService.trainingRedirectWithGlobalType(type);
  } else {
    redirectService.studentRedirect();
  }
};
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.join-us {
  padding: 45px 15px;
  background: var(--gray-f9);
  display: grid;
  row-gap: 30px;
  justify-items: center;

  .p-text {
    font-size: 22px;
    font-weight: 500;
    text-align: center;
    color: var(--gray-63);
    max-width: 900px;
    line-height: 40px;
  }

  @include normal-btn(white, var(--red-5e)) {
    width: 400px;
    height: 60px;
    border-radius: 30px;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 7px 14px 51px #00000073;
  }

  @include tablet-down() {
    padding: 15px 10px 40px;
    row-gap: 20px;
    background: white;
    .p-text {
      font-size: 16px;
      font-weight: normal;
      max-width: 760px;
      padding: 0 5px;
      line-height: 28px;
    }
    @include normal-btn(white, var(--red-5e)) {
      width: 280px;
      height: 44px;
      border-radius: 22px;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
