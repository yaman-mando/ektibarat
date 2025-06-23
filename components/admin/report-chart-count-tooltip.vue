<template>
  <div class="report-chart-count-tooltip">
    <div class="ie-block">
      <span class="ie-block__label">التاريخ:</span>
      <span class="ie-block__val">{{ dayModel }} - {{ dateModel }}</span>
    </div>
    <div class="ie-block">
      <span class="ie-block__label">العدد:</span>
      <span class="ie-block__val">{{ count }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { dateDayName, dateUi } from '~/main/utils/date-utils';

export default {
  props: {
    date: String,
    count: {
      type: [Number, String],
    },
  },
  data() {
    return {};
  },
  computed: {
    dayModel() {
      return dateDayName(this.date);
    },
    dateModel() {
      return dateUi(this.date!);
    },
  },
};
</script>
<style lang="scss" scoped>
.report-chart-count-tooltip {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 1px solid var(--gray-f2);

  .ie-block {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;

    &__label {
      font-size: 14px;
      display: inline-block;
      font-weight: bold;
      color: var(--purple-8c);
    }
    &__val {
      font-size: 14px;
      display: inline-block;
      color: var(--dark-1d);
    }
  }
}
</style>
