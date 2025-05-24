<template>
  <div class="so-sub-only-w">
    <service-lock />
    <span>للمشتركين</span>
  </div>
</template>
<script lang="ts">
export default {
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.so-sub-only-w {
  //opacity: 0.6;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 5px;
  i {
    font-size: 13px;
    color: var(--gray-8f);
  }
  span {
    font-size: 14px;
    color: var(--purple-8c);
  }
}
</style>
