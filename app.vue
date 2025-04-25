<template>
  <nuxt-route-announcer />
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
  <prime-toast position="bottom-right" />
</template>
<script setup lang="ts">
//composable
import { useDeviceService } from '#shared/useDeviceService';
import { useLocalStorageStore } from '#shared/useLocalStorageStore';
import type {
  AuthLoginProviderDataModel,
  UserInfoDataModel,
} from '~/core/auth/data-access/models/auth.model';
import { IS_PRODUCTION_APP } from '#shared/utils/shared-utils';
import {
  webAuthPathUtil,
  webGeneralSelectionPathUtil,
} from '#shared/utils/web-routes.utils';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { useGlobalStore } from '#shared/useGlobalStore';
import { GlobalTypes } from '#shared/constants/global-types';
import { UAParser } from 'ua-parser-js';
import { useClarityStore } from '#shared/modules/clarity/services/useClarityStore';
import { ScriptsIdEnum } from '#shared/scripts-id.enum';

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
    console.log('mainLayoutLoads: ' + e);
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
    console.log('infoRegister:' + e);
    throw e;
  }
};

//TODO-z
const handleFcm = (_userId: number) => {};

const handleCredentialResponse = async (response: { credential: string }) => {
  const res = await authStore.loginGoogle({ idToken: response.credential });
  if (res.refreshToken) {
    authStore.notifyProviderSignIn(res);
  } else {
    router.push({
      path: webAuthPathUtil(),
      query: { email: res.email, token: res.token },
    });
  }
};

const signWithProvider = async (res: AuthLoginProviderDataModel) => {
  authStore.setAuthCookie({
    token: res.token,
    refreshToken: res.refreshToken!,
  });
  await auth.getSession();
  globalStore.patchState({ globalTypeUser: GlobalTypes.kudrat });
  localStorageStore.setRegisterInfo(userData.value.id, true);
  handleClarityUser({ email: res.email, id: res.id });
  handleFcm(res.id);
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
    console.log('An error occurred C01:' + e);
    throw e;
  }
};

const handleLayoutExit = (name: string) => {
  console.log(name);
};

//watch
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
  authStore.providerSignInData,
  (val) => {
    if (val) {
      signWithProvider(val);
    }
  },
  { immediate: true, deep: true }
);

watch(isLoggedIn, (newVal) => {
  if (newVal && !globalStore.state.globalTypeUser.value) {
    router.push(webGeneralSelectionPathUtil());
  }
});
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
