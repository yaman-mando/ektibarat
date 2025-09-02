<!-- LessonCard.vue -->
<template>
  <div
    class="rounded-[8px] p-[15px_17px] flex items-center justify-between h-[70px] border-[1px]"
    :class="[cardClass, showSpinner ? 'cursor-default' : 'cursor-pointer']"
    @click="!showSpinner ? onCardClick() : {}"
  >
    <div class="flex items-center gap-x-[10px]">
      <span
        v-if="status === 'completed'"
        class="flex items-center justify-center w-9 h-9 rounded-full bg-white text-green-8c text-[22px]"
      >
        ✔
      </span>
      <span
        v-else-if="status === 'next'"
        class="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[22px] text-yellow-30"
      >
        <i class="fa fa-star"></i>
      </span>
      <span
        v-else-if="status === 'open'"
        class="flex items-center justify-center w-9 h-9 rounded-full bg-[#BCCCDB33] text-[22px] text-gray-8f"
      >
        <i class="fa fa-star"></i>
      </span>
      <span
        v-else
        class="flex items-center justify-center w-9 h-9 rounded-full bg-[#BCCCDB33] text-[22px] text-gray-8f"
      >
        <tooltip
          backgroundColor="#06152BE5"
          textColor="#ffffff"
        >
          <template #default>
            <i class="fa fa-lock"></i>
          </template>
          <template #content>
            <span class="text-[16px] font-medium text-white">
              سيفتح هذا الدرس بعد إكمالك
              <br />
              للدروس السابقة له.
            </span>
          </template>
        </tooltip>
      </span>
      <div class="grid">
        <span :class="textClass">{{ titleText }}</span>
        <span
          v-if="lesson.periodTime && lesson.type === 1"
          class="flex items-center gap-[4px] text-[16px] font-medium text-gray-8f"
        >
          المدة:
          {{ lesson.periodTime }}
        </span>
      </div>
    </div>
    <i class="fa fa-chevron-left"></i>
    <!-- subscribe modal -->
    <subscribe-modal
      v-if="showSubscribeModal"
      :show="showSubscribeModal"
      @update:show="
        ($event) => {
          showSubscribeModal = $event;
        }
      "
    />
    <app-spinner v-if="showSpinner" />
    <confirm-dialog
      v-model:visible="showConfirmTraining"
      :title="'تأكيد'"
      :message="'سوف تبدأ بالتدريب هل أنت موافق؟'"
      :confirmText="'نعم'"
      :cancelText="'لا'"
      :onConfirm="
        () => {
          handleExamClick(props.lesson.examId ?? 0);
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import Tooltip from '~/components/user/toolTip.vue';
import type { lessonObj } from '~/main/modules/user-panel/data-access/user-panel.model';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const router = useRouter();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { $axios } = useNuxtApp();

const props = defineProps<{
  lesson: lessonObj;
  status: 'completed' | 'next' | 'open' | 'locked';
}>();

const showSubscribeModal = ref(false);
const showConfirmTraining = ref(false);
const showSpinner = ref(false);
const selectedExamId = ref(null);

const cardClass = computed(() => {
  switch (props.status) {
    case 'completed':
      return 'text-green-8c bg-gradient-to-r from-[#ECFFFA] to-[#ECFFFA]';
    case 'next':
      return 'text-yellow-16 bg-gradient-to-r from-[#FFF8E2] to-[#FFF8E2]';
    case 'locked':
    case 'open':
      return 'bg-white-ff text-gray-8f';
  }
  return '';
});

const textClass = computed(() => {
  return 'text-[20px] font-bold';
});

const titleText = computed(() => {
  switch (props.lesson.type) {
    case 1:
    case 2: {
      return props.lesson.title;
    }
    case 3: {
      return 'معلومات الحفظ';
    }
    default:
      return props.lesson.title;
  }
});

function onCardClick() {
  if (props.status === 'locked') {
    openSubscribeModal();
    return;
  }

  switch (props.lesson.type) {
    case 1:
      toLessonDetails();
      break;

    case 2:
      showConfirmTraining.value = true;
      break;

    case 3:
      downloadAttachments(props.lesson.attachmentIds);
      break;

    default:
      toLessonDetails();
  }
}

const handleExamClick = async (examId: string | number) => {
  try {
    showSpinner.value = true;
    const { data } = await $axios.post('/studentsExam', {
      examId: examId,
      willDo: true,
    });
    if (data.id) {
      await router.push(`/student/training/${data.id}`);
    }
    showSpinner.value = false;
  } catch (e) {
    showSpinner.value = false;
  }
};

function downloadAttachments(files: string[]) {
  if (!files || files.length === 0) return;

  if (files.length === 1) {
    const url = `${runtimeConfig.public.baseImageUrl}/Lessons/File/${files[0]}`;
    triggerDownload(url, files[0]);
  } else {
    downloadMultipleAsZip(files);
  }
}

async function triggerDownload(url: string, filename: string) {
  try {
    showSpinner.value = true;
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);

    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
    showSpinner.value = false;
  } catch (err) {
    showSpinner.value = false;
    console.error('خطأ أثناء تنزيل الملف:', err);
  }
}

async function downloadMultipleAsZip(files: string[]) {
  showSpinner.value = true;
  const zip = new JSZip();
  const folder = zip.folder('attachments');

  for (const file of files) {
    const url = `${runtimeConfig.public.baseImageUrl}/Lessons/File/${file}`;
    const response = await fetch(url);
    const blob = await response.blob();
    folder?.file(file, blob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'attachments.zip');
  showSpinner.value = false;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function toLessonDetails() {
  const currentPath = route.fullPath.split('?')[0];
  const detailsId = props.lesson.id;
  const newPath = `${currentPath}/${detailsId}`;
  router.push(newPath);
}

function openSubscribeModal() {
  showSubscribeModal.value = true;
}
</script>
