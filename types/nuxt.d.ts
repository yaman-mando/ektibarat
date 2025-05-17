import type { AxiosInstance } from 'axios';
import type { VuexStoreState } from '~/store';
import type { Store } from 'vuex';

declare module '#app' {
  interface NuxtApp {
    $axios: AxiosInstance;
    $store: Store<VuexStoreState>;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $store: Store<VuexStoreState>;
  }
}
