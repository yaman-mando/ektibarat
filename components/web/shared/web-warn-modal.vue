<template>
  <lazy-prime-dialog
    id="web-warn-modal"
    v-model="isOpen"
    :closable="false"
    :showHeader="false"
    :class="`mx-auto w-container web-warn-modal`"
    :closeOnEscape="false"
    :dismissableMask="false"
    @hide="onConfirm"
  >
    <div
      class="bg-red-63 px-3 py-3 flex gap-3 text-white items-center justify-center text-center"
    >
      <span class="text-[25px] font-bold">يرجى الانتباه</span>
    </div>
    <div class="ec-wrapper">
      <span class="ec-label">
        {{ msg }}
      </span>
    </div>
    <div
      v-if="!hideClose"
      class="ec-actions"
    >
      <app-button
        :label="'إغلاق'"
        :colorType="'warn'"
        :variant="'flat'"
        @click="onConfirm"
      />
    </div>
  </lazy-prime-dialog>
</template>
<script lang="ts">
export default {
  props: {
    msg: String,
    hideClose: Boolean,
  },
  emits: ['onAction'],
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    onConfirm() {
      this.$emit('onAction', true);
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
@use '@/assets/scss/mixin' as *;

.web-warn-modal {
  width: 650px;
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
