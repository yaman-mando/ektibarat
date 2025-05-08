export const useSetupRoute = () => {
  const router = useRouter();
  const route = useRoute();

  return {
    appRouter: router,
    appRoute: route,
  };
};
