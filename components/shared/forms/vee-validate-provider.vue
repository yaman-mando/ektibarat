<template>
  <slot></slot>
</template>
<script lang="ts" setup>
import { setupVeeValidate } from '~/main/utils/vee-validate.util';

setupVeeValidate();
</script>
