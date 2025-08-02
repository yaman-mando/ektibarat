<template>
  <div class="cd-co-w">
    <i class="em-icon-Icon-material-update"></i>
    <span class="cd-co">{{ counterModel }}</span>
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
  line-height: 1;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid transparent;
  border-radius: 8px;
  justify-content: center;
  font-size: 24px;
  width: 100px;
  height: 37px;
  @include web-desktop-up() {
    border-color: #fff;
    width: 120px;
    height: 48px;
    font-size: 30px;
  }
  i {
    font-size: 18px;
  }
  .cd-co {
    width: auto;
    margin-bottom: -7px;
    @include web-desktop-up() {
      width: 70px;
      margin-bottom: -5px;
    }
    display: block;
    font-weight: bold;
    text-align: center;
  }
}
</style>
