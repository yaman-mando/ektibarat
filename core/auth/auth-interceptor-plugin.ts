export default defineNuxtPlugin(() => {
  const auth = useAuth();

  globalThis.$fetch = $fetch.create({
    onRequest({ options }) {
      const token = auth.token.value;
      if (token) {
        options.headers.set('Authorization', token);
      }
    },
  });
});
