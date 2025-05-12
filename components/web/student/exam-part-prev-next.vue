<template>
  <div
    v-if="staticLocales"
    class="ex-pt"
  >
    <app-button
      :label="staticLocales.trainPage.previous"
      iconStartClass="fa-solid fa-chevron-right"
      :isDisabled="!showPrev || loading"
      :colorType="'primary'"
      :variant="'outline'"
      @click="onPrevClick"
    />
    <template v-if="showEndExam">
      <app-button
        :label="staticLocales.trainPage.end"
        :isDisabled="!showEndExam"
        :colorType="'primary'"
        :variant="'flat'"
        @click="onEnd"
      />
    </template>
    <template v-else>
      <app-button
        :label="staticLocales.trainPage.next"
        iconEndClass="fa-solid fa-chevron-left"
        :isDisabled="!showNext || loading"
        :colorType="'primary'"
        :variant="'flat'"
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
@import '@/assets/scss/mixin';
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

  button {
    @include web-desktop-up() {
      width: 190px;
    }
  }
}
</style>
