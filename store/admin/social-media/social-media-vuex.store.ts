import type { Module } from 'vuex';

export const socialMediaVuexStore: Module = {
  state() {
    return {};
  },
  actions: {
    async getList({ commit }) {
      try {
        const { $axios } = useNuxtApp();
        const { data: response } = await $axios.get(`/socialPlans/all`);
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async deleteItem({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        const { data: response } = await $axios.delete(`/socialPlans/${id}`);
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async getDetail({ commit }, id) {
      try {
        const { $axios } = useNuxtApp();

        const { data: response } = await $axios.get(`/socialPlans/${id}`);
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async addSocialMedia({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const { data: response } = await $axios.post(`/socialPlans`, payload);
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    async addQuickSocialMedia({ commit }, payload) {
      try {
        const { $axios } = useNuxtApp();

        const { data: response } = await $axios.post(
          `/socialPlans/quickPublishStaticContent`,
          payload
        );
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    async updateSocialMedia({ commit }, data) {
      try {
        const { $axios } = useNuxtApp();

        const { data: response } = await $axios.put(
          `/socialPlans/${data.id}`,
          data.payload
        );
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async uploadSocialMediaStatic({ commit }, formData) {
      try {
        const { $axios } = useNuxtApp();

        const { data: response } = await $axios.post(
          `/socialPlans/uploadMedia`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async assignQuestion({ commit }, data) {
      try {
        const { $axios } = useNuxtApp();

        const { data: response } = await $axios.put(
          `/socialPlans/assignQuestionId`,
          data
        );
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async assignLaw({ commit }, data) {
      try {
        const { $axios } = useNuxtApp();

        const { data: response } = await $axios.put(
          `/socialPlans/assignLawId`,
          data
        );
        return response;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },
};
