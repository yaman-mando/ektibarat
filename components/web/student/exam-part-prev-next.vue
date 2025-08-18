<template>
  <div
    v-if="staticLocales"
    class="ex-pt"
  >
    <app-button
      :label="staticLocales.trainPage.previous"
      iconStartClass="fa-solid fa-chevron-right"
      :isDisabled="!showPrev || loading"
      :colorType="'blue'"
      :variant="'outline'"
      labelClass="text-lg text-white font-bold"
      @click="onPrevClick"
    />
    <template v-if="showEndExam">
      <app-button
        :label="staticLocales.trainPage.end"
        :isDisabled="!showEndExam"
        :colorType="'blue'"
        :variant="'flat'"
        labelClass="text-lg text-white font-bold"
        @click="onEnd"
      />
    </template>
    <template v-else>
      <app-button
        :label="staticLocales.trainPage.next"
        iconEndClass="fa-solid fa-chevron-left"
        :isDisabled="!showNext || loading"
        :colorType="'blue'"
        :variant="'flat'"
        labelClass="text-lg text-white font-bold"
        @click="onNextClick"
      />
    </template>
  </div>
</template>
<script lang="js">
import { useSetupStaticLocales } from '~/main/services/setup/useSetupStaticLocales.js';

export default {
  props: {
    showPrev: Boolean,
    showNext: Boolean,
    showEndExam: Boolean,
  },
  emits: ['prevAction', 'nextAction', 'endAction'],
  setup() {
    const { staticLocales } = useSetupStaticLocales();
    return {
      staticLocales,
    };
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    onPrevClick() {
      this.$emit('prevAction');
    },
    onNextClick() {
      this.$emit('nextAction');
    },
    onEnd() {
      this.$emit('endAction');
    },
  },
};
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;
.ex-pt {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 20px;
  background-color: white;
  padding: 10px 0;
  border-top: 1px solid var(--gray-f2);
  border-bottom: 1px solid var(--gray-f2);
  @include web-desktop-up() {
    column-gap: 36px;
  }

  :deep(.app-button) {
    width: 160px;
    height: 50px;
    border-radius: 100px;
    @include web-desktop-up() {
      width: 200px;
      height: 50px;
    }

    .app-button-label {
      font-size: 16px !important;
      @include web-desktop-up() {
        font-size: 18px !important;
      }
    }
  }
}
</style>
