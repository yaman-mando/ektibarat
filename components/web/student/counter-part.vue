<template>
  <div class="cd-co-w">
    <img
      class="w-[14px] flex items-center justify-center"
      src="/images/icons/stopwatch-white.svg"
      alt="clock"
    />
    <span class="cd-co num-font">{{ counterModel }}</span>
  </div>
</template>

<script lang="ts">
import { DateHelper } from '~/main/utils/date-utils';

export default {
  name: 'CounterPart',
  props: {
    counterValue: Number,
  },
  data() {
    return {};
  },
  computed: {
    dateHelper() {
      return DateHelper();
    },
    counterModel() {
      if (this.counterValue) {
        return this.dateHelper.convertSecondTo_hh_mm_ss(this.counterValue);
      }
      return '00:00';
    },
  },
};
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.cd-co-w {
  color: #fff;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #fff;
  border-radius: 100px;
  justify-content: center;
  width: 100px;
  height: 40px;
  @include web-desktop-up() {
  }
  .cd-co {
    width: auto;
    font-size: 20px;
    @include web-desktop-up() {
      //width: 70px;
    }
    display: block;
    font-weight: bold;
    text-align: center;
  }
}
</style>
