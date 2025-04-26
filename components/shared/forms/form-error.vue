<template>
  <div
    v-if="props.errors && props.errors.length > 0"
    class="fe-w"
  >
    <span class="fe-la">{{ props.errors[0] }}</span>
  </div>
</template>
<script setup lang="ts">
// Define props
const props = defineProps<{
  errors: string[];
}>();
</script>

<style lang="scss">
.fe-w {
  display: flex;

  .fe-la {
    font-size: 11px;
    color: var(--red-5e);
  }
}
</style>
