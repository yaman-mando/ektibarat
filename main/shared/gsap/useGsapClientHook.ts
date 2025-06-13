export const useGsapClientHook = () => {
  const state = reactive<{
    gsapLoading: boolean;
    gsapLib: GSAP | null;
  }>({
    gsapLoading: false,
    gsapLib: null,
  });

  onMounted(async () => {
    try {
      if (import.meta.client) {
        state.gsapLoading = true;
        const { gsap } = await import(/* webpackChunkName: "gsap"*/ 'gsap');
        const { TextPlugin } = await import(
          /* webpackChunkName: "gsap-text"*/ 'gsap/TextPlugin'
        );
        gsap.registerPlugin(TextPlugin);
        state.gsapLib = gsap;
        state.gsapLoading = false;
      }
    } catch (e) {
      console.error(e);
    } finally {
      state.gsapLoading = false;
    }
  });

  return {
    state: reactive({
      get gsapLoading() {
        return state.gsapLoading;
      },
      get gsapLib() {
        return state.gsapLib;
      },
    }),
  };
};
