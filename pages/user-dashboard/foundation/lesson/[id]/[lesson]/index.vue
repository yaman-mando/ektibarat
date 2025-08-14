<template>
  <user-panel-wrapper contentClass="max-w-[1050px] mx-auto" :has-l-info="windowSize.isDesktop" :has-r-info="windowSize.isDesktop" :withBackPage="true"
    :no-spaces="!windowSize.isDesktop" :has-prev="!windowSize.isDesktop"
    :page-name="userPanelStore.lessonDetails?.title">
    <div class="flex flex-col justify-center gap-y-[20px] xl1200:flex-row gap-x-[30px]">
      <!-- Main Content -->
      <main class="flex-2/3">
        <!-- Video Section -->

        <div v-if="windowSize.isDesktop"
          class="flex items-center cursor-pointer gap-x-[8px] text-[16px] font-medium text-dark-2b dark:text-white xl1200:mt-[-50px] w-fit"
          @click="goBack()">
          <i class="fa fa-chevron-right"></i>
          <span>رجوع للخلف</span>
        </div>

        <div class="xl:my-[30px_15px] my-[0] mx-auto"
          style="max-width: 700px;max-height: 395px;width: 100%;height: auto;">
          <app-video-player v-if="videoPath" :height="windowSize.isDesktop ? 395 : 203" ref="video_ref"
            :path="videoPath" />
        </div>

        <!-- Contents -->
        <section class="px-[15px] xl:px-0 xl1200:mt-0 sm:mt-[10px]">
          <div class="flex items-center flex-wrap gap-y-[15px] justify-between">
            <div>
              <h1 class="sm:text-[26px] text-[22px] font-bold text-purple-8c dark:text-white mb-[5px]">
                {{ userPanelStore.lessonDetails?.lessonCategoryTitle }}
              </h1>
              <span class="sm:text-[20px] text-[18px] font-medium text-gray-63 dark:text-white">
                {{ userPanelStore.lessonDetails?.title }}
                | {{ userPanelStore.lessonDetails?.shortDescription }}
              </span>
            </div>
            <div v-if="windowSize.isDesktop" class="space-y-[8px]">
              <h1 class="text-[20px] font-bold text-gray-63 dark:text-white">
                هل استفدت من الدرس؟
              </h1>
              <div class="flex gap-x-[12px] items-center">
                <button :disabled="loading" :class="buttonClasses" @click="sendFeedback(true)">
                  نعم، استفدت
                </button>
                <button :class="buttonClasses" :disabled="loading" @click="sendFeedback(false)">
                  لا، لم أستفد
                </button>
              </div>
              <p v-if="successMessage" class="text-green-600 !text-center">
                {{ successMessage }}
              </p>
            </div>
          </div>

          <template v-if="userPanelStore.lessonDetails?.videoContents">
            <div v-if="windowSize.isDesktop" class="mt-[13px] space-y-[11px]">
              <h3 class="text-[20px] font-bold text-gray-63 dark:text-white">
                محتويات المقطع
              </h3>
              <ul class="space-y-[8px]">
                <li v-for="content in userPanelStore.lessonDetails.videoContents" :key="content.id"
                  class="flex items-center gap-x-[8px]">
                  <span class="text-blue-d6 text-[20px] cursor-pointer" @click="onTimeClick(content.from)">
                    {{ content.from }}
                  </span>
                  <span class="text-gray-2b text-[20px]">
                    {{ content.title }}
                  </span>
                </li>
              </ul>
            </div>
            <div class="mt-[20px]" v-else>
              <disclosureGroup v-model:open="isDisclosureOpen" contentClass="!px-2" :hideArrow="true">
                <!-- head -->
                <template #right>
                  <div class="flex items-center gap-[10px] cursor-pointer">
                    <i :class="[
                      'fa',
                      isDisclosureOpen ? 'fa-minus' : 'fa-plus',
                      'text-blue-f1',
                      'text-[24px]'
                    ]"></i>
                    <span class="text-black font-bold text-[18px]">محتويات المقطع</span>
                  </div>
                </template>

                <ul class="space-y-[8px]">
                  <li v-for="content in userPanelStore.lessonDetails.videoContents" :key="content.id"
                    class="flex items-center gap-x-[8px]">
                    <span class="text-blue-d6 text-[16px] cursor-pointer" @click="onTimeClick(content.from)">
                      {{ formatTimestamp(content.from) }}
                    </span>
                    <span class="text-gray-2b text-[16px]">
                      {{ content.title }}
                    </span>
                  </li>
                </ul>
              </disclosureGroup>
            </div>
          </template>

          <!-- mobile like dislike -->
          <div v-if="!windowSize.isDesktop" class="space-y-[8px] mt-[20px]">
            <div class="flex items-center justify-between">
              <h1 class="text-[20px] font-bold text-gray-63 dark:text-white">
                هل استفدت من الدرس؟
              </h1>
              <div class="flex gap-x-[10px] items-center">
                <button
                  class="cursor-pointer border border-dark-36 rounded-[4px] w-[38px] h-[38px] flex items-center justify-center"
                  :class="{ '!border-green-8c': selected === true }"
                  :disabled="loading || selected !== null" @click="sendFeedback(true)">
                  <i class="fa fa-thumbs-up text-green-8c text-[16px]"
                    :class="{ 'pulse-animation': selected === true }"></i>
                </button>

                <button
                  class="cursor-pointer border border-dark-36 rounded-[4px] w-[38px] h-[38px] flex items-center justify-center"
                  :class="{ '!border-red-5e': selected === false }"
                  :disabled="loading || selected !== null" @click="sendFeedback(false)">
                  <i class="fa fa-thumbs-down text-red-5e text-[16px]"
                    :class="{ 'pulse-animation': selected === false }"></i>
                </button>
              </div>

            </div>
            <p v-if="successMessage" class="text-green-600 !text-center">
              {{ successMessage }}
            </p>
          </div>

        </section>
      </main>

      <!-- Sidebar -->
      <aside class="flex-1/3 w-full xl1200:w-1/3 space-y-4 px-[15px] xl:px-0">
        <lessons-list-side-bar v-if="userPanelStore.simillarVideos" :sectionTitle="userPanelStore.lessonDetails?.lessonCategoryTitle ?? 'لا يوجد'
          " :lessons="userPanelStore.simillarVideos" />
      </aside>
    </div>
  </user-panel-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserPanelStore } from '~/store/user-panel';
import LessonsListSideBar from '~/components/user/lessonsListSideBar.vue';
import type { AppVideoPlayer } from '#components';

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const userPanelStore = useUserPanelStore();
const { $axios } = useNuxtApp();
const windowSize = useWindowSize();
const videoRef =
  useTemplateRef<InstanceType<typeof AppVideoPlayer>>('video_ref');
const id = route.params.lesson;

await userPanelStore.getLessonDetails(id);
await userPanelStore.getVideoSimillar(id);

const loading = ref(false);
const selected = ref<null | boolean>(null);
const successMessage = ref('');
const isDisclosureOpen = ref(false);
const sendFeedback = async (benefited: boolean) => {
  loading.value = true;
  successMessage.value = '';
  selected.value = benefited;

  try {
    const res = await $axios.put(`/lessonsUsers/${id}/setBenefited`, {
      benefited,
    });
    if (res.data.benefited === benefited) {
      successMessage.value = 'تم إرسال رأيك بنجاح ✅';
    } else {
      successMessage.value = 'لم يتم التأكد من إرسال رأيك ❗';
    }
  } catch (err) {
    successMessage.value = 'حدث خطأ أثناء الإرسال ❌';
    selected.value = null;
  } finally {
    loading.value = false;
  }
};

function onTimeClick(seconds) {
  videoRef.value?.moveTo(seconds);
}

function goBack() {
  const segments = route.fullPath.split('?')[0].split('/');
  segments.pop();
  const newPath = segments.join('/') || '/';
  router.push(newPath);
}

const currentLesson = ref({
  id: 1,
  groupLawId: 1109,
  lessonsCategoriesId: 3,
  lessonCategoryTitle: 'المسائل الحسابية',
  title: 'العمليات الحسابية',
  shortDescription: 'العمليات الحسابية',
  description: 'العمليات الحسابية',
  iconUrl: 'string',
  order: 1,
  examId: null,
  attachmentIds: [],
  videoLink: 'https://www.youtube.com/watch?v=fwk8d_HRmZU',
  type: 1,
  periodTime: 1314,
  videoContents: [
    {
      id: 1,
      title: 'الجمع و الطرح',
      from: 0,
      to: 50,
    },
    {
      id: 2,
      title: 'الضرب و القسمة',
      from: 50,
      to: 250,
    },
  ],
});

const lessons = ref([
  {
    id: 1,
    periodTime: 1314,
    title: 'العمليات الحسابية',
    order: 1,
    videoLink: 'https://www.youtube.com/watch?v=fwk8d_HRmZU',
    isWatched: true,
  },
  {
    id: 2,
    periodTime: 1500,
    title: 'الأعداد',
    order: 2,
    videoLink: 'https://www.youtube.com/watch?v=6xT5n7iKhX4',
    isWatched: false,
  },
]);

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const videoPath = computed(() => {
  const lesson = userPanelStore.lessonDetails;
  if (!lesson) return null;

  return `${config.public.baseImageUrl}/LessonsVideos/${lesson.videoLink}`;
});

const buttonClasses = computed(() => {
  const base =
    'border-gray-8f border-[1px] w-[140px] h-[32px] cursor-pointer rounded-[4px] text-[18px] font-medium text-gray-63';
  if (loading.value) return `${base} opacity-50 pointer-events-none`;
  if (selected.value === true)
    return `${base} bg-green-600 text-white opacity-50 pointer-events-none`;
  if (selected.value === false)
    return `${base} bg-red-500 text-white opacity-50 pointer-events-none`;
  return `${base} bg-white`;
});

definePageMeta({
  layout: 'empty-layout',
});
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.pulse-animation {
  animation: pulse 1s ease-in-out infinite;
}
</style>
