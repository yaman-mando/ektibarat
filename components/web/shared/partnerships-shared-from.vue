<template>
  <div class="partnerships-shared-form">
    <vee-validate-provider>
      <client-only>
        <div class="register-form">
          <div class="c-back-mobile">
            <app-button variant="clear" size="md" label="رجوع" iconStartClass="fa fa-solid fa-arrow-right-from-bracket"
              @click="toMain" />
          </div>
          <client-only>
            <div class="rt-c">
              <h1>{{ labelTypes[selectedType] }}</h1>
              <vee-form ref="form_ref" class="w-full">
                <div class="rt-c__form">
                  <div class="w-full grid grid-cols-2 gap-5">
                    <form-input v-model:inputValue="form.firstName" inputId="firstName" label="الاسم الأول" :rules="{
                      required: true,
                    }" />
                    <form-input v-model:inputValue="form.lastname" inputId="lastname" label="اسم العائلة" :rules="{
                      required: true,
                    }" />
                  </div>

                  <!--   email  -->
                  <form-input v-model:inputValue="form.email" class="w-full" inputId="email" label="البريد الإلكتروني"
                    :rules="{
                      required: true,
                      email: true,
                    }" inputType="email" />

                  <phone-input ref="phone_input_ref" :key="phoneInputKey" class="w-full" :isEdit="true"
                    :showLabel="true" :phoneNumber="form.phoneNumber"
                    @onInputPhone="(val) => (form.phoneNumber = val)" />

                  <lazy-form-select v-if="selectedType === PartnerShipFormTypesEnum.teacher"
                    v-model:selectedValues="form.teacherQodoratType" :list="teacherQodoratType" :label="'التخصصات'"
                    :placeholder="'اختر تخصصك'" :rules="{ required: true }" inputId="teacherQodoratType" />

                  <lazy-form-select v-if="selectedType === PartnerShipFormTypesEnum.student"
                    v-model:selectedValues="form.grade" :list="gradesList" :label="'الصف الدراسي'"
                    :placeholder="'اختر صفك الدراسي'" :rules="{ required: true }" inputId="grade" :isMulti="false" />

                  <template v-if="selectedType === PartnerShipFormTypesEnum.school">
                    <lazy-form-select v-model:selectedValues="form.city" :list="applicantCityType" :label="'المدينة'"
                      :rules="{ required: true }" inputId="city" :isMulti="false" />

                    <form-input v-model:inputValue="form.schoolName" inputId="schoolName" label="اسم المدرسة" :rules="{
                      required: true,
                    }" />

                    <lazy-form-select v-model:selectedValues="form.applicantType" :list="applicantType"
                      :label="'صفة مقدم الطلب'" :rules="{ required: true }" inputId="applicantType" />
                  </template>

                  <lazy-web-register-privacy-message />

                  <app-button :isLoading="isSaving" class="!w-full !mt-3" label="إرسال" @click="checkDataForSend" />
                </div>
              </vee-form>
            </div>
          </client-only>
        </div>
      </client-only>

      <lazy-prime-dialog id="modal-edit-mail" v-model:visible="openMailModal" header="تعديل البريد الالكتروني"
        :showHeader="false" :modal="true" :dismissableMask="true" :closeOnEscape="true" :closable="true"
        @afterHide="closeMailModal()">
        <i class="fa fa-close" @click="closeMailModal()"></i>
        <div class="code-part" :class="{ 'wrong-code': wrongCode }">
          <p class="t-1">التحقق من البريد الإلكتروني</p>

          <span class="t-2">أدخل رمز التحقق المرسل إلى بريدك الإلكتروني</span>
          <span class="t-3">{{ form.email }}</span>
          <div class="relative w-full">
            <app-overlay v-if="processing" />
            <code-input ref="codeInputRef" class="t-code-input" :fields="4" :fieldWidth="45" :fieldHeight="45"
              :radius="8" :required="true" style="direction: ltr" @complete="sendCode" />
          </div>
          <p v-if="wrongCode" class="wrong-code">
            الكود غير صحيح يرجي التحقق
          </p>

          <span class="note-spam">
            تحقق من البريد العشوائي في حال لم تجد الرسالة
          </span>

          <timer-active v-if="
            requestData && requestData.countRegisterTries <= 3 && isWaiting
          " v-model:isActive="isWaiting" />

          <template v-if="requestData">
            <span v-if="requestData && requestData.countRegisterTries > 3" class="tries-limit">
              بإمكانك إعادة إرسال الرسالة بعد 8 ساعات
            </span>

            <app-button label="إعادة إرسال" size="sm" variant="outline" :isDisabled="(requestData && requestData.countRegisterTries > 3) || isWaiting
              " @click="
                requestData.countRegisterTries <= 3 && !isWaiting
                  ? callApiChangeEmail()
                  : {}
                " />
          </template>
        </div>
      </lazy-prime-dialog>

      <lazy-prime-dialog id="modal-edit-phone" v-model:visible="openPhoneModal" header="تعديل رقم الهاتف"
        :showHeader="false" :modal="true" :dismissableMask="true" :closeOnEscape="true" :closable="true"
        @afterHide="closePhoneModal()">
        <i class="fa fa-close" @click="closePhoneModal()"></i>
        <div class="code-part" :class="{ 'wrong-code': wrongCode }">
          <p class="t-1">التحقق من رقم واتساب</p>

          <span class="t-2">أدخل رمز التحقق المرسل إلى رقمك في واتساب</span>
          <span class="t-3">{{ form.phoneNumber }}+</span>
          <div class="relative w-full">
            <app-overlay v-if="processing" />
            <code-input ref="codeInputRef" class="t-code-input" :fields="4" :fieldWidth="45" :fieldHeight="45"
              :radius="8" :required="true" style="direction: ltr" @complete="sendCode" />
          </div>
          <p v-if="wrongCode" class="wrong-code">
            الكود غير صحيح يرجي التحقق
          </p>
          <template v-if="requestDataPhone">
            <span v-if="requestDataPhone.countRegisterTries > 3" class="tries-limit">
              بإمكانك إعادة إرسال الرسالة بعد 8 ساعات
            </span>
            <timer-active v-if="requestDataPhone.countRegisterTries <= 3 && isWaiting" v-model:isActive="isWaiting" />

            <span :class="{
              disable: requestDataPhone.countRegisterTries > 3 || isWaiting,
            }" class="re-send" @click="
                requestDataPhone.countRegisterTries <= 3 && !isWaiting
                  ? callApiChangePhone()
                  : {}
                ">
              إعادة إرسال
            </span>
          </template>
        </div>
      </lazy-prime-dialog>
    </vee-validate-provider>
  </div>
</template>

<script lang="ts">
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { scrollToTopUtil, sleepUtil } from '~/main/utils/shared-utils';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import {
  applicantCityTypeEnum,
  applicantTypeEnum,
  gradesListEnum,
  PartnerShipFormTypesEnum,
  teacherQodoratTypeEnum,
} from '~/main/constants/partnership-form-types.enum';
import type { AxiosResponse } from 'axios';
import { Form as VeeForm } from 'vee-validate';
import type { PhoneInput } from '#components';
const codeInputRef = ref<InstanceType<typeof import('~/components/shared/forms/code-input.vue')['default']> | null>(null);

const defaultValues = {
  firstName: null as string | null,
  lastname: null as string | null,
  email: null as string | null,
  phoneNumber: null as string | null,
  schoolName: null as string | null,
  grade: null as string | null,
  city: null as string | null,
  teacherQodoratType: null as string | null,
  applicantType: null as string | null,
};

const labelTypes = {
  school: 'الشراكة مع المدارس',
  student: 'الشراكة مع الطلاب',
  teacher: 'الشراكة مع المدربين',
};

export default {
  components: {
    VeeForm,
  },
  props: {
    selectedType: null,
  },
  setup() {
    const fromRef = useTemplateRef<InstanceType<typeof VeeForm>>('form_ref');
    const phoneInputRef =
      useTemplateRef<InstanceType<typeof PhoneInput>>('phone_input_ref');
    return {
      ...useSetupAuth(),
      ...useSetupRoute(),
      ...useToastMessage(),
      fromRef,
      phoneInputRef,
    };
  },
  data() {
    return {
      process: false,
      labelTypes: labelTypes,
      form: { ...defaultValues },
      isSaving: false,
      openMailModal: false,
      openPhoneModal: false,
      phoneInputKey: 0,
      processing: false,
      isWaiting: false,
      wrongCode: false,
      checkPhoneError: false,
      requestDataPhone: null as any | null,
      requestData: null as any | null,
    };
  },

  computed: {
    PartnerShipFormTypesEnum() {
      return PartnerShipFormTypesEnum;
    },
    gradesList() {
      return gradesListEnum.slice(-3);
    },

    teacherQodoratType() {
      return teacherQodoratTypeEnum;
    },

    applicantType() {
      return applicantTypeEnum;
    },

    applicantCityType() {
      return applicantCityTypeEnum;
    },

    isPhoneConfirmed() {
      if (this.appAuth.loggedIn) {
        return this.form.phoneNumber == this.appAuth.user.phoneNumber;
      }
      return true;
    },

    isMailConfirmed() {
      if (this.appAuth.loggedIn) {
        return this.form.email === this.appAuth.user.email;
      }
      return true;
    },
  },

  created() {
    if (this.appAuth.loggedIn) {
      this.fillForm();
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (import.meta.client) {
        scrollToTopUtil('scroll-page');
        document.getElementById('firstName')?.focus();
      }
    });
  },

  methods: {
    toMain() {
      this.appRouter.push('/partnerships');
    },
    fillForm() {
      if (this.appAuth.user.email) {
        this.form.email = this.appAuth.user.email;
      }
      if (this.appAuth.user.phoneNumber) {
        this.form.phoneNumber = this.appAuth.user.phoneNumber;
      }
      /*if (this.selectedType == formTypes.teacher) {
        if (this.appAuth.user.email) {
          this.form.email = this.appAuth.user.email;
        }
      }
      else {if (this.appAuth.user.phoneNumber) {
          this.form.phoneNumber = this.appAuth.user.phoneNumber;
        }}*/
    },

    checkEmailOrPhone() {
      if (
        this.form.email === this.appAuth.user.email &&
        this.form.phoneNumber === this.appAuth.user.phoneNumber
      ) {
        this.sendForm();
        return;
      }
      if (this.form.email != this.appAuth.user.email) {
        this.callApiChangeEmail();
        return;
      }
      if (this.form.phoneNumber != this.appAuth.user.phoneNumber) {
        this.callApiChangePhone();
      }

      /*if (this.selectedType === formTypes.teacher) {
        if (this.form.email === this.appAuth.user.email) {
          this.sendForm();
          return;
        }
        this.callApiChangeEmail();
      } else {
        if (this.form.phoneNumber === this.appAuth.user.phoneNumber) {
          this.sendForm();
          return;
        }
        this.callApiChangePhone();
      }*/
    },

    editPhone() {
      this.openPhoneModal = true;
    },

    editMail() {
      this.openMailModal = true;
    },

    closeMailModal() {
      this.openMailModal = false;
      this.wrongCode = false;
    },

    closePhoneModal() {
      this.openPhoneModal = false;
      this.wrongCode = false;
    },

    async checkDataForSend() {
      const { valid } = await this.fromRef!.validate();
      if (valid) {
        if (this.appAuth.loggedIn) {
          this.checkEmailOrPhone();
          return;
        }
        this.sendForm();
      } else {
        await this.phoneInputRef!.validatePhone();
      }
    },

    sendForm() {
      try {
        this.isSaving = true;
        this.$axios
          .post(`partnershipApplicant`, this.form)
          .then(() => {
            this.resetForm();
            this.fromRef!.resetForm();
            document.getElementById('firstName')?.focus();
            this.isSaving = false;
            this.showSuccess({
              life: 3500,
              summary: 'تهانينا ... تم تقديم طلبك بنجاح',
            });
          })
          .catch((err) => {
            console.log('partnershipApplicant err:' + err);
            this.isSaving = false;
            // this.showError();
          });
      } catch (e) {
        console.log('partnershipApplicant err:' + e);
        this.isSaving = false;
        // this.showError();
        throw e;
      }
    },

    callApiChangeEmail() {
      this.processing = true;
      this.isWaiting = true;
      codeInputRef.value?.reset();
      this.$axios
        .post(`/identity/requestChangeEmail`, {
          email: this.form.email,
        })
        .then(({ data: response }) => {
          this.processing = false;
          if (response.success) {
            this.requestData = response;
            this.editMail();
          } else {
            if (response.countRegisterTries > 3) {
              this.showError({
                summary:
                  'لقد تجاوزت عدد المحاولات المسموح به ... يرجى المحاولة لاحقاً',
              });
            }
          }
        })
        .catch((error) => {
          this.processing = false;
          if (error.response?.status == 400) {
            this.showError({
              life: 3000,
              summary: 'فشل العملية',
              detail: error.response.data.errors['Email'],
            });
          } else {
            this.showError();
          }
        });
    },

    callApiChangePhone() {
      this.processing = true;
      this.isWaiting = true;
      codeInputRef.value?.reset();
      this.$axios
        .post(`/identity/requestChangePhone`, {
          phone: this.form.phoneNumber,
        })
        .then(async (response) => {
          this.requestDataPhone = response.data;
          this.processing = false;
          if (this.requestDataPhone.success) {
            this.editPhone();
            this.checkPhoneError = false;
          } else {
            if (this.requestDataPhone.countRegisterTries > 3) {
              this.showError({
                summary:
                  'لقد تجاوزت عدد المحاولات المسموح به ... يرجى المحاولة لاحقاً',
              });
            }
          }
        })
        .catch((error) => {
          this.processing = false;
          if (error.response?.status == 400 || error.response?.status == 403) {
            this.checkPhoneError = true;
            this.showError({
              summary: 'رسالة فشل',
              detail: 'هذا الرقم موجود سابقاً أرجو إدخال رقم آخر.',
            });
          }
        });
    },

    async resetForm() {
      this.form = { ...defaultValues };
      if (this.appAuth.loggedIn) {
        await sleepUtil(100);
        this.fillForm();
      }
      this.phoneInputKey++;
      this.fromRef!.resetForm();
    },

    async sendCode(code) {
      try {
        this.process = true;
        const codeForm = {
          method: this.openMailModal
            ? this.requestData.method
            : this.requestDataPhone.method,
          code: code,
          userId: this.openMailModal
            ? this.requestData.id
            : this.requestDataPhone.id,
        };
        let res: AxiosResponse;
        if (this.openMailModal) {
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
          this.process = false;
          await this.appAuth.fetchUser();
          if (this.openMailModal) {
            this.form.email = this.appAuth.user.email;
          } else {
            this.form.phoneNumber = this.appAuth.user.phoneNumber;
          }

          this.openPhoneModal = false;
          this.openMailModal = false;
          this.showSuccess({
            life: 1500,
            summary: 'تم التحقق من الكود بنجاح',
          });
          this.checkDataForSend();
        } else {
          this.process = false;
          this.wrongCode = true;
        }
      } catch (e) {
        console.log(e);
        this.process = false;
        this.wrongCode = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.partnerships-shared-form {
  .c-back-mobile {
    display: grid;
    align-items: center;
    justify-content: flex-start;
    row-gap: 15px;

    @include outline-btn(var(--purple-8c)) {
      height: auto !important;
      width: auto !important;
      border: none !important;
      outline: none !important;
      display: grid;
      box-shadow: none !important;
      grid-auto-flow: column;
      align-items: center;
      justify-content: center;
      column-gap: 5.5px;
      padding: 0;

      span {
        font-size: 16px;
        color: var(--purple-8c);
      }

      img {
        width: 19px;
      }
    }

    .__label {
      font-size: 24px;
      font-weight: bold;
      color: var(--purple-8c);
    }
  }

  .register-form {
    display: grid;
    grid-template-columns: 330px;
    justify-content: center;
    width: 100%;
    margin: 25px auto;

    @media (max-width: 345px) {
      grid-template-columns: 97vw;
    }

    .rt-c {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;

      h1 {
        font-weight: bold;
        font-size: 24px;
        color: var(--purple-8c);
        margin-bottom: 20px;
        margin-top: 16px;
      }

      &__form {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 25px;

        .phone-input {
          width: 100%;
        }

        ::v-deep {
          .a-input-group {
            margin-bottom: 0;
          }

          .a-custom-input {
            width: 100%;
          }

          .a-custom-input .a-input-group .a-input-wrapper input {
            height: 45px;
            border: 0.75px solid #d6d6d6;
            border-radius: 8px;
          }

          .a-custom-input .a-input-group .a-input-label label,
          .a-form-select-label {
            font-weight: normal;
            margin-bottom: 8px;
            font-size: 16px;
          }

          .a-form-select {
            margin-bottom: 0;

            .vue-treeselect__menu-container {
              top: 92%;

              .vue-treeselect__menu {
                padding-top: 10px;
                border: 0.75px solid #d6d6d6;
                border-top: none;
                //border-radius: 0 8px 8px 0;
              }
            }

            .vue-treeselect__control {
              border: 0.75px solid #d6d6d6;
              border-radius: 8px;
              height: 45px;
              padding: 10px;
            }

            .vue-treeselect__x-container,
            .vue-treeselect__control-arrow-container {
              vertical-align: middle;
            }
          }

          .app-button {
            height: 45px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
@use '@/assets/scss/mixin' as *;

#modal-edit-mail,
#modal-edit-phone {
  --p-dialog-content-padding: 10px;

  height: 430px;
  width: 360px;

  .code-part {
    display: grid;
    justify-content: center;

    .t-1 {
      font-size: 24px;
      font-weight: bold;
      color: var(--purple-8c);
      text-align: center;
    }

    .t-2 {
      margin-top: 35px;
      font-size: 16px;
      font-weight: 500;
      color: var(--gray-63);
      text-align: center;
    }

    .t-3 {
      margin-top: 6px;
      font-size: 16px;
      font-weight: 500;
      color: var(--purple-8c);
      text-align: center;
    }

    .t-code-input {
      margin-top: 30px;
    }

    .tries-limit {
      font-size: 16px;
      color: var(--gray-63);
      opacity: 0.75;
      margin-top: 15px;
    }

    .note-spam {
      font-size: 16px;
      color: var(--gray-63);
      opacity: 0.75;
      margin-top: 15px;
    }

    .re-send {
      margin-top: 15px;
      text-align: center;
      font-size: 14px;
      color: var(--purple-8c);
      text-decoration-line: underline;
      cursor: pointer;

      &.disable {
        opacity: 0.5;
        pointer-events: none;
      }
    }
  }

  .fa-close {
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 14px;
    cursor: pointer;
    color: var(--purple-8d);
  }

  .next-btn {
    text-align: end;

    @include normal-btn(white) {
      width: 90px;
      height: 39px;
    }
  }

  .code-part {
    .code-title {
      font-size: 20px;
      margin-bottom: 15px;
    }

    &.wrong-code {
      ::v-deep .vue-pincode-input {
        box-shadow: 0 0 3px rgb(255 0 0);
      }
    }

    .wrong-code {
      margin-top: 15px;
      font-size: 12px;
      color: var(--red-63);
      text-align: center;
    }
  }
}
</style>
