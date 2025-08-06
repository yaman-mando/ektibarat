<template>
  <div class="sci-item">
    <div class="flex gap-2 items-center justify-center">
      <img
        :src="iconSvgPath"
        alt="icon"
      />
      <div class="flex flex-col !gap-1 items-start justify-start">
        <span class="sci-item__title">{{ title }}</span>
        <span class="sci-item__label whitespace-pre-line">{{ label }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="option of options"
        :key="option.key"
        class="option-item"
        :class="[{ active: isActive(option.key) }]"
        @click="emit('select', option.key)"
      >
        <span>{{ option.description }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    iconSvgPath: string;
    title: string;
    label: string;
    options: { key: string | number; description: string }[];
    selectedValues?: Array<string> | Array<number>;
  }>(),
  {}
);

const emit = defineEmits<{
  (e: 'select', val: string | number): void;
}>();

function isActive(key: string | number) {
  if (!props.selectedValues) return false;

  return props.selectedValues.some((val) => val == key);
}
</script>
<style lang="scss" scoped>
.sci-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: 8px;
  box-shadow: 0 0 6px #00000026;
  gap: 10px;
  background-color: #fff;
  padding: 10px;

  --color: var(--orange-39);
  --light-color: var(--blue-0ff);

  &__title {
    font-size: 16px;
    font-weight: bold;
    color: var(--color);
  }
  &__label {
    font-size: 14px;
    color: #000;
  }

  .option-item {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 32px;
    box-shadow: 0 0 6px #00000029;
    background-color: #fff;
    border: 1px solid transparent;
    width: 95px;
    height: 36px;
    cursor: pointer;
    span {
      font-size: 14px;
    }
    &.active {
      box-shadow: none;
      background-color: #f8f3ff;
      border: 1px solid #7840e0;
      span {
        color: #7840e0;
      }
    }
  }
}
</style>
