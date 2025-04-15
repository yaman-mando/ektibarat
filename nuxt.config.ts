import tailwindcss from '@tailwindcss/vite';
import { process } from 'std-env';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { LinkWithoutEvents, ScriptWithoutEvents } from 'unhead/types';
import PrimeTheme from '@primeuix/themes/aura';

const __dirname = dirname(fileURLToPath(import.meta.url));

const IS_PRODUCTION_APP = process.env.NODE_ENV === 'production';
const APP_ENVS = {
  prod: 'prod',
  local_prod: 'local_prod',
  dev: 'dev',
  local_dev: 'local_dev',
};
const currentEnv = APP_ENVS.local_dev;
const getEnv = () => {
  const buildEnvOptions = {
    [APP_ENVS.prod]: {
      websiteUrl: 'https://ekhtibarat.com',
      baseUrl: 'https://ekhtibarat.com/root',
      baseImageUrl: 'https://media.ekhtibarat.com/prod',
      jsonImageUrl: 'https://media.ekhtibarat.com/prod',
      jsonFiles: 'https://media.ekhtibarat.com/prod/JsonFilesFolder',
      socialPlansBaseUrl: 'https://api.ekhtibarat.com/social/staticContent',
      paymentKey: 'pk_live_qpFZP5nJDm4CB7rwXjY0zuOf',
      ALGOLIA_API_KEY: '5704291ecfe824310415614e12299ca8',
      ALGOLIA_APPLICATION_ID: '7NEGIC2FM0',
      ALGOLIA_QUESTION_INDEX: 'questions_index',
      defaultSubjectId: 1,
      defaultSubjectIdTahsele: 3,
      vapId:
        'BPcahsjD5j8Su-8rMVNrVXVKZ_hVzn0WHbC64cQ7PG2VZ13QWmWRteLulsb9LRtHNNvsbapraQ5cCLCpnaWLzBY',
      firebaseConfig: {
        apiKey: 'AIzaSyA_26zXV-dLJIFIzay4I7z3aa0mta0_i_Q',
        authDomain: 'ekhtibarat-1703573629722.firebaseapp.com',
        projectId: 'ekhtibarat-1703573629722',
        databaseURL:
          'https://ekhtibarat-1703573629722-default-rtdb.europe-west1.firebasedatabase.app/',
        storageBucket: 'ekhtibarat-1703573629722.appspot.com',
        messagingSenderId: '930044743699',
        appId: '1:930044743699:web:e43ca0fb0a283b5796efe6',
        measurementId: 'G-ZZHKE5C3MW',
        slackWebhookUrl:
          'https://hooks.slack.com/services/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',
      },
    },
    [APP_ENVS.local_prod]: {
      websiteUrl: 'https://ekhtibarat.com',
      baseUrl: 'https://ekhtibarat.com/root',
      baseImageUrl: 'https://media.ekhtibarat.com/prod',
      jsonImageUrl: 'https://media.ekhtibarat.com/prod',
      jsonFiles: 'https://media.ekhtibarat.com/prod/JsonFilesFolder',
      socialPlansBaseUrl: 'https://api.ekhtibarat.com/social/staticContent',
      paymentKey: 'pk_test_fIzOXAqYytpbNFj6Qgmh1TuM',
      ALGOLIA_API_KEY: '5704291ecfe824310415614e12299ca8',
      ALGOLIA_APPLICATION_ID: '7NEGIC2FM0',
      ALGOLIA_QUESTION_INDEX: 'questions_index',
      defaultSubjectId: 1,
      defaultSubjectIdTahsele: 3,
      vapId:
        'BPcahsjD5j8Su-8rMVNrVXVKZ_hVzn0WHbC64cQ7PG2VZ13QWmWRteLulsb9LRtHNNvsbapraQ5cCLCpnaWLzBY',
      firebaseConfig: {
        apiKey: 'AIzaSyA_26zXV-dLJIFIzay4I7z3aa0mta0_i_Q',
        authDomain: 'ekhtibarat-1703573629722.firebaseapp.com',
        projectId: 'ekhtibarat-1703573629722',
        databaseURL:
          'https://ekhtibarat-1703573629722-default-rtdb.europe-west1.firebasedatabase.app/',
        storageBucket: 'ekhtibarat-1703573629722.appspot.com',
        messagingSenderId: '930044743699',
        appId: '1:930044743699:web:e43ca0fb0a283b5796efe6',
        measurementId: 'G-ZZHKE5C3MW',
        slackWebhookUrl:
          'https://hooks.slack.com/services/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',
      },
      /*vapId:
        'BPcahsjD5j8Su-8rMVNrVXVKZ_hVzn0WHbC64cQ7PG2VZ13QWmWRteLulsb9LRtHNNvsbapraQ5cCLCpnaWLzBY',
      firebaseConfig: {
        apiKey: 'AIzaSyA_26zXV-dLJIFIzay4I7z3aa0mta0_i_Q',
        authDomain: 'ekhtibarat-1703573629722.firebaseapp.com',
        projectId: 'ekhtibarat-1703573629722',
        databaseURL:
          'https://ekhtibarat-1703573629722-default-rtdb.europe-west1.firebasedatabase.app/',
        storageBucket: 'ekhtibarat-1703573629722.appspot.com',
        messagingSenderId: '930044743699',
        appId: '1:930044743699:web:e43ca0fb0a283b5796efe6',
        measurementId: 'G-ZZHKE5C3MW',
      },*/
    },
    [APP_ENVS.dev]: {
      websiteUrl: 'http://37.27.63.239:8030',
      baseUrl: 'http://37.27.63.239:8030/root',
      baseImageUrl: 'https://media.ekhtibarat.com/dev',
      jsonImageUrl: 'https://media.ekhtibarat.com/prod',
      jsonFiles: 'https://media.ekhtibarat.com/dev/JsonFilesFolder',
      socialPlansBaseUrl: 'https://devapi.ekhtibarat.com/social/staticContent',
      paymentKey: 'pk_test_fIzOXAqYytpbNFj6Qgmh1TuM',
      ALGOLIA_API_KEY: '29de583c1e969e38148a2500632c1d9e',
      ALGOLIA_APPLICATION_ID: '0GVYPCEO46',
      ALGOLIA_QUESTION_INDEX: 'questions_index',
      defaultSubjectId: 1,
      defaultSubjectIdTahsele: 3,
      vapId:
        'BEvf10GX-bJCQoFE_Uq-6YRaB2IkojY33u8DNWyhvno6vc4LDFRHj8QVq7k-wS6e3oKtKi1sKus1gW1x8LGrovU',
      firebaseConfig: {
        apiKey: 'AIzaSyBRLQQmksNfHrhE9V7V6goX4tuqK-qiZ0M',
        authDomain: 'ekhtibarat-dev.firebaseapp.com',
        projectId: 'ekhtibarat-dev',
        databaseURL: 'https://ekhtibarat-dev-default-rtdb.firebaseio.com',
        storageBucket: 'ekhtibarat-dev.appspot.com',
        messagingSenderId: '637123427639',
        appId: '1:637123427639:web:25823d1ddb1bb10701eeb2',
        measurementId: 'G-BJLKK55FNQ',
        slackWebhookUrl: '',
      },
    },
  };
  buildEnvOptions[APP_ENVS.local_dev] = buildEnvOptions[APP_ENVS.dev];
  return buildEnvOptions[currentEnv];
};

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
  typescript: {
    typeCheck: true,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
    // resolve: {
    //   alias: {
    //     '@': resolve(__dirname, '.'),
    //     '@/assets': resolve(__dirname, 'assets'),
    //   },
    // },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: '',
    //       includePaths: ['.'],
    //     },
    //   },
    // },
  },
  modules: [
    'nuxt-security',
    '@sidebase/nuxt-auth',
    '@primevue/nuxt-module',
    '@nuxt/image',
    '@nuxt/eslint',
  ],
  primevue: {
    usePrimeVue: true,
    autoImport: true,
    components: {
      prefix: 'Prime',
      exclude: ['Editor', 'FormField', 'Form', 'Chart'],
    },
    options: {
      theme: {
        preset: PrimeTheme,
      },
    },
  },
  css: ['~/assets/css/app-font.css', '~/assets/css/main.css'],
  // plugins: ['~/plugins/shared/init-auth.ts'],
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
      contentSecurityPolicy: {
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
        'upgrade-insecure-requests': [APP_ENVS.prod, APP_ENVS.local_prod].some(
          (env) => currentEnv === env
        ),
      },
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
  runtimeConfig: {
    baseURL: getEnv().websiteUrl,
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
        cookieName: 'auth.token',
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
          cookieName: 'auth.refresh-token',
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
