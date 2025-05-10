import type { AxiosInstance } from 'axios';
import type { VuexStoreState } from '~/store';

declare module '#app' {
  interface NuxtApp {
    $axios: AxiosInstance;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $store: Store<VuexStoreState>;
  }
}
