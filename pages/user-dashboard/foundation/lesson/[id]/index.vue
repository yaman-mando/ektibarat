<template>
  <user-panel-wrapper :has-l-info="windowSize.isDesktop" :has-r-info="windowSize.isDesktop"
    :contentClass="`max-w-[1065px] !mx-auto ${!windowSize.isDesktop?'!py-[5px] !px-[10px]':''} `">
    <template #top-right></template>

    <div v-if="userPanelStore.lessonsList" class="flex flex-col xl1200:flex-row gap-[35px]">
      <div class="flex-1 xl1200:mt-[-60px]">
        <div style="background: linear-gradient(270deg, #24A7F1 0%, #0266D6 100%);"
          :class="windowSize.isDesktop?'mb-[30px]':'mb-[20px]'"
          class="grid items-center h-[107px] text-white p-[10px_20px] rounded-[8px]">
          <div class="flex items-center justify-baseline gap-x-[8px] cursor-pointer opacity-50 w-fit"
            @click="toFoundation()">
            <i class="fa fa-chevron-right text-white text-[16px]"></i>
            <span class="text-white font-medium text-[16px] leading-[1.2]">رجوع للخلف</span>
          </div>
          <div class="flex justify-between mt-[5px]">
            <h2 class="text-[26px] font-bold leading-[1.2]">
              {{ userPanelStore.lessonsList?.title }}
            </h2>
          </div>
          <div class="flex items-center gap-x-[10px] justify-between">
            <app-g-progress-bar class="flex-1" height="8px"
              :value="(doneCount / totalCount) * 100" :showText="false" bgClass="bg-white" bgEmptyClass="bg-white/30" />
            <span class="text-[16px] font-bold text-white">{{ doneCount }}/{{ totalCount }}</span>
          </div>
        </div>

        <div :class="windowSize.isDesktop?'space-y-[15px]':'space-y-[20px]'">
          <template v-for="(group, index) in lessonGroups" :key="index">
            <div v-if="group.length === 1">
              <lesson-card :lesson="group[0]" :status="getStatus(group[0])" />
            </div>
            <div v-else class="flex flex-wrap gap-[15px]">
              <lesson-card v-for="lesson in group" :key="lesson.id" :lesson="lesson" :status="getStatus(lesson)"
                class="flex-1" />
            </div>
          </template>
        </div>
      </div>

      <div class="w-full xl1200:w-[330px]">
        <daily-challenges />
      </div>
    </div>
  </user-panel-wrapper>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import lessonCard from '@/components/user/lessonCard.vue';
import dailyChallenges from '@/components/user/dailyChallenges.vue';
import { useUserPanelStore } from '~/store/user-panel';
import type { lessonObj } from '~/main/modules/user-panel/data-access/user-panel.model';
import { definePageMeta } from '#imports';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { planSubscribedEnum } from '~/main/constants/global.enums';
const windowSize = useWindowSize();

// const data = {
//   id: 3,
//   title: 'المسائل الحسابية',
//   totalLessonsCount: 11,
//   doneLessonsCount: 1,
//   lessons: [
//     {
//       id: 1,
//       title: 'العمليات الحسابية',
//       iconUrl: 'string',
//       order: 1,
//       examId: null,
//       attachmentIds: [],
//       videoLink: 'https://www.youtube.com/watch?v=fwk8d_HRmZU',
//       type: 1,
//       periodTime: 1314,
//       isWatched: true,
//       isShow: true,
//     },
//     {
//       id: 2,
//       title: 'الأعداد وخصائصها',
//       iconUrl: '',
//       order: 2,
//       examId: null,
//       attachmentIds: [],
//       videoLink: '',
//       type: 1,
//       periodTime: 857,
//       isWatched: false,
//       isShow: true,
//     },
//     {
//       id: 6,
//       title: 'معلومات للحفظ',
//       iconUrl: '',
//       order: 3,
//       examId: null,
//       attachmentIds: [],
//       videoLink: '',
//       type: 2,
//       periodTime: 0,
//       isWatched: false,
//       isShow: false,
//     },
//     {
//       id: 3,
//       title: 'الأعداد العشرية',
//       iconUrl: '',
//       order: 3,
//       examId: null,
//       attachmentIds: [],
//       videoLink: '',
//       type: 1,
//       periodTime: 857,
//       isWatched: false,
//       isShow: false,
//     },
//     {
//       id: 4,
//       title: 'معلومات للحفظ',
//       iconUrl: '',
//       order: 4,
//       examId: null,
//       attachmentIds: [],
//       videoLink: '',
//       type: 2,
//       periodTime: 0,
//       isWatched: false,
//       isShow: false,
//     },
//     {
//       id: 5,
//       title: 'تدريبات القسم',
//       iconUrl: '',
//       order: 5,
//       examId: null,
//       attachmentIds: [],
//       videoLink: '',
//       type: 3,
//       periodTime: 0,
//       isWatched: false,
//       isShow: false,
//     },
//   ],
// };

//resourses
const route = useRoute();
const router = useRouter();
const id = route.params.id;

//store
const userPanelStore = useUserPanelStore();
const { data } = useAuth();
const userData = computed(() => data.value as UserInfoDataModel);

//data getting
await userPanelStore.getLessonsList(id);

const sortedLessons = computed(() => {
  return userPanelStore.lessonsList?.lessons.sort((a, b) => a.order - b.order);
});

const doneCount = computed(
  () => userPanelStore.lessonsList?.doneLessonsCount ?? 0
);
const totalCount = computed(
  () => userPanelStore.lessonsList?.totalLessonsCount ?? 0
);

function getStatus(lesson: lessonObj) {
  const index = sortedLessons.value?.findIndex((l) => l.id === lesson.id);
  const firstLocked = sortedLessons.value?.findIndex(
    (l) => l.isWatched === false
  );
  if (lesson.isWatched) return 'completed';
  if (index === firstLocked) return 'next';
  if(lesson.isFree) return 'open'
  return userData.value.planSubscribed === planSubscribedEnum.subscribed ?'open':'locked';
}

const toFoundation = () => {
  router.push(`/user-dashboard/foundation`);
};

//type=1 videos,type=2 training ,type=3 file to save
//if type2 + type3 behind div is tow part
const lessonGroups = computed(() => {
  const groups: lessonObj[][] = [];
  const lessons = sortedLessons.value;
  let i = 0;
  if (!lessons) return groups;
  while (i < lessons.length) {
    const curr = lessons[i];
    const next = lessons[i + 1];
    if (curr?.type === 2 && next?.type === 3) {
      groups.push([curr, next]);
      i += 2;
    } else {
      groups.push([curr]);
      i += 1;
    }
  }
  return groups;
});

definePageMeta({
  layout: 'empty-layout',
});
</script>
