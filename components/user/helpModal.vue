<template>

    <div v-show="show" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <transition name="grow-fade">

            <div
v-if="show" class="
    bg-white flex flex-col-reverse md:flex-row
    justify-center md:justify-between
    items-center
    w-full max-w-[95vw] md:w-[830px] 
    min-h-[300px] md:min-h-[367px]
    rounded-[15px]
    p-5 md:p-[35px] md:px-10
    text-center relative shadow-xl
  ">
                <div class="pr-0 md:pr-[35px]">
                    <div class="flex justify-center">
                        <i class="fa fa-warning text-red-5e text-[70px] md:text-[105px]"></i>
                    </div>

                    <h2 class="font-bold text-red-5e text-[20px] md:text-[26px] mt-1 md:mt-[5px] !text-center">
                        أنت كثير الأخطاء
                    </h2>

                    <p
class="
        text-dark-2b
        mt-1 md:mt-[5px]
        h-auto md:h-[85px]
        font-medium
        text-[16px] md:text-[18px]
        leading-relaxed
        !text-center
      ">
                        يبدو أنك لم تتأسس جيداً في هذا القسم<br />
                        أو أنك تجيب على الأسئلة عشوائيًا أو دون تركيز<br />
                        <strong>ننصحك بالعودة إلى قسم التأسيس في اختبارات</strong>
                    </p>

                    <div class="flex mt-3 md:mt-[15px] gap-3 md:gap-4 justify-center">
                        <button
class="
          text-gray-8f border border-gray-8f
          text-[14px] md:text-[16px]
          font-bold bg-transparent
          w-[150px] md:w-[200px]
          h-[40px] md:h-[44px]
          rounded-[6px] cursor-pointer
        " @click="continueTraining">
                            إكمال التدريب
                        </button>

                        <button
class="
          text-white border border-gray-8f
          text-[14px] md:text-[16px]
          font-bold bg-blue-d6
          w-[150px] md:w-[200px]
          h-[40px] md:h-[44px]
          rounded-[6px] cursor-pointer
        " @click="goToFoundation">
                            إعادة التأسيس
                        </button>
                    </div>
                </div>

                <img src="/images/robot-sad.png" alt="robot sad" class="w-[120px] md:w-[200px]" />
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
    show: boolean
}>()

const emit = defineEmits<{
    (e: 'continue'): void
}>()

const router = useRouter()

function goToFoundation() {
    router.push('/user-dashboard/foundation')
}

function continueTraining() {
    emit('continue')
}
</script>

<style lang="scss" scoped>
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
