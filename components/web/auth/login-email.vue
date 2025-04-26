<template>
  <vee-form
    ref="pageForm"
    class="w-full flex flex-col items-start justify-start"
  >
    <template v-if="!isCodeStep">
      <form-input
        v-model:inputValue="email"
        label="البريد الالكتروني"
        :rules="{ required: true, email: true }"
        inputId="email"
      />
      <span class="note">سيتم إرسال رمز الدخول إلى بريدك الإلكتروني</span>
    </template>

    <template v-if="isCodeStep">
      <div class="rw-user-info">
        <span class="code-label">
          يرجى إدخال الكود الواصل إليكم عبر البريد الإلكتروني
        </span>
        <span class="user-data">
          {{ email }}
          <button
            class="change-method"
            @click="backToEmail"
          >
            تغيير
          </button>
        </span>
      </div>
      <code-input
        :fields="4"
        :fieldWidth="50"
        :fieldHeight="45"
        :radius="8"
        :required="true"
        style="direction: ltr"
        @complete="onCompleteCode"
      />
    </template>
    <span
      v-if="fullTries"
      class="__triesNote"
    >
      لقد استنفذت عدد المحاولات المسموح بها لإرسال الكود يرجى إعادة المحاولة بعد
      مرور 8 ساعات
    </span>
    <app-button
      type="submit"
      :isLoading="isLoading"
      :isDisabled="fullTries"
      class="!w-full !mt-6"
      :label="isCodeStep ? 'إعادة إرسال الكود' : 'إرسال'"
      size="sm"
      @click="submit"
    />
  </vee-form>
</template>
<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import type {
  AuthLoginOtpDataModel,
  AuthLoginOtpDTODataModel,
} from '~/core/auth/data-access/models/auth.model';
import type { FetchError } from 'ofetch';

const authStore = useAuthStore();
const toastMessage = useToastMessage();
const isLoading = ref(false);
const fullTries = ref(false);
const pageForm = ref<InstanceType<typeof VeeForm> | null>();
const email = ref<string | null>(null);
const isCodeStep = ref<boolean>(false);

const backToEmail = () => {
  resetForm();
  isCodeStep.value = false;
};

const resetForm = () => {
  const form = pageForm.value!;
  email.value = null;
  form.resetForm();
  fullTries.value = false;
};

const onSuccess = (res: AuthLoginOtpDataModel) => {
  if (res && res.success) {
    if (!res.token) {
      isCodeStep.value = true;
    } else {
      authStore.notifySignInAction({
        id: res.id,
        token: res.token,
        email: null,
        refreshToken: res.refreshToken,
        showWelcomeModal: res.showWelcomeModal,
      });
    }
  } else {
    toastMessage.showError({ summary: 'لم تنجح عملية التسجيل ....' });
  }
};

const submit = async () => {
  const formRef = pageForm.value!;

  const { valid } = await formRef.validate();
  if (!valid) return;

  loginOTP({ input: email.value!, code: null });
};

const loginOTP = async (model: AuthLoginOtpDTODataModel) => {
  try {
    isLoading.value = true;
    const res = await authStore.loginOTP(model);
    isLoading.value = false;
    onSuccess(res);
  } catch (error: unknown) {
    isLoading.value = false;
    const httpError = error as FetchError;
    if (httpError?.response?.status == 400) {
      if (httpError?.response._data.countRegisterTries > 3) {
        fullTries.value = true;
        return;
      }
    }
    throw error;
  }
};

const onCompleteCode = (code: string) => {
  loginOTP({ input: email.value!, code: code });
};
</script>
<style lang="scss" scoped>
.note {
  font-size: 16px;
  text-align: center;
  color: var(--gray-63);
  font-weight: 500;
  line-height: 22px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.rw-user-info {
  display: grid;
  justify-content: center;
  row-gap: 10px;
  margin-bottom: 20px;

  .code-label {
    font-size: 16px;
    color: #252525;
  }

  .user-data {
    font-size: 16px;
    color: var(--purple-8c);
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;

    .change-method {
      font-size: 13px;
      color: white;
      background: var(--purple-8c);
      width: 40px;
      height: 25px;
      border: none;
      outline: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.__triesNote {
  margin-top: 20px;
  text-align: center;
  display: flex;
  font-size: 12px;
  color: var(--red-5e);
}
</style>
