export default defineNuxtPlugin(() => {
  const authState = useAuthState();

  globalThis.$fetch = $fetch.create({
    onRequest({ options }) {
      const token = authState.token.value;
      if (token) {
        // console.log(authState.rawToken.value);
        // console.log(authState.rawRefreshToken.value);
        options.headers.set('Authorization', token);
      }
    },
  });
});
