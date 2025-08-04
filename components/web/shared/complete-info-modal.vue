<template>
  <lazy-prime-dialog
    :visible="isOpenModal"
    :modal="true"
    :showHeader="false"
    :closable="true"
    :dismissableMask="false"
    class="complete-info-modal"
    @afterHide="closeModal()"
  >
    <lazy-vee-validate-provider>
      <i
        class="fa fa-times"
        @click="closeModal"
      ></i>
      <div class="steps">
        <vee-form
          ref="form_ref"
          class="complete-info-form w-full"
        >
          <template v-if="activeStep === 1">
            <span class="__text1">يرجى استكمال المعلومات الخاصة بكم</span>
            <span class="__text2">قبل الانتقال لعملية الدفع</span>
            <form-input
              v-if="!hasFirstName"
              v-model:inputValue="form.firstName"
              inputTabIndex="1"
              label="الاسم الأول"
              :inputId="'firstName'"
              :rules="{ required: true }"
            />

            <form-input
              v-if="!hasLastName"
              v-model:inputValue="form.lastName"
              inputTabIndex="2"
              label="الاسم الأخير"
              :inputId="'lastName'"
              :rules="{ required: true }"
            />

            <form-input
              v-if="!hasEmail"
              v-model:inputValue="email"
              :inputId="'email'"
              :rules="{ required: true, email: true }"
              :label="'البريد الالكتروني'"
            />

            <span
              v-if="!hasEmail && countRegisterTriesEmail > 3"
              class="__triesNote __red"
            >
              لقد استنفذت عدد المحاولات المسموح بها لإرسال الكود يرجى إعادة
              المحاولة بعد مرور 8 ساعات
            </span>
          </template>

          <template v-if="activeStep === 2">
            <div class="co-code">
              <span class="__text4">
                سيتم إرسال رسالة تحقق إلى بريدك الإلكتروني
              </span>
              <span class="__text5">التحقق من البريد الإلكتروني</span>
              <div class="cl-mail">
                <a
                  class="mail"
                  @click="activeStep = 1"
                >
                  {{ email }}
                </a>
              </div>
              <div
                class="code-part relative"
                :class="{ 'wrong-code': wrongCode }"
              >
                <app-overlay v-if="processCode" />
                <code-input
                  ref="code-input"
                  className="w-full"
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
                تحقق من البريد العشوائي في حال لم تجد الرسالة
              </span>
              <timer-active
                v-if="countRegisterTriesEmail <= 3 && isWaiting"
                v-model:isActive="isWaiting"
              />
              <span
                v-if="countRegisterTriesEmail > 3"
                class="__triesNote __red"
              >
                لقد استنفذت عدد المحاولات المسموح بها لإرسال الكود يرجى إعادة
                المحاولة بعد مرور 8 ساعات
              </span>
              <span
                :class="{ disabled: countRegisterTriesEmail > 3 || isWaiting }"
                class="resend"
                @click="
                  countRegisterTriesEmail <= 3 && !isWaiting
                    ? requestChangeMail
                    : {}
                "
              >
                إعادة إرسال
              </span>
            </div>
          </template>

          <app-button
            v-if="activeStep == 1"
            :disabled="!hasEmail && countRegisterTriesEmail > 3"
            class="next-btn"
            :label="btnText"
            @click="sendInfo"
          />
        </vee-form>
      </div>
    </lazy-vee-validate-provider>
  </lazy-prime-dialog>
</template>

<script lang="ts">
import { Form as VeeForm } from 'vee-validate';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { sleepUtil } from '~/main/utils/shared-utils';

const errTypes = {
  isExist: 1,
  domain: 2,
  tries: 3,
};

export default {
  components: {
    VeeForm,
  },

  props: {
    isOpenModal: Boolean,
  },
  emits: ['onCompleteInfo', 'update:isOpenModal'],
  setup() {
    const formRef = useTemplateRef<InstanceType<typeof VeeForm>>('form_ref');
    return {
      ...useSetupAuth(),
      ...useToastMessage(),
      formRef,
    };
  },
  data() {
    return {
      activeStep: 1,
      email: null,
      form: {
        firstName: null as string | null,
        lastName: null as string | null,
      },
      countRegisterTriesEmail: 0,
      errType: null,
      processCode: false,
      wrongCode: false,
      isWaiting: false,
    };
  },

  computed: {
    hasFirstName() {
      return this.appAuth.user.firstName;
    },
    hasLastName() {
      return this.appAuth.user.lastName;
    },
    hasEmail() {
      return this.appAuth.user.email;
    },

    btnText() {
      if (!this.hasEmail && this.activeStep === 1) {
        return 'التالي';
      }
      return 'إرسال المعلومات';
    },
  },

  mounted() {
    this.form.firstName = this.appAuth.user.firstName;
    this.form.lastName = this.appAuth.user.lastName;
  },

  methods: {
    closeModal() {
      this.$emit('update:isOpenModal', false);
    },

    async sendInfo() {
      const { valid } = await this.formRef!.validate();
      if (valid) {
        if (!this.hasEmail) {
          this.requestChangeMail();
          return;
        }
        this.updateProfile();
      }
    },

    async updateProfile() {
      try {
        this.$axios
          .put(`/profile`, this.form)
          .then(async ({ data: res }) => {
            if (res) {
              await this.appAuth.fetchUser();
              await sleepUtil(800);
              this.$emit('onCompleteInfo');
              return true;
            }
          })
          .catch((e) => {
            this.showError({ summary: 'حدث خطأ في تحديث المعلومات الشخصية' });
            return false;
          });
      } catch (e) {
        this.showError({ summary: 'حدث خطأ في تحديث المعلومات الشخصية' });
        console.log('updateProfile: ' + e);
        return false;
      }
    },

    requestChangeMail() {
      this.isWaiting = true;
      this.$axios
        .post(`/identity/requestChangeEmail`, { email: this.email })
        .then(({ data: res }) => {
          this.countRegisterTriesEmail = res.countRegisterTries;
          if (res.success && res.countRegisterTries < 4) {
            this.activeStep = 2;
          }
        })
        .catch((error) => {
          if (error.response?.status == 400) {
            this.showError({
              life: 3000,
              summary: 'فشل العملية',
              detail: "error.response.data.errors['Email']",
            });
            if (
              error.response.data.errors['Email'] == 'هذا الإيميل موجود مسبقاً'
            ) {
              this.countRegisterTriesEmail = 0;
            }
          } else {
            this.showError();
          }
        });
    },

    async sendCode(code) {
      try {
        this.wrongCode = false;
        this.processCode = true;
        const codeForm = {
          method: 0,
          code: code,
          userId: this.appAuth.user.id,
        };
        const { data: res } = await this.$axios.post(
          `/identity/confirmChangeEmail`,
          codeForm
        );
        if (res) {
          await this.updateProfile();
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

.complete-info-modal {
  background-color: var(--modal-bg);
  width: 360px !important;
  min-height: 360px;
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
    .complete-info-form {
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
