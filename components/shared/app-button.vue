<template>
  <lazy-prime-button
    type="button"
    :class="`app-button ${colorType} ${variant} size-${size} ${
      isAnalytics ? 'is-analytics' : ''
    } ${rounded ? 'rounded' : ''}`"
    :disabled="isDisabled || isLoading"
    :loading="isLoading"
  >
    <slot name="iconStart"></slot>
    <i
      v-if="iconStartClass"
      :class="`app-button-icon  ${iconStartClass}`"
    ></i>
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
    ></i>
  </lazy-prime-button>
</template>
<script setup lang="ts">
//props
withDefaults(
  defineProps<{
    isLoading?: boolean;
    isDisabled?: boolean;
    iconStartClass?: string;
    iconEndClass?: string;
    label: string;
    labelClass?: string;
    suffixLabel?: string;
    colorType?: 'primary' | 'success' | 'warn' | 'warn-light' | 'blue';
    variant?: 'flat' | 'outline' | 'clear';
    size?: 'sm' | 'md' | 'lg' | string;
    isAnalytics?: boolean;
    rounded?: boolean;
  }>(),
  {
    colorType: 'primary',
    variant: 'flat',
    size: '',
    rounded: false,
    labelClass: '',
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
  height: 48px;
  width: 155px;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 10px;
  border: 2px solid var(--color) !important;
  padding: 1px 6px;

  &.rounded {
    border-radius: 30px;
  }

  &.success {
    --color: var(--green-8c);
  }
  &.warn {
    --color: var(--red-5e);
  }
  &.warn-light {
    --color: var(--orange-39);
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
    border: none !important;
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

  &.size-md {
    width: fit-content;
    height: 40px;
    min-width: auto;
    .app-button-label {
      font-size: 14px;
    }
    .app-button-icon {
      font-size: 12px;
    }
  }

  &.size-lg {
    width: fit-content;
    height: 60px;
    min-width: 250px;
    .app-button-label {
      font-size: 20px;
      font-weight: bold;
    }
    .app-button-icon {
      font-size: 14px;
    }
  }

  &:disabled {
    border-color: transparent !important;
    background: var(--gray-8b);
    .app-button-label {
      color: var(--white-ff);
    }
    .app-button-icon {
      color: var(--white-ff);
    }
  }
  &:hover {
    --p-button-primary-hover-border-color: var(--color);
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
