<template>
  <aside class="w-64 min-h-screen bg-white dark:bg-gray-900 shadow flex flex-col justify-between">
    <!-- logo -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <img src="/images/EkhtibaratLogoColor.png" alt="شعار" class="w-40 mx-auto" />
    </div>

    <!-- menu items -->
    <nav class="flex-1 p-4 space-y-2">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.name">
          <router-link
            :to="item.route"
            class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            active-class="bg-gray-100 dark:bg-gray-800 text-blue-600"
          >
            <img
              :src="item.icon"
              alt="icon"
              class="w-5 h-5"
            />
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- user list -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
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
        <span class="text-sm text-gray-700 dark:text-gray-200 font-semibold">حسابي</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageSize } from '~/main/constants/image-size';
import { ImageExt } from '~/main/constants/image-ext';
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
    route: '/dashboard/training',
  },
  {
    name: 'محاكي الاختبار',
    icon: '/images/svg/user-panel/studying-exam.svg',
    route: '/dashboard/simulator',
  },
  {
    name: 'سجل التدريب',
    icon: '/images/svg/user-panel/hourglass-time.svg',
    route: '/dashboard/history',
  },
  {
    name: 'تحليلاتي',
    icon: '/images/svg/user-panel/chart-bullish.svg',
    route: '/dashboard/analytics',
  },
  {
    name: 'الاشتراكات',
    icon: '/images/svg/user-panel/star.svg',
    route: '/dashboard/subscriptions',
  },
];

//composable
const { data} = useAuth();

//computed
const userData = computed(() => data.value as UserInfoDataModel);

//enums
const imagesFolderName = ImagesFolderName;
const imagesSize = ImageSize;
const imageExt = ImageExt;
</script>
