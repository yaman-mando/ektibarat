<template>
  <prime-dialog
    v-model:visible="isOpenValue"
    :modal="true"
    class="a-add-teacher-modal"
    :showHeader="false"
    :dismissableMask="false"
    :closable="false"
    :closeOnEscape="false"
  >
    <lazy-vee-validate-provider>
      <i
        class="fa fa-times"
        @click="closeModal"
      ></i>
      <div class="steps">
        <vee-form
          v-slot="{ meta: formMeta }"
          ref="teacher_form_ref"
          slim
          class="add-teacher-form"
        >
          <template v-if="activeStep === 1">
            <span class="__text1">{{ step1Text.text1 }}</span>
            <span class="__text2">
              {{ step1Text.text2 }}
              <br />
              قبل الانضمام إلى مدرب
            </span>
            <div class="w-full flex flex-col gap-3">
              <form-input
                v-model:inputValue="form.firstName"
                inputTabIndex="1"
                label="الاسم الأول"
                :inputId="'firstName'"
                :rules="{ required: true }"
              />

              <form-input
                v-model:inputValue="form.lastName"
                inputTabIndex="2"
                label="الاسم الأخير"
                :inputId="'lastName'"
                :rules="{ required: true }"
              />

              <template v-if="incomplete === inCompleteType.mail">
                <form-input
                  v-model:inputValue="form.email"
                  :inputId="'email'"
                  inputType="email"
                  :rules="{ required: true, email: true }"
                  :label="'البريد الالكتروني'"
                />
              </template>

              <template v-if="incomplete === inCompleteType.phone">
                <phone-input
                  :phoneNumber="form.phoneNumber"
                  @onInputPhone="(val) => (form.phoneNumber = val)"
                />
              </template>
            </div>

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
              <template v-if="incomplete === inCompleteType.mail">
                <div class="cl-mail">
                  <a
                    class="mail"
                    @click="backToStep1()"
                  >
                    {{ form.email }}
                  </a>
                </div>
              </template>
              <template v-else>
                <div class="cl-mail">
                  <a
                    class="mail"
                    @click="backToStep1()"
                  >
                    {{ form.phoneNumber }}+
                  </a>
                </div>
              </template>
              <div
                class="code-part relative"
                :class="{ 'wrong-code': wrongCode }"
              >
                <app-overlay v-if="processCode" />
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
                class="resend"
                @click="!isFullTries ? reSendAction() : {}"
              >
                إعادة إرسال
              </span>
            </div>
          </template>

          <template v-if="activeStep === 3">
            <div class="join-to">
              <span class="t-1">انضمام إلى مدرب</span>
              <span class="t-2">
                قم بإدخال كود المدرب للانضمام إلى مجموعته
                <br />
                سيصل طلبك إلى المدرب ليوافق على انضمامك
              </span>

              <form-input
                v-model:inputValue="coachCode"
                inputTabIndex="2"
                label="كود المدرب"
                inputType="number"
                :inputId="'coachCode'"
                rules="required|just_num"
              />
            </div>
          </template>

          <template v-if="activeStep === 1">
            <app-button
              class="!w-full !mt-3"
              size="md"
              :disabled="!formMeta.valid || isFullTries || isExist"
              label="التالي"
              @click="nextStep()"
            />
          </template>

          <div
            v-if="activeStep === 3"
            class="code-actions"
          >
            <app-button
              class="!w-full !mt-3"
              :isDisabled="!formMeta.valid"
              size="md"
              label="إرسال طلب"
              @click="sendTeacherCode"
            />
            <app-button
              class="!w-full !mt-3"
              variant="outline"
              colorType="warn"
              label="إلغاء"
              @click="closeModal"
            />
          </div>
        </vee-form>
      </div>
    </lazy-vee-validate-provider>
  </prime-dialog>
</template>
<script lang="ts">
import { defineRule, Form as VeeForm } from 'vee-validate';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { deepCloneUtil, deepEqualUtil } from '~/main/utils/lodash.utils';
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
  text2: 'يجب عليك استكمال معلوماتك',
  text3: '',
};

const step1TextsPhone = {
  text1: 'إدخال رقم واتساب',
  text2: 'يجب عليك توثيق رقمك في واتساب',
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

defineRule('just_num', (value) => {
  if (/^[0-9]+$/.test(value)) {
    return true;
  }

  return 'يجب أن يحتوي فقط على أرقام.';
});

export default {
  components: {
    VeeForm,
  },
  props: {
    isOpen: Boolean,
  },
  emits: ['onConfirm', 'update:isOpen', 'onClose'],
  setup() {
    const teacherFormRef =
      useTemplateRef<InstanceType<typeof VeeForm>>('teacher_form_ref');
    return {
      ...useSetupAuth(),
      ...useToastMessage(),
      teacherFormRef,
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
        phoneNumber: null as string | null,
      },
      defaultForm: null as any | null,
      errorMessagesText: errorMessagesText,
      coachCode: null,
      step1Text: step1TextsInfo as any,
      countRegisterTriesEmail: 0,
      countRegisterTriesPhone: 0,
      blockedEmail: null,
      blockedPhone: null,
      errType: null as any | null,
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
      return '';
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
      if (!user.phoneNumber) {
        this.incomplete = inCompleteType.phone;
        this.step1Text = step1TextsPhone;
        return;
      }
      if (!user.email) {
        this.incomplete = inCompleteType.mail;
        this.step1Text = step1TextsEmail;
        return;
      }
      if (!user.firstName || !user.lastName) {
        this.incomplete = inCompleteType.info;
        this.step1Text = step1TextsInfo;
        return;
      }
      this.activeStep = 3;
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
        this.defaultForm.firstName === this.form.firstName &&
        this.defaultForm.lastName === this.form.lastName
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
            const val = await this.updateProfile();
            if (val) {
              this.activeStep = 2;
            }
          }
        })
        .catch((error) => {
          if (error.response?.status == 400) {
            this.showError({
              life: 3000,
              summary: 'فشل العملية',
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
      this.$axios
        .post(`/identity/requestChangePhone`, { phone: newPhone })
        .then(async ({ data: res }) => {
          if (res.success) {
            this.countRegisterTriesPhone = res.countRegisterTries;
            const val = await this.updateProfile();
            if (val) {
              this.activeStep = 2;
            }
          }
        })
        .catch((error) => {
          if (error.response?.status == 400) {
            this.showError({
              life: 3000,
              summary: 'فشل العملية',
              detail: 'رقم الهاتف موجود مسبقاً',
            });
            this.countRegisterTriesEmail = 0;
            this.blockedPhone = deepCloneUtil(newPhone);
          } else {
            this.showError();
          }
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
        let res;
        if (this.incomplete === inCompleteType.mail) {
          res = (
            await this.$axios.post(`/identity/confirmChangeEmail`, codeForm)
          ).data;
        } else {
          res = (
            await this.$axios.post(`/identity/confirmChangePhone`, codeForm)
          ).data;
        }
        if (res.data || res.isConfirmed) {
          this.activeStep = 3;
          setTimeout(() => {
            this.teacherFormRef?.resetForm();
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

    sendTeacherCode() {
      try {
        this.$axios
          .post(`teachersStudents/request`, {
            teacherId: Number(this.coachCode),
          })
          .then(({ data: res }) => {
            this.showSuccess({
              summary: 'تم إضافة المدرس بنجاح',
            });
            this.onConfirm();
          })
          .catch((e) => {
            if (e.response?.status == 403) {
              this.showError({
                life: 3000,
                summary: 'فشل العملية',
                detail:
                  'لديك طلب سابق لهذا المدرس ... لا يمكن إضافة أكثر من طلب',
              });
              document.getElementById('coachCode')!.focus();
              //@ts-expect-error access input select
              document.getElementById('coachCode')!.select();
              return;
            }
            if (e.response?.status == 404) {
              this.showError({
                life: 3000,
                summary: 'فشل العملية',
                detail: 'لايوجد مدرس بهذا الكود',
              });
              document.getElementById('coachCode')!.focus();
              //@ts-expect-error access input select
              document.getElementById('coachCode')!.select();
              return;
            }
            this.showError();
          });
      } catch (e) {
        console.log('sendTeacherCode: ' + e);
      }
    },
  },
};
</script>
<style lang="scss" src="./add-teacher-modal.scss"></style>
