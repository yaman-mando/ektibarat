<template>
  <div
    class="phone-input"
    :class="{ isEdit: isEdit }"
  >
    <label
      v-if="!isEdit || showLabel"
      class="b-title"
    >
      رقم واتساب
    </label>
    <div class="input-select-container">
      <vee-field
        ref="phoneInputRef"
        v-slot="{ handleBlur, handleChange }"
        v-model="phone"
        slim
        :rules="{
          required: true,
          phoneValidation: {
            length: selectedRules.length,
            startsWith: selectedRules.startsWith,
          },
        }"
        :name="'phone-input'"
      >
        <input
          id="phone-input"
          :value="phone"
          type="tel"
          :placeholder="selectedRules.placeholder"
          inputmode="numeric"
          dir="rtl"
          @input="
            validatePhone();
            handleChange($event);
          "
          @blur="handleBlur"
        />
      </vee-field>
      <div>
        <lazy-phone-code-select
          v-model:selectedItem="selectedCountry"
          :isEdit="isEdit"
        />
      </div>
      <span
        v-if="error"
        class="error-message"
      >
        {{ error }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineRule, Field as VeeField } from 'vee-validate';
import { useGlobalStore } from '~/main/useGlobalStore';
import {
  getKeyByValue,
  IS_PRODUCTION_APP,
  sleepUtil,
} from '~/main/utils/shared-utils';
import { CountryPhoneCodes } from '~/main/constants/country-phone-codes';

/**
 * @typedef {Object} TextConfig
 * @property {string} placeHolder
 * @property {string} errMsg
 * @property {number} length
 */

/**
 * @type {Record<string, TextConfig>}
 */
const countryRules = {
  SA: { placeholder: '512345678', length: 9, startsWith: '5' },
  QA: { placeholder: '31234567', length: 8, startsWith: '3' },
  EG: { placeholder: '1012345678', length: 10, startsWith: '1' },
  AE: { placeholder: '501234567', length: 9, startsWith: '5' },
  TR: { placeholder: '5485611577', length: 10, startsWith: '5' },
};

defineRule(
  'phoneValidation',
  (value: string, params: { length: number; startsWith: string }) => {
    const { length, startsWith } = params;

    if (!value || value.trim() === '') {
      return 'رقم الهاتف مطلوب.';
    }

    if (!value.startsWith(startsWith)) {
      return `يجب أن يبدأ رقم الهاتف بـ ${startsWith}.`;
    }

    if (value.length < length) {
      return `يجب أن يتكون رقم الهاتف من ${length} أرقام.`;
    }

    return true;
  }
);

const emit = defineEmits<{
  (e: 'onInputPhone', value: string): void;
}>();
const props = withDefaults(
  defineProps<{
    phoneNumber?: string | null;
    isEdit?: boolean;
    showLabel?: boolean;
  }>(),
  {
    phoneNumber: null,
    isEdit: false,
    showLabel: false,
  }
);

//composable
const globalStore = useGlobalStore();

//data
const phoneInputRef = ref<InstanceType<typeof VeeField> | null>(null);
const selectedCountry = ref<string | null>(null);
const phone = ref<string>('');
const error = ref<string | null>('');
//computed
const selectedRules = computed(() => {
  if (!IS_PRODUCTION_APP) {
    return countryRules['TR'];
  }
  return selectedCountryKey.value
    ? countryRules[selectedCountryKey.value]
    : countryRules['SA'];
});

const selectedCountryKey = computed(() => {
  return getKeyByValue(
    CountryPhoneCodes,
    selectedCountry.value
  ) as keyof typeof countryRules;
});

//hook
onBeforeMount(() => {
  if (props.phoneNumber) {
    if (props.phoneNumber.toString().substring(0, 2) === '20') {
      phone.value = props.phoneNumber.substring(2);
      selectedCountry.value = props.phoneNumber.substring(0, 2);
    } else {
      phone.value = props.phoneNumber.substring(3);
      selectedCountry.value = props.phoneNumber.substring(0, 3);
    }
  } else {
    selectedCountry.value = globalStore.state.countryCode;
  }
});

//method
const validatePhone = async () => {
  phone.value = phone.value.replace(/[^0-9٠-٩]/g, '');

  phone.value = phone.value.replace(/[٠-٩]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 1632);
  });

  if (phone.value.length > selectedRules.value.length) {
    phone.value = phone.value.slice(0, selectedRules.value.length);
  }

  await sleepUtil(50);
  const err = phoneInputRef.value?.errors;
  if (phone.value.length == selectedRules.value.length && err?.length === 0) {
    error.value = null;
  } else {
    error.value = err?.[0] ?? null;
  }

  const fullPhone = selectedCountry.value + phone.value;
  emit('onInputPhone', fullPhone);
};

//watch
watch(
  () => selectedCountry.value,
  (newVal) => {
    // emit('changeCountryCode', newVal);
    const fullPhone = newVal + phone.value;
    emit('onInputPhone', fullPhone);
    validatePhone();
  }
);
</script>
<style lang="scss">
.phone-input {
  text-align: start;
  .input-select-container {
    background: white;
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 5px 5px 5px 0;
    width: 100%;
    height: 45px;
    position: relative;
  }

  .error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    position: absolute;
    width: 100%;
    right: 0;
    top: 40px;
  }

  .input-select-container input {
    flex: 1;
    border: none;
    outline: none;
    padding: 5px;
  }

  .b-title {
    font-size: 16px;
    color: #252525;
    font-weight: normal;
    margin-bottom: 8px;
  }
}
</style>
