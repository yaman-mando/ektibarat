<template>
  <prime-button
    type="button"
    :class="`app-button ${colorType} ${type} size-${size} ${
      isAnalytics ? 'is-analytics' : ''
    }`"
    :disabled="isDisabled || isLoading"
    :loading="isLoading"
  >
    <slot name="iconStart" />
    <i
      v-if="iconStartClass"
      :class="`app-button-icon  ${iconStartClass}`"
    />
    <span class="app-button-label-w">
      <span :class="`app-button-label text-lg  ${labelClass}`">
        {{ label }}
      </span>
      <span
        v-if="suffixLabel"
        class="app-button-label-w__suffix"
      >
        {{ suffixLabel }}
      </span>
    </span>
    <i
      v-if="iconEndClass"
      :class="`app-button-icon   ${iconEndClass}`"
    />
  </prime-button>
</template>
<script setup lang="ts">
//props
withDefaults(
  defineProps<{
    isLoading?: boolean;
    isDisabled?: boolean;
    iconStartClass?: string;
    iconEndClass?: string;
    label?: string;
    labelClass?: string;
    suffixLabel?: string;
    colorType?: 'primary' | 'success' | 'warn' | 'blue';
    type?: 'flat' | 'outline' | 'clear';
    size?: 'sm' | string;
    isAnalytics?: boolean;
  }>(),
  {
    colorType: 'primary',
    type: 'flat',
    size: '',
  }
);
</script>
<style lang="scss" scoped>
.app-button {
  overflow: hidden;
  --color: var(--purple-8d);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 60px;
  width: 155px;
  border-radius: 10px;
  border: 2px solid var(--color);

  &.success {
    --color: var(--green-8c);
  }
  &.warn {
    --color: var(--red-63);
  }
  &.blue {
    --color: var(--blue-d6);
  }

  .app-button-label-w {
    display: flex;
    align-items: center;
    justify-content: center;
    &__suffix {
      font-size: 12px;
      color: var(--yellow-16);
      align-self: flex-start;
    }
  }

  &.flat {
    background-color: var(--color);
    .app-button-label {
      color: var(--white-ff);
    }
    .app-button-icon {
      color: var(--white-ff);
    }
  }

  &.outline {
    outline-style: none;
    background-color: var(--white-ff);
    .app-button-label {
      color: var(--color);
    }
    .app-button-icon {
      color: var(--color);
    }
  }

  &.clear {
    outline-style: none;
    background-color: transparent;
    border: none;
    .app-button-label {
      color: var(--color);
    }
    .app-button-icon {
      color: var(--color);
    }
  }

  &.size-sm {
    height: auto;
    width: auto;
    min-width: fit-content;
    .app-button-label {
      font-size: 14px;
    }
    .app-button-icon {
      font-size: 12px;
    }
  }

  &:disabled {
    border-color: transparent;
    background: var(--gray-8b);
    .app-button-label {
      color: var(--white-ff);
    }
    .app-button-icon {
      color: var(--white-ff);
    }
  }
  &:active {
    opacity: 0.8;
  }

  &.is-analytics {
    padding: 0;
    &:disabled {
      background: #b599d1;
    }
  }
}
</style>
