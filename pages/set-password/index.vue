<template>
  <div class="set-password-page">
    <template v-if="isLoadingPage">
      <app-spinner :isAbsolute="true" />
    </template>
    <template v-else>
      <lazy-vee-validate-provider>
        <div class="content-part">
          <p class="title">تعيين كلمة المرور</p>
          <div class="e-title">
            <h3><span>تعيين كلمة المرور</span></h3>
          </div>
          <template v-if="isAvailable">
            <vee-form
              ref="form_ref"
              class="w-full relative"
            >
              <app-overlay v-if="$store.state.admin.fetching.setPassword" />
              <div :class="`a-password-form`">
                <form-input
                  v-model:inputValue="form.password"
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
                  :inputId="'confirmPassword'"
                  inputType="password"
                  :rules="{ required: true, confirmed: 'password' }"
                  :label="'تأكيد كلمة المرور'"
                />

                <app-button
                  class="!mt-3"
                  size="md"
                  label="إرسال"
                  tabindex="3"
                  @click="sendForm"
                />
              </div>
            </vee-form>
          </template>

          <div
            v-else
            class="fp-part"
          >
            <p class="fp-title">
              عذراً الرابط هذا تم استخدامه سابقاً ولم يعد صالحاً
            </p>
            <p class="fp-link">
              يمكن وضع أو تعديل كلمة المرور عبر:
              <span @click="goForgetPassword">نسيت كلمة المرور</span>
            </p>

            <nuxt-link
              :to="webHomePathUtil()"
              tabindex="5"
            >
              الذهاب إلى الصفحة الرئيسية
            </nuxt-link>
          </div>

          <div class="policy-link">
            <nuxt-link
              :to="webPrivacyPathUtil()"
              tabindex="5"
            >
              سياسة الخصوصية
            </nuxt-link>
          </div>
        </div>

        <div class="logo-part">
          <p class="title-1">مرحبا بكم في</p>
          <p class="title-2">اختبارات</p>
          <p class="title-3">تعلم بذكاء</p>
          <div class="logo">
            <img
              src="/images/png/collection/login_logo.webp"
              alt=""
            />
          </div>
          <p class="copyRight">© Copyright 2022. By اختبارات</p>
        </div>
      </lazy-vee-validate-provider>
    </template>
  </div>
</template>
<script lang="ts">
import { Form as VeeForm } from 'vee-validate';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import {
  webAuthForgetPassword,
  webHomePathUtil,
  webPrivacyPathUtil,
} from '~/main/utils/web-routes.utils';

export default {
  components: {
    VeeForm,
  },
  setup() {
    const formRef = useTemplateRef<InstanceType<typeof VeeForm>>('form_ref');
    definePageMeta({
      layout: 'auth-layout',
    });
    return {
      ...useToastMessage(),
      ...useSetupAuth(),
      ...useSetupRoute(),
      authStore: useAuthStore(),
      formRef,
    };
  },

  data() {
    return {
      isLoadingPage: true,
      form: {
        token: null,
        userId: null,
        password: null,
      },
      confirmPassword: null,
      userId: null as any | null,
      token: null as any | null,
      isAvailable: false,
    };
  },

  mounted() {
    this.initPage();
  },

  methods: {
    webPrivacyPathUtil,
    webHomePathUtil,
    async initPage() {
      try {
        this.isLoadingPage = true;
        const query = this.appRoute.query;
        const code = query?.code;
        if (!code) {
          return navigateTo(webHomePathUtil());
        }
        // const res = {
        //   isAvailable: true,
        //   userId: 1,
        //   token: 'test',
        // };
        const { data: res } = await this.$axios.post(
          `/identity/checkThirdPartyCode`,
          {
            code: query.code,
          }
        );
        if (res && res.isAvailable) {
          this.userId = res.userId;
          this.token = res.token;
          this.isAvailable = res.isAvailable;

          if (this.isAvailable) {
            this.form.token = this.token;
            this.form.userId = this.userId;
          }

          this.isLoadingPage = false;
        } else {
          return navigateTo(webHomePathUtil());
        }
      } catch (e) {
        return navigateTo(webHomePathUtil());
      }
    },
    async sendForm() {
      try {
        const { valid } = await this.formRef!.validate();
        if (valid) {
          const { data: res } = await this.$axios.post(
            `/identity/setPassword`,
            this.form
          );
          if (res.response) {
            this.showSuccess();
            this.formRef!.resetForm();
            setTimeout(() => {
              this.appRouter.push('/');
            }, 1000);
          } else {
            this.showError();
          }
        }
      } catch (e) {
        this.showError();
      }
    },

    async goForgetPassword() {
      if (this.appAuth.loggedIn) {
        await this.authStore.logout({ redirect: false });
      }
      await this.appRouter.push(webAuthForgetPassword());
    },
  },
};
</script>
<style lang="scss">
@import '@/assets/scss/mixin';

.set-password-page {
  height: 100%;
  display: grid;
  @include ipad-up() {
    grid-template-columns: repeat(2, 1fr);
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
    @include mobile-down() {
      width: 95%;
    }
    .title {
      margin-top: 100px;
      margin-bottom: 0;
      font-size: 36px;
      font-weight: bold;
      color: var(--text-4d);
      text-align: center;
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

    .fp-part {
      margin-top: 42%;
      margin-bottom: 35%;

      .fp-title {
        color: var(--red-63);
        font-size: 16px;
        font-weight: bold;
      }

      .fp-link {
        font-size: 16px;

        span {
          font-weight: bold;
          cursor: pointer;
          color: var(--blue-f7);
        }
      }
    }

    .a-password-form {
    }

    .policy-link {
      margin-top: 23px;
      margin-bottom: 40px;
      text-align: start;
      font-size: 14px;
    }
  }
}
</style>
