export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (_error, _instance, _info) => {
    console.error(_error);
  };
});
