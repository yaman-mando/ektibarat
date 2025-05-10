<template>
  <div
    class="sb-w_item"
    @click="onClick($event)"
  >
    <lazy-service-block-modal ref="modalRef" />
  </div>
</template>
<script lang="ts">
import type ServiceBlockModal from '~/components/web/shared/service-block-modal.vue';

export default {
  data() {
    return {};
  },
  methods: {
    onClick(event) {
      event.preventDefault();
      event.stopPropagation();
      const ref = this.$refs?.modalRef as InstanceType<
        typeof ServiceBlockModal
      >;
      if (ref) {
        ref.showModal();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sb-w_item {
  z-index: 1000;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 105%;
  height: 105%;
  transform: translate(-50%, -50%);
}
</style>
