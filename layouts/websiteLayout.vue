<template>
  <div>
    <slot />
  </div>
</template>
<script setup lang="ts">
const { status } = useAuth();
const headers = {
  __dangerouslyDisableSanitizersByTagID: {
    'custom-inline-script': ['innerHTML'],
  },
};
const extraScript = computed(() => {
  let scripts = [];

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

  if (status.value === 'unauthenticated') {
    scripts.push({
      src: 'https://accounts.google.com/gsi/client',
      type: 'text/javascript',
      async: true,
      defer: true,
    });

    scripts.push({
      src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
      type: 'text/javascript',
      id: 'appleId',
      async: true,
      defer: true,
    });
  }

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
  script: extraScript.value,
});
</script>
