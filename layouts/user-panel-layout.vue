<template>
  <div :class="[$colorMode === 'dark' ? 'dark' : '', 'min-h-screen flex flex-col']">

    <!-- sidebar button in mobile -->
    <button @click="isSidebarOpen = !isSidebarOpen"
      class="md:hidden fixed top-4 right-4 z-50 bg-gray-700 text-white p-2 rounded shadow-md">
      ☰
    </button>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <transition name="slide">
        <aside v-show="isSidebarOpen || isDesktop"
          class="w-64 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 fixed md:relative z-40 h-full md:h-auto">
          <userSidebar />
        </aside>
      </transition>



      <div v-if="isSidebarOpen && !isDesktop" class="fixed inset-0 bg-black opacity-40 z-30"
        @click="isSidebarOpen = false"></div>


      <div class="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 ml-0 md:ml-64">


        <div class="flex justify-between items-center flex-wrap gap-4 mb-6">

          <div class="flex items-center">
              <slot name="top-right"></slot>
            </div>

          <div class="flex items-center just gap-4">
            <div class="flex items-center gap-1">
              <img src="/images/svg/star-orange.svg" alt="icon" class="w-5 h-5" />
              <span>2,849</span>
            </div>
            <div class="flex items-center gap-1">
              <img src="/images/svg/fire.svg" alt="icon" class="w-5 h-5" />
              <span>7</span>
            </div>
            <select class="p-2 border rounded bg-white dark:bg-gray-700 dark:text-white">
              <option>قدرات</option>
              <option>تحصيلي</option>
            </select>
          </div>



        </div>


        <slot></slot>
      </div>
    </div>

    <!-- dark light button -->
    <button @click="toggleDarkMode"
      class="fixed bottom-4 left-4 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600 z-50">
      {{ $colorMode === 'dark' ? '🌙' : '☀️' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { ref, onMounted } from 'vue'
import userSidebar from '@/components/user/userSidebar.vue'

useHead({
  htmlAttrs: {
    dir: 'rtl',
    class: 'app-light',
  },
});

const $colorMode = useColorMode()
const isSidebarOpen = ref(false)
const isDesktop = ref(false)

function toggleDarkMode() {
  $colorMode.value = $colorMode.value === 'dark' ? 'light' : 'dark'
}

// تحديث حالة الجهاز (موبايل أو سطح مكتب)
onMounted(() => {
  const checkScreen = () => {
    isDesktop.value = window.innerWidth >= 768
    if (isDesktop.value) isSidebarOpen.value = false
  }

  checkScreen()
  window.addEventListener('resize', checkScreen)
})
</script>

<style lang="scss">
@import '@/assets/scss/shared/sidebar-filter.scss';
@import '@/assets/scss/style.scss';
@import '@/assets/font-icons/ek-icon-v1.0/style.css';
@import '@/assets/scss/main.scss';


/* انتقال جانبي للقائمة */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
