<template>
  <div class="min-h-screen bg-gray-fb py-[20px]" style="direction: rtl;">
    <div class="flex justify-center mb-[35px]">
      <img src="/images/EkhtibaratLogoColor.png" alt="" />
    </div>
    <div class="w-[1060px] max-w-[calc(100vw-30px)] m-auto bg-white rounded-[8px] pb-[50px] min-h-[530px] grid"
      style="box-shadow: 0px 0px 10px 0px #00000026">
      <!-- Progress Bar & Back Arrow -->
      <div class="flex items-center gap-[6px] h-[44px] p-[0_15px] border-b-[1px] border-b-[#BCCCDB]">
        <button :disabled="step < 2" @click="step--" class="cursor-pointer disabled:opacity-30 disabled:cursor-default">
          <i class="fa fa-arrow-right text-gray-8f"></i>
        </button>
        <div class="w-full h-[12px] rounded" style="box-shadow: 2px 2px 4px 0px #00000026 inset;background: #F0F0F0">
          <div class="h-[12px] rounded transition-all duration-500"
            style="background: linear-gradient(90deg, #58CC02 0%, #4E9818 100%)"
            :style="{ width: `${(step / 5) * 100}%` }"></div>
        </div>
      </div>

      <div class="my-auto">
        <!-- Step 1 -->
        <div v-if="step === 1">
          <h2 class="text-[30px] sm:text-[40px] font-bold !text-center text-blue-d6">خلنا نتعرّف عليك</h2>
          <div class="flex gap-x-[10px] justify-center mt-[50px]">
            <input
              :class="['border-gray-[#8F8F8F]', 'border-[.5px]', 'rounded-[8px]', 'outline-0', 'pr-[15px]', 'h-[40px]', 'w-[145px]', { 'border-red-500': errors.firstName }]"
              v-model="form.firstName" placeholder="الاسم الاول" />
            <input
              :class="['border-gray-[#8F8F8F]', 'border-[.5px]', 'rounded-[8px]', 'outline-0', 'pr-[15px]', 'h-[40px]', 'w-[145px]', { 'border-red-500': errors.lastName }]"
              v-model="form.lastName" placeholder="الاسم الاخير" />
          </div>

          <div class="mt-[30px]">
            <p class="!text-center font-medium text-blue-d6">اختر شخصيّتك</p>
            <div class="flex justify-center items-center gap-[20px] mt-[20px]">
              <img :class="[avatarClass(0), errors.sex ? 'border-red-500 border-[3px]' : '']"
                src="/images/png/person.png" alt="male" @click="form.sex = 0" />
              <img :class="[avatarClass(1), errors.sex ? 'border-red-500 border-[3px]' : '']"
                src="/images/png/female.png" alt="female" @click="form.sex = 1" />
            </div>
          </div>
        </div>
        <!-- Step 2 -->
        <div v-if="step === 2" class="space-y-[30px] w-[300px] grid justify-self-center">
          <client-only>
            <div class="space-y-[10px]">
              <label class="block">مدينتك في السعودية</label>
              <v-select v-model="form.cityId" :options="cities" :reduce="city => city.id" label="label"
                :clearable="false" placeholder="اختر مدينة" @update:modelValue="fetchSchools(true)" :class="[
                  'w-full',
                  'text-right',
                  'rtl',
                  errors.cityId ? 'border border-red-500 rounded' : ''
                ]" dir="rtl" />
            </div>
            <div class="space-y-[10px]">
              <label class="block">مدرستك</label>
              <v-select v-model="form.schoolId" :options="schools" :reduce="school => school.id" label="label"
                :clearable="false" placeholder="اختر مدرسة" :disabled="!form.cityId" style="direction: rtl" :class="[
                  'w-full',
                  'text-right',
                  'rtl',
                  errors.schoolId ? 'border border-red-500 rounded' : ''
                ]" dir="rtl" />
            </div>
          </client-only>
        </div>

        <!-- Step 3 -->
        <div v-if="step === 3" class="space-y-[40px] grid justify-center">
          <h2 class="text-blue-d6 text-[30px] sm:text-[40px] font-bold !text-center">في أي صف تدرس؟</h2>
          <div class="space-y-[20px] grid justify-center">
            <button v-for="grade in grades" :key="grade.id"
              :class="[{ 'border-1 border-blue-d6': form.grades === grade.id, 'border border-red-500': errors.grades && form.grades !== grade.id }, 'w-[300px] h-[50px] bg-gray-fa rounded-[10px] text-dark-2b text-[20px] font-medium cursor-pointer']"
              @click="selectGrade(grade.id)">
              {{ grade.label }}
            </button>
          </div>
        </div>

        <!-- Step 4 -->
        <div v-if="step === 4" class="grid grid-rows-2 gap-y-[30px] justify-center">
          <div class="space-y-[10px] grid">
            <label class="text-dark-2b text-[20px] font-medium">أي محاولة قدرات هذي لك؟</label>
            <div class="flex gap-[12px]">
              <div v-for="n in 5" :key="n" @click="form.qodoratAttempt = n; form.lastQodoratMark = null"
                class="w-[50px] h-[50px] flex items-center justify-center rounded-full cursor-pointer"
                :class="[form.qodoratAttempt === n ? 'bg-[#F8F3FF] border-1 border-[#7840E0]' : 'bg-[#F5F7FA]', errors.qodoratAttempt ? 'border-red-500' : '']">
                {{ n }}
              </div>
            </div>
          </div>

          <div v-show="form.qodoratAttempt && form.qodoratAttempt > 1" class="space-y-[10px] grid justify-center">
            <label class="text-dark-2b text-[20px] font-medium">كم آخر درجة قدرات جبتها؟</label>
            <div class="relative w-[300px]">
              <input type="number" v-model.number="form.lastQodoratMark" min="1" max="100" @input="enforceRange"
                :class="['input', 'outline-0', 'border', 'rounded-[6px]', 'w-full', 'h-[40px]', 'pr-[10px]', 'appearance-none', '[&::-webkit-inner-spin-button]:appearance-none', '[&::-webkit-outer-spin-button]:appearance-none', errors.lastQodoratMark ? 'border-red-500' : 'border-[#8F8F8F]']"
                placeholder="أدخل درجتك" />
              <span class="absolute left-2 top-1/2 -translate-y-1/2">%</span>
            </div>
          </div>
        </div>

        <!-- Step 5 -->
        <div v-if="step === 5" class="space-y-4 text-center">
          <div class="w-[300px] flex justify-self-center relative mt-[100px]">
            <div class="w-[220px] h-[90px] flex justify-center absolute right-0 sm:right-[-70px] top-[-60px]
          items-center text-[18px] font-medium text-dark-63" style="box-shadow: 0px 0px 10px 0px #00000026">
              أنت الحين جاهز
              <br>
              تبدأ تدريب معنا
            </div>
            <img src="/images/robot-info.png" alt="robot" class="sm:mx-auto mr-auto ml-0 w-[160px] scale-x-[-1]" />
          </div>
        </div>
      </div>

      <button v-if="step !== 3" @click="step === 5 ? startTraining() : toStep()"
        class="w-[200px] h-[50px] bg-blue-d6 text-white text-[18px] font-bold rounded-[8px] cursor-pointer flex items-center justify-center justify-self-center mt-auto">
        {{ step === 5 ? 'ابدأ التدريب' : 'التالي' }}
        <i class="fa fa-chevron-left mr-[8px]"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import type { citiesListDataModel, schoolsListDataModel } from "~/main/modules/global/data-access/global.enum"
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { RouteHelper } from '~/main/utils/route-helper';
import { sleepUtil } from '~/main/utils/shared-utils';
import { webUserPanelTraining } from '~/main/utils/web-routes.utils';
import { useGlobalUserStore } from '~/store/global';


const router = useRouter();
const auth = useAuth();
const setupAuth = useSetupAuth();
const authStore = useAuthStore();
const toastMessage = useToastMessage()
const globalStore = useGlobalUserStore();


const step = ref(1);
const form = ref({
  firstName: '',
  lastName: '',
  sex: <any>null,
  cityId: <any>null,
  schoolId: <any>null,
  grades: <any>null,
  qodoratAttempt: <any>null,
  lastQodoratMark: <any>null,
});

const errors = ref({
  firstName: false,
  lastName: false,
  sex: false,
  cityId: false,
  schoolId: false,
  grades: false,
  qodoratAttempt: false,
  lastQodoratMark: false,
});

const isStepValid = (currentStep: number): boolean => {
  let valid = true;
  Object.keys(errors.value).forEach(key => errors.value[key] = false);

  switch (currentStep) {
    case 1:
      if (!form.value.firstName) { errors.value.firstName = true; valid = false; }
      if (!form.value.lastName) { errors.value.lastName = true; valid = false; }
      if (form.value.sex === null) { errors.value.sex = true; valid = false; }
      break;
    case 2:
      if (!form.value.cityId) { errors.value.cityId = true; valid = false; }
      if (!form.value.schoolId) { errors.value.schoolId = true; valid = false; }
      break;
    case 3:
      if (!form.value.grades) { errors.value.grades = true; valid = false; }
      break;
    case 4:
      if (!form.value.qodoratAttempt) { errors.value.qodoratAttempt = true; valid = false; }
      if (form.value.qodoratAttempt > 1 && !form.value.lastQodoratMark) {
        errors.value.lastQodoratMark = true;
        valid = false;
      }
      break;
  }
  return valid;
};

const toStep = async () => {
  try {
    if (!isStepValid(step.value)) return;
    if (step.value !== 4) {
      step.value++;
      return;
    }
    sendForm();
  } catch (e) {
    console.log('toStepError: ' + e)
  }
};


const cities = ref<citiesListDataModel | null>([]);
const schools = ref<schoolsListDataModel | null>([]);
const grades = [{ id: 10, label: 'الأول الثانوي' }, { id: 11, label: 'الثاني الثانوي' }, { id: 12, label: 'الثالث الثانوي' }]
//computed
const user = computed(() => authStore.state.userData as unknown as UserInfoDataModel);

const fetchCities = async () => {
  const res = await globalStore.getCitiesList();
  cities.value = res
};

const fetchSchools = async (resetId: boolean = false) => {
  if (resetId) {
    form.value.schoolId = ''
  }
  const res = await globalStore.getShoolsList({ id: form.value.cityId })
  schools.value = res
};

const sendForm = async () => {
  try {
    const { $axios } = useNuxtApp()
    const { data: res } = await $axios.put(`/profile`,
      form.value
    );
    if (res) {
      setupAuth.appAuth.fetchUser()
      step.value = 5
      toastMessage.showSuccess({ summary: 'تم تحديث البيانات بنجاح' })
    } else {
      toastMessage.showError()
    }
  } catch (e) {
    console.error(e);
    toastMessage.showError()
  }
}


const normalizeArabic = (str: string): string => {
  return str
    .replace(/[أإآا]/g, 'ا')
    .replace(/[ىي]/g, 'ي')
    .replace(/[هة]/g, 'ه')
    .replace(/[ؤو]/g, 'و')
    .toLowerCase()
    .trim();
};


const selectGrade = async (gradeId) => {
  form.value.grades = gradeId
  await sleepUtil(400)
  step.value++
}

const fillForm = () => {
  Object.keys(form.value).forEach((key) => {
    if (user.value[key] !== undefined) {
      form.value[key] = user.value[key]
    }
  })
}

const fetchData = () => {
  fillForm()
  fetchCities()
  if (form.value.schoolId) {
    fetchSchools()
  }
}

const avatarClass = (type) =>
  `w-25 h-25 cursor-pointer rounded-full ${form.value.sex === type ? 'border-blue-d6 border-[3px]' : 'border-gray-8f border-[1px]'}`;

const startTraining = () => {
  router.push(webUserPanelTraining())
};

function enforceRange(e) {
  const val = Number(e.target.value)
  if (val < 1) e.target.value = 0
  if (val > 100) e.target.value = 100
  form.value.lastQodoratMark = Number(e.target.value).toFixed()
}

onMounted(() => {
  fetchData()
});
</script>

<style scoped>
/* .input {
  @apply border border-gray-300 rounded-md px-3 py-2 text-sm;
} */
</style>
