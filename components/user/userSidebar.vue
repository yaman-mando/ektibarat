<template>
  <aside v-if="isDesktop" class="user-side-bar pt-[35px] pb-[25px] w-[260px] min-h-screen bg-white dark:bg-dark-37 
      shadow flex flex-col justify-between relative" ref="sidebarRef">
    <!-- logo -->
    <div>
      <img src="/images/EkhtibaratLogoColor.png" alt="شعار" class="w-[190px] mx-auto block dark:hidden" />
      <img src="/images/EkhtibaratLogoWhite.png" alt="شعار" class="w-[190px] mx-auto hidden dark:block" />
    </div>

    <!-- menu items -->
    <nav class="flex-1 p-[15px] mt-[35px]">
      <ul class="space-y-1 gap-y-[10px] grid">


        <template v-for="item in menuItems" :key="item.name">
        <li v-if="item.show">
          <router-link :to="item.route" :class="['text-[20px] h-[50px] flex items-center gap-2 font-medium p-2 transition dark:hover:text-dark-44 hover:bg-pink-ff',
            route.fullPath === item.route
              ? 'bg-pink-ff border border-purple-e0 rounded-lg text-dark-44 dark:text-dark-44'
              : 'text-dark-44 dark:text-white'
          ]">
            <img :src="item.icon" alt="icon" />
            <span>{{ item.name }}</span>
          </router-link>
        </li>
        </template>
      </ul>
    </nav>


    <div @click="toggleAccountMenu"
      class="px-[15px] dark:border-gray-700 flex items-center justify-between cursor-pointer relative">
      <div class="flex items-center gap-3">
        <custom-image :folderName="imagesFolderName.Users" :url="userData?.pictureUrl" :size="imagesSize.xs"
          :ext="imageExt.jpg" width="40" height="40" radius="50%" />
        <span class="text-[18px] font-bold text-purple-e0 dark:text-gray-200">حسابي</span>
      </div>
      <i class="fa fa-chevron-left text-purple-e0 font-[16px]"></i>

      <transition name="fade-slide">
        <ul @click.stop v-if="showAccountMenu" style="box-shadow: 0px 0px 10px 0px #00000026" class="absolute bottom-0 left-[-270px] bg-white dark:bg-dark-37 shadow-md 
        w-[280px] h-[244px] grid justify-stretch items-center
        border border-[#BCCCDB] rounded-[20px] p-[10px_15px] text-sm text-right z-50">
          <li @click="toggleExamMenu"
            class="cursor-pointer text-[20px] font-medium color-dark-63 flex justify-between items-center w-full">
            <span>تغيير الاختبار</span>
            <span class="text-[14px] text-purple-e0">{{ globalOptions.filter(k=> k.value === selectedGlobal)?.[0]?.label }}
              <i class="fa fa-chevron-left text-purple-e0 text-sm"></i>
            </span>


            <transition name="fade-slide">
              <div v-if="showExamMenu"
                class="ml-4 mt-2 bg-gray-50 absolute left-[-90px] top-0 rounded-lg border border-gray-200 shadow-sm p-1">
                <div v-for="option,index in globalOptions" :key="index" @click.stop="selectExam(option.value)"
                  class="cursor-pointer py-2 px-2 hover:bg-purple-100 rounded text-sm"
                  :class="{ 'bg-purple-200 font-bold': selectedGlobal === option.value }">
                  {{ option.label }}
                </div>
              </div>
            </transition>

          </li>
          <li class="cursor-pointer hover:text-purple-600 text-[20px] font-medium color-dark-63">خُطَطي التدريبية</li>
          <li @click="toPage('personal-setting')"
            class="cursor-pointer hover:text-purple-600 text-[20px] font-medium color-dark-63">الإعدادات</li>
          <li class="cursor-pointer hover:text-purple-600 text-[20px] font-medium color-dark-63">المساعدة</li>
          <li @click="logout" class="cursor-pointer hover:text-red-500 text-[20px] font-medium color-dark-63">خروج</li>
        </ul>
      </transition>
    </div>

  </aside>
  <div class="w-full fixed bottom-0 h-[78px] px-[15px] bg-white" style="box-shadow: 0px -2px 10px 0px #00000026" v-else-if="hasMobileMenu">
    <div class="flex items-center justify-between h-full">
      <template v-for="item in menuItems" :key="item.name">
      <router-link
      v-if="item.isMobile" 
      :to="item.route" 
      :class="['flex items-center',
        route.fullPath === item.route
          ? 'bg-pink-ff border border-purple-e0 rounded-[8px] p-[8px] text-dark-44 dark:text-dark-44'
          : 'text-dark-44 dark:text-white'
      ]">
        <img :src="item.icon" alt="icon" />
      </router-link>
      </template>
    </div>
  </div>
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
import { globalSubList } from '~/main/modules/user-panel/data-access/user-panel.enum';
import { useUserPanelStore } from '~/store/user-panel';


const props = withDefaults(
  defineProps<{
    hasMobileMenu?: boolean;
  }>(),
  {
    hasMobileMenu: true,
  }
);


const menuItems = [
  {
    name: 'الرئيسية',
    icon: '/images/svg/user-panel/house.svg',
    route: '/',
    isMobile:true,
    show:true,
  },
  {
    name: 'تأسيس',
    icon: '/images/svg/user-panel/balon.svg',
    route: '/user-dashboard/foundation',
    isMobile:true,
    show:true,
  },
  {
    name: 'تدريب',
    icon: '/images/svg/user-panel/target.svg',
    route: `/user-dashboard/prepare?page=${UserPanelItemsRecord[UserPanelItems.trainings]}`,
    isMobile:true,
    show:true,
  },
  {
    name: 'محاكي الاختبار',
    icon: '/images/svg/user-panel/studying-exam.svg',
    route: `/user-dashboard/prepare?page=${UserPanelItemsRecord[UserPanelItems.exams]}`,
    isMobile:false,
    show:false,
  },
  {
    name: 'سجل التدريب',
    icon: '/images/svg/user-panel/hourglass-time.svg',
    route: '/dashboard/history',
    isMobile:false,
    show:false,
  },
  {
    name: 'خطواتي',
    icon: '/images/svg/user-panel/star.svg',
    route: '/user-dashboard/steps',
    isMobile:false,
    show:false,
  },
  {
    name: 'تحليلاتي',
    icon: '/images/svg/user-panel/analytics.svg',
    route: '/user-dashboard/analytics',
    isMobile:true,
    show:true,
  },
  {
    name: 'الاشتراكات',
    icon: '/images/svg/user-panel/king.svg',
    route: RouteHelper.userPanelSubscriptions(),
    isMobile:false,
    show:true,
  },
  {
    name: 'المزيد',
    icon: '/images/svg/user-panel/more.svg',
    route: '/user-dashboard/mobile-menu',
    isMobile:true,
    show:false,
  },
];

//composable
const { data,signOut } = useAuth();
const route = useRoute();
const router = useRouter();
const userPanelStore = useUserPanelStore();
const isDesktop = ref(false);


//computed
const userData = computed(() => data.value as UserInfoDataModel);
const selectedGlobal = computed(()=> {return userPanelStore.globalType})

//data
const showExamMenu = ref(false)
const showAccountMenu = ref(false)

//enums
const imagesFolderName = ImagesFolderName;
const imagesSize = ImageSize;
const imageExt = ImageExt;
const globalOptions = globalSubList;


const toggleExamMenu = () => {
  showExamMenu.value = !showExamMenu.value
  //showAccountMenu.value = false
}

const toggleAccountMenu = () => {
  showAccountMenu.value = !showAccountMenu.value
  //showExamMenu.value = false
}

const selectExam = (exam) => {
  showExamMenu.value = false
  userPanelStore.setGlobalType(exam);
}

const sidebarRef = ref(null)

const logout = async () => {
  await signOut({ callbackUrl: '/' });
  document.getElementById('web-footer')?.classList.remove('is-user-panel');
};

const handleClickOutside = (event) => {
  //@ts-ignore
  if (!sidebarRef.value?.contains(event.target)) {
    showExamMenu.value = false
    showAccountMenu.value = false
  }
}

const toPage = (pageName) => {
  router.push(`/user-dashboard/${pageName}`)
}

onMounted(() => {
  const checkScreen = () => {
    isDesktop.value = window.innerWidth >= 768;
  }
  checkScreen();
  window.addEventListener('resize', checkScreen);
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>

<style lang="scss" scoped>
.user-side-bar {
  box-shadow: -4px 0px 10px #00000029;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
