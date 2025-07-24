<template>
    <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" @click.self="closeModal">
        <transition name="grow-fade">
            <div v-if="visible" class="bg-white dark:bg-dark-800 rounded-lg shadow-lg w-full max-w-2xl p-6 relative"
                style="box-shadow: 0px 0px 10px 0px #00000026">
                <div class="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white">نصائح اختبارات</h2>
                    <button @click="closeModal" class="text-gray-500 hover:text-red-500 cursor-pointer">
                        <i class="fa fa-close text-xl"></i>
                    </button>
                </div>

                <div v-if="content" v-html="content" class="text-gray-700 dark:text-gray-200"></div>
                <div v-else class="text-center text-gray-500 dark:text-gray-400">لايوجد نصائح لعرضها</div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

defineProps({
    content: String
});
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
</script>

<style scoped>
/* Transition */
.grow-fade-enter-active,
.grow-fade-leave-active {
    transition: all 0.3s ease;
}

.grow-fade-enter-from,
.grow-fade-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

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
