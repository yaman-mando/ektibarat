export default {
  async getAdminServicesList() {
    try {
      /**@type {AdminServicesListItemDataModel[]}*/
      const response = await this.$axios.$get('/ekhtibaratServices/list');
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};
