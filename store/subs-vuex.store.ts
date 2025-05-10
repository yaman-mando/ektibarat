import type { Module } from 'vuex';
import type { SubscriptionsItemDataModel } from '~/main/modules/subscriptions/data-access/subscriptions.model';

export type VuexSubsState = {
  subsList: SubscriptionsItemDataModel[] | null;
};

export const subsVuexStore: Module<VuexSubsState> = {
  namespaced: true,
  state(): VuexSubsState {
    return {
      subsList: null as SubscriptionsItemDataModel[] | null,
    };
  },
  actions: {
    async getSubsList({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();
        const { data: response } = await $axios.get(
          `/subscriptions/all?grades=${payload.globalTypeUser}`
        );
        commit('SET_SUBS_LIST', response);
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },
  mutations: {
    SET_SUBS_LIST(state, subs: any[]) {
      state.subsList = subs;
    },
  },
};
