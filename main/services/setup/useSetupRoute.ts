export const useSetupRoute = () => {
  const router = useRouter();
  const route = useRoute();

  return {
    $router: router,
    $route: route,
  };
};
