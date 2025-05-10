<template>
  <lazy-prime-dialog
    v-if="staticLocales"
    :id="'web-answer-warn-modal'"
    v-model:visible="isOpenModel"
    :closable="false"
    :modal="true"
    :showHeader="false"
    class="mx-auto w-container a-wc-m"
    :dismissableMask="false"
    :closeOnEscape="false"
    @show="onModalShown"
    @hide="onConfirm"
  >
    <template v-if="modalType === trainModalWarnCase.deleteAnswerHelp">
      <img
        class="warn__image"
        :style="imageStyleModel"
        src="/images/del-answer-warn.png"
      />
    </template>
    <template v-if="modalType === trainModalWarnCase.showAnswerHelp">
      <img
        class="warn__image"
        :style="imageStyleModel"
        src="/images/show-answer-help.png"
      />
    </template>
    <template v-if="modalType === trainModalWarnCase.beforeMinTime">
      <img
        class="warn__image"
        :style="imageStyleModel"
        src="/images/min-time-warn.png"
      />
    </template>
  </lazy-prime-dialog>
</template>

<script lang="ts">
import { TRAIN_MODAL_WARN_CASE } from '~/main/constants/train-modal-warn-case.enum';
import { useSetupStaticLocales } from '~/main/services/setup/useSetupStaticLocales';
import { Subject } from 'rxjs';

export default {
  props: {
    isOpen: Boolean,
    refTo: {
      default: null,
      type: Object as PropType<any | null>,
    },
    refX: {
      default: null,
      type: Object as PropType<any | null>,
    },
  },
  emits: ['update:isOpen', 'onAction'],
  setup(props, { expose }) {
    const { staticLocales } = useSetupStaticLocales();
    const modalType = ref<any | number>(null);
    const message = ref<string>('');
    const isOpenModel = ref<boolean>(false);
    const onActionSub = new Subject<boolean>();
    function showModalWarn(val) {
      modalType.value = val;
      const messageCase = {
        [TRAIN_MODAL_WARN_CASE.beforeMinTime]:
          staticLocales?.trainPage.beforeMinTime,
        [TRAIN_MODAL_WARN_CASE.afterMaxTime]:
          staticLocales?.trainPage.afterMaxTime,
        [TRAIN_MODAL_WARN_CASE.deleteAnswerHelp]:
          staticLocales?.trainPage.deleteAnswerHelp,
        [TRAIN_MODAL_WARN_CASE.showAnswerHelp]:
          staticLocales?.trainPage.showAnswerHelp,
      };
      message.value = messageCase[val];
      isOpenModel.value = true;
    }
    expose({
      onActionSub,
      showModalWarn,
    });
    return { staticLocales, onActionSub, modalType, message, isOpenModel };
  },
  data() {
    return {
      bottomGap: 0,
      leftGap: 0,
      modalTimer: null as null | ReturnType<typeof setTimeout>,
    };
  },
  computed: {
    imageStyleModel() {
      return { bottom: this.bottomGap + 'px', left: this.leftGap + 'px' };
    },
    trainModalWarnCase() {
      return TRAIN_MODAL_WARN_CASE;
    },
  },
  methods: {
    onModalShown() {
      this.calcImagePosition();
      this.startModalTimer();
    },
    startModalTimer() {
      this.endModalTimer();

      this.modalTimer = setTimeout(() => {
        this.onConfirm();
      }, 3000);
    },
    endModalTimer() {
      if (this.modalTimer) {
        clearTimeout(this.modalTimer);
      }
      this.modalTimer = null;
    },
    calcImagePosition() {
      if (this.refTo) {
        const el = this.refTo.$el;
        this.bottomGap =
          window.innerHeight -
          el.getBoundingClientRect().bottom +
          el.offsetHeight;
        if (this.refX) {
          const elx = this.refX.$el;
          this.leftGap = elx.getBoundingClientRect().x + elx.clientWidth / 2;
        } else {
          this.leftGap = window.innerWidth / 2;
        }
      }
    },
    closeModal() {
      this.isOpenModel = false;
      this.endModalTimer();
    },
    showModalWarn(val) {
      this.modalType = val;
      const messageCase = {
        [TRAIN_MODAL_WARN_CASE.beforeMinTime]:
          this.staticLocales?.trainPage.beforeMinTime,
        [TRAIN_MODAL_WARN_CASE.afterMaxTime]:
          this.staticLocales?.trainPage.afterMaxTime,
        [TRAIN_MODAL_WARN_CASE.deleteAnswerHelp]:
          this.staticLocales?.trainPage.deleteAnswerHelp,
        [TRAIN_MODAL_WARN_CASE.showAnswerHelp]:
          this.staticLocales?.trainPage.showAnswerHelp,
      };
      this.message = messageCase[val];
      this.isOpenModel = true;
    },
    onClose() {
      this.closeModal();
      this.$emit('onAction', false);
      this.onActionSub.next(false);
    },
    onConfirm() {
      this.closeModal();
      this.$emit('onAction', true);
      this.onActionSub.next(true);
    },
  },
};
</script>
<style lang="scss">
@import '@/assets/scss/mixin';

#web-answer-warn-modal {
  min-width: 100dvw;
  min-height: 100dvh;
  background: transparent;
  border: none;
}

.warn__image {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  height: 160px;
  margin: auto;
  @include web-desktop-up() {
    height: auto;
    width: 310px;
  }
}
</style>
