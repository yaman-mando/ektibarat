<template>
  <div class="admin-menu">
    <div
      class="m-toggle"
      @click="toggleAdminMenu"
    >
      <i
        :class="
          $store.state.admin.isClosedAdminMenu
            ? 'fa-solid fa-chevron-left'
            : 'fa-solid fa-chevron-right'
        "
      ></i>
    </div>
    <div class="m-wrapper">
      <nuxt-link
        :to="{ path: '/' }"
        class="m-logo"
        style="cursor: pointer"
      >
        <img
          :src="logoUrl"
          alt="logo"
        />
      </nuxt-link>
      <div class="m-list">
        <template v-for="item in MENU_ITEMS">
          <template v-if="isAllowShow(item)">
            <admin-menu-item
              :key="item.id"
              :item="item"
            />
          </template>
        </template>
        <div
          class="m-footer"
          :class="{ isEmployee: isEmployeeUser }"
        >
          <div
            class="m-logout"
            @click="logout"
          >
            <i class="m-icon em-icon-Group-2999"></i>
            <span class="m-label">تسجيل الخروج</span>
          </div>
          <div class="flex items-center !gap-2 !my-3">
            <prime-toggle-switch
              v-model="isLightTheme"
              inputId="review-check"
              @update:modelValue="onThemeToggle"
            />
            <label
              for="review-check"
              class=""
            >
              تفعيل الوضع الداكن
            </label>
          </div>
        </div>
      </div>
    </div>
    <!--    mobile menu header-->
    <template v-if="isMobileMenuHeader">
      <div
        v-if="!$store.state.admin.isClosedAdminMenu"
        class="admin-mobile-menu-overlay"
        @click="toggleAdminMenu"
      ></div>
      <div class="admin-mobile-header">
        <div
          class="am-toggle"
          @click="toggleAdminMenu"
        >
          <i class="em-icon-tasks"></i>
        </div>
        <div class="am-logo">
          <img
            :src="logoUrl"
            alt="logo"
          />
        </div>
      </div>
    </template>
    <!--    mobile menu header-->
  </div>
</template>
<script lang="ts">
import {
  main_routers,
  ROUTE_QUERY_ENUM,
  RouteHelper,
} from '~/main/utils/route-helper';
import { STATIC_PAGE_TYPE } from '~/main/constants/static-page-type';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { AppTheme, AppThemeNames } from 'public/constants/app-config';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { all_routers } from '~/main/constants/routes';
import { mediaQuery } from '~/main/constants/media-query.enum';
import { toggleAdminMenu } from '~/main/utils/shared-utils';
import { webAuthSignup } from '~/main/utils/web-routes.utils';

const MENU_ITEMS = [
  {
    id: '1',
    label: 'الداشبورد - وتحليل البيانات',
    icon: 'em-icon-Group-3000',
    path: RouteHelper.adminReports(),
    children: [
      {
        id: '1-1',
        label: 'التقارير',
        icon: 'em-icon-Group-3004',
        path: RouteHelper.adminReports(),
      },
      {
        id: '1-2',
        label: 'لوحة التحكم',
        path: `/${main_routers.adminRoute}/c-panel`,
      },
      {
        id: '1-3',
        label: 'تحليل البيانات',
        path: `/${main_routers.adminRoute}`,
      },
      {
        id: '1-4',
        label: 'الاستبيانات',
        path: RouteHelper.adminSurveysShow(),
      },
    ],
  },
  {
    id: '2',
    label: 'ادارة المواد',
    icon: 'em-icon-Group-3002',
    path: `/${main_routers.adminRoute}/subjects`,
    children: [
      {
        id: '2-1',
        label: 'المواد',
        icon: 'em-icon-Group-3002',
        path: `/${main_routers.adminRoute}/subjects`,
      },
      {
        id: '2-2',
        label: 'إدارة التصنيفات',
        icon: 'em-icon-Group-3004',
        path: `/${main_routers.adminRoute}/categories`,
      },
      {
        id: 'categoriesLaws',
        label: 'إدارة القوانين',
        icon: 'em-icon-Group-3004',
        path: RouteHelper.adminCategoriesLawsRoot(),
      },
      {
        id: '31',
        label: 'إدارة الخدمات',
        icon: 'em-icon-Group-3004',
        path: `/${main_routers.adminRoute}/services-manage`,
      },
      {
        id: '29',
        label: 'إدارة التاغات',
        icon: 'em-icon-tags',
        path: `/${main_routers.adminRoute}/tags-manage`,
      },
      {
        id: '19',
        label: 'إدارة باقات القوانين',
        icon: 'em-icon-Group-3004',
        path: `/${main_routers.adminRoute}/law-manage`,
      },
    ],
  },
  {
    id: '3',
    label: 'بنك الأسئلة',
    icon: 'em-icon-Group-3005',
    path: `/${main_routers.adminRoute}/questions`,
  },
  {
    id: '4',
    label: 'إدارة الطلاب',
    icon: 'em-icon-tags',
    path: `/${main_routers.adminRoute}/students`,
  },
  {
    id: '5',
    label: 'ادارة المراسلات المباشرة',
    icon: 'em-icon-Group-3008',
    path: `/${main_routers.adminRoute}/chat`,
  },
  {
    id: '6',
    label: 'إدارة الشكاوى',
    icon: 'em-icon-Group-3009',
    path: `/${main_routers.adminRoute}/complains`,
    isComplaints: true,
  },
  {
    id: '7',
    label: 'الرسائل',
    icon: 'em-icon-envelope-open-1',
    path: `/${main_routers.adminRoute}/contact-us`,
    isMessages: true,
  },
  {
    id: '8',
    label: 'إدارة الإشتراكات',
    icon: 'em-icon-tags',
    path: `/${main_routers.adminRoute}/subscriptions`,
    children: [
      {
        id: '8-1',
        label: 'إدارة الباقات',
        icon: 'em-icon-tags',
        path: `/${main_routers.adminRoute}/subscriptions`,
      },
      {
        id: '8-2',
        label: 'إدارة الكوبونات',
        icon: 'em-icon-tags',
        path: `/${main_routers.adminRoute}/coupons`,
      },
    ],
  },
  {
    id: '9',
    label: 'ادارة الصفحات المحتوى الثابت (json)',
    icon: 'em-icon-file',
    path: `/${main_routers.adminRoute}/site-content`,
  },
  {
    id: '10',
    label: 'إدارة الميديا',
    icon: 'em-icon-file',
    path: `/${main_routers.adminRoute}/media-manage`,
  },
  {
    id: '11',
    label: 'إدارة العامة',
    icon: 'em-icon-Group-3005',
    path: `/${main_routers.adminRoute}/faqs`,
    children: [
      {
        id: '11-1',
        label: 'الأسئلة الشائعة',
        icon: 'em-icon-Group-3005',
        path: `/${main_routers.adminRoute}/faqs`,
      },
      {
        id: '11-2',
        label: 'إدارة فيديو',
        icon: 'em-icon-Group-3003',
        path: `/${main_routers.adminRoute}/videos-lib`,
      },
      {
        id: '11-3',
        label: 'رفع أسئلة الموقع',
        icon: 'em-icon-file',
        path: `/${main_routers.adminRoute}/upload-questions`,
      },
      {
        id: '11-4',
        label: 'رفع أسئلة تحصيلي',
        icon: 'em-icon-file',
        path: `/${main_routers.adminRoute}/upload-questions-tahsili`,
      },
      {
        id: '14',
        label: 'الامتحانات',
        icon: 'em-icon-Group-3169',
        path: `/${main_routers.adminRoute}/exams`,
      },
      {
        id: '27',
        label: 'المسابقات',
        icon: 'em-icon-Group-3169',
        path: `/${main_routers.adminRoute}/competitions`,
      },
      {
        id: '18',
        label: 'معلومات عامة',
        icon: 'em-icon-Group-3005',
        path: `/${main_routers.adminRoute}/general-info`,
      },
      {
        id: '20-1',
        label: 'المدونات',
        path: `/${main_routers.adminRoute}/blogs`,
      },
      {
        id: '20-2',
        label: 'التصنيفات',
        path: `/${main_routers.adminRoute}/blogs/categories`,
      },
      {
        id: '20-3',
        label: 'التاغات',
        path: `/${main_routers.adminRoute}/blogs/tags`,
      },
      {
        id: '21',
        label: 'شركاء النجاح',
        icon: 'em-icon-tags',
        path: `/${main_routers.adminRoute}/static-page`,
        query: {
          [ROUTE_QUERY_ENUM.staticPageType]: STATIC_PAGE_TYPE.successPartners,
        },
      },
      {
        id: '22',
        label: 'الأساتذة المتعاونين',
        icon: 'em-icon-tags',
        path: `/${main_routers.adminRoute}/static-page`,
        query: {
          [ROUTE_QUERY_ENUM.staticPageType]:
            STATIC_PAGE_TYPE.collaboratingTeachers,
        },
      },
      {
        id: '23',
        label: 'الطلاب الأوائل',
        icon: 'em-icon-tags',
        path: `/${main_routers.adminRoute}/static-page`,
        query: {
          [ROUTE_QUERY_ENUM.staticPageType]: STATIC_PAGE_TYPE.topStudents,
        },
      },
      {
        id: '24',
        label: 'الميزات',
        icon: 'em-icon-tags',
        path: `/${main_routers.adminRoute}/static-page`,
        query: {
          [ROUTE_QUERY_ENUM.staticPageType]: STATIC_PAGE_TYPE.features,
        },
      },
    ],
  },

  {
    id: '12',
    label: 'الموظفين',
    icon: 'em-icon-Group-3001',
    path: `/${main_routers.adminRoute}/employees`,
  },
  {
    id: 'teachers',
    label: 'المدرسين',
    icon: 'em-icon-Group-3001',
    path: `/${main_routers.adminRoute}/teachers`,
  },
  {
    id: '13',
    label: 'الصفوف',
    icon: 'em-icon-Group-3003',
    path: '/grades',
  },
  {
    id: '26',
    label: 'إدارة طلبات التسويق',
    icon: 'em-icon-tags',
    path: `/${main_routers.adminRoute}/partnerships`,
    isPartnerships: true,
  },
  {
    id: '15',
    label: 'التواصل',
    icon: 'em-icon-Group-3007',
    path: '/8',
  },
  {
    id: '16',
    label: 'الشكاوى',
    icon: 'em-icon-Group-3009',
    path: '/10',
  },
  {
    id: '17',
    label: 'الاعدادات',
    icon: 'em-icon-Group-3010',
    path: '/11',
  },
  {
    id: '25',
    label: 'خريطة الموقع',
    icon: 'em-icon-tags',
    path: `/${main_routers.adminRoute}/site-map`,
  },
  {
    id: 'socialMedia',
    label: 'إدارة السوشيال ميديا',
    icon: 'em-icon-Group-3004',
    path: RouteHelper.adminSocialMedia(),
  },
];

export default {
  setup() {
    const windowSize = useWindowSize();
    const authService = useAuth();
    return {
      ...useSetupAuth(),
      ...useSetupRoute(),
      windowSize,
      authService,
    };
  },
  data() {
    return {
      mediaQuery,
      MENU_ITEMS,
      isLightTheme: !this.$store.state.admin.isDarkTheme,
    };
  },
  computed: {
    isMobileMenuHeader() {
      return window?.innerWidth < this.mediaQuery.desktopStart;
    },
    logoUrl() {
      return this.$store.state.admin.isDarkTheme
        ? '/images/logo-white.webp'
        : '/images/logo-color.webp';
    },
    isEmployeeUser() {
      return this.appAuth.user?.role == UserRoles.employee;
    },
  },
  mounted() {
    if (window?.innerWidth < this.mediaQuery.desktopStart) {
      this.toggleAdminMenu();
    }
  },
  methods: {
    async logout() {
      if (this.appAuth.loggedIn) {
        await this.authService.signOut({ redirect: false });
      }
      await this.appRouter.push(webAuthSignup());
    },
    onThemeToggle(val: boolean) {
      if (!val) {
        this.setTheme(AppTheme.dark);
      } else {
        this.setTheme(AppTheme.light);
      }
    },
    setTheme(theme) {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.remove(...AppThemeNames);
      document.documentElement.classList.add(theme);
      this.$store.commit('admin/SET_IS_DARK_THEME', theme == AppTheme.dark);
    },
    toggleAdminMenu() {
      toggleAdminMenu(this.$store);
    },
    isAllowShow(itemData) {
      const item = all_routers.find((r) => r.path === itemData.path);

      if (!item) {
        return false;
      }

      const hasAccess = (route) => {
        switch (this.appAuth.user.role) {
          case UserRoles.admin:
            return route.allowAdmin;
          case UserRoles.employee:
            return route.allowEmployee;
          default:
            return false;
        }
      };

      if (itemData.children && itemData.children.some(this.isAllowShow)) {
        return true;
      }

      return hasAccess(item);
    },

    toHome() {
      this.appRouter.push('/');
    },
  },
};
</script>
<style lang="scss" scoped src="./admin-menu.scss"></style>
<style lang="scss" src="./admin-menu-shared.scss"></style>
