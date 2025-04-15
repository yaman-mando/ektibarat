export default defineNuxtPlugin(() => {
  const router = useRouter();
  const auth = useAuth();

  globalThis.$fetch = $fetch.create({
    onRequest({ options }) {
      const token = auth.token.value;
      if (token) {
        options.headers.set('Authorization', token);
      }
    },
    onResponseError({ response }) {
      console.error('Server error:', response._data);
      if (response.status === 401) {
        router.push('/login');
      }
    },
  });
});
