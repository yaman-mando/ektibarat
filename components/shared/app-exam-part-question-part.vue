<template>
  <div></div>
</template>
<script lang="ts">
export default defineComponent({
  setup() {},
  data() {
    return {};
  },
  mounted() {
    this.$axios.get('/');
    this.$store.commit('');
  },
});
</script>
