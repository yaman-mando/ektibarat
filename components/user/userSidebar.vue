<template>
  <aside
    class="user-side-bar pt-[35px] pb-[25px] w-[260px] min-h-screen bg-white dark:bg-dark-37 shadow flex flex-col justify-between"
  >
    <!-- logo -->
    <div>
      <img
        src="/images/EkhtibaratLogoColor.png"
        alt="شعار"
        class="w-[190px] mx-auto block dark:hidden"
      />
      <img
        src="/images/EkhtibaratLogoWhite.png"
        alt="شعار"
        class="w-[190px] mx-auto hidden dark:block"
      />
    </div>

    <!-- menu items -->
    <nav class="flex-1 p-[15px] mt-[35px]">
      <ul class="space-y-1 gap-y-[10px] grid">
        <li
          v-for="item in menuItems"
          :key="item.name"
        >
          <router-link
            :to="item.route"
            :class="[
              'text-[20px] h-[50px] flex items-center gap-2 font-medium p-2 transition dark:hover:text-dark-44 hover:bg-pink-ff',
              route.fullPath === item.route
                ? 'bg-pink-ff border border-purple-e0 rounded-lg text-dark-44 dark:text-dark-44'
                : 'text-dark-44 dark:text-white',
            ]"
          >
            <img
              :src="item.icon"
              alt="icon"
              class=""
            />
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- user list -->
    <div
      class="px-[15px] dark:border-gray-700 flex items-center justify-between cursor-pointer"
    >
      <div class="flex items-center gap-3">
        <custom-image
          :folderName="imagesFolderName.Users"
          :url="userData?.pictureUrl"
          :size="imagesSize.xs"
          :ext="imageExt.jpg"
          width="40"
          height="40"
          radius="50%"
        />
        <span class="text-[18px] font-bold text-purple-e0 dark:text-gray-200">
          حسابي
        </span>
      </div>
      <i class="fa fa-chevron-left text-purple-e0 font-[16px]"></i>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageSize } from '~/main/constants/image-size';
import { ImageExt } from '~/main/constants/image-ext';
import { RouteHelper } from '~/main/utils/route-helper';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';

const menuItems = [
  {
    name: 'الرئيسية',
    icon: '/images/svg/user-panel/house.svg',
    route: '/',
  },
  {
    name: 'تأسيس',
    icon: '/images/svg/user-panel/bricks.svg',
    route: '/user-dashboard/foundation',
  },
  {
    name: 'تدريب',
    icon: '/images/svg/user-panel/dumbbell-iron.svg',
    route: `/user-dashboard/prepare?page=${UserPanelItemsRecord[UserPanelItems.trainings]}`,
  },
  {
    name: 'محاكي الاختبار',
    icon: '/images/svg/user-panel/studying-exam.svg',
    route: `/user-dashboard/prepare?page=${UserPanelItemsRecord[UserPanelItems.exams]}`,
  },
  {
    name: 'سجل التدريب',
    icon: '/images/svg/user-panel/hourglass-time.svg',
    route: '/dashboard/history',
  },
  {
    name: 'خطواتي',
    icon: '/images/svg/user-panel/star.svg',
    route: '/user-dashboard/steps',
  },
  {
    name: 'تحليلاتي',
    icon: '/images/svg/user-panel/chart-bullish.svg',
    route: '/user-dashboard/analytics',
  },
  {
    name: 'الاشتراكات',
    icon: '/images/svg/user-panel/star.svg',
    route: RouteHelper.userPanelSubscriptions(),
  },
];

//composable
const { data } = useAuth();
const route = useRoute();

//computed
const userData = computed(() => data.value as UserInfoDataModel);

//enums
const imagesFolderName = ImagesFolderName;
const imagesSize = ImageSize;
const imageExt = ImageExt;
</script>

<style lang="scss" scoped>
.user-side-bar {
  box-shadow: -4px 0px 10px #00000029;
}
</style>
