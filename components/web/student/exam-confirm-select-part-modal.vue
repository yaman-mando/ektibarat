<template>
  <lazy-prime-dialog
    id="exam-confirm-select-part-modal"
    v-model:visible="isOpen"
    :showHeader="false"
    :modal="true"
    :closable="true"
    :closeOnEscape="true"
    :dismissableMask="true"
    :class="`mx-auto w-container exam-confirm-select-part-modal`"
  >
    <template v-if="staticLocales">
      <div class="_imc-w">
        <img
          src="/images/warn-image.svg"
          alt=""
          loading="lazy"
        />
      </div>
      <div class="_iv-w">
        <div
          v-if="unAnsweredCount"
          class="v-item primary"
        >
          <span class="__pre-label">{{ unAnsweredCount }}</span>
          <div class="__v-w">
            <span class="_m-label">لم يتم الإجابة عليها</span>
            <span class="_s-label">
              يجب الإجابة قبل الانتقال إلى القسم التالي
            </span>
          </div>
        </div>
        <div
          v-if="flaggedCount && isPartAnswered"
          class="v-item warn"
        >
          <span class="__pre-label">{{ flaggedCount }}</span>
          <div class="__v-w">
            <span class="_m-label">عليها علم للمراجعة</span>
            <span class="_s-label">بالمتابعة ستفقد فرصة مراجعتها</span>
          </div>
        </div>
      </div>
      <div
        v-if="isPartAnswered"
        class="ec-wrapper"
      >
        <span class="ec-label">
          {{ staticLocales.trainPage.confirm_continue_to_next_part }}
        </span>
      </div>
      <div class="ec-actions">
        <app-button
          :label="staticLocales.trainPage.back"
          :colorType="'primary'"
          :variant="'flat'"
          @click="onClose"
        />
        <app-button
          v-if="isPartAnswered"
          :label="staticLocales.trainPage.resume"
          :colorType="'warn'"
          :variant="'outline'"
          @click="onConfirm"
        />
      </div>
    </template>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import { useSetupStaticLocales } from '~/main/services/setup/useSetupStaticLocales';
import { Subject } from 'rxjs';

export default {
  props: {
    unAnsweredCount: Number,
    flaggedCount: Number,
    isPartAnswered: Boolean,
  },
  emits: ['update:isOpen', 'onAction'],
  setup(props, { expose }) {
    const { staticLocales } = useSetupStaticLocales();
    const onActionSub = new Subject<boolean>();
    const isOpen = ref(false);

    function showModal() {
      isOpen.value = true;
    }

    expose({ onActionSub, showModal });
    return {
      staticLocales,
      onActionSub,
      showModal,
      isOpen,
    };
  },
  data() {
    return {};
  },
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
.exam-confirm-select-part-modal {
  border: 0;
  margin: 0 auto;
  width: 340px !important;
  @include web-desktop-up() {
    width: 637px !important;
  }
  ._imc-w {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 0 34px 0;
    @include web-desktop-up() {
      padding: 20px 0 43px 0;
    }
  }
  ._iv-w {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 44px;
    .v-item {
      display: grid;
      grid-template-columns: 60px minmax(0, 1fr);
      gap: 10px;
      padding: 10px;
      border: 1px solid;
      border-radius: 8px;
      align-items: center;
      width: 320px;
      min-height: 75px;
      height: auto;
      @include web-desktop-up() {
        width: 370px;
      }
      &.primary {
        --p-color: var(--purple-8c);
        border-color: var(--p-color);
      }
      &.warn {
        --p-color: var(--red-5e);
        border-color: var(--p-color);
      }
      .__pre-label {
        line-height: 1;
        font-family: sans-serif !important;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 55px;
        color: var(--p-color);
      }
      .__v-w {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        ._m-label {
          font-weight: bold;
          display: block;
          font-size: 24px;
          color: var(--p-color);
        }
        ._s-label {
          display: block;
          font-size: 16px;
          color: #4b5363;
        }
      }
    }
  }
  .ec-wrapper {
    padding: 0 15px 40px 15px;
  }
  .ec-label {
    display: block;
    font-size: 24px;
    font-weight: 600;
    color: #000;
    text-align: center;
  }

  .ec-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-bottom: 25px;
    .app-button {
      width: 135px;
    }
  }
}
</style>
