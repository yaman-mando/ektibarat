import { vuexStore } from '~/store';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vuexStore);
});
