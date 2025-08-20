<template>
  <lazy-prime-dialog
    v-model:visible="isOpenValue"
    class="a-add-teacher-modal"
    :showHeader="false"
    :closable="true"
    :modal="true"
    :dismissableMask="true"
    :closeOnEscape="true"
  >
    <lazy-vee-validate-provider>
      <i
        class="fa fa-times"
        @click="closeModal"
      ></i>
      <div class="steps">
        <vee-form
          ref="add_teacher_form"
          v-slot="{ meta }"
          slim
          class="add-teacher-form"
        >
          <template v-if="activeStep === 1">
            <span class="__text1">{{ step1Text.text1 }}</span>
            <span class="__text2">
              {{ step1Text.text2 }}
            </span>

            <template v-if="incomplete === inCompleteType.phone">
              <phone-input
                :phoneNumber="form.phoneNumber"
                @onInputPhone="(val) => (form.phoneNumber = val)"
              />
            </template>

            <span
              v-if="step1ErrMsg"
              class="__triesNote __red"
            >
              {{ step1ErrMsg }}
            </span>

            <span class="__text3">
              {{ step1Text.text3 }}
            </span>
          </template>

          <template v-if="activeStep === 2">
            <div class="co-code">
              <span class="__text4">{{ step1Text.text4 }}</span>
              <span class="__text5">
                {{ step1Text.text5 }}
              </span>

              <div class="cl-mail">
                <a
                  class="mail"
                  @click="backToStep1()"
                >
                  {{ form.phoneNumber }}+
                </a>
              </div>

              <div
                class="code-part"
                :class="{ 'wrong-code': wrongCode }"
              >
                <div class="relative w-full block">
                  <lazy-app-overlay v-if="processCode" />
                  <code-input
                    ref="codeInputRef"
                    :fields="4"
                    :fieldWidth="45"
                    :fieldHeight="45"
                    :radius="8"
                    :required="true"
                    style="direction: ltr"
                    @complete="sendCode"
                  />
                </div>
                <p
                  v-if="wrongCode"
                  class="wrong-code"
                >
                  الكود خاطىء يرجى إدخال كود صحيح
                </p>
              </div>
              <span class="__text6">
                {{ step1Text.text6 }}
              </span>
              <span
                v-if="isFullTries"
                class="__triesNote __red"
              >
                {{ errorMessagesText.codeTries }}
              </span>

              <span
                :class="{ disabled: isFullTries }"
                class="resend relative"
                @click="!isFullTries ? reSendAction() : {}"
              >
                <lazy-app-overlay :show="resendLoading" />
              </span>
            </div>
          </template>

          <template v-if="activeStep === 1">
            <app-button
              :isDisabled="!meta.valid || isFullTries || isExist"
              colorType="primary"
              label="التالي"
              @click="nextStep()"
            />
          </template>
        </vee-form>
      </div>
    </lazy-vee-validate-provider>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import { defineRule, Form as VeeForm } from 'vee-validate';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { deepCloneUtil, deepEqualUtil } from '~/main/utils/lodash.utils';
import type { AxiosResponse } from 'axios';
const codeInputRef = ref<InstanceType<typeof import('~/components/shared/forms/code-input.vue')['default']> | null>(null);

const inCompleteType = {
  none: 0,
  mail: 1,
  phone: 2,
  info: 3,
};

const errTypes = {
  isExist: 1,
  domain: 2,
  tries: 3,
};

const errorMessagesText = {
  existEmail: 'هذا البريد الإلكتروني مسجّل لدينا مسبقًا',
  existPhone: 'رقم الهاتف هذا مسجّل لدينا مسبقًا',
  registerTries: 'لقد استنفذت عدد المحاولات للايميل يرجى المحاولة بعد 8 ساعات',
  codeTries:
    'لقد استنفذت عدد المحاولات المسموح بها لإرسال الكود يرجى إعادة المحاولة بعد مرور 8 ساعات',
  domainNotAvailable: 'الدومين غير مدعوم في المنصة',
  wrongCode: 'الكود غير صحيح يرجي التحقق',
  spamEmailNote: 'تحقق من البريد العشوائي في حال لم تجد الرسالة',
  passwordNote: 'لا تقل كلمة المرور عن 8 خانات وتحتوي حرف ورقم على الأقل',
};

const step1TextsInfo = {
  text1: 'إدخال المعلومات الناقصة',
  text2: 'نرجو استكمال معلوماتك',
  text3: '',
  text4: '',
  text5: '',
  text6: '',
};

const step1TextsPhone = {
  text1: 'إدخال رقم واتساب',
  text2: 'يرجى توثيق رقمك في واتساب',
  text3: 'سيتم إرسال رسالة تحقق إلى رقمك على واتساب',
  text4: 'التحقق من رقم واتساب',
  text5: 'أدخل رمز التحقق المرسل إلى رقمك في واتساب',
  text6: '',
  text7: 'بإمكانك إعادة إرسال الرسالة بعد 8 ساعات',
};

const step1TextsEmail = {
  text1: 'إدخال البريد الإلكتروني',
  text2: 'يجب عليك توثيق بريدك الإلكتروني',
  text3: 'سيتم إرسال رسالة تحقق إلى بريدك الإلكتروني',
  text4: 'التحقق من البريد الإلكتروني',
  text5: 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني',
  text6: 'تحقق من البريد العشوائي في حال لم تجد الرسالة',
  text7: 'بإمكانك إعادة إرسال الرسالة بعد 8 ساعات',
};

type FormType = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
};

defineRule('just_num', (value) => {
  if (!/^[0-9]+$/.test(value)) {
    return 'يجب أن يحتوي فقط على أرقام.';
  }
  return true;
});

export default {
  components: {
    VeeForm,
  },
  props: {
    isOpen: Boolean,
  },
  setup() {
    const formRef = useTemplateRef<InstanceType<typeof VeeForm> | null>(
      'add_teacher_form'
    );
    return {
      ...useSetupAuth(),
      ...useToastMessage(),
      formRef,
    };
  },
  data() {
    return {
      isOpenValue: false,
      activeStep: 1,
      inCompleteType: inCompleteType,
      incomplete: inCompleteType.none,
      processCode: false,
      wrongCode: false,
      form: {
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
      } as FormType,
      defaultForm: null as FormType | null,
      errorMessagesText: errorMessagesText,
      step1Text: step1TextsInfo,
      countRegisterTriesEmail: 0,
      countRegisterTriesPhone: 0,
      blockedEmail: null,
      blockedPhone: null,
      errType: null as number | null,
      resendLoading: false,
    };
  },

  computed: {
    step1ErrMsg() {
      if (this.isExist) {
        if (this.incomplete === inCompleteType.phone) {
          return this.errorMessagesText.existPhone;
        }
        return this.errorMessagesText.existEmail;
      }
      if (this.isFullTries) {
        return this.errorMessagesText.codeTries;
      }
      return false;
    },

    isFullTries() {
      return (
        (this.incomplete === inCompleteType.mail &&
          this.countRegisterTriesEmail > 3 &&
          this.blockedEmail === this.form.email) ||
        (this.incomplete === inCompleteType.phone &&
          this.countRegisterTriesPhone > 3 &&
          this.blockedPhone === this.form.phoneNumber)
      );
    },

    isExist() {
      return (
        (this.incomplete === inCompleteType.mail &&
          this.countRegisterTriesEmail <= 3 &&
          this.blockedEmail === this.form.email) ||
        (this.incomplete === inCompleteType.phone &&
          this.countRegisterTriesPhone <= 3 &&
          this.blockedPhone === this.form.phoneNumber)
      );
    },
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(val) {
        this.isOpenValue = val;
      },
    },
    isOpenValue: {
      handler(val) {
        this.$emit('update:isOpen', val);
      },
    },
  },

  beforeMount() {
    this.setActiveStep();
  },
  methods: {
    fillForm() {
      const user = this.appAuth.user;
      Object.keys(this.form).forEach((key) => {
        this.form[key] = user[key];
      });
      this.defaultForm = deepCloneUtil(this.form);
    },
    setActiveStep() {
      const user = this.appAuth.user;
      this.fillForm();
      this.incomplete = inCompleteType.phone;
      this.step1Text = step1TextsPhone;
      /*if (!user.phoneNumber) {
        this.incomplete = inCompleteType.phone;
        this.step1Text = step1TextsPhone;
        return;
      }*/
      /*if (!user.email) {
        this.incomplete = inCompleteType.mail;
        this.step1Text = step1TextsEmail;
        return;
      }*/
      /*if (!user.firstName || !user.lastName) {
        this.incomplete = inCompleteType.info;
        this.step1Text = step1TextsInfo;
        return;
      }*/
      //this.activeStep = 2;
      /*this.step1Text = step1TextsPhone;
      this.incomplete = inCompleteType.phone;
      this.activeStep = 1;*/
    },

    nextStep() {
      if (this.incomplete === inCompleteType.info && this.activeStep === 1) {
        if (deepEqualUtil(this.defaultForm, this.form)) {
          this.activeStep = 3;
          return;
        }
        this.updateProfile(3);
        return;
      }
      if (this.incomplete === inCompleteType.mail) {
        this.requestChangeMail(this.form.email);
        return;
      }
      if (this.incomplete === inCompleteType.phone) {
        this.requestChangePhone(this.form.phoneNumber);
      }
    },

    backToStep1() {
      this.activeStep = 1;
      this.wrongCode = false;
    },

    noChangeProfile() {
      return (
        this.defaultForm?.firstName === this.form.firstName &&
        this.defaultForm?.lastName === this.form.lastName
      );
    },

    async updateProfile(step: number | null = null) {
      try {
        if (this.noChangeProfile()) {
          return true;
        }
        this.$axios.put(`/profile`, this.form).then(({ data: res }) => {
          if (res) {
            this.appAuth.fetchUser();
            this.defaultForm = deepCloneUtil(this.form);
            if (step) {
              this.activeStep = step;
            }
            return true;
          }
        });
      } catch (e) {
        this.showError();
        console.log('updateProfile: ' + e);
        return false;
      }
    },

    requestChangeMail(newMail) {
      this.$axios
        .post(`/identity/requestChangeEmail`, { email: newMail })
        .then(async ({ data: res }) => {
          if (res.success) {
            this.countRegisterTriesEmail = res.countRegisterTries;
            if (res.countRegisterTries > 3) {
              this.blockedEmail = deepCloneUtil(newMail);
              this.errType = errTypes.tries;
            }
            const result = await this.updateProfile();
            if (result) {
              this.activeStep = 2;
            }
          }
        })
        .catch((error) => {
          if (error.response?.status == 400) {
            this.showError({
              summary: 'فشل العملية',
              life: 3000,
              detail: error.response.data.errors['Email'],
            });
            if (
              error.response.data.errors['Email'] == 'هذا الإيميل موجود مسبقاً'
            ) {
              this.countRegisterTriesEmail = 0;
              this.blockedEmail = deepCloneUtil(newMail);
            }
          } else {
            this.showError();
          }
        });
    },

    requestChangePhone(newPhone) {
      this.resendLoading = true;
      this.$axios
        .post(`/identity/requestChangePhone`, { phone: newPhone })
        .then(async ({ data: res }) => {
          if (res.success) {
            this.countRegisterTriesPhone = res.countRegisterTries;
            const result = await this.updateProfile();
            if (result) {
              this.activeStep = 2;
            }
          }
        })
        .catch((error) => {
          if (error.response?.status == 400) {
            this.showError({
              detail: 'رقم الهاتف موجود مسبقاً',
              summary: 'فشل العملية',
              life: 3000,
            });
            this.countRegisterTriesEmail = 0;
            this.blockedPhone = deepCloneUtil(newPhone);
          } else {
            this.showError();
          }
        })
        .finally(() => {
          this.resendLoading = false;
        });
    },

    reSendAction() {
      codeInputRef.value?.reset();
      if (this.incomplete === inCompleteType.phone) {
        this.requestChangePhone(this.form.phoneNumber);
        return;
      }
      if (this.incomplete === inCompleteType.mail) {
        this.requestChangeMail(this.form.email);
      }
    },

    onConfirm() {
      this.isOpenValue = false;
      this.$emit('onConfirm');
    },
    closeModal() {
      this.isOpenValue = false;
      this.$emit('onClose');
    },

    async sendCode(code) {
      try {
        this.wrongCode = false;
        this.processCode = true;
        const codeForm = {
          method: this.incomplete === inCompleteType.mail ? 0 : 1,
          code: code,
          userId: this.appAuth.user.id,
        };
        let res: AxiosResponse;
        if (this.incomplete === inCompleteType.mail) {
          res = await this.$axios.post(
            `/identity/confirmChangeEmail`,
            codeForm
          );
        } else {
          res = await this.$axios.post(
            `/identity/confirmChangePhone`,
            codeForm
          );
        }
        if (res.data || res.data.isConfirmed) {
          this.closeModal();
          setTimeout(() => {
            this.formRef?.resetForm();
          }, 200);
        } else {
          this.processCode = false;
          this.wrongCode = true;
        }
      } catch (e) {
        this.processCode = false;
        this.wrongCode = true;
      }
    },
  },
};
</script>
<style lang="scss">
@use '@/assets/scss/mixin' as *;

.a-add-teacher-modal {
  background-color: var(--modal-bg);
  width: 360px !important;
  min-height: 360px !important;
  max-width: 95vw;
  margin: auto;
  border-radius: 15px;
  .fa-times {
    position: absolute;
    cursor: pointer;
    left: 15px;
    top: 15px;
    font-size: 16px;
    color: var(--purple-8c);
  }

  .steps {
    .add-teacher-form {
      display: grid;
      justify-content: center;
      width: 100%;
      margin-top: 25px;
      .__text1,
      .__text4 {
        font-size: 24px;
        font-weight: bold;
        color: var(--purple-8c);
        text-align: center;
      }
      .__text2 {
        font-size: 16px;
        font-weight: 500;
        color: var(--gray-63);
        line-height: 24px;
        text-align: center;
        margin: 35px 0;
      }
      .__text3 {
        font-size: 16px;
        font-weight: 500;
        color: var(--gray-63);
        text-align: center;
        margin-top: 25px;
      }
      .__text5 {
        font-size: 16px;
        font-weight: 500;
        color: var(--gray-63);
        text-align: center;
        margin-top: 35px;
      }
      .__text6 {
        font-size: 16px;
        color: var(--gray-63);
        text-align: center;
        position: absolute;
        bottom: 30px;
        right: 0;
        width: 100%;
      }
      .__text7 {
        font-size: 16px;
        color: var(--red-5e);
        text-align: center;
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 100%;
      }
      .cl-mail {
        margin-top: 6px;
        margin-bottom: 35px;
        text-align: center;
        a {
          font-size: 16px;
          color: var(--purple-8c);
          cursor: pointer;
        }
      }

      .resend {
        font-size: 14px;
        text-decoration: none;
        color: var(--purple-8c);
        text-align: center;
        margin-top: 110px;
        cursor: pointer;
        border: 1px solid;
        padding: 10px 15px;
        width: 100px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-self: center;
        border-radius: 5px;
        &.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
      }
      .next-btn {
        margin-top: 20px;
        width: 330px;
        height: 45px;
        border-radius: 10px;
        background-color: var(--purple-8c);
        color: white;
        font-size: 16px;
        font-weight: bold;
        max-width: 90vw;
      }

      .co-code {
        display: grid;
        width: 330px;
        position: relative;
      }

      .wrong-code {
        font-size: 13px;
        text-align: center;
        color: var(--red-5e);
      }

      .join-to {
        display: grid;
        .t-1 {
          font-size: 24px;
          font-weight: bold;
          color: var(--purple-8c);
          text-align: center;
        }
        .t-2 {
          font-size: 16px;
          font-weight: 500;
          color: var(--gray-63);
          line-height: 24px;
          text-align: center;
          margin: 35px 0 30px;
        }
      }

      .code-actions {
        display: grid;
        align-items: center;
        column-gap: 20px;
        row-gap: 15px;
        justify-content: center;
        margin-top: 30px;
        grid-auto-flow: column;
        .normal-btn {
          width: 155px;
          height: 45px;
          border-radius: 10px;
          background-color: var(--purple-8c);
          color: white;
          font-size: 16px;
          font-weight: bold;
          max-width: 40vw;
        }

        .outline-btn {
          width: 155px;
          height: 45px;
          border-radius: 10px;
          border: 2px solid var(--red-5e);
          background-color: transparent;
          color: var(--red-5e);
          font-size: 16px;
          font-weight: bold;
          max-width: 40vw;
        }
      }

      .__triesNote {
        font-size: 12px;
      }

      .a-input-wrapper {
        input {
          height: 45px;
          border: 0.75px solid #70707080;
          border-radius: 8px;
        }
      }
      label {
        font-size: 16px;
        color: #252525;
        font-weight: normal;
      }

      .__red {
        color: var(--red-5e);
      }
    }
  }
}
</style>
