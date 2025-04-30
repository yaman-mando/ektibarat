<template>
  <div class="c-spinner"></div>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.c-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: var(--purple-8c);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 10px auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
