<template>
  <slot
    name="trigger"
    :bindTrigger="bindTrigger"
  ></slot>

  <lazy-prime-popover ref="popover_ref">
    <slot name="content"></slot>
  </lazy-prime-popover>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    triggerEvent?: 'hover' | 'click' | 'both';
    isDisabled?: boolean;
  }>(),
  {
    triggerEvent: 'hover',
    isDisabled: false,
  }
);

const popoverRef = useTemplateRef('popover_ref');

const onMouseOver = (event: any) => {
  if (props.isDisabled) return;

  if (props.triggerEvent === 'hover' || props.triggerEvent === 'both') {
    popoverRef.value?.show(event);
  }
};

const onMouseOut = () => {
  if (props.isDisabled) return;

  if (props.triggerEvent === 'hover' || props.triggerEvent === 'both') {
    popoverRef.value?.hide();
  }
};

const onClick = (event: Event) => {
  if (props.isDisabled) return;

  if (props.triggerEvent === 'click' || props.triggerEvent === 'both') {
    popoverRef.value?.toggle(event);
  }
};

const bindTrigger = {
  onMouseover: onMouseOver,
  onMouseout: onMouseOut,
  onClick: onClick,
};
</script>
