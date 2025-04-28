<template>
  <client-only>
    <div class="registration-page">
      <prime-card
        v-if="registerMethodRequest.status.value === 'pending'"
        class="loading-group"
      >
        <template #content>
          <div class="w-full flex flex-col gap-3">
            <prime-skeleton
              animation="wave"
              width="85%"
              height="2rem"
            />
            <prime-skeleton
              animation="wave"
              width="70%"
              height="2rem"
            />
            <prime-skeleton
              animation="throb"
              width="55%"
              height="2rem"
            />
            <prime-skeleton
              animation="throb"
              width="55%"
              height="2rem"
            />
          </div>
        </template>
      </prime-card>
      <prime-card
        v-else
        class="registration-square"
      >
        <template #content>
          <prime-tabs v-model:value="activeTab">
            <prime-tab-list>
              <prime-tab :value="logicType.login">تسجيل الدخول</prime-tab>
              <prime-tab :value="logicType.signup">حساب جديد</prime-tab>
            </prime-tab-list>
            <prime-tab-panels>
              <prime-tab-panel :value="logicType.login">
                <lazy-tab-contents />
              </prime-tab-panel>
              <prime-tab-panel :value="logicType.signup">
                <lazy-tab-contents :isRegister="true" />
              </prime-tab-panel>
            </prime-tab-panels>
          </prime-tabs>
        </template>
      </prime-card>
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
