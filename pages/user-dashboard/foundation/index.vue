<template>
  <user-panel-layout contentClass="max-w-[1050px] !mx-auto">
    <template #top-right></template>

    <div class="space-y-10 mb-[100px] lg:mb-0">
      <app-loading-spinner
        v-if="userPanelStore.fetching.lessonsCategories"
        text="جاري تحميل البيانات..."
        :showText="false"
        :showSpinner="false"
        :showSkeleton="true"
        :skeletonCount="16"
      />

      <div
        v-else-if="
          !userPanelStore.lessonsCategories ||
          userPanelStore.lessonsCategories.length === 0
        "
        class="flex justify-center items-center py-10"
      >
        <span class="text-gray-500 dark:text-gray-300">لا توجد بيانات</span>
      </div>

      <div
        v-for="section in userPanelStore.lessonsCategories"
        v-else
        :key="section.id"
        class="fade-in mx-auto max-w-fit"
      >
        <div class="flex items-center gap-x-[10px] mb-[20px]">
          <img
            :src="section.iconUrl"
            alt="icon"
            class="w-[36px]"
          />
          <h2 class="text-[24px] font-bold text-blue-d6">
            {{ section.title }}
          </h2>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-[15px] justify-self-start"
        >
          <div
            v-for="child in section.children"
            :key="child.id"
            class="rounded-[8px] w-[300px] p-[17px_15px] bg-white dark:bg-dark-37 transition hover:scale-[1.02] cursor-pointer group shadow-custom dark:shadow-custom-dark"
            @click="toLesson(child.id)"
          >
            <h3 class="text-[20px] font-bold text-dark-63 dark:text-white">
              {{ child.title }}
            </h3>

            <p class="text-[14px] font-bold text-purple-c2 mb-1">
              {{ getProgress(child) + '%' }}
            </p>

            <div class="flex justify-between items-center gap-x-[26px]">
              <app-g-progress-bar
                bgClass="bg-purple-c2"
                height="5px"
                :showText="false"
                :value="getProgress(child)"
              />
              <div class="flex items-center gap-x-[8px]">
                <p
                  class="text-[14px] font-medium text-gray-8f dark:text-gray-400 mb-1"
                >
                  {{ getStatus(child) }}
                </p>
                <i
                  class="fa fa-chevron-left text-[14px] text-gray-8f dark:text-gray-400"
                ></i>
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
import { definePageMeta } from '#imports';

//resourses
const router = useRouter();

//store
const userPanelStore = useUserPanelStore();

//data getting
await userPanelStore.getLessonsCategoryList();

//methods
function getStatus(item: lessonsCategoriesDataModel) {
  if (item.doneLessonsCount === 0) return 'ابدأ';
  if (item.doneLessonsCount >= item.totalLessonsCount) return 'مراجعة';
  return 'استمرار';
}

function getProgress(item: lessonsCategoriesDataModel) {
  if (!item.totalLessonsCount) return 0;
  return Math.round((item.doneLessonsCount / item.totalLessonsCount) * 100);
}

function toLesson(id) {
  router.push(`/user-dashboard/foundation/lesson/${id}`);
}

//watch
watch(
  () => userPanelStore.globalType,
  async (newVal, oldVal) => {
    await userPanelStore.getLessonsCategoryList();
  },
  { immediate: true }
);

definePageMeta({
  layout: 'empty-layout',
});
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
