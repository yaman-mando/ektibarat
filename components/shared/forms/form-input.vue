<template>
  <field
    ref="fieldRef"
    v-slot="{ errors, handleChange, handleBlur, meta }"
    v-model="valueModel"
    :name="inputId"
    :rules="rules"
  >
    <div class="custom-input">
      <div class="a-input-label">
        <label :for="inputId">
          {{ label }}
        </label>
        <span
          v-if="isRequired"
          class="a-req"
        >
          *
        </span>
      </div>
      <div class="relative am-w">
        <!-- Regular input -->
        <input
          v-if="!isTextArea"
          :id="inputId"
          ref="inputRef"
          :dir="direction"
          :placeholder="inputPlaceholder"
          :disabled="isDisabled"
          :tabindex="inputTabIndex"
          :type="inputTypeModel"
          :value="valueModel"
          class="ac-ii"
          @blur="handleBlur"
          @input="handleChange"
        />
        <!-- Textarea input -->
        <textarea
          v-if="isTextArea"
          :id="inputId"
          ref="inputRef"
          :rows="textAreaRows"
          :dir="direction"
          :placeholder="inputPlaceholder"
          :disabled="isDisabled"
          :tabindex="inputTabIndex"
          :value="valueModel"
          class="ac-ii"
          @blur="handleBlur"
          @input="handleChange"
        ></textarea>

        <!-- Password toggle -->
        <template v-if="inputType === 'password'">
          <div
            class="flex absolute left-[20px] top-1/2 -translate-x-1/2 -translate-y-1/2"
            @click="togglePassword"
          >
            <i
              v-if="!visiblePassword"
              class="fa-solid fa-eye"
            ></i>
            <i
              v-if="visiblePassword"
              class="fa-solid fa-eye-slash"
            ></i>
          </div>
        </template>
      </div>
      <form-error
        v-if="!hideErrorLabel"
        class="!mt-1"
        :errors="errors"
      />
    </div>
  </field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate';

// Define props
const props = withDefaults(
  defineProps<{
    direction?: 'ltr' | 'rtl';
    label?: string;
    inputPlaceholder?: string;
    inputValue: string | number | null;
    isTextArea?: boolean;
    inputId: string;
    inputType?: 'text' | 'password' | 'email' | 'number';
    inputTabIndex?: number;
    rules?: Record<string, unknown>;
    isDisabled?: boolean;
    hasClear?: boolean;
    hideErrorLabel?: boolean;
    textAreaRows?: number;
  }>(),
  {
    direction: 'rtl',
    label: '',
    inputType: 'text',
    inputTabIndex: 0,
    isDisabled: false,
    hasClear: false,
    hideErrorLabel: false,
    textAreaRows: 5,
  }
);

const emit = defineEmits(['update:inputValue']);

const valueModel = computed({
  get() {
    return props.inputValue;
  },
  set(val) {
    emit('update:inputValue', val);
  },
});

const isRequired = computed(() => {
  if (props.rules) {
    return 'required' in props.rules;
  }
  return false;
});

const visiblePassword = ref(false);

const inputTypeModel = computed(() =>
  visiblePassword.value ? 'text' : props.inputType
);

const togglePassword = () => {
  visiblePassword.value = !visiblePassword.value;
};
</script>

<style lang="scss" scoped>
.custom-input {
  width: 100%;

  .a-input-label {
    display: flex;
    align-items: center;
    justify-content: space-between;

    label {
      font-size: 16px;
      color: #252525;
      font-weight: 400;
      margin-bottom: 8px;
    }

    .a-req {
      font-size: 20px;
      color: var(--red-63);
    }
  }

  .am-w {
    input {
      height: 45px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }

    input,
    textarea {
      width: 100%;
      padding: 0.5rem 1rem;
      //border-radius: 10px;
      //border: 1px solid var(--gray-c7);
      //font-size: 12px;
      &::placeholder {
        font-size: 12px;
        color: var(--gray-c7);
      }
    }

    textarea {
      padding: 10px;
    }
  }
}
</style>
