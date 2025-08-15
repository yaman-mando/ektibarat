<template>
  <!-- page foundation -->
  <user-panel-wrapper contentClass="max-w-[1050px] !mx-auto">
    <template #top-right></template>

    <div class="space-y-10 mb-[100px] lg:mb-0">

      <app-data-wrapper :loading="userPanelStore.fetching.lessonsCategories" :data="userPanelStore.lessonsCategories"
        loading-type="skeleton" :skeleton-count="16" empty-text="لا توجد بيانات">
        <div v-for="section in userPanelStore.lessonsCategories" :key="section.id" class="fade-in mx-auto max-w-fit">
          <div class="flex items-center gap-x-[10px] mb-[20px]">
            <img :src="section.iconUrl" alt="icon" class="w-[36px]" />
            <h2 class="text-[24px] font-bold text-blue-d6">
              {{ section.title }}
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-[15px] justify-self-start">
            <div v-for="child in section.children" :key="child.id"
              class="grid rounded-[8px] w-[300px] h-[95px] p-[15px] bg-white dark:bg-dark-37 transition hover:scale-[1.02] cursor-pointer group shadow-custom dark:shadow-custom-dark"
              @click="toLesson(child.id)">
              <h3 class="text-[20px] font-bold text-dark-63 dark:text-white leading-[1.2]">
                {{ child.title }}
              </h3>

              <div class="flex justify-between items-end gap-x-[28px]">
                <div class="grid gap-[2px] max-w-[180px] flex-1">
                  <span class="text-[14px] font-bold text-purple-c2 leading-[1.2]">
                    {{ getProgress(child) + '%' }}
                  </span>
                  <app-g-progress-bar radius="100px" background="linear-gradient(90deg, #7840E0 0%, #300378 100%)"
                    :has-shadow="true" height="6px" :showText="false" :value="getProgress(child)" />
                </div>
                <div class="flex items-center gap-x-[8px] mb-[-5px]">
                  <span class="text-[14px] font-medium text-dark-63 dark:text-gray-400 leading-[1.2]">
                    {{ getStatus(child) }}
                  </span>
                  <i class="fa fa-chevron-left text-[14px] text-dark-63 dark:text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </app-data-wrapper>


    </div>
  </user-panel-wrapper>
</template>

<script lang="ts" setup>
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
