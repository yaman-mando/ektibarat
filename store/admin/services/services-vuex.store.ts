import type { Module } from 'vuex';
import type { AdminServicesListItemDataModel } from '~/store/admin/services/admin-services.model';

export const servicesVuexStore: Module = {
  state() {
    return {};
  },
  actions: {
    async getAdminServicesList(): Promise<AdminServicesListItemDataModel[]> {
      try {
        const { $axios } = useNuxtApp();
        const { data: response } = await $axios.get('/ekhtibaratServices/list');
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },
};
