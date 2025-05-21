<template>
  <div class="login-part">
    <lazy-vee-validate-provider>
      <vee-form
        v-if="showContent"
        ref="login_form"
        class="login-form relative"
      >
        <lazy-app-overlay v-if="isSaving" />
        <div :class="`a-login-form`">
          <form-input
            v-model:inputValue="form.userName"
            inputTabIndex="1"
            label="اسم المستخدم"
            inputId="userName"
            :rules="{ required: true }"
          />
          <div @keypress="sendOnEnter($event)">
            <form-input
              v-model:inputValue="form.password"
              inputTabIndex="2"
              inputId="password"
              inputType="password"
              :rules="{
                required: true,
                regex: /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/,
              }"
              label="كلمة المرور"
            />
          </div>

          <div class="forget-password">
            <nuxt-link
              :to="webAuthForgetPassword()"
              tabindex="6"
            >
              هل نسيت كلمة المرور؟
            </nuxt-link>
          </div>

          <app-button
            label="تسجيل الدخول"
            tabindex="3"
            @click="sendForm"
          />
        </div>
      </vee-form>
    </lazy-vee-validate-provider>
    <check-admin-modal @onSuccess="successCheck" />
  </div>
</template>

<script lang="ts">
import { useLocalStorageStore } from '~/main/useLocalStorageStore';
import { IS_PRODUCTION_APP } from '~/main/utils/shared-utils';
import { loginForm } from '~/core/auth/auth-ui.model';
import { Form as VeeForm } from 'vee-validate';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { authEvents } from '~/core/auth/data-access/services/useAuthEvents';
import { useAuthState } from '#imports';
import { webAuthForgetPassword } from '~/main/utils/web-routes.utils';

export default {
  components: {
    VeeForm,
  },
  setup() {
    const localStorageStore = useLocalStorageStore();
    const showContent = ref(false);
    const authStore = useAuthStore();
    onMounted(() => {
      if (localStorageStore.getIsAuthenticatedAdmin() || !IS_PRODUCTION_APP) {
        showContent.value = true;
      }
    });

    const formRef = useTemplateRef<InstanceType<typeof VeeForm>>('login_form');

    definePageMeta({
      layout: 'website-layout',
    });
    return {
      showContent,
      ...useToastMessage(),
      ...useSetupRoute(),
      authState: useAuthState(),
      formRef,
      authStore,
    };
  },
  data() {
    return {
      form: new loginForm(),
      passEntered: false,
      isSaving: false,
    };
  },

  methods: {
    webAuthForgetPassword,
    async sendForm() {
      try {
        const { valid } = await this.formRef!.validate();
        if (valid) {
          this.isSaving = true;
          await this.authStore.loginLocal(
            {
              username: this.form.userName!,
              password: this.form.password!,
            },
            { redirect: false }
          );
          this.showSuccess({ summary: 'تمت عملية التسجيل بنجاح' });
          this.isSaving = false;

          authEvents.emitSignIn({
            id: this.authStore.state.userData!.id,
            email: this.authStore.state.userData!.email,
            refreshToken: this.authState.refreshToken.value,
            showWelcomeModal: false,
            token: this.authState.rawToken.value!,
          });
        } else {
          this.passEntered = true;
        }
      } catch (e) {
        this.isSaving = false;
        throw e;
      }
    },
    async sendOnEnter($event) {
      if ($event.key == 'Enter') {
        await this.sendForm();
      }
    },

    successCheck() {
      this.showContent = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.login-part {
  width: 360px;
  margin-left: auto;
  margin-right: auto;
  max-width: 98vw;
  margin-bottom: 133px;
  .login-form {
    margin-top: 25px;
    width: 100%;

    .a-login-form {
      display: grid;
      width: 100%;
      row-gap: 25px;

      ::v-deep .a-input-group {
        margin-bottom: 0;

        .a-input-label {
          label {
            font-size: 16px;
            color: #252525;
            font-weight: normal;
          }
        }

        .a-input-wrapper {
          input {
            height: 45px;
            border: 0.75px solid #70707080;
            border-radius: 8px;

            &::placeholder {
              color: #252525;
              opacity: 0.5;
            }
          }
        }
      }

      .forget-password {
        position: relative;
        margin-top: -11px;
        font-size: 14px;
        color: var(--purple-8c);
        text-decoration: underline;
      }

      .login-btn {
        height: 45px;
        width: 100%;
        background: var(--purple-8c);
        color: white;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        border-radius: 10px;
      }
    }
  }
}
</style>
