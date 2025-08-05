<template>
  <div
    class="sci-item"
    :class="[
      color,
      { active: isActive },
      { 'cursor-pointer': !isDisabled },
      { '!bg-[#F5F7FA]': isDisabled },
    ]"
  >
    <template v-if="hasNewBadge">
      <img
        class="absolute left-0 top-0 w-[55px] -rotate-90"
        src="/images/badge.png"
        alt="new"
      />
      <span
        class="absolute left-[7px] top-[9px] -rotate-[45deg] text-[14px] text-[#fff]"
      >
        جديد
      </span>
    </template>

    <img
      :src="iconSvgPath"
      alt="icon"
    />
    <div class="flex flex-col items-start justify-start">
      <span class="sci-item__title">{{ title }}</span>
      <span class="sci-item__label">{{ label }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    iconSvgPath: string;
    title: string;
    label: string;
    color: 'blue' | 'green' | 'red' | 'yellow';
    isActive?: boolean;
    isDisabled?: boolean;
    hasNewBadge?: boolean;
    badgePath?: string | null;
  }>(),
  {
    isActive: false,
    isDisabled: false,
    hasNewBadge: false,
  }
);
</script>
<style lang="scss" scoped>
.sci-item {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 8px;
  box-shadow: 0 0 6px #00000026;
  gap: 10px;
  background-color: #fff;
  padding: 10px;

  &.blue {
    --color: var(--blue-d6);
    --light-color: var(--blue-0ff);
  }

  &.red {
    --color: var(--red-5e);
    --light-color: var(--red-ef);
  }

  &.yellow {
    --color: var(--yellow-16);
    --light-color: var(--yellow-e2);
  }

  &.green {
    --color: var(--green-8c);
    --light-color: var(--green-fa);
  }

  &.active {
    background-color: var(--light-color);
  }

  &__title {
    font-size: 16px;
    font-weight: bold;
    color: var(--color);
  }
  &__label {
    font-size: 14px;
    color: #000;
  }
}
</style>
