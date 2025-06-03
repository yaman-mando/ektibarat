<template>
  <prime-dialog
    v-model:visible="isOpenValue"
    class="a-delete-modal"
    :showHeader="false"
    :modal="true"
    :closable="false"
    :closeOnEscape="false"
    :dismissableMask="false"
  >
    <div class="a-wrapper">
      <i
        class="fa fa-times"
        @click="closeModal"
      ></i>
      <div class="a-h">
        <img
          v-if="!isReject"
          width="120px"
          height="auto"
          src="/images/svg/trash.svg"
          alt="اختبارات"
        />
        <img
          v-else
          width="120px"
          height="auto"
          src="/images/svg/warning.svg"
          alt="اختبارات"
        />
        <span class="t-1">
          هل أنت متأكد من رغبتك
          <br />
          {{ msg }}
        </span>
        <span class="t-2">
          {{ label }}
          <br />
          {{ exLabel }}
        </span>
      </div>
      <div class="a-actions">
        <app-button
          colorType="warn"
          label="حذف"
          @click="onConfirm"
        />
        <app-button
          variant="outline"
          label="إلغاء"
          @click="closeModal"
        />
      </div>
    </div>
  </prime-dialog>
</template>
<script lang="ts">
export default {
  props: {
    isOpen: Boolean,
    isReject: Boolean,
    label: String,
    msg: String,
    exLabel: {
      type: String,
      default: null,
    },
  },
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
    onConfirm() {
      this.isOpenValue = false;
      this.$emit('onConfirm');
    },
    closeModal() {
      this.isOpenValue = false;
      this.$emit('onClose');
    },
  },
};
</script>
<style lang="scss">
.a-delete-modal {
  background-color: var(--modal-bg);
  width: 340px !important;
  height: auto;
  max-width: 90vw;
  margin: auto;
  border-radius: 15px;
  .a-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: 10px;
    .a-h {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      .t-1 {
        margin-top: 15px;
        font-size: 20px;
        font-weight: bold;
        color: var(--purple-8c);
        text-align: center;
      }
      .t-2 {
        margin-top: 10px;
        font-size: 16px;
        font-weight: 500;
        color: var(--dark-2b);
        text-align: center;
      }
    }
    .a-actions {
      margin-top: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      grid-column-gap: 20px;
      .a-confirm {
        font-size: 18px;
        font-weight: bold;
        background-color: transparent;
        color: var(--red-5e);
        box-shadow: none !important;
        border: 2px solid var(--red-5e);
        border-radius: 10px;
        width: 135px;
        height: 60px;
      }
      .a-cancel {
        font-size: 18px;
        font-weight: bold;
        background-color: var(--purple-8c);
        color: white;
        box-shadow: none !important;
        border: none;
        border-radius: 10px;
        width: 135px;
        height: 60px;
      }
    }
  }
  .fa-times {
    position: absolute;
    left: 20px;
    top: 20px;
    font-size: 24px;
    color: var(--purple-8c);
    cursor: pointer;
  }
}
</style>
