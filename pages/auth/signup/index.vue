<template>
  <client-only>
    <div class="registration-page">
      <lazy-prime-card
        v-if="registerMethodRequest.status.value === 'pending'"
        class="loading-group"
      >
        <template #content>
          <div class="w-full flex flex-col gap-3">
            <lazy-prime-skeleton
              animation="wave"
              width="85%"
              height="2rem"
            />
            <lazy-prime-skeleton
              animation="wave"
              width="70%"
              height="2rem"
            />
            <lazy-prime-skeleton
              animation="throb"
              width="55%"
              height="2rem"
            />
            <lazy-prime-skeleton
              animation="throb"
              width="55%"
              height="2rem"
            />
          </div>
        </template>
      </lazy-prime-card>
      <lazy-prime-card
        v-else
        class="registration-square"
      >
        <template #content>
          <lazy-prime-tabs v-model:value="activeTab">
            <lazy-prime-tab-list>
              <lazy-prime-tab :value="logicType.login">
                تسجيل الدخول
              </lazy-prime-tab>
              <lazy-prime-tab :value="logicType.signup">
                حساب جديد
              </lazy-prime-tab>
            </lazy-prime-tab-list>
            <lazy-prime-tab-panels>
              <lazy-prime-tab-panel :value="logicType.login">
                <lazy-tab-contents />
              </lazy-prime-tab-panel>
              <lazy-prime-tab-panel :value="logicType.signup">
                <lazy-tab-contents :isRegister="true" />
              </lazy-prime-tab-panel>
            </lazy-prime-tab-panels>
          </lazy-prime-tabs>
        </template>
      </lazy-prime-card>
    </div>
  </client-only>
</template>
<script setup lang="ts">
import { useProjectSettingsStore } from '~/main/modules/project-settings/services/useProjectSettingsStore';

definePageMeta({
  layout: 'website-layout',
});

const logicType = {
  login: 0,
  signup: 1,
};

//compo
const route = useRoute();
const projectSettingsStore = useProjectSettingsStore();

//data
const activeTab = ref(logicType.login);
const registerMethodRequest = useLazyAsyncData(
  'registration-method',
  () => projectSettingsStore.getRegistrationMethod(),
  { immediate: false }
);

//hook
onMounted(() => {
  registerMethodRequest.execute();
});

//watch
watch(
  () => route.query,
  (query) => {
    activeTab.value = query?.isSignup ? logicType.signup : logicType.login;
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped src="./signup.scss"></style>
