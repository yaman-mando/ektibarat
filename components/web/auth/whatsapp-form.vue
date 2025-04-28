<template>
  <vee-form
    ref="pageForm"
    class="w-full block"
  >
    <prime-block-u-i
      class="w-full flex flex-col justify-start gap-6"
      :blocked="loginOtpReq.status.value === 'pending'"
    >
      <template v-if="!isCodeStep">
        <lazy-phone-input @onInputPhone="onChange($event)" />
        <span
          v-if="errorMessage"
          class="err-msg"
        >
          {{ errorMessage }}
        </span>
        <span class="note">سيتم إرسال رمز الدخول إلى الواتساب</span>
      </template>
      <template v-if="isCodeStep">
        <div class="rw-user-info">
          <span class="code-label">
            يرجى إدخال الكود الواصل إليكم عبر الواتس اب
          </span>
          <span class="user-data">
            {{ data.phone }}
            <button
              class="change-method"
              @click="backToInput"
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
      <app-button
        :isDisabled="!!errorMessage || fullTries"
        size="sm"
        :label="isCodeStep ? 'إعادة إرسال الكود' : 'إرسال'"
        @click="onSubmitClick"
      />
    </prime-block-u-i>
  </vee-form>
</template>
<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import type { FetchError } from 'ofetch';
import type { AuthLoginOtpDataModel } from '~/core/auth/data-access/models/auth.model';
import { authEvents } from '~/core/auth/data-access/services/useAuthEvents';

//composable
const authStore = useAuthStore();
const toastMessage = useToastMessage();

//data
const fullTries = ref(false);
const pageForm = ref<InstanceType<typeof VeeForm> | null>(null);
const isCodeStep = ref(false);
const data = ref<{ phone: string | null; code: string | null }>({
  phone: null,
  code: null,
});
const loginOtpReq = useLazyAsyncData(
  'login-otp',
  () => authStore.loginOTP({ input: data.value.phone!, code: data.value.code }),
  {
    immediate: false,
  }
);
const errorMessage = ref<string | null>(null);

//method
const onSubmitClick = async () => {
  data.value.code = null;
  submit();
};
const onCompleteCode = (code: string) => {
  data.value.code = code;
  submit();
};

const onChange = (val: string) => {
  data.value.phone = val;
};

const submit = async () => {
  try {
    const formRef = pageForm.value!;
    const { valid } = await formRef.validate();
    if (!valid) return;

    await loginOtpReq.execute();
    if (loginOtpReq.data.value) {
      onSuccess(loginOtpReq.data.value!);
    }
  } catch (error) {
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

const backToInput = () => {
  resetForm();
  isCodeStep.value = false;
};

const resetForm = () => {
  const form = pageForm.value!;
  data.value = { phone: null, code: null };
  form.resetForm();
  fullTries.value = false;
};

const onSuccess = (res: AuthLoginOtpDataModel) => {
  if (res && res.success) {
    if (!res.token) {
      isCodeStep.value = true;
    } else {
      authEvents.emitSignIn({
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
</script>
<style lang="scss" scoped>
.note {
  font-size: 16px;
  text-align: center;
  color: var(--gray-63);
  font-weight: 500;
  line-height: 22px;
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
</style>
