export default defineNuxtPlugin((nuxtApp) => {
  const toastMessage = useToastMessage();
  nuxtApp.vueApp.config.errorHandler = (_error, _instance, _info) => {
    console.log(_error);
    // toastMessage.showError({ summary: 'عذراً، حصل خطأ' });
  };
});
