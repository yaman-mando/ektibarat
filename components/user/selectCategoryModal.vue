<template>
  <!-- Modal overlay -->
  <div v-show="show" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <transition name="grow-fade">
      <!-- Modal box -->
      <div
        v-if="show"
        class="bg-white shadow-xl rounded-[15px]
               w-full max-w-[95vw] md:w-[830px]
               min-h-[429px]
               flex flex-col gap-5
               p-5 md:p-[20px] text-center relative"
      >
        <!-- Modal header with close button -->
        <div class="w-full flex justify-between items-center">
          <span class="text-[18px] md:text-[20px] font-medium text-purple-8c">
            اختيار القسم التالي
          </span>
          <i
            class="fa fa-times text-[22px] md:text-[24px] text-purple-8c cursor-pointer"
            @click="$emit('update:show', false)"
          ></i>
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
        <div class="flex md:flex-wrap gap-[10px] justify-center items-center">
          <template v-if="categoriesList" v-for="(card, index) in categoriesList" :key="`card_${index}`">
            <div v-if="card.children.length > 0" class="card w-full md:max-w-[390px]">
              <!-- Category title -->
              <div class="ca-head">
                <label>{{ card.name }}</label>
              </div>

              <!-- Items under category -->
              <div class="ca-contents relative">
                <div
                  v-for="item in card.children"
                  :key="item.id"
                  class="item"
                  :class="{ active: selectedCat === item.id, disabled: item.disabled }"
                  @click="!item.disabled && (selectedCat = item.id)"
                >
                  <text-slice :length="20" :text="item.label" />
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Save button -->
        <button
          @click="selectedCat !== null && saveSelection(selectedCat)"
          class="mt-4 w-[150px] md:w-[200px]
                 h-[40px] md:h-[44px]
                 text-[14px] md:text-[16px]
                 font-bold text-white
                 bg-purple-8c rounded-[6px] 
                mx-auto
                 flex items-center justify-center
                 cursor-pointer"
        >
          حفظ
        </button>
      </div>
    </transition>
  </div>
</template>





<script setup lang="ts">
import type { categoriesListForModal } from '~/main/modules/user-panel/data-access/user-panel.model';
import { useUserPanelStore } from '~/store/user-panel';


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

await userPanelStore.getCategoriesListForUser()

const categoriesList: categoriesListForModal | null = userPanelStore.categoriesListForModal


//data
const selectedCat = ref<number | null>(null)

//method

function continueTraining() {
    emit('continue')
}

const saveSelection = async (catId: Number) => {
    try {
        await userPanelStore.getCategoryInfo(catId, props.stepId)
        continueTraining()

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
