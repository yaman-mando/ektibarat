<template>
  <lazy-prime-dialog
    id="web-train-end-modal"
    v-model:visible="isOpen"
    :closable="false"
    :showHeader="false"
    :class="`mx-auto w-container exam-confirm-end-modal`"
    :closeOnEscape="false"
    :dismissableMask="false"
  >
    <template v-if="staticLocales">
      <div
        class="bg-red-63 px-3 py-3 flex gap-3 text-white items-center justify-center text-center"
      >
        <span class="text-[25px] font-bold">
          {{ staticLocales.trainPage.endTrainModalTitle }}
        </span>
      </div>
      <div class="ec-wrapper">
        <span class="ec-label">
          {{ staticLocales.trainPage.endTrainModalMessage }}
        </span>
      </div>
      <div class="ec-actions">
        <app-button
          :isDisabled="isLoadingContinue"
          :label="staticLocales.trainPage.yes"
          :colorType="'success'"
          :variant="'flat'"
          @click="onContinue"
        />
        <app-button
          :label="staticLocales.trainPage.end"
          :colorType="'warn'"
          :variant="'outline'"
          @click="onEnd"
        />
      </div>
    </template>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import { useSetupStaticLocales } from '~/main/services/setup/useSetupStaticLocales';

export default {
  props: {
    isLoadingContinue: Boolean,
  },
  emits: ['onContinue', 'onEnd'],
  setup() {
    const { staticLocales } = useSetupStaticLocales();
    return { staticLocales };
  },
  data() {
    return {
      isOpen: false,
    };
  },
  mounted() {},
  methods: {
    onContinue() {
      this.$emit('onContinue');
      this.hideModal();
    },
    onEnd() {
      this.$emit('onEnd');
      this.hideModal();
    },
    showModal() {
      this.isOpen = true;
    },
    hideModal() {
      this.isOpen = false;
    },
  },
};
</script>
<style lang="scss">
@import '@/assets/scss/mixin';
.exam-confirm-end-modal {
  .modal-content {
    width: 650px;
    margin: 0 auto;
    max-width: 90vw;
  }
  .ec-wrapper {
    padding: 40px 15px;
  }
  .ec-label {
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: #000;
    text-align: center;
  }

  .ec-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-bottom: 30px;
    .app-button {
      width: 120px;
    }
  }
}
</style>
