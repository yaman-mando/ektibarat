<template>
  <div class="registration-page">
    <prime-card
      v-if="hasLoading"
      class="loading-group"
    >
      <template #content>
        <prime-skeleton
          animation="wave"
          width="85%"
        />
        <prime-skeleton
          animation="throb"
          width="55%"
        />
        <prime-skeleton
          animation="throb"
          width="70%"
        />
        <prime-skeleton
          animation="throb"
          width="85%"
        />
        <prime-skeleton
          animation="throb"
          width="55%"
        />
        <prime-skeleton
          animation="throb"
          width="70%"
        />
        <prime-skeleton
          animation="throb"
          width="85%"
        />
        <prime-skeleton
          animation="throb"
          width="55%"
        />
        <prime-skeleton
          animation="throb"
          width="70%"
        />
        <prime-skeleton
          animation="throb"
          width="85%"
        />
        <prime-skeleton
          animation="throb"
          width="55%"
        />
        <prime-skeleton
          animation="throb"
          width="70%"
        />
        <prime-skeleton
          animation="throb"
          width="85%"
        />
        <prime-skeleton
          animation="throb"
          width="55%"
        />
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
              <tab-contents />
            </prime-tab-panel>
            <prime-tab-panel :value="logicType.signup">
              <tab-contents :isRegister="true" />
            </prime-tab-panel>
          </prime-tab-panels>
        </prime-tabs>
      </template>
    </prime-card>
  </div>
</template>
<script setup lang="ts">
import { useProjectSettingsStore } from '#shared/modules/project-settings/services/useProjectSettingsStore';

definePageMeta({
  layout: 'website-layout',
});

const logicType = {
  login: 0,
  signup: 1,
};

const projectSettingsStore = useProjectSettingsStore();
projectSettingsStore.getRegistrationMethod();

//data
const activeTab = ref(logicType.login);
const hasLoading = projectSettingsStore.state.fetchingRegisterMethod;
</script>
<style lang="scss" scoped src="./signup.scss"></style>
