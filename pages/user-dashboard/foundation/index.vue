<template>
  <user-panel-layout>

    <template #top-right>

    </template>

    <div class="space-y-10">

      <app-loading-spinner v-if="userPanelStore.fetching.lessonsCategories" text="جاري تحميل البيانات..."
        :showText="false" :showSpinner="false" :showSkeleton="true" :skeletonCount="16" />

      <div v-else-if="!userPanelStore.lessonsCategories || userPanelStore.lessonsCategories.length === 0"
        class="flex justify-center items-center py-10">
        <span class="text-gray-500 dark:text-gray-300">لا توجد بيانات</span>
      </div>

      <div v-else v-for="section in userPanelStore.lessonsCategories" :key="section.id" class="fade-in">


        <h2 class="text-[24px] font-bold text-blue-d6 mb-[20px]">{{ section.title }}</h2>

        <div class="flex flex-wrap gap-[15px]">
          <div @click="toLesson(child.categoryId)" v-for="child in section.children" :key="child.id" class="rounded-[8px] w-[300px] p-[17px_15px] bg-white dark:bg-dark-37 transition
                    hover:scale-[1.02] cursor-pointer group
                    shadow-custom dark:shadow-custom-dark
                    ">
            <div class="flex gap-x-[8px] items-center mb-2">
              <img :src="child.iconUrl" alt="icon" class="w-5 h-5" />
              <h3 class="text-[20px] font-bold text-dark-63 dark:text-white">
                {{ child.title }}
              </h3>
            </div>


            <p class="text-[14px] font-bold text-purple-c2 mb-1">

              {{ getProgress(child) + '%' }}
            </p>

            <div class="flex justify-between items-center gap-x-[26px]">
              <div class="relative w-full bg-gray-200 h-[5px] rounded-full overflow-hidden">
                <div class="h-full bg-purple-c2 transition-all" :style="{ width: getProgress(child) + '%' }"></div>
                <span class="absolute text-[10px] text-purple-700 -top-5 left-0 rtl:right-0 rtl:left-auto">
                  {{ getProgress(child) }}%
                </span>
              </div>
              <div class="flex items-center gap-x-[8px]">
                <p class="text-[14px] font-medium text-gray-8f dark:text-gray-400 mb-1">
                  {{ getStatus(child) }}

                </p>
                <i class="fa fa-chevron-left text-[14px] text-gray-8f dark:text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



  </user-panel-layout>
</template>

<script lang="ts" setup>
import userPanelLayout from '~/layouts/user-panel-layout.vue';
import type { lessonsCategoriesDataModel } from '~/main/modules/user-panel/data-access/user-panel.model';
import { useUserPanelStore } from '~/store/user-panel';

//resourses
const router = useRouter();

//store
const userPanelStore = useUserPanelStore()

//data getting
await userPanelStore.getLessonsCategoryList()

//methods
function getStatus(item: lessonsCategoriesDataModel) {
  if (item.doneLessonsCount === 0) return 'ابدأ'
  if (item.doneLessonsCount >= item.totalLessonsCount) return 'مراجعة'
  return 'استمرار'
}

function getProgress(item: lessonsCategoriesDataModel) {
  if (!item.totalLessonsCount) return 0
  return Math.round((item.doneLessonsCount / item.totalLessonsCount) * 100)
}


function toLesson(id) {
  router.push(`/user-dashboard/foundation/lesson/${id}`)
}

//watch
watch(
  () => userPanelStore.globalType,
  async (newVal, oldVal) => {
    await userPanelStore.getLessonsCategoryList()
  },
  { immediate: true }
)

</script>
<style lang="scss">
.fade-in {
  animation: fadeInUp 0.6s ease-in-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>