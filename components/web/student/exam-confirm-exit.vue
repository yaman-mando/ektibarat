<template>
  <lazy-prime-dialog
    v-if="staticLocales"
    id="exam-confirm-exit-modal"
    v-model:visible="isOpen"
    :closable="false"
    :showHeader="false"
    :modal="true"
    :class="`mx-auto w-container exam-confirm-exit-modal`"
  >
    <div class="_imc-w">
      <img
        src="/images/warn-image.svg"
        alt=""
        loading="lazy"
      />
    </div>
    <div class="ec-wrapper">
      <span class="ec-label">{{ messageModel }}</span>
    </div>
    <div class="ec-actions">
      <app-button
        :label="staticLocales.trainPage.continue"
        :colorType="'primary'"
        :variant="'flat'"
        @click="onClose"
      />
      <app-button
        :label="confirmLabel"
        :colorType="'warn'"
        :variant="'outline'"
        @click="onConfirm"
      />
    </div>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import { useSetupStaticLocales } from '~/main/services/setup/useSetupStaticLocales';
import { Subject } from 'rxjs';

export default {
  props: {
    isEndAction: Boolean,
  },
  emits: ['update:isOpen', 'onAction'],
  setup(props, { expose }) {
    const isOpen = ref(false);
    function showModal() {
      isOpen.value = true;
    }
    const { staticLocales } = useSetupStaticLocales();
    const onActionSub = new Subject<boolean>();
    expose({
      showModal,
      onActionSub,
    });
    return { staticLocales, isOpen, showModal, onActionSub };
  },
  data() {
    return {};
  },
  computed: {
    titleModel() {
      return this.isEndAction
        ? this.staticLocales?.trainPage.endExamLabel
        : this.staticLocales?.trainPage.exitExamLabel;
    },
    messageModel() {
      return this.isEndAction
        ? this.staticLocales?.trainPage.endExamWarn
        : this.staticLocales?.trainPage.exitExamWarn;
    },
    confirmLabel() {
      return this.isEndAction
        ? this.staticLocales?.trainPage.exit
        : this.staticLocales?.trainPage.exit;
    },
  },
  mounted() {},
  methods: {
    onClose() {
      this.isOpen = false;
      this.$emit('onAction', false);
      this.onActionSub.next(false);
    },
    onConfirm() {
      this.isOpen = false;
      this.$emit('onAction', true);
      this.onActionSub.next(true);
    },
  },
};
</script>
<style lang="scss">
@import '@/assets/scss/mixin';
.exam-confirm-exit-modal {
  border: 0;
  width: 340px !important;
  height: 447px;
  margin: 0 auto;
  @include web-desktop-up() {
    width: 650px !important;
    height: auto;
  }
  ._imc-w {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 31px 0 50px 0;
    @include web-desktop-up() {
      padding: 46px 0 50px 0;
    }
  }
  .ec-wrapper {
    padding: 0 15px 50px 15px;
  }
  .ec-label {
    display: block;
    font-size: 20px;
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
      width: 135px;
    }
  }
}
</style>
