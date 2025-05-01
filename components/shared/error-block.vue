<template>
  <div class="error-card">
    <i class="fa fa-solid fa-circle-exclamation"></i>
    <span class="error-text">عذراً، حصل خطأ</span>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.error-card {
  background-color: var(--red-f4);
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid var(--red-5e);
  width: fit-content;
  padding: 10px;
  border-radius: 10px;
  i {
    font-size: 16px;
    color: var(--red-27);
  }
  .error-text {
    font-size: 16px;
    color: var(--red-27);
  }
}
</style>
