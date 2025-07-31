<template>
  <section class="w-full">
    <slot></slot>
  </section>
</template>
<script setup lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import { IS_PRODUCTION_APP, removeScript } from '~/main/utils/shared-utils';
import { ScriptsIdEnum } from '~/main/constants/scripts-id.enum';

//composable
const { status } = useAuth();
const route = useRoute();
const globalStore = useGlobalStore();
const headers = {
  __dangerouslyDisableSanitizersByTagID: {
    'custom-inline-script': ['innerHTML'],
  },
};

//refs
const extraScript = computed(() => {
  const scripts: any[] = [];

  scripts.push({
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Corporation',
      name: 'اختبارات',
      url: 'https://ekhtibarat.com',
      logo: 'https://ekhtibarat.com/images/ekhtibaratLogo-2.png',
      image: 'https://ekhtibarat.com/images/ekhtibaratLogo-2.png',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'المملكة العربية السعودية',
        addressRegion: 'الرياض',
        sameAs: [
          'https://www.facebook.com/EkhtibaratAi',
          'https://x.com/EkhtibaratAi',
          'https://instagram.com/EkhtibaratAi',
          'https://www.tiktok.com/@EkhtibaratAi',
          'https://www.snapchat.com/add/EkhtibaratAi',
        ],
      },
      inLanguage: 'ar',
    }),
    type: 'application/ld+json',
  });

  return scripts;
});
useHead({
  ...headers,
  htmlAttrs: {
    dir: 'rtl',
    class: 'app-light',
  },
  meta: [
    {
      property: 'og:site_name',
      content: 'اختبارات',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'اختبارات',
    },
  ],
  script: IS_PRODUCTION_APP ? extraScript : [],
});

//data
const isLoggedIn = computed(() => status.value === 'authenticated');

//hook
onBeforeMount(() => {
  removeScript(ScriptsIdEnum.appleId);
});

//method

//watch
watch(
  () => route.query.globalTypeUser,
  (newVal) => {
    if (
      isLoggedIn.value &&
      newVal &&
      globalStore.state.globalTypeUserValue !== Number(newVal)
    ) {
      globalStore.patchState({ globalTypeUserValue: Number(newVal) });
    }
  },
  { immediate: true }
);
</script>
<style lang="scss">
@import '@/assets/scss/shared/sidebar-filter';
@import '@/assets/scss/style';
@import '@/assets/font-icons/ek-icon-v1.0/style.css';
@import '@/assets/scss/main';

* {
  @include app-scroll-bar();
}

#g_a11y_announcement {
  display: none;
}
</style>
