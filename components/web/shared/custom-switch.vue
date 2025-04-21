<template>
  <div
    class="em-switch"
    :class="{ right: !active, left: active, 'is-sm': isSm }"
    @click="onSelect"
  >
    <div class="fixable-part"></div>
    <span :class="{ active: !active }">{{ rightLabel }}</span>
    <span :class="{ active: active }">{{ leftLabel }}</span>
  </div>
</template>
<script setup lang="ts">
//props
const props = withDefaults(
  defineProps<{
    active?: boolean;
    rightLabel?: string | null;
    leftLabel?: string | null;
    isSm?: boolean;
  }>(),
  {
    active: false,
    rightLabel: null,
    leftLabel: null,
    isSm: false,
  }
);
const emit = defineEmits(['update:active']);
function onSelect() {
  emit('update:active', !props.active);
}
</script>
<style lang="scss" scoped>
.em-switch {
  width: 280px;
  height: 50px;
  border-radius: 25px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  position: relative;
  background: var(--purple-8c);
  cursor: pointer;
  span {
    font-size: 18px;
    color: #b599d1;
    z-index: 10;
    &.active {
      color: var(--purple-8c);
      font-weight: bold;
    }
  }
  .fixable-part {
    position: absolute;
    width: 134px;
    height: 38px;
    border-radius: 25px;
    top: 6px;
    right: 6px;
    background: white;
    transition: all 0.5s;
  }
  &.right {
    .fixable-part {
      transform: translate(0, 0);
    }
  }
  &.left {
    .fixable-part {
      transform: translate(-100%, 0);
    }
  }
  &.is-sm {
    zoom: 0.75;
  }
}
</style>
