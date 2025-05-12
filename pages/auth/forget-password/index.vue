<template>
  <div class="forget-password-page">
    <lazy-vee-validate-provider>
      <template v-if="showContent">
        <div class="content-part">
          <p class="title">إعادة تعيين كلمة المرور</p>

          <div class="steppers">
            <div
              v-for="(step, index) of Array(3)"
              :key="index"
              class="step"
            >
              <div
                class="step-num"
                :class="{ active: activeStep >= index + 1 }"
              >
                {{ index + 1 }}
              </div>
              <div
                v-if="index < 2"
                class="step-line"
                :class="{ active: activeStep > index + 1 }"
              ></div>
            </div>
          </div>

          <div v-if="activeStep == 1">
            <div class="e-title">
              <h3><span>معلومات الحساب</span></h3>
            </div>
            <vee-form
              ref="step1_form_ref"
              class="step1-form"
            >
              <form-radio
                v-model:selected="step1Form.method"
                class="radio-list"
                :options="[
                  { id: 1, label: 'واتس اب' },
                  { id: 0, label: 'البريد الالكتروني' },
                ]"
                groupName="mediaType"
                :gap="66"
              />

              <template v-if="step1Form.method == 1">
                <phone-input @onInputPhone="(val) => (step1Form.phone = val)" />
              </template>

              <template v-else>
                <form-input
                  v-model:inputValue="step1Form.email"
                  inputId="email"
                  :rules="{ required: true, email: true }"
                  label="البريد الالكتروني"
                />
              </template>

              <app-button
                label="إرسال"
                variant="flat"
                @click="sendStep1"
              />
            </vee-form>
          </div>

          <div
            v-if="activeStep == 2"
            class="code-part"
            :class="{ 'wrong-code': wrongCode }"
          >
            <div class="e-title">
              <h3><span>كود التفعيل</span></h3>
            </div>
            <p class="code-title">يرجى إدخال كود التأكيد</p>
            <div class="relative w-full">
              <lazy-app-overlay v-if="processCode" />
              <code-input
                :fields="4"
                :fieldWidth="56"
                :fieldHeight="56"
                :required="true"
                style="direction: ltr"
                @complete="sendStep2"
              />
            </div>
            <p
              v-if="wrongCode"
              class="wrong-code"
            >
              الكود غير صحيح يرجي التحقق
            </p>
          </div>

          <div v-if="activeStep == 3">
            <div class="e-title">
              <h3><span>تعيين كلمة المرور</span></h3>
            </div>
            <vee-form
              ref="step3_form_ref"
              class="step3-form relative"
            >
              <lazy-app-overlay v-if="processCode" />
              <form-input
                v-model:inputValue="step3Form.password"
                :inputId="'password'"
                inputType="password"
                :rules="{
                  required: true,
                  regex: /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/,
                }"
                :label="'كلمة المرور'"
              />

              <form-input
                v-model:inputValue="confirmPassword"
                inputId="confirmPassword"
                inputType="password"
                :rules="{ required: true, confirmed: 'password' }"
                label="تأكيد كلمة المرور"
              />

              <app-button
                label="إرسال"
                @click="sendStep3"
              />
            </vee-form>
          </div>
        </div>

        <div class="logo-part">
          <p class="title-1">مرحبا بكم في</p>
          <p class="title-2">امتحانكم</p>
          <p class="title-3">تعلم بذكاء</p>
          <div class="logo">
            <img
              src="/images/png/collection/login_logo.webp"
              alt=""
            />
          </div>
          <p class="copyRight">© Copyright 2022. By امتحانكوم</p>
        </div>
      </template>
    </lazy-vee-validate-provider>
    <check-admin-modal @onSuccess="successCheck" />
  </div>
</template>
<script lang="ts">
import { useLocalStorageStore } from '~/main/useLocalStorageStore';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { webAuthSignup } from '~/main/utils/web-routes.utils';
import { Form as VeeForm } from 'vee-validate';
import FormRadio from '~/components/shared/forms/form-radio.vue';

export default {
  components: {
    FormRadio,
    VeeForm,
  },
  setup() {
    const localStorageStore = useLocalStorageStore();
    const step1FormRef =
      useTemplateRef<InstanceType<typeof VeeForm>>('step1_form_ref');
    const step3FormRef =
      useTemplateRef<InstanceType<typeof VeeForm>>('step3_form_ref');

    const showContent = ref(false);
    onMounted(() => {
      if (localStorageStore.getIsAuthenticatedAdmin()) {
        showContent.value = true;
      }
    });

    definePageMeta({
      layout: 'auth-layout',
    });
    return {
      step1FormRef,
      step3FormRef,
      showContent,
      ...useToastMessage(),
      ...useSetupRoute(),
    };
  },
  data() {
    return {
      step1Form: {
        method: 0,
        email: null as string | null,
        phone: null as string | null,
      },
      step2Form: {
        method: 1,
        email: null as string | null,
        phone: null as string | null,
        code: null,
      },
      step3Form: {
        token: null,
        userId: null,
        password: null,
      },
      confirmPassword: null,
      wrongCode: false,
      processCode: false,
      activeStep: 1,
    };
  },

  methods: {
    successCheck() {
      this.showContent = true;
    },
    async sendStep1() {
      try {
        const { valid } = await this.step1FormRef!.validate();
        if (valid) {
          if (this.step1Form.method == 0) {
            this.step1Form.phone = null;
          } else {
            this.step1Form.email = null;
          }
          await this.$axios
            .post(`/identity/forgetPassword`, this.step1Form)
            .then(({ data: res }) => {
              if (res.success) {
                this.step1FormRef?.resetForm();
                this.activeStep = 2;
              } else {
                this.showError();
              }
            })
            .catch((e) => {
              this.showError({
                detail:
                  e.response.data.errors?.Phone ||
                  e.response.data.errors?.Email,
              });
            });
        }
      } catch (e) {
        this.showError();
      }
    },

    async sendStep2(code) {
      try {
        this.processCode = true;
        this.step2Form = {
          method: this.step1Form.method,
          code: code,
          email: this.step1Form.method == 0 ? this.step1Form.email : null,
          phone: this.step1Form.method == 1 ? this.step1Form.phone : null,
        };
        const { data: res } = await this.$axios.post(
          `/identity/confirmForgetPassword`,
          this.step2Form
        );
        if (res.success) {
          this.step3Form.token = res.token;
          this.step3Form.userId = res.id;
          this.processCode = false;
          this.activeStep = 3;
        } else {
          this.processCode = false;
          this.wrongCode = true;
        }
      } catch (e) {
        this.processCode = false;
        this.wrongCode = true;
      }
    },

    async sendStep3() {
      try {
        const { valid } = await this.step3FormRef!.validate();
        if (valid) {
          const { data: res } = await this.$axios.post(
            `/identity/setPassword`,
            this.step3Form
          );
          if (res.response) {
            this.showSuccess();
            this.step3FormRef?.resetForm();
            setTimeout(() => {
              this.appRouter.push(webAuthSignup());
            }, 1000);
          } else {
            this.showError();
          }
        }
      } catch (e) {
        this.showError();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.forget-password-page {
  height: 100%;
  display: grid;
  @include ipad-up() {
    grid-template-columns: repeat(2, 1fr);
  }

  .steppers {
    margin-top: 30px;
    display: flex;
    align-content: center;
    justify-content: center;
    .step {
      display: grid;
      align-items: center;
      &:not(:last-child) {
        grid-template-columns: 40px 0.9fr;
        width: 33%;
      }
      .step-num {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--gray-91);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 20px;
        &.active {
          color: var(--purple-8d);
          border-color: var(--purple-8d);
          font-weight: bold;
        }
      }
      .step-line {
        margin-inline-start: 5px;
        margin-inline-end: 5px;
        width: 100%;
        border-bottom: 1px solid var(--gray-f5);
        &.active {
          border-color: var(--purple-8d);
        }
      }
    }
  }

  .logo-part {
    text-align: center;
    background: #ffcfcc;
    @include tablet-down() {
      display: none;
    }
    .title-1 {
      font-size: 55px;
      color: var(--purple-8d);
      font-weight: bold;
      margin-top: 52px;
      margin-bottom: 0;
      text-align: center;
    }
    .title-2 {
      font-size: 40px;
      color: var(--red-63);
      font-weight: bold;
      margin-top: 5px;
      margin-bottom: 0;
      text-align: center;
    }
    .title-3 {
      font-size: 45px;
      color: var(--purple-8d);
      margin-top: 5px;
      opacity: 60%;
      margin-bottom: 0;
      text-align: center;
    }
    .logo {
      margin-top: 45px;
    }
    .copyRight {
      margin-top: 45px;
      font-size: 16px;
      font-weight: bold;
      color: var(--purple-8d);
      direction: ltr;
      text-align: center;
    }
  }

  .content-part {
    text-align: center;
    width: 420px;
    margin: auto;
    .title {
      margin-top: 100px;
      margin-bottom: 0;
      font-size: 36px;
      font-weight: bold;
      color: var(--text-4d);
    }

    .e-title {
      margin-top: 44px;
      h3 {
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #00000033;
        line-height: 0.1em;
        margin: 10px 0 44px;
        span {
          background: #fff;
          color: var(--dark-2b);
          font-size: 14px;
          font-weight: bold;
          padding: 0 10px;
        }
      }
    }

    ::v-deep .a-input-group {
      margin-bottom: 46px;

      .a-input-label {
        label {
          color: #1e1e1e;
          font-size: 16px;
        }
      }

      .a-input-wrapper {
        input {
          height: 48px;
          border-color: #c1c1c1;
          border-radius: 8px;
        }
      }
    }

    .forget-password {
      position: relative;
      text-align: left;
      margin-bottom: -24px;
      margin-left: 15px;
    }

    .login-btn {
      margin-top: 25px;
      height: 48px;
      width: 100%;
      background: var(--purple-8d);
      color: white;
      font-size: 16px;
      text-align: center;
      border-radius: 8px;
      box-shadow: 0px 1px 3px #00000026;
      border: 1px solid #00000033;
    }

    .radio-list {
      justify-content: center;
      margin: 25px 0;
    }

    .code-part {
      .code-title {
        font-size: 20px;
        margin-bottom: 15px;
        text-align: center;
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

    @include mobile-down() {
      max-width: 95vw;
      width: 420px;
      .title {
        margin-top: 40px;
        font-size: 20px;
        text-align: center;
      }
    }
  }
}
</style>
