<template>
  <prime-dialog
    v-model:visible="isOpenValue"
    class="a-exam-action-modal"
    :showHeader="false"
    :modal="true"
    :closeOnEscape="false"
    :dismissableMask="false"
    :closable="false"
  >
    <div class="a-wrapper">
      <div class="a-h">
        <i class="fa-solid fa-info-circle"></i>
        <span>
          لقد قمت سابقا بتاريخ
          <span>{{ dateUi(lastDate ?? null) }}</span>
          في الدخول في هذا الامتحان
        </span>
      </div>
      <div class="a-msg">
        <span>هل تريد المتابعة أو الدخول في امتحان جديد</span>
      </div>
      <div class="a-actions">
        <app-button
          size="md"
          label="إعادة الامتحان"
          @click="onReset"
        />
        <app-button
          variant="outline"
          size="md"
          label="تكملة الامتحان"
          @click="onComplement"
        />
        <app-button
          label="إلغاء العميلة"
          variant="outline"
          colorType="warn"
          size="md"
          @click="closeModal"
        />
      </div>
    </div>
  </prime-dialog>
</template>
<script lang="ts">
import { dateUi } from '~/main/utils/date-utils';

export default {
  props: {
    isOpen: Boolean,
    label: String,
    lastDate: String,
  },
  emits: ['update:isOpen', 'onComplement', 'onReset'],
  data() {
    return {
      isOpenValue: false,
    };
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(val) {
        this.isOpenValue = val;
      },
    },
    isOpenValue: {
      handler(val) {
        this.$emit('update:isOpen', val);
      },
    },
  },
  methods: {
    dateUi,
    onComplement() {
      this.isOpenValue = false;
      this.$emit('onComplement');
    },
    onReset() {
      this.isOpenValue = false;
      this.$emit('onReset');
    },
    closeModal() {
      this.isOpenValue = false;
    },
  },
};
</script>
<style lang="scss">
.a-exam-action-modal {
  background-color: var(--modal-bg);
  width: 500px !important;
  max-width: 90vw;
  margin: auto;
  .a-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    .a-h {
      display: flex;
      //flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 20px;
      i {
        font-size: 20px;
        color: var(--red-63);
        margin-inline-end: 10px;
      }
      span {
        font-size: 16px;
        color: var(--red-63);
        font-weight: bold;
      }
    }
    .a-msg {
      display: flex;
      justify-content: center;
      width: 400px;
      margin-bottom: 20px;
      span {
        color: var(--a-forground-text);
        font-size: 16px;
        text-align: center;
      }
    }
    .a-actions {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: center;
      grid-column-gap: 30px;
      .a-confirm {
        font-size: 14px;
        background-color: var(--red-63);
        border: none !important;
        box-shadow: none !important;
      }
      .a-cancel {
        font-size: 14px;
        background-color: transparent !important;
        color: var(--a-forground-text);
      }
    }
  }
}
</style>
