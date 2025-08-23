<template>
  <aside
    v-if="windowSize.isDesktop"
    class="user-side-bar pt-[35px] pb-[25px] w-[260px] min-h-screen bg-white dark:bg-dark-37 shadow flex flex-col justify-between relative"
  >
    <!-- logo -->
    <div>
      <nuxt-link :to="webHomePathUtil()">
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
      </nuxt-link>
    </div>

    <!-- menu items -->
    <nav class="flex-1 p-[15px] mt-[35px]">
      <ul class="space-y-1 gap-y-[10px] grid">
        <template
          v-for="item in filteredMenuModel"
          :key="item.name"
        >
          <li>
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
              />
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </template>
      </ul>
    </nav>

    <div
      ref="sidebarRef"
      class="px-[15px] dark:border-gray-700 flex items-center justify-between cursor-pointer relative"
      @click="toggleAccountMenu"
    >
      <div class="flex items-center gap-3">
        <custom-image
          :folderName="imagesFolderName.Users"
          :url="userData?.pictureUrl"
          :size="imagesSize.xs"
          :ext="imageExt.jpg"
          :byGender="true"
          width="40"
          height="40"
          radius="50%"
        />
        <span class="text-[18px] font-bold text-purple-e0 dark:text-gray-200">
          حسابي
        </span>
      </div>
      <i class="fa fa-chevron-left text-purple-e0 font-[16px]"></i>

      <transition name="fade-slide">
        <ul
          v-if="showAccountMenu"
          style="box-shadow: 0px 0px 10px 0px #00000026"
          class="absolute bottom-0 left-[-270px] bg-white dark:bg-dark-37 shadow-md w-[280px] h-[244px] grid justify-stretch items-center border border-[#BCCCDB] rounded-[20px] p-[10px_15px] text-sm text-right z-50"
          @click.stop
        >
          <li
            class="cursor-pointer text-[20px] font-medium color-dark-63 flex justify-between items-center w-full"
            @click="toggleExamMenu"
          >
            <span>تغيير الاختبار</span>
            <span class="text-[14px] text-purple-e0">
              {{
                globalOptions.filter((k) => k.value === selectedGlobal)?.[0]
                  ?.label
              }}
              <i class="fa fa-chevron-left text-purple-e0 text-sm"></i>
            </span>

            <transition name="fade-slide">
              <div
                v-show="showExamMenu"
                class="ml-4 mt-2 bg-gray-50 absolute left-[-90px] top-0 rounded-lg border border-gray-200 shadow-sm p-1"
              >
                <div
                  v-for="(option, index) in globalOptions"
                  :key="index"
                  class="cursor-pointer py-2 px-2 hover:bg-purple-100 rounded text-sm"
                  :class="{
                    'bg-purple-200 font-bold': selectedGlobal === option.value,
                  }"
                  @click.stop="selectExam(option.value)"
                >
                  {{ option.label }}
                </div>
              </div>
            </transition>
          </li>
          <template v-if="showMyTrainPlanItem">
            <li class="relative">
              <service-block v-if="!subscriptionsStore.isPremiumSub" />
              <nuxt-link
                :to="webUserTrainingPlan()"
                class="cursor-pointer hover:text-purple-600 text-[20px] font-medium color-dark-63"
              >
                خُطَطي التدريبية
              </nuxt-link>
            </li>
          </template>

          <li
            class="cursor-pointer hover:text-purple-600 text-[20px] font-medium color-dark-63"
            @click="toPage('personal-setting')"
          >
            الإعدادات
          </li>
          <li
            class="cursor-pointer hover:text-purple-600 text-[20px] font-medium color-dark-63"
          >
            المساعدة
          </li>
          <li
            class="cursor-pointer hover:text-red-500 text-[20px] font-medium color-dark-63"
            @click="logout"
          >
            خروج
          </li>
        </ul>
      </transition>
    </div>
  </aside>
  <div
    v-else-if="hasMobileMenu && windowSize.isMobileSize"
    class="w-full fixed bottom-0 h-[78px] px-[15px] bg-white"
    style="box-shadow: 0px -2px 10px 0px #00000026"
  >
    <div
      class="flex items-center h-full"
      :class="
        filteredMobileMenuModel.length > 3
          ? 'justify-between'
          : 'justify-around'
      "
    >
      <template
        v-for="item in filteredMobileMenuModel"
        :key="item.name"
      >
        <router-link
          :to="item.route"
          :class="[
            'flex items-center justify-center',
            route.fullPath === item.route
              ? 'bg-pink-ff border border-purple-e0 rounded-[8px] h-[48px] w-[48px] text-dark-44 dark:text-dark-44'
              : 'text-dark-44 dark:text-white',
          ]"
        >
          <img
            :src="item.icon"
            alt="icon"
          />
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
import { globalSubList } from '~/main/modules/user-panel/data-access/user-panel.enum';
import { useUserPanelStore } from '~/store/user-panel';
import { UserPlanSubscribedEnum } from '~/core/auth/constants/user-plan-subscribed.enum';
import type { userMenuItems } from '~/core/auth/constants/user-filtered-menu';
import { userMenuItemsIds } from '~/core/auth/constants/user-filtered-menu';
import {
  webHomePathUtil,
  webUserSteps,
  webUserTrainingPlan,
  webUserTrainingPlanGuardUtil,
  webUserTrainWithUs,
} from '~/main/utils/web-routes.utils';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';

const props = withDefaults(
  defineProps<{
    hasMobileMenu?: boolean;
  }>(),
  {
    hasMobileMenu: true,
  }
);

//composable
const runtimeConfig = useRuntimeConfig();
const { data, signOut } = useAuth();
const { appAuth } = useSetupAuth();
const subscriptionsStore = useSubscriptionsStore();
const route = useRoute();
const router = useRouter();
const userPanelStore = useUserPanelStore();
const windowSize = useWindowSize();
const { filteredMenu, filteredMenuMobile } = useFilteredMenu();
//computed
const userData = computed(() => data.value as UserInfoDataModel);
const selectedGlobal = computed(() => {
  return userPanelStore.globalType;
});

const showMyTrainPlanItem = computed(() => {
  return webUserTrainingPlanGuardUtil(userData.value.role);
});

const filteredMenuModel = computed(() => {
  return mapMenuModel(filteredMenu.value);
});

const filteredMobileMenuModel = computed(() => {
  return mapMenuModel(filteredMenuMobile.value);
});

function mapMenuModel(list: typeof userMenuItems) {
  const targetIndex = list.findIndex(
    (item) => item.id === userMenuItemsIds.train
  )!;
  const item = list[targetIndex];

  if (subscriptionsStore.isPremiumSub) {
    if (subscriptionsStore.state.userCurrentSubVal?.isStartedPlan) {
      item.route = webUserSteps();
    } else {
      item.route = webUserTrainWithUs();
    }
  } else {
    item.route = webUserTrainWithUs();
  }

  list.splice(targetIndex, 1, item);

  return list;
}

//data
const showExamMenu = ref(false);
const showAccountMenu = ref(false);

//enums
const imagesFolderName = ImagesFolderName;
const imagesSize = ImageSize;
const imageExt = ImageExt;
const globalOptions = globalSubList;

const toggleExamMenu = () => {
  showExamMenu.value = !showExamMenu.value;
  //showAccountMenu.value = false
};

const toggleAccountMenu = () => {
  showAccountMenu.value = !showAccountMenu.value;
  //showExamMenu.value = false
};

const selectExam = (exam) => {
  showExamMenu.value = false;
  userPanelStore.setGlobalType(exam);
};

const sidebarRef = ref(null);

const logout = async () => {
  await signOut({ callbackUrl: '/' });
  document.getElementById('web-footer')?.classList.remove('is-user-panel');
};

const handleClickOutside = (event) => {
  //@ts-ignore
  if (!sidebarRef.value?.contains(event.target)) {
    showExamMenu.value = false;
    showAccountMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const toPage = (pageName) => {
  router.push(`/user-dashboard/${pageName}`);
};
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
