<template>
  <lazy-prime-dialog
    v-if="staticLocales"
    :id="modalId"
    v-model:visible="isOpen"
    :showHeader="false"
    :closeOnEscape="false"
    :closable="false"
    :dismissableMask="false"
    :modal="true"
    :class="`mx-auto w-container web-confirm-modal`"
  >
    <div
      class="bg-red-63 px-3 py-3 flex gap-3 text-white items-center justify-center text-center"
    >
      <span class="text-[25px] font-bold">يرجى التأكيد</span>
    </div>
    <div class="ec-wrapper">
      <span class="ec-label">
        {{ modalData.message }}
      </span>
    </div>
    <div class="ec-actions">
      <app-button
        :label="modalData.confirmText"
        :colorType="'success'"
        :variant="'flat'"
        size="md"
        @click="onConfirm"
      />
      <app-button
        :label="staticLocales.trainPage.cancel"
        :colorType="'warn'"
        :variant="'outline'"
        size="md"
        @click="onCancel"
      />
    </div>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import { useSetupStaticLocales } from '~/main/services/setup/useSetupStaticLocales';
import { Subject } from 'rxjs';

export default {
  setup(props, { expose }) {
    const { staticLocales } = useSetupStaticLocales();
    const onActionSub = new Subject<boolean>();
    const isOpen = ref(false);
    const modalData = ref<{ message: string; confirmText: string }>({
      message: '',
      confirmText: '',
    });

    function showModal(model: { message: string; confirmText?: string }): void {
      modalData.value = {
        message: model.message,
        confirmText:
          model.confirmText ?? staticLocales.value?.trainPage.yes ?? '',
      };
      isOpen.value = true;
    }

    function hideModal() {
      isOpen.value = false;
    }

    expose({ onActionSub, showModal });
    return {
      staticLocales,
      onActionSub,
      hideModal,
      showModal,
      modalData,
    };
  },
  data() {
    return {
      isOpen: false,
      modalId: 'web-confirm-modal',
    };
  },
  mounted() {},
  methods: {
    onConfirm() {
      this.hideModal();
      this.onActionSub.next(true);
    },
    onCancel() {
      this.hideModal();
      this.onActionSub.next(false);
    },
  },
};
</script>
<style lang="scss">
@import '@/assets/scss/mixin';
.web-confirm-modal {
  width: 650px !important;
  margin: 0 auto;
  max-width: 90vw;
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
