export default {
  async getSubsList({ commit }, payload) {
    try {
      /**@type {SubsListItemDataModel[]}*/
      const response = await this.$axios.$get(
        `/subscriptions/all?grades=${payload.globalTypeUser}`
      );
      commit('SET_SUBS_LIST', response);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};
