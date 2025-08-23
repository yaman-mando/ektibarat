<template>
  <div>
    <div class="flex items-center justify-baseline">
      <span class="font-bold text-[18px] text-blue-d6">خطة التدريب</span>
    </div>

    <div
      v-if="config"
      :class="[
        'mt-[15px] py-[22px] px-[20px]',
        config.hasBorder ? 'border border-purple-e0 rounded-[8px]' : ''
      ]"
    >
      <div class="grid justify-items-center gap-y-[18px]">
        <!-- title -->
        <template v-if="config.icon">
          <div class="flex gap-x-[10px] items-center">
            <i :class="config.icon" class="text-[22px] text-purple-e0"></i>
            <span class="text-purple-e0 text-[30px] font-bold">{{ config.title }}</span>
          </div>
        </template>
        <template v-else>
          <span class="text-black text-[20px] font-bold"
          :class="{'h-[150px] flex items-center justify-center':type==='studentHasNoPlaneForTeacher'}"
          >{{ config.title }}</span>
        </template>

        <!-- sub text -->
        <div v-if="config.subtitle && type !== 'studentHasNoPlane'" class="text-black text-[18px] font-medium text-center">
          <span v-html="config.subtitle"></span>
        </div>
        <div v-if="config.subtitle && type === 'studentHasNoPlane'" class="text-gray-8f text-[14px] font-medium text-center">
          <span v-html="config.subtitle"></span>
        </div>

        <!-- button -->
        <button
          v-if="config.action"
          @click="config.action.handler"
          style="background: linear-gradient(270deg, #24A7F1 0%, #0266D6 100%)"
          class="flex justify-center items-center gap-x-[12px] h-[36px] w-[164px] rounded-[8px] text-white text-[14px] font-bold cursor-pointer"
        >
          <span>{{ config.action.label }}</span>
          <i class="fa fa-chevron-left"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RouteHelper } from '~/main/utils/route-helper';

interface Props {
  type: 'studentHasNoPlane' | 'studentHasNoPlaneForTeacher' | 'studentNotSubscribe' | 'studentNotSubscribeForTeacher';
}
const props = defineProps<Props>();
const router = useRouter();

function toPricesPage() {
  router.push(RouteHelper.webPrices());
}
function toPlanePage() {
  router.push(RouteHelper.webPrices());
}

const configMap = {
  studentNotSubscribe: {
    hasBorder: true,
    icon: 'fas fa-lock',
    title: 'للمشتركين فقط',
    subtitle: 'خطة مخصصة لك<br>لتضمن أعلى درجة في أقل وقت',
    action: { label: 'اشترك الآن', handler: toPricesPage },
  },
  studentNotSubscribeForTeacher: {
    hasBorder: true,
    icon: 'fas fa-lock',
    title: 'للمشتركين فقط',
    subtitle: 'تتاح ميزة الخطة للطلاب<br>المشتركين في باقات اختبارات',
    action: null,
  },
  studentHasNoPlane: {
    hasBorder: false,
    icon: null,
    title: 'لم تقم بإنشاء خطة تدريب',
    subtitle: 'روبوت اختبارات ينشأ لك خطة مخصصة<br>تضمن لك أعلى درجة في أقل وقت',
    action: { label: 'انشاء خطة', handler: toPlanePage },
  },
  studentHasNoPlaneForTeacher: {
    hasBorder: false,
    icon: null,
    title: 'الطالب لم ينشأ خطة تدريب',
    subtitle: null,
    action: null,
  },
} as const;

const config = computed(() => configMap[props.type]);
</script>
