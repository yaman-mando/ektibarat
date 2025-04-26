<template>
  <div
    :class="{
      'code-input-container': true,
      [props.className]: !!props.className,
    }"
  >
    <div class="code-input">
      <p
        v-if="props.title"
        class="title"
      >
        {{ props.title }}
      </p>
      <input
        v-for="(v, index) in values22"
        :key="index"
        :ref="(el) => (inputRefs[index] = el as any)"
        type="tel"
        class="w-14 h-14 rounded-lg border border-gray outline-none focus:outline-none focus:border-primary focus:ring-0 text-center transition-all"
        pattern="[0-9]"
        inputmode="numeric"
        :style="{
          width: `${props.fieldWidth}px`,
          height: `${props.fieldHeight}px`,
          borderRadius: `${props.radius}px`,
        }"
        :autofocus="autoFocus && index === autoFocusIndex"
        :data-id="index"
        :value="values22[index]"
        :required="props.required"
        :disabled="props.disabled"
        maxlength="1"
        @input="onValueChange"
        @focus="onFocus"
        @keydown="onKeyDown"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const arabicToEnglishMap: Record<string, string> = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

const props = withDefaults(
  defineProps<{
    className?: string;
    fields?: number;
    fieldWidth?: number;
    fieldHeight?: number;
    disabled?: boolean;
    required?: boolean;
    title?: string;
    radius?: number;
  }>(),
  {
    className: '',
    fields: 3,
    fieldWidth: 56,
    fieldHeight: 56,
    disabled: false,
    required: true,
    title: '',
    radius: 4,
  }
);

const emit = defineEmits<{
  (e: 'change' | 'complete', value: string): void;
}>();

const KEY_CODE = { backspace: 8, left: 37, up: 38, right: 39, down: 40 };
const values22 = ref<string[]>(Array(props.fields).fill(''));
const inputRefs = reactive<HTMLInputElement[]>([]);
const iRefs = ref<number[]>([]);
const autoFocusIndex = ref(0);
const autoFocus = ref(true);

const onFocus = (e: Event) => {
  (e.target as HTMLInputElement).select();
};

const triggerChange = (values = values22.value) => {
  const val = values.join('');
  emit('change', val);
  if (val.length >= props.fields) {
    emit('complete', val);
  }
};

const onValueChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const index = parseInt(input.dataset.id || '0');
  const value = input.value.replace(
    /[٠-٩]/g,
    (char) => arabicToEnglishMap[char]
  );

  if (!/^\d$/.test(value)) {
    input.value = '';
    return;
  }

  values22.value[index] = value;
  triggerChange();

  const next = inputRefs[index + 1];
  if (next) next.focus();
};

const onKeyDown = (e: KeyboardEvent) => {
  const input = e.target as HTMLInputElement;
  const index = parseInt(input.dataset.id || '0');
  const prev = inputRefs[index - 1];
  const next = inputRefs[index + 1];

  switch (e.keyCode) {
    case KEY_CODE.backspace:
      e.preventDefault();
      if (values22.value[index]) {
        values22.value[index] = '';
        triggerChange();
      } else if (prev) {
        values22.value[index - 1] = '';
        prev.focus();
        triggerChange();
      }
      break;
    case KEY_CODE.left:
      e.preventDefault();
      if (prev) prev.focus();
      break;
    case KEY_CODE.right:
      e.preventDefault();
      if (next) next.focus();
      break;
    case KEY_CODE.up:
    case KEY_CODE.down:
      e.preventDefault();
      break;
  }
};

const initVals = () => {
  const vals: string[] = [];
  if (values22.value.length) {
    for (let i = 0; i < props.fields; i++) {
      vals.push(values22.value[i] || '');
    }
    autoFocusIndex.value =
      values22.value.length >= props.fields ? 0 : values22.value.length;
  } else {
    for (let i = 0; i < props.fields; i++) {
      vals.push('');
    }
  }
  values22.value = vals;

  iRefs.value = [];
  for (let i = 0; i < props.fields; i++) {
    iRefs.value.push(i + 1);
  }
};

onMounted(() => {
  initVals();
});
</script>

<style scoped>
.code-input-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.code-input {
  display: grid;
  grid-template-columns: repeat(auto-fit, 45px);
  justify-content: center;
  column-gap: 15px;
}

.code-input > input {
  border: 0.75px solid #70707080;
  font-family: 'Lato';
  font-size: 20px;
  border-radius: 8px;
  text-align: center;
  color: #525461;
}

.code-input > input:focus {
  border: 1px solid #006fff;
  caret-color: #006fff;
}

.title {
  margin: 0;
  height: 20px;
  padding-bottom: 10px;
}
</style>
