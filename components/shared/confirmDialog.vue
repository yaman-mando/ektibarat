<template>
  <lazy-prime-dialog
    :visible="visible"
    :modal="true"
    :closable="false"
    :dismissableMask="false"
    class="rounded-lg"
  >
    <div class="p-4 text-center">
      <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {{ title }}
      </h2>
      <p class="text-gray-700 dark:text-gray-300 mb-6">
        {{ message }}
      </p>
      <div class="flex justify-center gap-4">
        <button
          class="px-4 py-2 min-w-[100px] rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition cursor-pointer"
          @click="onCancelClick"
        >
          {{ cancelText }}
        </button>
        <button
          class="px-4 py-2 min-w-[100px] rounded-lg bg-green-73 hover:bg-primary/90 text-white transition cursor-pointer"
          @click="onConfirmClick"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </lazy-prime-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:visible']);

const props = withDefaults(
  defineProps<{
    visible: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>(),
  {
    title: 'هل تريد حفظ التغييرات؟',
    message: 'لقد قمت بتعديل الإعدادات، هل تود حفظ التغييرات قبل الخروج؟',
    confirmText: 'حفظ',
    cancelText: 'إلغاء',
  }
);

const onConfirmClick = () => {
  props.onConfirm?.();
  emit('update:visible', false);
};

const onCancelClick = () => {
  props.onCancel?.();
  emit('update:visible', false);
};
</script>
