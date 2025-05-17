import { vuexStore } from '~/store';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vuexStore);

  //hydrate state from server to client
  if (import.meta.server) {
    nuxtApp.payload.vuexState = vuexStore.state;
  } else {
    vuexStore.replaceState(nuxtApp.payload.vuexState || {});
  }
});
