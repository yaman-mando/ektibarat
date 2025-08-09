<template>
  <nuxt-route-announcer />
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
  <lazy-hello-modal ref="hello_modal_ref" />
  <lazy-prime-toast position="bottom-right" />
</template>
<script lang="ts" setup>
//composable
import { useDeviceService } from '~/main/useDeviceService';
import { useLocalStorageStore } from '~/main/useLocalStorageStore';
import { IS_PRODUCTION_APP, scrollToTopUtil } from '~/main/utils/shared-utils';
import { webAuthPathUtil } from '~/main/utils/web-routes.utils';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { UAParser } from 'ua-parser-js';
import { useClarityStore } from '~/main/modules/clarity/services/useClarityStore';
import { ScriptsIdEnum } from '~/main/constants/scripts-id.enum';
import {
  authEvents,
  type SignInActionDataUiModel,
} from '~/core/auth/data-access/services/useAuthEvents';
import { delay, filter, mergeMap, of, Subject } from 'rxjs';
import { useGlobalStore } from '~/main/useGlobalStore';
import { RouteHelper } from './main/utils/route-helper';

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

//refs
const helloModalRef = useTemplateRef('hello_modal_ref');

//data
const isLoggedIn = computed(() => auth.status.value === 'authenticated');
const userData = computed(() => authStore.state.userData);
const firstRegisterTrackModel = computed(() => ({
  isLoggedIn: isLoggedIn.value,
  userId: userData.value?.id,
}));

//subs
const clearFirstRegisterDelaySub = new Subject<number>();

//hook
onMounted(() => {
  globalStore.getUserCountry();

  // clearFirstRegisterDelaySub
  //   .pipe(mergeMap((val) => of(val).pipe(delay(8000))))
  //   .subscribe((userId) => {
  //     localStorageStore.clearFirstRegister(userId);
  //   });
});

//method
const showHelloModal = () => {
  if (import.meta.client) {
    helloModalRef.value?.showModal();
  }
};
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
    const userId = userData.value?.id;
    if (
      !!userId &&
      !localStorageStore.getRegisterInfo(userId) &&
      IS_PRODUCTION_APP
    ) {
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
      showWelcomeModal: res.showWelcomeModal,
    });
  } else {
    router.push({
      path: webAuthPathUtil(),
      query: { email: res.email, token: res.token },
    });
  }
};

const signInAction = async (data: SignInActionDataUiModel) => {
  try {
    authStore.setAuthCookie({
      token: data.token,
      refreshToken: data.refreshToken!,
    });
    const userData = authStore.state.userData;
    if (!userData) {
      await auth.getSession();
    }
    if (userData?.id) {
      localStorageStore.setRegisterInfo(userData.id, true);
    }
    if (IS_PRODUCTION_APP) {
      handleClarityUser({ email: data.email, id: data.id });
      handleFcm(data.id);
    }
    if (data.showWelcomeModal) {
      localStorageStore.setFirstRegister(data.id);
      router.push(RouteHelper.userInformationSteps())
      return
    }
    await router.push(authStore.redirectUrlAfterLogin());
  } catch (e) {
    console.log(e);
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
    console.error('An error occurred C01:' + e);
    throw e;
  }
};

const handleLayoutExit = (name: string) => {};

//events
authEvents.signInData$.pipe(filter(Boolean)).subscribe((val) => {
  if (val) {
    signInAction(val);
  }
});
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

//track hello modal
watch(
  () => firstRegisterTrackModel.value,
  (val) => {
    const userId = val.userId;
    if (!!val && val.isLoggedIn && !!userId) {
      const isFirstRegisterExist = localStorageStore.getFirstRegister(userId);
      if (!isFirstRegisterExist) {
        localStorageStore.setFirstRegister(userId);
        //clearFirstRegisterDelaySub.next(userId);
        showHelloModal();
      }
    }
  },
  { deep: true }
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

watch(
  () => route.path,
  () => {
    scrollToTopUtil('scroll-page');
    scrollToTopUtil('website-layout');
  }
);

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
</script>
