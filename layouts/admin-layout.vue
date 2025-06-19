<template>
  <!-- <client-only>
    <div class="app-dashboard">
      
      
      

      <mx-admin-menu />
      <div
        id="admin-layout"
        class="app-nuxt"
      >
        <div class="select-global">
          <span class="_title">التصنيف الرئيسي</span>
          <select-list
            v-model:selectedItem="selectedGlobalType"
            name="التصنيف الرئيسي"
            :options="globalList"
            class="sec a"
            :isMulti="false"
            :showSelectedItem="true"
          />
        </div>
        <nuxt />
      </div>

      

      <template v-if="activeFormEmployee">
        <mx-admin-custom-sidebar
          :title="
            $route.query[ROUTE_QUERY_ENUM.employeeItemId]
              ? 'تعديل موظف'
              : 'إضافة موظف'
          "
          :sideBarId="'employee-sidebar'"
          @onHidden="closeEmployeeForm"
        >
          <mx-admin-employee-form @onFinish="onFinishFormEmployee" />
        </mx-admin-custom-sidebar>
      </template>

      <template v-if="activeFormCategory">
        <mx-admin-custom-sidebar
          :title="
            $route.query[ROUTE_QUERY_ENUM.categoryItemId]
              ? 'تعديل التصنيف'
              : 'إضافة تصنيف'
          "
          :sideBarId="'category-sidebar'"
          @onHidden="closeCategoryForm"
        >
          <mx-admin-category-form @onFinish="onFinishFormCategory" />
        </mx-admin-custom-sidebar>
      </template>

      <template v-if="activeFormLaws">
        <mx-admin-custom-sidebar
          :title="$route.query[ROUTE_QUERY_ENUM.lawsItemId] ? 'تعديل' : 'إضافة'"
          :sideBarId="'laws-sidebar'"
          @onHidden="closeLawsForm"
        >
          <laws-form @onFinish="onFinishFormLaws" />
        </mx-admin-custom-sidebar>
      </template>

      <template v-if="activeFormLawManage">
        <mx-admin-custom-sidebar
          :title="
            $route.query[ROUTE_QUERY_ENUM.lawManageId] ? 'تعديل' : 'إضافة'
          "
          :sideBarId="'law-manage-sidebar'"
          @onHidden="closeLawMangeForm"
        >
          <law-manage-form @onFinish="onFinishFormManageLaw" />
        </mx-admin-custom-sidebar>
      </template>

      <template v-if="activeFormServiceManage">
        <mx-admin-custom-sidebar
          :title="
            $route.query[ROUTE_QUERY_ENUM.serviceManageId] ? 'تعديل' : 'إضافة'
          "
          :sideBarId="'service-manage-sidebar'"
          @onHidden="closeServiceMangeForm"
        >
          <service-manage-form @onFinish="onFinishFormManageService" />
        </mx-admin-custom-sidebar>
      </template>

      <template v-if="activeFormSubject">
        <template
          v-if="
            $store.state.isSchool != 'false' && $auth.user.role == roles.admin
          "
        >
          <mx-admin-add-subject-form
            :isOpen="isOpenFormSubject"
            @hideForm="closeSubjectForm"
          />
        </template>
      </template>
      
    </div>
  </client-only> -->
</template>
<!-- <script lang="ts">
export default {
  setup() {
    const theme = this.$store.state.admin.isDarkTheme
      ? AppTheme.dark
      : AppTheme.light;
    const menuClass = this.$store.state.admin.isClosedAdminMenu
      ? 'is-closed-admin-menu'
      : '';

    useHead({
      title: 'Admin',
      htmlAttrs: {
        dir: 'rtl',
        class: [`${theme}`, menuClass],
      },
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/mathlive@0.27.4/dist/mathlive-static.css',
        },
        /*{
          rel:'stylesheet',
          href:'https://unpkg.com/mathlive/dist/mathlive-static.css'
        }*/
      ],
      script: [
        {
          src: 'https://cdn.ckeditor.com/4.14.0/standard-all/ckeditor.js',
          type: 'text/javascript',
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/mathlive',
          type: 'text/javascript',
        },
        /*{
          src: 'https://www.wiris.net/demo/editor/editor',
          type: 'text/javascript'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/@wiris/mathtype-ckeditor4@8.9.0/plugin.min.js',
          type: 'text/javascript'
        },
        {
          src:'https://cdn.ckeditor.com/4.14.0/standard-all/ckeditor.js',
          type:'text/javascript'
        },
        {
          src: 'https://unpkg.com/mathlive',
          defer:true,
          type:'text/javascript'
        },*/
        /* {
          src: 'https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js',
          type:'text/javascript'
        }*/
        /*{
          src:'https://cdn.ckeditor.com/ckeditor5/41.0.0/super-build/ckeditor.js',
          type:'text/javascript'
        }*/
      ],
    });
    return {};
  },
  data() {
    return {
      isOpenFormEmployee: false,
      isOpenFormCategory: false,
      isOpenFormLaws: false,
      isOpenFormSubject: false,
      activeFormEmployee: false,
      activeFormCategory: false,
      activeFormSubject: false,
      activeFormLaws: false,
      activeFormLawManage: false,
      activeFormServiceManage: false,

      ROUTE_QUERY_ENUM,
      roles,
      settingKeys,
      globalList: globalTypesList,
      selectedGlobalType: this.$store.state.globalType,
    };
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      async handler(newVal, oldVal) {
        const query = newVal.query;
        //employee form
        if (query && query.isOpenFormEmployee != null) {
          this.isOpenFormEmployee = query.isOpenFormEmployee == 1;
          if (this.isOpenFormEmployee) {
            this.activeFormEmployee = true;
            await new Promise((resolve) => setTimeout(resolve, 100));
            this.$root.$emit('bv::toggle::collapse', 'employee-sidebar');
          }
        }
        //category form
        if (query && query[ROUTE_QUERY_ENUM.isOpenFormCategory] != null) {
          this.isOpenFormCategory =
            query[ROUTE_QUERY_ENUM.isOpenFormCategory] == 1;
          if (this.isOpenFormCategory) {
            this.activeFormCategory = true;
            await new Promise((resolve) => setTimeout(resolve, 100));
            this.$root.$emit('bv::toggle::collapse', 'category-sidebar');
          }
        }

        //laws
        if (query && query[ROUTE_QUERY_ENUM.isOpenFormLaws] != null) {
          this.isOpenFormLaws = query[ROUTE_QUERY_ENUM.isOpenFormLaws] == 1;
          if (this.isOpenFormLaws) {
            this.activeFormLaws = true;
            await new Promise((resolve) => setTimeout(resolve, 100));
            this.$root.$emit('bv::toggle::collapse', 'laws-sidebar');
          }
        }

        //law manage
        if (query && query[ROUTE_QUERY_ENUM.isOpenFormLawManage] != null) {
          this.isOpenFormLawManage =
            query[ROUTE_QUERY_ENUM.isOpenFormLawManage] == 1;
          if (this.isOpenFormLawManage) {
            this.activeFormLawManage = true;
            await new Promise((resolve) => setTimeout(resolve, 100));
            this.$root.$emit('bv::toggle::collapse', 'law-manage-sidebar');
          }
        }

        //service manage
        if (query && query[ROUTE_QUERY_ENUM.isOpenFormServiceManage] != null) {
          this.isOpenFormServiceManage =
            query[ROUTE_QUERY_ENUM.isOpenFormServiceManage] == 1;
          if (this.isOpenFormServiceManage) {
            this.activeFormServiceManage = true;
            await new Promise((resolve) => setTimeout(resolve, 100));
            this.$root.$emit('bv::toggle::collapse', 'service-manage-sidebar');
          }
        }

        //subject form
        if (query && query.isOpenFormSubject != null) {
          this.activeFormSubject = true;
          this.isOpenFormSubject = query.isOpenFormSubject == 1;
          if (this.isOpenFormSubject) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            this.$root.$emit('bv::toggle::collapse', 'add-subject-sidebar');
          }
        }
      },
    },
    '$auth.loggedIn': {
      handler(newVal, oldVal) {
        if (newVal == false) {
          //window.location.reload()
        }
      },
    },
    selectedGlobalType: {
      async handler(newVal, oldVal) {
        this.$store.commit('SET_GLOBAL_TYPE', newVal);
        if (newVal != this.$route.query.globalType) {
          await sleep(1600);
          this.$router.push({
            name: this.$route.name,
            query: {
              ...this.$route.query,
              globalType: newVal,
            },
          });
        }
      },
    },
    '$route.query.globalType': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.$store.commit('SET_GLOBAL_TYPE', newVal);
          if (newVal != this.selectedGlobalType) {
            this.selectedGlobalType = newVal;
          }
        }
      },
    },
  },

  async beforeCreate() {
    try {
      //const res = await this.$store.dispatch('admin/callSettingKey',{key:'isSchool'})
      //this.$store.commit('SET_IS_SCHOOL',res.data.value)
      if (this.$store.state.isSchool == 'false') {
        StaticJson.examTypes.forEach((r, index) => {
          if (r.id == 1) {
            r.isShow = false;
          }
        });
      }
      //this.changeIsSchool(res.data.value)
      /*this.$store.state.admin.settingKeysList.forEach(r=>{
        if(r.key == 'isSchool'){
          if (r.value == 'false') {
            this.$store.commit('SET_ACTIVE_EXAM_TYPE',13)
            StaticJson.examTypes.forEach((r, index) => {
                if (r.id == 1) {
                  StaticJson.examTypes.splice(index, 1)
                }
              })
          }
        }
      })*/
      if (this.$auth.user.role === roles.admin) {
        await this.$store.dispatch('admin/callComplaintsUnreadCounts');
        await this.$store.dispatch('admin/callPendingApplicantsCount');
        await this.$store.dispatch('admin/callMessagesUnreadCounts');
      }
    } catch (e) {
      console.log(e);
      showToastError(this.$bvToast);
    }
  },

  mounted() {
    this.initAppTheme();
  },
  methods: {
    initAppTheme() {
      try {
        const theme = localStorage.getItem('theme');
        if (theme) {
          document.documentElement.classList.add(theme);
          this.$store.commit('admin/SET_IS_DARK_THEME', theme == AppTheme.dark);
        } else {
          localStorage.setItem('theme', AppTheme.light);
          document.documentElement.classList.add(AppTheme.light);
          this.$store.commit('admin/SET_IS_DARK_THEME', false);
        }
      } catch (e) {
        console.log(e);
      }
    },
    closeEmployeeForm() {
      //remove edit id from url query
      const query = this.$route.query;
      delete query[ROUTE_QUERY_ENUM.employeeItemId];

      this.$router.push({
        name: this.$route.name,
        query: {
          ...query,
          isOpenFormEmployee: 0,
        },
      });
      this.activeFormEmployee = false;
    },
    async onFinishFormEmployee() {
      this.closeEmployeeForm();
      await showToastSuccess(this.$bvToast);
      this.$store.commit('admin/ON_FINISH_EMPLOYEE_FORM');
    },

    closeCategoryForm() {
      //remove edit id from url query
      const query = this.$route.query;
      delete query[ROUTE_QUERY_ENUM.categoryItemId];

      this.$router.push({
        name: this.$route.name,
        query: {
          ...query,
          [ROUTE_QUERY_ENUM.isOpenFormCategory]: 0,
        },
      });
      this.activeFormCategory = false;
    },
    closeLawsForm() {
      //remove edit id from url query
      const query = this.$route.query;
      delete query[ROUTE_QUERY_ENUM.lawsItemId];

      this.$router.push({
        name: this.$route.name,
        query: {
          ...query,
          [ROUTE_QUERY_ENUM.isOpenFormLaws]: 0,
        },
      });
      this.activeFormLaws = false;
    },
    async onFinishFormLaws() {
      this.closeLawsForm();
      await showToastSuccess(this.$bvToast);
      this.$store.commit('admin/ON_FINISH_LAWS_FORM');
    },

    closeLawMangeForm() {
      //remove edit id from url query
      const query = this.$route.query;
      delete query[ROUTE_QUERY_ENUM.lawManageId];

      this.$router.push({
        name: this.$route.name,
        query: {
          ...query,
          [ROUTE_QUERY_ENUM.isOpenFormLawManage]: 0,
        },
      });
      this.activeFormLawManage = false;
    },
    async onFinishFormManageLaw() {
      this.closeLawMangeForm();
      await showToastSuccess(this.$bvToast);
      this.$store.commit('admin/ON_FINISH_LAWS_FORM_MANAGE');
    },

    closeServiceMangeForm() {
      //remove edit id from url query
      const query = this.$route.query;
      delete query[ROUTE_QUERY_ENUM.serviceManageId];

      this.$router.push({
        name: this.$route.name,
        query: {
          ...query,
          [ROUTE_QUERY_ENUM.isOpenFormServiceManage]: 0,
        },
      });
      this.activeFormServiceManage = false;
    },
    async onFinishFormManageService() {
      this.closeServiceMangeForm();
      await showToastSuccess(this.$bvToast);
      this.$store.commit('admin/ON_FINISH_SERVICE_FORM_MANAGE');
    },

    async onFinishFormCategory() {
      this.closeCategoryForm();
      await showToastSuccess(this.$bvToast);
      this.$store.commit('admin/ON_FINISH_CATEGORY_FORM');
    },

    closeSubjectForm() {
      //remove edit id from url query
      const query = this.$route.query;
      delete query.itemEditId;

      this.$router.push({
        name: this.$route.name,
        query: {
          ...query,
          isOpenFormSubject: 0,
        },
      });
      this.activeFormSubject = false;
    },
  },
};
</script> -->
<!-- <style lang="scss">
@import '@/assets/scss/style.scss';

* {
  @include app-scroll-bar();
}

#__layout,
#__nuxt,
body,
html {
  height: 100%;
  overflow-y: hidden;
}

.default-admin-page {
  padding: 23px 25px 0 29px;
  @media (max-width: 990px) {
    padding: 23px 10px 0 10px;
  }
}

.app-dashboard {
  height: 100%;
  background-color: var(--bg-color);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  .app-nuxt {
    height: 100%;
    width: 100%;
    overflow-y: auto;

    .select-global {
      width: fit-content;
      margin-inline-start: 30px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      column-gap: 10px;
      ._title {
        font-size: 13px;
        font-weight: bold;
        color: var(--purple-8c);
      }
    }
  }

  @include ipad-down() {
    .app-nuxt {
      padding-top: 94px;
    }
  }

  .collapse {
    visibility: visible;
  }
}

body {
  --keyboard-zindex: 1050;
}
</style> -->
