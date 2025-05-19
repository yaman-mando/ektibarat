<template>
  <div class="redirect-payment"></div>
</template>

<script lang="ts" setup>
const router = useRouter();
onMounted(() => {
  const id = router.currentRoute.value.query['tap_id'];
  if (id) {
    localStorage.setItem('tapId', id as string);
  }
});
</script>
