<template>
  <div
    class="em-checkbox-wrapper"
    @click="onSelect"
  >
    <div class="em-checkbox">
      <i
        v-if="indeterminate"
        class="fa fa-square square"
      ></i>
      <i
        v-if="checked"
        class="fa fa-check check"
      ></i>
    </div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    checked: Boolean,
    indeterminate: Boolean,
  },
  emits: ['onCheck'],
  methods: {
    onSelect() {
      if (this.indeterminate || this.checked) {
        this.$emit('onCheck', false);
      } else {
        this.$emit('onCheck', true);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.em-checkbox-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
}
.em-checkbox {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border: 1px solid #707070;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: white;
  .square,
  .check {
    font-size: 18.28px;
    color: var(--green-8c);
    margin-top: 2px;
  }
}
</style>
