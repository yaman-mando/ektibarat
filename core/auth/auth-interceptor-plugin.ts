export default defineNuxtPlugin(() => {
  const authState = useAuthState();

  globalThis.$fetch = $fetch.create({
    onRequest({ options }) {
      const token = authState.token.value;
      if (token) {
        options.headers.set('Authorization', token);
      }
    },
  });
});
