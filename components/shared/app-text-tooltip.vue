<template>
  <slot
    name="trigger"
    :bindTrigger="bindTrigger"
  ></slot>

  <lazy-prime-popover ref="popover_ref">
    <div class="p-inner">
      <span v-html="text"></span>
    </div>
  </lazy-prime-popover>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text: string;
    triggerEvent?: 'hover' | 'click' | 'both';
    maxChar?: number;
  }>(),
  {
    triggerEvent: 'hover',
    maxChar: 11,
  }
);

const popoverRef = useTemplateRef('popover_ref');

const onMouseOver = (event: any) => {
  if (isDisabled.value) return;

  if (props.triggerEvent === 'hover' || props.triggerEvent === 'both') {
    popoverRef.value?.show(event);
  }
};

const onMouseOut = () => {
  if (isDisabled.value) return;

  if (props.triggerEvent === 'hover' || props.triggerEvent === 'both') {
    popoverRef.value?.hide();
  }
};

const onClick = (event: Event) => {
  if (isDisabled.value) return;

  if (props.triggerEvent === 'click' || props.triggerEvent === 'both') {
    popoverRef.value?.toggle(event);
  }
};
const isDisabled = computed(() => {
  return props.text && props.text.length <= props.maxChar;
});

const shortText = computed(() => {
  if (!props.text) return '';
  if (props.text && props.text.length > props.maxChar) {
    const val = props.text.substring(0, props.maxChar);
    return `${val}..`;
  }
  return props.text;
});

const bindTrigger = {
  onMouseover: onMouseOver,
  onMouseout: onMouseOut,
  onClick: onClick,
  text: props.text,
  shortText: shortText,
};
</script>
