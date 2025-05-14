<template>
  <span
    v-if="isArray"
    :title="text && text.length > Number(length) ? createText(text) : ''"
  >
    <template v-if="index < Number(length)">
      <template
        v-for="(item, index) of text"
        :key="index"
      >
        {{ item }}
        <span v-if="index < text.length - 1 && index < Number(length) - 1">
          {{ separator }}
        </span>
      </template>
    </template>
    <template v-if="text.length > Number(length)">..</template>
  </span>
  <span
    v-else
    :title="text && text.length > Number(length) ? text : ''"
  >
    {{ text && text.slice(0, length) }}
    <template v-if="text && text.length > Number(length)">..</template>
  </span>
</template>
<script lang="ts">
export default {
  props: {
    text: {
      type: String as PropType<string | any[]>,
    },
    length: Number as PropType<string | number>,
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
      let text = null;
      array.forEach((r, index) => {
        if (index < array.length - 1) {
          text = text + r + ` ${this.separator} `;
        } else {
          text = text + r;
        }
      });
      return text;
    },
  },
};
</script>
