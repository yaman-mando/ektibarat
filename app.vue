<template>
  <div>
    <nuxt-route-announcer />
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </div>
</template>
<script setup lang="ts">
//composable
const auth = useAuth();
const isLoggedIn = computed(() => auth.status.value === 'authenticated');

//watch
watch(isLoggedIn, (newVal) => {
  if (!newVal) {
    console.log(newVal);
  }
});
</script>
