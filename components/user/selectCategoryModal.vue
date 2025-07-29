<template>
  <!-- Modal overlay -->
  <div v-show="show" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <transition name="grow-fade">
      <!-- Modal box -->
      <div v-if="show" class="bg-white shadow-xl rounded-[15px]
               w-full max-w-[95vw] md:w-[830px]
               min-h-[429px]
               flex flex-col gap-5
               p-5 md:p-[20px] text-center relative">
        <!-- Modal header with close button -->
        <div class="w-full flex justify-between items-center">
          <span class="text-[18px] md:text-[20px] font-medium text-purple-8c">
            اختيار القسم التالي
          </span>
          <i class="fa fa-times text-[22px] md:text-[24px] text-purple-8c cursor-pointer"
            @click="$emit('update:show', false)"></i>
        </div>

        <!-- Instructional text -->
        <div class="w-full flex flex-col items-center gap-2">
          <span class="text-blue-d6 text-[18px] md:text-[20px] font-bold">
            قم بتحديد القسم الذي تريد أن تتدرب عليه
          </span>
          <span class="text-dark-2b text-[14px] md:text-[16px] font-medium leading-snug text-center">
            بعد اختيارك، لن تتمكن من تغيير القسم إلى أن تُنهيه بالكامل
          </span>
        </div>

        <!-- Categories list -->
        <div class="flex flex-col md:flex-row md:flex-wrap gap-[10px] justify-center items-center">
          <template v-if="categoriesList" v-for="(card, index) in categoriesList" :key="`card_${index}`">
            <div v-if="card.children.length > 0" class="card w-full md:max-w-[390px]">
              <!-- Category title -->
              <div class="ca-head">
                <label>{{ card.name }}</label>
              </div>

              <!-- Items under category -->
              <div class="ca-contents relative">
                <div v-for="item in card.children" :key="item.id" class="item"
                  :class="{ active: selectedCat === item.id, disabled: item.disabled }"
                  @click="!item.disabled && (selectedCat = item.id)">
                  <text-slice :length="20" :text="item.label" />
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Save button -->
        <app-overlay v-if="examLoading" />
        <button @click="selectedCat !== null && saveSelection(selectedCat)" class="mt-4 w-[150px] md:w-[200px]
                 h-[40px] md:h-[44px]
                 text-[14px] md:text-[16px]
                 font-bold text-white
                 bg-purple-8c rounded-[6px] 
                mx-auto
                 flex items-center justify-center
                 cursor-pointer">
          حفظ
        </button>
      </div>
    </transition>
  </div>
</template>





<script setup lang="ts">
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { GlobalTypes, globalTypesList } from '~/main/constants/global-types';
import type { categoriesListForModal } from '~/main/modules/user-panel/data-access/user-panel.model';
import { useGlobalStore } from '~/main/useGlobalStore';
import { getUuid, sleepUtil } from '~/main/utils/shared-utils';
import { useUserPanelStore } from '~/store/user-panel';
import { useStore } from 'vuex';


const props = defineProps({
  stepId: {
    type: Number,
    required: true
  },
  show: {
    type: Boolean,
    default: false,
    required: true
  }
})

//emits
const emit = defineEmits<{
  (e: 'continue'): void
  (e: 'update:show', value: boolean): void
}>()

//store
const userPanelStore = useUserPanelStore()
const globalStore = useGlobalStore()
const runtimeConfig = useRuntimeConfig();
const store = useStore();
const auth = useAuth();
const authStore = useAuthStore();
const { $axios } = useNuxtApp();
const router = useRouter();
const toastMessage = useToastMessage()

//getting
await userPanelStore.getCategoriesListForUser()



//enums
class examForm {
  subjectId: number | string;

  constructor(subjectId: number | string) {
    this.subjectId = subjectId;
  }
  willDo = false;
  withoutStudentEvaluate = false;
  randomLevel = false;
  isOpen = false;
  tagsIds = [] as any[];
  takfeelTagsIds = [] as any[];
  onlyWrongQuestions = false;
  onlyFlaggedQuestions = false;
  randomQuestionsSettings = [] as any[];
  questionsLevelsMin = 0;
  questionsCount: null | number = 10;
  questionsLevelsMax = 10;
  customerId: any | null = null;
  sessionId: any | null = null;
  stepId: null | number = null;

}

//data
const categoriesList: categoriesListForModal | null = userPanelStore.categoriesListForModal
const selectedCat = ref<number | null>(null)
const examLoading = ref<boolean>(false)
const form = ref(new examForm(runtimeConfig.public.defaultSubjectId));


//computed
const user = computed(
  () => { return authStore.state.userData as unknown as UserInfoDataModel }
)

const globalUser = computed(() => {
  return globalStore.state.globalTypeUserValue
})

const isTahsele = computed(() => {
  return globalUser.value === GlobalTypes.tahsele;
})

//method
const handleClarityData = async () => {
  try {
    //eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      if (!window['clarity']) {
        resolve(null);
        return null;
      }
      const custom_session_id = getUuid();

      const result = await window['clarity'](
        'identify',
        user.value.email,
        user.value.id + '_' + custom_session_id
      );
      form.value.customerId = result?.userId;
      form.value.sessionId = result?.sessionId;
      resolve(result);
    });
  } catch (e) {
    console.log(e);
    return null;
  }
}

const toTrainig = async () => {
  try {
    examLoading.value = true;
    if (runtimeConfig.public.currentEnv === 'dev') {
      await handleClarityData();
    }
    const url = 'studentsExam/customFromTags';
    form.value.subjectId = isTahsele.value
      ? runtimeConfig.public.defaultSubjectIdTahsele
      : runtimeConfig.public.defaultSubjectId;
    const { data: res } = await $axios.post(url, form.value)
    if (res) {
      store.commit('student/SET_CURRENT_EXAM_TRAIN_PAGE_DATA', res);
      router.push(`/student/training/${res.id}`)
    }
    await sleepUtil(1500);
    examLoading.value = false;
  } catch (e) {
    toastMessage.showError({
      life: 2500,
      summary: 'عذراً حدث خطأ في إنشاء امتحانكم ... يرجى إعادة المحاولة',
    });
    await sleepUtil(1000);
    examLoading.value = false;
    console.log(e);
  }
}

const saveSelection = async (catId: Number) => {
  try {
    const catInfo = await userPanelStore.getCategoryInfo(catId, props.stepId)
    form.value.randomQuestionsSettings.push({
      categoryId: catInfo?.categoryId,
      questionLevel: 0,
      questionsCount: catInfo?.questionsCount,
    })
    form.value.stepId = catInfo?.stepId ?? null
    toTrainig()
  } catch (e) {
    console.log('حدث خطأ')
  }
}

</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 100%;
  border-radius: 15px;
  box-shadow: 0px 0px 15px #00000033;
  border: none;

  @media (min-width: 768px) {
    max-width: 390px;
  }

  .ca-head {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background-color: #ECEFF2;

    label {
      font-size: 20px;
      font-weight: bold;
      color: var(--orange-39);
      text-align: center;
    }
  }

  :deep(.ca-contents) {
    padding: 10px 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: center;

    @media (min-width: 640px) {
      grid-template-columns: repeat(3, 90px);
    }

    column-gap: 15px;
    row-gap: 10px;

    .item {
      width: 100%;
      height: 50px;
      border-radius: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      box-shadow: 0px 0px 6px #0000003d;
      background: white;
      cursor: pointer;

      @media (min-width: 640px) {
        width: 90px;
        height: 60px;
      }

      span {
        text-align: center;
        color: var(--gray-63);
        line-height: 22px;
        font-size: 14px;
        font-weight: 500;
      }

      &.active {
        background: var(--purple-8c);
        box-shadow: none;

        span {
          color: #fff;
        }
      }

      &.disabled {
        box-shadow: none;
        background: #F0F0F0;
        pointer-events: none;

        span {
          color: #8F8F8F;
        }
      }
    }
  }
}

/* Animations for modal transitions */
.grow-fade-enter-active {
  animation: grow-fade-in 0.4s ease forwards;
}

.grow-fade-leave-active {
  animation: grow-fade-out 0.4s ease forwards;
}

@keyframes grow-fade-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes grow-fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
