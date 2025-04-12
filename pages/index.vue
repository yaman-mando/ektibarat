<template>
  <div>home</div>
  <button
    type="button"
    v-if="status === 'unauthenticated'"
    :disabled="isLoadingAuth"
    @click="login()"
  >
    login
  </button>
  <button
    v-if="status === 'authenticated'"
    :disabled="isLoadingAuth"
    @click="logout"
  >
    logout
  </button>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'website-layout',
});

const { signIn, data, status, signOut } = useAuth();
const isLoadingAuth = computed(() => status.value === 'loading');

const login = async () => {
  await signIn(
    { username: 'admin_ekhts', password: 'dsaewq321' },
    { callbackUrl: '/', redirect: false }
  );
  console.log(data.value);
};

const logout = async () => {
  await signOut({ redirect: false });
};
</script>
