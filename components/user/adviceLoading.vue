<template>
    <div class="fixed inset-0 z-50 bg-black/75">
        <transition name="grow-fade">
            <div v-if="visible" class="flex flex-col items-center justify-center p-4 text-center text-white h-full">
                <h2 class="text-2xl font-bold mb-4">⏳ جاري تجهيز نصائحك الشخصية...</h2>
                <p class="mb-2">
                    نظام <span class="text-yellow-400 font-bold">اختبارات الذكي</span> يعمل على تحليل أدائك وتجهيز نصائح
                    مخصصة لك 👨‍🏫📊
                </p>
                <p class="mb-6">
                    قد يستغرق الأمر <span class="text-yellow-300 font-bold">30 ثانية فقط</span>... بنجهز لك شيء يستاهل!
                    🚀
                </p>

                <div class="w-full max-w-md mb-6">
                    <div class="w-full bg-gray-700 rounded-full overflow-hidden h-6">
                        <div class="bg-yellow-400 h-full text-sm font-bold text-center leading-[1.5rem] transition-all duration-200"
                            :style="{ width: `${progress * 100 / 30}%` }">
                            {{ Math.ceil(progress) }} ثانية
                        </div>
                    </div>
                </div>

                <h3 class="text-xl font-semibold mt-4 mb-2">🎯 لماذا نأخذ هذا الوقت؟</h3>
                <p class="mb-2">لأننا نستخدم تقنيات تحليل متقدمة لتقديم نصائح تناسب <span
                        class="text-yellow-400 font-bold">مستواك تمامًا</span> 💡</p>
                <p class="text-green-400 font-bold">🟢 لا تغلق الصفحة، النصائح قادمة خلال لحظات!</p>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'close'): void
}>();

const visible = ref(false);

const closeModal = () => {
    visible.value = false;
    setTimeout(() => {
        emit('close');
    }, 300);
};

onMounted(() => {
    visible.value = true;
});

const progress = ref(0)
const intervalId = ref<any>(null)

const startProgressBar = () => {
    const duration = 30;
    const step = 0.1;

    progress.value = 0;

    intervalId.value = setInterval(() => {
        progress.value += step;
        if (progress.value >= duration) {
            clearInterval(intervalId.value);
            progress.value = duration;
        }
    }, step * 1000);
}


onMounted(() => {
    startProgressBar()
})

onBeforeUnmount(() => {
    clearInterval(intervalId.value);
})
</script>
