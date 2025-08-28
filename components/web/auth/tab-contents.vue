<template>
  <div class="registration-tab-content">
    <div class="rw-1">
      <span>{{ texts.title }}</span>
    </div>
    <lazy-app-overlay v-if="registerPermissionsLoading" />
    <template v-if="!registerPermissionsLoading">
      <div
        v-if="activeStep !== steps.userInfo"
        class="rw-2 actions"
      >
        <lazy-prime-button
          v-if="(isRegister && googlePermission) || !isRegister"
          class="outline-btn by-google"
          @click="loginByGoogle()"
        >
          <img
            src="/images/svg/googleLogo.svg"
            alt=""
          />

          <span>{{ texts.signGoogle }}</span>
        </lazy-prime-button>
        <lazy-prime-button
          v-if="(isRegister && applePermission) || !isRegister"
          class="outline-btn by-ios"
          :loading="appleLoading"
          @click="loginByApple"
        >
          <i class="fab fa-apple"></i>
          <span>{{ texts.SignApple }}</span>
        </lazy-prime-button>
        <lazy-prime-button
          v-if="
            ((isRegister && emailPermission) || !isRegister) &&
            activeTab !== signTypes.email
          "
          class="outline-btn by-email"
          @click="loginByEmail"
        >
          <i
            class="fa"
            :class="isRegister ? 'fa-envelope' : 'fa-lock'"
          ></i>
          <span>{{ texts.signEmail }}</span>
        </lazy-prime-button>
        <lazy-prime-button
          v-if="
            ((isRegister && phonePermission) || !isRegister) &&
            activeTab !== signTypes.whatsapp
          "
          class="outline-btn by-watsapp"
          @click="registerByWhatsapp()"
        >
          <i class="fab fa-whatsapp"></i>
          <span>{{ texts.signWatsApp }}</span>
        </lazy-prime-button>
      </div>
      <div
        v-if="activeTab"
        class="rw-3 info"
      >
        <lazy-login-email
          v-if="activeTab === signTypes.email"
          class="!mt-6"
        />
        <lazy-whatsapp-form
          v-if="activeTab === signTypes.whatsapp"
          class="!mt-6"
        />
      </div>
      <h3
        v-if="isRegister"
        class="conditions"
      >
        توافق بتسجيلك على
        <nuxt-link to="/conditions">الشروط والأحكام</nuxt-link>
      </h3>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useProjectSettingsStore } from '~/main/modules/project-settings/services/useProjectSettingsStore';
import { sleepUtil } from '~/main/utils/shared-utils';
import {
  webAuthAppleSignIn,
  webAuthGoogleSignIn,
} from '~/main/utils/web-routes.utils';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { authEvents } from '~/core/auth/data-access/services/useAuthEvents';

declare const AppleID: any | null;

const signInTexts = {
  title: 'أهلا بعودتك',
  signGoogle: 'الدخول باستخدام جوجل',
  SignApple: 'الدخول باستخدام أبل',
  signEmail: 'الدخول باستخدام البريد الإلكتروني',
  signWatsApp: 'الدخول باستخدام واتساب',
};

const signUpTexts = {
  title: 'أهلا بك في اختبارات',
  signGoogle: 'التسجيل باستخدام جوجل',
  SignApple: 'التسجيل باستخدام أبل',
  signEmail: 'التسجيل بالبريد الإلكتروني',
  signWatsApp: 'التسجيل باستخدام واتساب',
};

const signTypes = {
  email: 1,
  whatsapp: 2,
};

const steps = {
  email: 1,
  code: 2,
  userInfo: 3,
};

const props = defineProps({
  isRegister: Boolean,
  hideActions: Boolean,
});

//composable
const runtimeConfig = useRuntimeConfig();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const projectSettingsStore = useProjectSettingsStore();

// data
const appleLoading = ref(false);
const activeTab = ref<number | null>(null);
const activeStep = ref(steps.email);

const texts = computed(() => (props.isRegister ? signUpTexts : signInTexts));

const registerPermissions = computed(() => {
  return projectSettingsStore.state.registerMethods.value;
});

const emailPermission = computed(
  () => registerPermissions.value?.email ?? true
);
const phonePermission = computed(
  () => registerPermissions.value?.phone ?? true
);
const googlePermission = computed(
  () => registerPermissions.value?.google ?? true
);
const applePermission = computed(
  () => registerPermissions.value?.apple ?? true
);

const registerPermissionsLoading = computed(
  () => projectSettingsStore.state.fetchingRegisterMethod.value
);

// Methods
const loginByApple = async () => {
  try {
    appleLoading.value = true;
    await AppleID.auth.init({
      clientId: runtimeConfig.public.appleClientId,
      scope: 'email',
      redirectURI: `${window.location.origin}${webAuthAppleSignIn()}`,
      usePopup: true,
    });
    const data = await AppleID.auth.signIn();
    if (data) {
      const res = await authStore.loginApple({
        idToken: data.authorization.id_token,
      });
      if (res.refreshToken) {
        authEvents.emitSignIn({
          id: res.id,
          token: res.token,
          refreshToken: res.refreshToken,
          tokenExpireDate: res.tokenExpireDate,
          email: res.email,
          showWelcomeModal: res.showWelcomeModal,
        });
      } else {
        //TODO-z
        // this.handleClarityUser({ email: res.email, id: res.id });
        // this.$router.push({
        //   path: this.$route.path,
        //   query: {
        //     ...this.$route.query,
        //     email: res.email,
        //     token: res.token,
        //     id: res.id,
        //   },
        // });
      }
    }
  } catch (e) {
    appleLoading.value = false;
    throw e;
  }
};
async function loginByGoogle() {
  const clientId = useRuntimeConfig().public.googleClientId;
  const redirectUri = `${window.location.origin}${webAuthGoogleSignIn()}`;
  const scope = encodeURIComponent('openid profile email');

  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${scope}`;
  window.location.href = url;
}

async function loginByEmail() {
  await removeParams();
  activeTab.value = null;
  await sleepUtil(100);
  activeTab.value = signTypes.email;
}

const registerByWhatsapp = async () => {
  await removeParams();
  activeTab.value = null;
  await sleepUtil(100);
  activeTab.value = signTypes.whatsapp;
};

async function _loginByWatsApp() {
  await removeParams();
  activeTab.value = null;
  await sleepUtil(100);
  activeTab.value = signTypes.whatsapp;
}

async function removeParams() {
  const query = { ...route.query };
  delete query.email;
  delete query.token;
  await sleepUtil(100);
  router.push({ query });
}

// Watch route query
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.email) {
      activeTab.value = signTypes.email;
    }
  },
  { immediate: true, deep: true }
);
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.registration-tab-content {
  padding: 15px;

  .rw-1 {
    display: flex;
    justify-content: center;

    span {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      color: var(--purple-8c);
    }
  }

  .rw-2 {
    display: grid;
    row-gap: 15px;
    width: 100%;
    margin-top: 20px;
    @include outline-btn() {
      width: 100%;
      height: 45px;
      font-size: 16px;
      border-radius: 8px;
      color: var(--blue-f4);
      border: 0.75px solid #4285f4;
      display: grid;
      grid-template-columns: 16px 1fr;
      align-items: center;
      i {
        font-size: 23px;
      }
      span {
        text-align: center;
      }
      &.by-ios {
        color: black;
        border-color: #000000bf;
      }
      &.by-email {
        color: var(--purple-8c);
        border-color: var(--purple-8c);

        i {
          font-size: 16px;
        }
      }
      &.by-watsapp {
        color: #128c7e;
        border-color: #128c7e;

        i {
          color: #128c7e;
          font-size: 20px;
        }
      }
    }
  }

  .conditions {
    margin-top: 100px;
    font-size: 16px;
    color: var(--gray-63);
    line-height: 22px;
    text-align: center;

    a {
      color: var(--purple-8c);
      text-decoration-line: underline;
    }
  }
}
</style>
