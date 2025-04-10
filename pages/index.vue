<template>
  <div>home</div>
  <button @click="login()">login</button>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'website-layout',
});

const { signIn, data } = useAuth();

const login = async () => {
  await signIn(
    { username: 'admin_ekhts', password: 'dsaewq321' },
    { callbackUrl: '/', redirect: false }
  );
  console.log(data.value);
};
</script>
