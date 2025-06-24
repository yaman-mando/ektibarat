<template>
  <div
    id="user-panel-layout"
    :class="[
      colorMode.preference === 'dark' ? 'dark' : '',
      'min-h-screen flex flex-col',
    ]"
  >
    <!-- sidebar button in mobile -->
    <button
      class="md:hidden fixed top-4 right-4 z-50 bg-gray-700 text-white p-2 rounded shadow-md"
      @click="isSidebarOpen = !isSidebarOpen"
    >
      ☰
    </button>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <transition name="slide">
        <aside
          v-show="isSidebarOpen || isDesktop"
          class="fixed md:relative z-40 h-full md:h-auto"
        >
          <user-sidebar />
        </aside>
      </transition>

      <div
        v-if="isSidebarOpen && !isDesktop"
        class="fixed inset-0 bg-black opacity-40 z-30"
        @click="isSidebarOpen = false"
      ></div>

      <div class="us-content flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-[40px] py-[30px] ml-0">


        <div class="flex justify-between items-baseline flex-wrap gap-4 mb-6">

          <div class="flex items-center">
            <slot name="top-right"></slot>
          </div>

          <div class="flex items-center w-[300px] gap-x-[20px]">
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
              v-model="selectedGlobal"
              topLabel="تغيير الاختبار"
              :options="globalOptions"
              @select="handleSelectGlobal"
            />
          </div>
        </div>

        <slot></slot>
      </div>
    </div>

    <!-- dark light button -->
    <button
      class="fixed bottom-4 left-4 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600 z-50 cursor-pointer"
      @click="toggleDarkMode"
    >
      {{ colorMode.preference === 'dark' ? '🌙' : '☀️' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import userSidebar from '@/components/user/userSidebar.vue';
import appDropdown from '@/components/shared/app-dropdown.vue';
import { useUserPanelStore } from '~/store/user-panel';
import { globalSubList } from '~/main/modules/user-panel/data-access/user-panel.enum';

useHead({
  htmlAttrs: {
    dir: 'rtl',
    class: 'app-light',
  },
});

const colorMode = useColorMode();
const userPanelStore = useUserPanelStore();
const isSidebarOpen = ref(false);
const isDesktop = ref(false);

//enums
const globalOptions = globalSubList;

const selectedGlobal = ref(globalOptions[0]);

const handleSelectGlobal = (item) => {
  selectedGlobal.value = item;
  userPanelStore.setGlobalType(item.value);
};

function toggleDarkMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
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
    selectedGlobal.value =
      globalOptions.find((opt) => opt.value === userPanelStore.globalType) ||
      globalOptions[0];
  }
});
</script>

<style lang="scss">
@import '@/assets/scss/shared/sidebar-filter.scss';
@import '@/assets/scss/style.scss';
@import '@/assets/font-icons/ek-icon-v1.0/style.css';
@import '@/assets/scss/main.scss';

#user-panel-layout {
  .us-content {
    max-height: 100vh;
    overflow-y: scroll;
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
