<template>
  <div>
    <nuxt-route-announcer />
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </div>
</template>
<script setup lang="ts">
//composable
import { useDeviceStore } from '#shared/useDeviceStore';
import { useLocalStorageStore } from '#shared/useLocalStorageStore';
import type {
  AuthLoginGoogleDataModel,
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
import type { HttpError } from 'http-errors';
import { ErrorsRecord } from '#shared/constants/errors.enum';
import { useToastMessage } from '~/composables/useToastMessage';
//eslint-disable-next-line
declare const google: any;
//eslint-disable-next-line
declare const AppleID: any;

//composable
const auth = useAuth();
const router = useRouter();
const route = useRoute();
const deviceStore = useDeviceStore();
const localStorageStore = useLocalStorageStore();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const clarityStore = useClarityStore();
const toastMessage = useToastMessage();

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
          id: 'appleId',
          async: true,
          defer: true,
        },
        {
          src: 'https://accounts.google.com/gsi/client',
          type: 'text/javascript',
          id: 'googleId',
          async: true,
          defer: true,
        },
      ],
});

//hooks
onMounted(() => {
  mainLayoutLoads();
});

//method
const mainLayoutLoads = async () => {
  try {
    if (deviceStore.state.isMobileDevice.value) {
      document.body.classList.add('is-mobile');
    }
    if (!isLoggedIn.value) {
      initAuth();
    } else {
      infoRegister();
      listToNotification();
    }
  } catch (e) {
    console.log('mainLayoutLoads: ' + e);
  }
};

//TODO-z
const listToNotification = () => {};

const initAuth = async () => {
  try {
    if (import.meta.client) {
      await loadGoogle();
      await loadApple();
    }
  } catch (e) {
    console.error('initAuth:' + e);
  }
};

const loadGoogle = async () => {
  try {
    const interval = setInterval(async () => {
      if (document.getElementById('googleId')) {
        clearInterval(interval);
        await google.accounts.id.initialize({
          client_id:
            '699802488472-274u4ektcj1aqcmbojj99s3auf8bep14.apps.googleusercontent.com',
          context: 'signin',
          callback: handleCredentialResponse,
        });

        if (
          router.currentRoute.value.path != webAuthPathUtil() &&
          !router.currentRoute.value.query?.token
        ) {
          await google.accounts.id.prompt();
        }
      }
    }, 1000);
  } catch (e) {
    console.error('loadGoogle:' + e);
  }
};

const loadApple = async () => {
  try {
    const interval = setInterval(async () => {
      if (document.getElementById('appleId')) {
        clearInterval(interval);
        await AppleID.auth.init({
          clientId: 'ekhtibarat.com',
          scope: 'email',
          redirectURI: 'https://ekhtibarat.com/auth/signin-apple',
          usePopup: true,
        });
      }
    });
  } catch (e) {
    console.error('loadApple:' + e);
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
  }
};

//TODO-z
const handleFcm = (_userId: number) => {};

const handleCredentialResponse = async (response: { credential: string }) => {
  try {
    const res = await authStore.loginGoogle({ idToken: response.credential });
    if (res.refreshToken) {
      signinPopupGoogle(res);
    } else {
      router.push({
        path: webAuthPathUtil(),
        query: { email: res.email, token: res.token },
      });
    }
  } catch (e: unknown) {
    processErrors(e as HttpError);
  }
};

const signinPopupGoogle = async (res: AuthLoginGoogleDataModel) => {
  try {
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
  } catch (e) {
    console.log('err-signinPopupByGoogle: ' + e);
  }
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

const processErrors = async (error: HttpError) => {
  try {
    if (error.response?.status == 400) {
      if (error.response.data.errorType == 6) {
        globalStore.patchState({
          showBlockModal: true,
        });
      } else {
        const errorType = error.response.data.errorType as unknown as number;
        toastMessage.showError({
          summary: ErrorsRecord[errorType],
          life: 5000,
        });
      }
    } else {
      toastMessage.showError();
    }
  } catch (e) {
    console.log('err-signByAppleProcessErr: ' + e);
  }
};

const handleLayoutExit = (name: string) => {
  console.log(name);
};

//watch
watch(
  () => route.meta.layout,
  (newVal, oldVal) => {
    if (oldVal && newVal !== oldVal) {
      handleLayoutExit(oldVal);
    }
  },
  { immediate: true }
);
watch(isLoggedIn, (newVal) => {
  if (newVal && !globalStore.state.globalTypeUser.value) {
    router.push(webGeneralSelectionPathUtil());
  }
});
</script>
