<template>
  <userPanelLayout>

    <template #top-right>

    </template>

    <div class="flex flex-col xl1200:flex-row gap-[50px]" v-if="userPanelStore.lessonsList">
      <div class="flex-1 xl1200:mt-[-60px]">
        <div
          class="grid h-[110px] gap-y-2px bg-gradient-to-r from-[#24A7F1] to-[#0266D6] text-white p-[15px_20px] rounded-[8px] mb-[30px]">
          <div @click="toFoundation()"
            class="flex items-center justify-baseline gap-x-[8px] cursor-pointer opacity-50 w-fit">
            <i class="fa fa-chevron-right text-white text-[16px]"></i>
            <span class="text-white font-medium text-[16px]">رجوع للخلف</span>
          </div>
          <div class="flex justify-between">
            <h2 class="text-lg font-bold">{{ userPanelStore.lessonsList?.title }}</h2>
          </div>
          <div class="flex items-center gap-x-[23px] justify-between">
            <div class="w-full h-[8px] bg-white/30 rounded-[8px] mt-2">
              <div v-if="doneCount && totalCount" class="h-full bg-white rounded"
                :style="{ width: `${(doneCount / totalCount) * 100}%` }"></div>
            </div>
            <span>{{ doneCount }}/{{ totalCount }}</span>
          </div>
        </div>


        <div class="space-y-[15px]">
          <template v-for="(group, index) in lessonGroups" :key="index">
            <div v-if="group.length === 1">
              <lessonCard :lesson="group[0]" :status="getStatus(group[0])" />
            </div>
            <div v-else class="flex flex-wrap gap-[15px]">
              <lessonCard v-for="lesson in group" :key="lesson.id" :lesson="lesson" :status="getStatus(lesson)"
                class="flex-1" />
            </div>
          </template>
        </div>
      </div>

      <div class="w-full xl1200:w-[310px]">
        <dailyChallenges />
      </div>
    </div>


  </userPanelLayout>

</template>

<script lang="ts" setup>
import userPanelLayout from '~/layouts/user-panel-layout.vue';
import { computed } from 'vue'
import lessonCard from '@/components/user/lessonCard.vue'
import dailyChallenges from '@/components/user/dailyChallenges.vue'
import { useUserPanelStore } from '~/store/user-panel';
import type { lessonObj } from '~/main/modules/user-panel/data-access/user-panel.model';

const data = {
  id: 3,
  title: 'المسائل الحسابية',
  totalLessonsCount: 11,
  doneLessonsCount: 1,
  lessons: [
    {
      id: 1,
      title: 'العمليات الحسابية',
      iconUrl: 'string',
      order: 1,
      examId: null,
      attachmentIds: [],
      videoLink: 'https://www.youtube.com/watch?v=fwk8d_HRmZU',
      type: 1,
      periodTime: 1314,
      isWatched: true,
      isShow: true,
    },
    {
      id: 2,
      title: 'الأعداد وخصائصها',
      iconUrl: '',
      order: 2,
      examId: null,
      attachmentIds: [],
      videoLink: '',
      type: 1,
      periodTime: 857,
      isWatched: false,
      isShow: true,
    },
    {
      id: 6,
      title: 'معلومات للحفظ',
      iconUrl: '',
      order: 3,
      examId: null,
      attachmentIds: [],
      videoLink: '',
      type: 2,
      periodTime: 0,
      isWatched: false,
      isShow: false,
    },
    {
      id: 3,
      title: 'الأعداد العشرية',
      iconUrl: '',
      order: 3,
      examId: null,
      attachmentIds: [],
      videoLink: '',
      type: 1,
      periodTime: 857,
      isWatched: false,
      isShow: false,
    },
    {
      id: 4,
      title: 'معلومات للحفظ',
      iconUrl: '',
      order: 4,
      examId: null,
      attachmentIds: [],
      videoLink: '',
      type: 2,
      periodTime: 0,
      isWatched: false,
      isShow: false,
    },
    {
      id: 5,
      title: 'تدريبات القسم',
      iconUrl: '',
      order: 5,
      examId: null,
      attachmentIds: [],
      videoLink: '',
      type: 3,
      periodTime: 0,
      isWatched: false,
      isShow: false,
    }
  ]
}

//resourses
const route = useRoute();
const router = useRouter()
const id = route.params.id

//store
const userPanelStore = useUserPanelStore()

//data getting
await userPanelStore.getLessonsList(id)

const sortedLessons = computed(() => {
  return userPanelStore.lessonsList?.lessons.sort((a, b) => a.order - b.order)
})

const doneCount = computed(() => userPanelStore.lessonsList?.doneLessonsCount ?? null)
const totalCount = computed(() => userPanelStore.lessonsList?.totalLessonsCount ?? null)

function getStatus(lesson: lessonObj) {
  const index = sortedLessons.value?.findIndex(l => l.id === lesson.id)
  const firstLocked = sortedLessons.value?.findIndex(l => l.isWatched === false)
  if (lesson.isWatched) return 'completed'
  if (index === firstLocked) return 'next'
  return 'locked'
}


const toFoundation = () => {
  router.push(`/user-dashboard/foundation`)
}


const lessonGroups = computed(() => {
  const groups: any[][] = []
  const lessons = sortedLessons.value
  let i = 0
  if (!lessons) return groups
  while (i < lessons.length) {
    const curr = lessons[i]
    const next = lessons[i + 1]
    if (curr?.type === 2 && next?.type === 3) {
      groups.push([curr, next])
      i += 2
    } else {
      groups.push([curr])
      i += 1
    }
  }
  return groups
})

</script>