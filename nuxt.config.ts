import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { LinkWithoutEvents, ScriptWithoutEvents } from 'unhead/types';
import PrimeTheme from '@primeuix/themes/aura';
import { process } from 'std-env';
import { APP_ENVS, currentEnv, getEnv } from './config';

const IS_PRODUCTION_APP = process.env.NODE_ENV === 'production';
enum AuthCookiesEnum {
  token = 'auth.token',
  refreshToken = 'auth.refresh-token',
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const jsLinks = (): ScriptWithoutEvents[] => {
  const buildEnvOptions: { [key: string]: ScriptWithoutEvents[] } = {
    [APP_ENVS.prod]: IS_PRODUCTION_APP
      ? [{ src: '/clarity.js', defer: true }]
      : [],
    [APP_ENVS.dev]: [],
    [APP_ENVS.local_dev]: [],
    [APP_ENVS.local_prod]: [],
  };
  return buildEnvOptions[currentEnv];
};

const getPrefetchAndPreconnect = (url: string) => {
  const { protocol, hostname } = new URL(url);
  return {
    preconnect: `${protocol}//${hostname}`, // >  "https://media.ekhtibarat.com"
    dnsPrefetch: `//${hostname}`, // > "//media.ekhtibarat.com"
  };
};
const prefetch_preConnect_urls = getPrefetchAndPreconnect(
  getEnv().baseImageUrl
);

const appFonts: LinkWithoutEvents[] = [
  {
    rel: 'preload',
    href: '/fonts/abdoLine/AbdoLine.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
  },
  {
    rel: 'preload',
    href: '/fonts/Tajawal/Tajawal-Regular.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
  },
  {
    rel: 'preload',
    href: '/fonts/Tajawal/Tajawal-Bold.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
  },
];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    baseURL: getEnv().websiteUrl,
    public: {
      defaultSubjectId: getEnv().defaultSubjectId,
      defaultSubjectIdTahsele: getEnv().defaultSubjectIdTahsele,
      websiteUrl: getEnv().websiteUrl,
      apiUrl: getEnv().baseUrl,
      baseImageUrl: getEnv().baseImageUrl,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      appleClientId: process.env.APPLE_CLIENT_ID,
    },
  },
  typescript: {
    typeCheck: true,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/main/shared/math-jax/components',
      pathPrefix: false,
    },
  ],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-security',
    '@sidebase/nuxt-auth',
    '@primevue/nuxt-module',
    '@nuxt/image',
    '@nuxt/eslint',
    '@vueuse/nuxt',
  ],
  primevue: {
    usePrimeVue: true,
    autoImport: false,
    components: {
      prefix: 'Prime',
      include: [
        //todo-z handle provider as vee-validate
        'Checkbox',
        'ToggleSwitch',
        'Popover',
        //start accordion
        'Accordion',
        'AccordionPanel',
        'AccordionHeader',
        'AccordionContent',
        //end accordion
        //tabs
        'Tabs',
        'Tab',
        'TabList',
        'TabPanel',
        'TabPanels',
        //end tabs
        'Skeleton',
        'Card',
        'Dialog',
        'Toast',
        'Button',
      ],
    },
    directives: {
      prefix: 'prime-',
      include: ['Tooltip'], //v-prime-tooltip
    },
    options: {
      theme: {
        preset: PrimeTheme,
      },
    },
  },
  css: ['~/assets/css/app-font.css', '~/assets/css/main.css'],
  plugins: [
    '~/plugins/shared/axios-plugin.ts',
    '~/plugins/shared/vuex-plugin.ts',
    '~/core/auth/auth-interceptor-plugin.ts',
    '~/core/auth/http-error-interceptor-plugin.client.ts',
    '~/plugins/shared/global-error-handler-plugin.client.ts',
    '~/plugins/shared/detect-device-plugin.ts',
    '~/plugins/shared/gtag-plugin.client.ts',
    '~/plugins/shared/font-awesome-plugin.client.ts',
  ],
  app: {
    head: {
      title: 'اختبارات',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'Content-Security-Policy',
          content: 'upgrade-insecure-requests',
        },
        { name: 'referrer', content: 'origin' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'preconnect',
          href: prefetch_preConnect_urls.preconnect,
        },
        { rel: 'dns-prefetch', href: prefetch_preConnect_urls.dnsPrefetch },
        //@ts-expect-error because of typing
        ...appFonts,
      ],
      //@ts-expect-error because of typing
      script: [...jsLinks()],
    },
  },
  security: {
    strict: false,
    headers: {
      crossOriginResourcePolicy: 'same-origin',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginEmbedderPolicy: 'credentialless',
      contentSecurityPolicy: IS_PRODUCTION_APP
        ? {
            'base-uri': ["'none'"],
            'font-src': ["'self'", 'https:', 'data:'],
            'form-action': ["'self'"],
            'frame-ancestors': ["'self'"],
            'img-src': ["'self'", 'data:'],
            'object-src': ["'none'"],
            'script-src-attr': ["'none'"],
            'style-src': ["'self'", 'https:', "'unsafe-inline'"],
            'script-src': [
              "'self'",
              'https:',
              "'unsafe-inline'",
              "'strict-dynamic'",
              "'nonce-{{nonce}}'",
            ],
            'upgrade-insecure-requests': [
              APP_ENVS.prod,
              APP_ENVS.local_prod,
            ].some((env) => currentEnv === env),
          }
        : false,
      originAgentCluster: '?1',
      referrerPolicy: 'no-referrer',
      strictTransportSecurity: {
        maxAge: 15552000,
        includeSubdomains: true,
      },
      xContentTypeOptions: 'nosniff',
      xDNSPrefetchControl: 'off',
      xDownloadOptions: 'noopen',
      xFrameOptions: 'DENY',
      xPermittedCrossDomainPolicies: 'none',
      xXSSProtection: '0',
      permissionsPolicy: {
        camera: [],
        'display-capture': [],
        fullscreen: [],
        geolocation: [],
        microphone: [],
      },
    },
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000,
      maxUploadFileRequestInBytes: 8000000,
      throwError: true,
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000,
      headers: false,
      driver: {
        name: 'lruCache',
      },
      throwError: true,
    },
    xssValidator: {
      throwError: true,
    },
    corsHandler: {
      origin: getEnv().websiteUrl,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      preflight: {
        statusCode: 204,
      },
    },
    allowedMethodsRestricter: {
      methods: '*',
      throwError: true,
    },
    hidePoweredBy: true,
    basicAuth: false,
    enabled: true,
    csrf: false,
    nonce: true,
    removeLoggers: true,
    ssg: {
      meta: true,
      hashScripts: true,
      hashStyles: false,
      nitroHeaders: true,
      exportToPresets: true,
    },
    sri: true,
  },

  auth: {
    // originEnvKey: 'NUXT_BASE_URL',
    baseURL: getEnv().baseUrl,
    provider: {
      type: 'local',
      endpoints: {
        signUp: false,
        signIn: { path: '/identity/login', method: 'post' },
        signOut: { path: '/identity/logout', method: 'post' },
        getSession: { path: '/profile', method: 'get' },
      },
      token: {
        signInResponseTokenPointer: '/token',
        type: 'Bearer',
        cookieName: AuthCookiesEnum.token,
        headerName: 'Authorization',
        maxAgeInSeconds: 60 * 60 * 5,
        // sameSiteAttribute: 'lax',
        cookieDomain: IS_PRODUCTION_APP
          ? new URL(getEnv().websiteUrl).hostname
          : undefined,
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: false,
      },
      refresh: {
        isEnabled: true,
        endpoint: { path: '/identity/refreshToken', method: 'post' },
        refreshOnlyToken: false,
        token: {
          signInResponseRefreshTokenPointer: '/refreshToken',
          refreshResponseTokenPointer: '/token',
          refreshRequestTokenPointer: '/refreshToken',
          cookieName: AuthCookiesEnum.refreshToken,
          maxAgeInSeconds: 60 * 60 * 5,
          // sameSiteAttribute: 'lax',
          cookieDomain: IS_PRODUCTION_APP
            ? new URL(getEnv().websiteUrl).hostname
            : undefined,
          secureCookieAttribute: false,
          httpOnlyCookieAttribute: false,
        },
      },
    },
  },
  image: {
    domains: [getEnv().baseImageUrl, getEnv().websiteUrl, 'localhost'],
    format: ['jpg', 'png', 'webp'],
    screens: {
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
});
