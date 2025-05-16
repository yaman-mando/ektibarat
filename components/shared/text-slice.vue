<template>
  <span
    v-if="isArray && !!text"
    :title="text && text.length > Number(length) ? createText(text) : ''"
  >
    <template
      v-for="(item, index) of text"
      :key="index"
    >
      <template v-if="index < Number(length)">
        {{ item }}
        <span v-if="index < text.length - 1 && index < Number(length) - 1">
          {{ separator }}
        </span>
      </template>
    </template>
    <template v-if="text.length > Number(length)">..</template>
  </span>
  <template v-if="!isArray && !!text">
    <span :title="text.length > Number(length) ? text.toString() : ''">
      {{ text && text.slice(0, Number(length)) }}
      <template v-if="text && text.length > Number(length)">..</template>
    </span>
  </template>
</template>
<script lang="ts">
export default {
  props: {
    text: {
      type: String as PropType<string | any[]>,
    },
    length: Number as PropType<number | string>,
    isArray: {
      type: Boolean,
      default: false,
    },
    separator: {
      type: String,
      default: '-',
    },
  },

  methods: {
    createText(array) {
      let text: string | null = null;
      array.forEach((r, index) => {
        if (index < array.length - 1) {
          text = text + r + ` ${this.separator} `;
        } else {
          text = text + r;
        }
      });
      return text ?? '';
    },
  },
};
</script>
