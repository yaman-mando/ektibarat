<template>
  <nuxt-route-announcer />
  <prime-block-u-i
    :blocked="isLoadingProfile"
    fullScreen
  />
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
  <prime-toast position="bottom-right" />
</template>
<script setup lang="ts">
//composable
import { useDeviceService } from '~/main/useDeviceService';
import { useLocalStorageStore } from '~/main/useLocalStorageStore';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { IS_PRODUCTION_APP } from '~/main/utils/shared-utils';
import { webAuthPathUtil } from '~/main/utils/web-routes.utils';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { UAParser } from 'ua-parser-js';
import { useClarityStore } from '~/main/modules/clarity/services/useClarityStore';
import { ScriptsIdEnum } from '~/main/scripts-id.enum';
import {
  authEvents,
  type SignInActionDataUiModel,
} from '~/core/auth/data-access/services/useAuthEvents';
import { filter } from 'rxjs';
import { useGlobalStore } from '~/main/useGlobalStore';

declare const google: any;

//composable
const auth = useAuth();
const router = useRouter();
const route = useRoute();
const deviceService = useDeviceService();
const localStorageStore = useLocalStorageStore();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const clarityStore = useClarityStore();
const runtimeConfig = useRuntimeConfig();

//data
const isLoadingProfile = authStore.isLoadingProfile;
const isLoggedIn = computed(() => auth.status.value === 'authenticated');
const userData = computed(() => auth.data.value as UserInfoDataModel);

//meta
useHead({
  script: isLoggedIn.value
    ? []
    : [
        {
          src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
          type: 'text/javascript',
          id: ScriptsIdEnum.appleId,
          async: true,
          defer: true,
        },
        {
          src: 'https://accounts.google.com/gsi/client',
          type: 'text/javascript',
          id: ScriptsIdEnum.googleId,
          async: true,
          defer: true,
        },
      ],
});

//hook
onMounted(() => {
  globalStore.getUserCountry();
});

//method
const initApp = async (isLoggedIn: boolean) => {
  try {
    if (deviceService.isMobileDevice.value) {
      document.body.classList.add('is-mobile');
    }
    if (!isLoggedIn) {
      initAuth();
    } else {
      infoRegister();
      listToNotification();
    }
  } catch (e) {
    console.error('mainLayoutLoads: ' + e);
    throw e;
  }
};

//TODO-z
const listToNotification = () => {};

const initAuth = async () => {
  try {
    if (import.meta.client) {
      await loadGoogle();
    }
  } catch (e) {
    console.error('initAuth:' + e);
    throw e;
  }
};

const loadGoogle = async () => {
  try {
    const interval = setInterval(async () => {
      const el = document.getElementById(ScriptsIdEnum.googleId);
      if (!el) return;

      clearInterval(interval);
      await google.accounts.id.initialize({
        client_id: runtimeConfig.public.googleClientId,
        context: 'signin',
        callback: handleCredentialResponse,
      });

      if (
        router.currentRoute.value.path != webAuthPathUtil() &&
        !router.currentRoute.value.query?.token
      ) {
        google.accounts.id.prompt();
      }
    }, 300);
  } catch (e) {
    console.error('loadGoogle:' + e);
    throw e;
  }
};

const infoRegister = () => {
  try {
    const userId = userData.value.id;
    if (!localStorageStore.getRegisterInfo(userId) && IS_PRODUCTION_APP) {
      localStorageStore.setRegisterInfo(userId, true);
      handleClarityUser(userData.value);
      handleFcm(userId);
    }
  } catch (e) {
    console.error('infoRegister:' + e);
    throw e;
  }
};

//TODO-z
const handleFcm = (_userId: number) => {};

const handleCredentialResponse = async (response: { credential: string }) => {
  const res = await authStore.loginGoogle({ idToken: response.credential });
  if (res.refreshToken) {
    authEvents.emitSignIn({
      id: res.id,
      token: res.token,
      refreshToken: res.refreshToken,
      email: res.email,
      showWelcomeModal: false,
    });
  } else {
    router.push({
      path: webAuthPathUtil(),
      query: { email: res.email, token: res.token },
    });
  }
};

const signInAction = async (data: SignInActionDataUiModel) => {
  authStore.setAuthCookie({
    token: data.token,
    refreshToken: data.refreshToken!,
  });
  await auth.getSession();
  localStorageStore.setRegisterInfo(userData.value.id, true);
  if (IS_PRODUCTION_APP) {
    handleClarityUser({ email: data.email, id: data.id });
    handleFcm(data.id);
  }
  if (data.showWelcomeModal) {
    localStorageStore.setFirstRegister(data.id, true);
  }
  await router.push(authStore.redirectUrlAfterLogin());
};

const handleClarityUser = async (model: {
  id: number;
  email: string | null;
}) => {
  try {
    if (import.meta.client) {
      //@ts-expect-error access clarity var
      const result = await window.clarity('identify', model?.email);
      const parser = new UAParser();
      const resultUA = parser.getResult();

      await clarityStore.sendClarity({
        customId: result?.userId,
        userId: model.id,
        operatingSystem: resultUA.os.name ?? null,
        deviceType: resultUA.device.type ?? null,
      });
    }
  } catch (e) {
    console.error('An error occurred C01:' + e);
    throw e;
  }
};

const handleLayoutExit = (name: string) => {
  console.log(name);
};

//watch
authEvents.signInData$.pipe(filter(Boolean)).subscribe((val) => {
  if (val) {
    signInAction(val);
  }
});

watch(
  isLoggedIn,
  (val) => {
    if (import.meta.client) {
      initApp(val);
    }
  },
  { immediate: true }
);

watch(
  () => route.meta.layout,
  (newVal, oldVal) => {
    if (oldVal && newVal !== oldVal) {
      handleLayoutExit(oldVal);
    }
  },
  { immediate: true }
);
</script>
