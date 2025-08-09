<template>
  <div
    id="user-panel-wrapper"
    :class="[
      colorMode.preference === 'dark' ? 'dark' : '',
      'min-h-screen flex flex-col',
    ]"
  >
    <app-mobile-header
      v-if="showMobileHeader && pageTitle"
      :title="pageTitle"
    />
    <!-- sidebar button in mobile -->
    <!-- <button class="md:hidden fixed top-4 right-4 z-50 bg-gray-700 text-white p-2 rounded shadow-md"
      @click="isSidebarOpen = !isSidebarOpen">
      ☰
    </button> -->
    <div
      v-if="hasPrev"
      class="w-full h-[60px] flex items-center px-[19px] shadow-custom sticky top-0 bg-white"
    >
      <i
        class="fa fa-chevron-right cursor-pointer text-gray-8f"
        @click="toBack"
      ></i>
      <span class="!text-center text-dark-63 text-[18px] font-bold flex-auto">
        {{ pageName }}
      </span>
    </div>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside class="fixed md:relative z-40 h-full md:h-auto">
        <user-sidebar :hasMobileMenu="!hasPrev" />
      </aside>

      <div
        v-if="isSidebarOpen && !isDesktop"
        class="fixed inset-0 bg-black opacity-40 z-30"
        @click="isSidebarOpen = false"
      ></div>

      <div
        :class="[
          { isMobile: !windowSize.isDesktop && !hasPrev },
          { hasPrev: hasPrev },

          { '!p-0 !bg-white': noSpaces },
        ]"
        class="us-content flex-1 bg-gray-fb dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-[40px] py-[30px] ml-0"
      >
        <div :class="contentClass">
          <div
            v-if="hasLInfo || hasRInfo"
            class="flex justify-between items-baseline flex-wrap gap-4 mb-6"
            :class="contentWrapperClass"
          >
            <!-- right info -->
            <div
              v-if="hasRInfo"
              class="flex items-center"
            >
              <slot name="top-right"></slot>
            </div>

            <!-- left info -->
            <div
              v-if="hasLInfo"
              class="flex items-center gap-x-[20px]"
            >
              <div class="flex items-center gap-x-[8px]">
                <img
                  src="/images/svg/star-orange.svg"
                  alt="icon"
                  class="w-[24px] h-auto"
                />
                <span class="text-[20px] font-bold text-blue-f7">2,849</span>
              </div>
              <div class="flex items-center gap-x-[8px]">
                <img
                  src="/images/svg/fire.svg"
                  alt="icon"
                  class="w-[16px] h-auto"
                />
                <span class="text-[20px] font-bold text-orange-39">7</span>
              </div>
              <app-dropdown
                :modelValue="
                  globalOptions.filter((k) => k.value === selectedGlobal)?.[0]
                    .label
                "
                topLabel="تغيير الاختبار"
                :options="globalOptions"
                @select="handleSelectGlobal"
              />
            </div>
          </div>

          <slot></slot>
        </div>
      </div>
    </div>

    <!-- dark light button -->
    <button
      :class="{ '!bottom-[90px]': !isDesktop && !hasPrev }"
      class="fixed bottom-4 left-4 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600 z-50 cursor-pointer"
      @click="toggleDarkMode"
    >
      {{ colorMode.preference === 'dark' ? '🌙' : '☀️' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import userSidebar from '~/components/user/userSidebar.vue';
import appDropdown from '~/components/shared/app-dropdown.vue';
import { useUserPanelStore } from '~/store/user-panel';
import { globalSubList } from '~/main/modules/user-panel/data-access/user-panel.enum';

useHead({
  htmlAttrs: {
    dir: 'rtl',
    class: 'app-light',
  },
});

const props = withDefaults(
  defineProps<{
    contentClass?: string;
    contentWrapperClass?: string;
    hasRInfo?: boolean;
    hasLInfo?: boolean;
    showMobileHeader?: boolean;
    pageTitle?: string;
    withBackPage?: boolean;
    hasPrev?: boolean;
    noSpaces?: boolean;
    pageName?: string;
  }>(),
  {
    contentClass: '',
    contentWrapperClass: '',
    hasRInfo: true,
    hasLInfo: true,
    hasPrev: false,
    noSpaces: false,
    withBackPage: false,
    pageName: '',
  }
);
const router = useRouter();
const colorMode = useColorMode();
const userPanelStore = useUserPanelStore();
const windowSize = useWindowSize();
const isSidebarOpen = ref(false);
const isDesktop = ref(false);

//enums
const globalOptions = globalSubList;

const selectedGlobal = computed(() => {
  return userPanelStore.globalType;
});

const handleSelectGlobal = (item) => {
  userPanelStore.setGlobalType(item.value);
};

function toggleDarkMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
}

function toBack() {
  if (props.withBackPage) {
    router.go(-1);
    return;
  }
  router.push('/user-dashboard/mobile-menu');
}

onMounted(() => {
  const checkScreen = () => {
    isDesktop.value = window.innerWidth >= 768;
    if (isDesktop.value) isSidebarOpen.value = false;
  };

  checkScreen();
  window.addEventListener('resize', checkScreen);

  if (import.meta.client) {
    userPanelStore.loadGlobalTypeFromStorage();
  }
});

definePageMeta({
  layout: 'empty-layout',
});
</script>

<style lang="scss">
@import '/assets/scss/shared/sidebar-filter';
@import '/assets/scss/style';
@import 'assets/font-icons/ek-icon-v1.0/style.css';
@import '/assets/scss/main';

:root {
  --app-mobile-header-height: 60px;
  --mobile-menu-height: 78px;
  @include web-desktop-up() {
    --app-mobile-header-height: 0px;
  }
}

#user-panel-wrapper {
  .us-content {
    max-height: 100vh;
    &.hasPrev {
      max-height: calc(100vh - 60px);
    }
    &.isMobile {
      max-height: calc(100vh - var(--mobile-menu-height));
    }
    overflow-y: scroll;

    @include web-mobile-only() {
      padding: 10px 5px;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
