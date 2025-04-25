export default defineNuxtPlugin((nuxtApp) => {
  const toastMessage = useToastMessage();
  nuxtApp.vueApp.config.errorHandler = (_error, _instance, _info) => {
    console.error(_error);
    toastMessage.showError();
  };
});
