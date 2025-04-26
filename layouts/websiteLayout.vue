<template>
  <div
    id="website-layout"
    class="website-layout"
  >
    <div class="app-nuxt">
      <div class="wrapper">
        <div class="main-section">
          <main-menu />

          <div
            id="scroll-page"
            class="scroll-page"
          >
            <div class="page-contents">
              <slot></slot>
            </div>
            <defer-view>
              <lazy-main-footer />
            </defer-view>
          </div>
        </div>
      </div>
    </div>
    <client-only>
      <div
        id="floatingMenu"
        class="contact-group"
        tabindex="0"
        @blur="handleBlurMenu"
      >
        <div
          :class="{ open: isOpenContactMenu }"
          class="floating-menu"
        >
          <div class="contact-menu-content">
            <button
              class="menu-item"
              @click.stop="navToSocial('whatsapp')"
            >
              <i class="fab fa-whatsapp"></i>
              التواصل عبر واتساب
            </button>
            <button
              class="menu-item"
              @click.stop="navToSocial('telegram')"
            >
              <i class="fab fa-telegram-plane"></i>
              التواصل عبر تليغرام
            </button>
            <button
              class="menu-item"
              @click.stop="navToSocial('chat')"
            >
              <i class="fa fa-comment"></i>
              الدعم الفني
              <span
                v-if="unreadMessages && isLoggedIn"
                class="unreadMsg"
              >
                {{ unreadMessages }}
              </span>
            </button>
          </div>
        </div>
        <div
          id="toggle-btn"
          class="toggle-btn-group"
          @click.stop="toggleContactMenu"
        >
          <div class="toggle-btn">
            <span
              v-if="unreadMessages && isLoggedIn"
              class="unreadMsg"
            >
              {{ unreadMessages }}
            </span>
            <i class="fa fa-comment"></i>
          </div>
        </div>
      </div>
      <lazy-hello-modal ref="modalHelloRef" />
      <lazy-block-modal />
    </client-only>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '#shared/useGlobalStore';
import { removeScript, sleepUtil } from '#shared/utils/shared-utils';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '#shared/constants/user-panel-items';
import { webAuthPathUtil } from '#shared/utils/web-routes.utils';
import { ScriptsIdEnum } from '#shared/scripts-id.enum';

//composable
const { status } = useAuth();
const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();
const headers = {
  __dangerouslyDisableSanitizersByTagID: {
    'custom-inline-script': ['innerHTML'],
  },
};
const extraScript = computed(() => {
  const scripts = [];

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
  script: extraScript.value,
});

//data
const isLoggedIn = computed(() => status.value === 'authenticated');
//TODO-z
const unreadMessages = ref<number>(0);
const isOpenContactMenu = ref(false);
const isInternalbtn = ref(false);
const modalHelloRef = ref(null);

//hook
onBeforeMount(() => {
  document?.getElementById('web-footer')?.classList.remove('is-user-panel');
  removeScript(ScriptsIdEnum.appleId);
});

//method
const toggleContactMenu = async () => {
  isOpenContactMenu.value = !isOpenContactMenu.value;
  await sleepUtil(100);
  document?.getElementById('floatingMenu')?.focus();
};

const handleBlurMenu = async () => {
  await sleepUtil(200);
  if (isInternalbtn.value) {
    return;
  }
  isOpenContactMenu.value = false;
};

const navToSocial = async (type: 'chat' | 'whatsapp' | 'telegram') => {
  isInternalbtn.value = true;
  switch (type) {
    case 'chat':
      {
        if (isLoggedIn.value) {
          await router.push({
            path: '/user-panel',
            query: {
              page: UserPanelItemsRecord[UserPanelItems.chat],
            },
          });
        } else {
          await router.push(webAuthPathUtil());
        }
      }
      break;
    case 'whatsapp':
      window.open(
        'https://api.whatsapp.com/send?phone=966570380975&text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D8%A7%D9%86%D8%A7%20%D9%82%D8%A7%D8%AF%D9%85%20%D8%A7%D9%84%D9%8A%D9%83%D9%85%20%D9%85%D9%86%20%D9%85%D9%88%D9%82%D8%B9%20%D8%A7%D8%AE%D8%AA%D8%A8%D8%A7%D8%B1%D8%A7%D8%AA',
        '_blank'
      );
      break;
    case 'telegram':
      window.open('https://t.me/+966570380975', '_blank');
      break;
  }
  await sleepUtil(1100);
  document?.getElementById('floatingMenu')?.focus();
  document?.getElementById('floatingMenu')?.click();
  await sleepUtil(800);
  isInternalbtn.value = false;
};

//watch
watch(
  () => route.query.globalTypeUser,
  (newVal) => {
    if (
      isLoggedIn.value &&
      newVal &&
      globalStore.state.globalTypeUser.value !== Number(newVal)
    ) {
      globalStore.patchState({ globalTypeUser: Number(newVal) });
    }
  },
  { immediate: true }
);
</script>
<style lang="scss">
@import '@/assets/scss/shared/sidebar-filter';
@import '@/assets/scss/style';
@import '@/assets/font-icons/ek-icon-v1.0/style';
@import '@/assets/scss/main';

* {
  @include app-scroll-bar();
}

#g_a11y_announcement {
  display: none;
}

#__nuxt,
body,
html {
  height: 100%;
  overflow-y: hidden;

  &.zoom-wrapper {
    .website-layout {
      zoom: 0.9;
      @media (max-width: 1399px) {
        .image-panner {
          zoom: 1.1;
        }
      }
      .scroll-page {
        max-height: 100% !important;
      }
    }
  }
}

.website-layout {
  height: 100%;
  //background-color: var(--bg-color);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;

  .app-nuxt {
    height: 100%;
    width: 100%;
    //overflow-y: auto;
    > .wrapper {
      > .main-section {
        background: #ffffff;
        //transform: scaleX(-1);
        overflow: hidden;
      }

      .scroll-page {
        margin-top: 100px;
        max-height: calc(100vh - 100px);
        overflow-y: auto;
        overflow-x: hidden;

        .page-contents {
          min-height: calc(100vh - 260px);
          display: grid;
        }

        @include tablet-down() {
          margin-top: 70px;
          max-height: 100%;
          .page-contents {
            min-height: calc(100vh - 70px - 256px);
          }
        }
      }
    }
  }

  .sm-fixed-part {
    position: fixed;
    bottom: 0;
    z-index: 20;
    background: white;
    padding: 10px;
    border-top: 1px solid var(--purple-8c);
    display: flex;
    justify-content: center;
    width: 100%;
    @include normal-btn() {
      border-radius: 20px;
      height: 40px;
      width: 145px;
      background: var(--purple-8c);
      color: white;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.no-background {
  .app-nuxt {
    > .wrapper {
      background-image: none;
    }
  }
}

.chat-btn {
  position: absolute;
  left: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 300;
  background: var(--purple-8c);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  box-shadow: 0 0 6px 0px var(--purple-8c);
  transition: 0.3s all;

  i {
    font-size: 22px !important;
    color: white !important;
    transform: scaleX(-1) !important;
  }

  .unreadMsg {
    z-index: 5;
    color: #ffffff;
    font-size: 12px;
    position: absolute;
    top: -15%;
    font-weight: bold;
    background: var(--red-5e);
    border-radius: 50%;
    width: 23px;
    height: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 10%;
    box-shadow: 0px -1px 5px 0px var(--purple-8c);
  }

  @include tablet-down() {
    width: 45px;
    height: 45px;
    left: 10px;
    bottom: 10px;
    i {
      font-size: 18px !important;
    }
  }

  &:hover {
    transform: scale(1.1);
  }
}

.contact-group {
  position: absolute;
  left: 20px;
  bottom: 20px;
  width: 275px;
  display: grid;
  justify-items: end;
  align-items: end;
  row-gap: 15px;
  outline: none;
  .toggle-btn-group {
    display: flex;
    align-items: center;
    column-gap: 10px;
    cursor: pointer;
    &:hover {
      .toggle-btn {
        transform: scale(1.1);
      }
    }
    .t-help {
      font-size: 14px;
      color: var(--purple-8c);
      font-weight: bold;
      text-shadow: 2px 1px 7px rgb(255 255 255);
    }
    .toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 300;
      background: var(--purple-8c);
      border-radius: 50%;
      width: 60px;
      height: 60px;
      box-shadow: 0 0 6px 0px var(--purple-8c);
      transition: 0.3s all;
      position: relative;

      i {
        font-size: 22px !important;
        color: white !important;
        transform: scaleX(-1) !important;
      }

      .unreadMsg {
        z-index: 5;
        color: #ffffff;
        font-size: 12px;
        position: absolute;
        top: -15%;
        font-weight: bold;
        background: var(--red-5e);
        border-radius: 50%;
        width: 23px;
        height: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 10%;
        box-shadow: 0px -1px 5px 0px var(--purple-8c);
      }

      @include tablet-down() {
        width: 45px;
        height: 45px;
        i {
          font-size: 18px !important;
        }
      }
    }
  }

  .floating-menu {
    border-radius: 15px;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
    width: 275px;
    max-width: 80vw;
    text-align: center;
    overflow: hidden;
    transition: height 0.3s ease-in-out;
    height: 0;

    .contact-menu-content {
      background-color: white;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
      //transform: translateY(100%);
      //opacity: 0;
      //transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;

      .menu-item {
        display: flex;
        align-items: center;
        background-color: #f1f1f1;
        padding: 10px;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        font-size: 16px;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease;
        column-gap: 5px;
        position: relative;
        cursor: pointer;
        border: none;
        height: 100%;

        &:hover {
          background-color: #ddd;
        }

        i {
          margin-right: 10px;
          color: var(--purple-8c);
          font-size: 18px;
        }
        .unreadMsg {
          z-index: 5;
          color: #ffffff;
          font-size: 12px;
          position: absolute;
          top: 16px;
          font-weight: bold;
          background: #ff375e;
          background: var(--red-5e);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          left: 15px;
        }
      }
    }

    &.open {
      height: 100%;

      .contact-menu-content {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  @include mobile-down() {
    left: 10px;
    bottom: 10px;
    .toggle-btn-group {
      .toggle-btn {
        width: 40px;
        height: 40px;
      }
    }
  }
}

#hello-modal {
  .modal-dialog {
    max-width: 700px;
    width: 637px;

    .modal-content {
      height: 490px;
      border-radius: 10px;

      .modal-body {
        padding: 0;

        .close-btn {
          position: absolute;
          left: 15px;
          top: 10px;
          font-size: 25px;
          cursor: pointer;
        }

        .rw-contents {
          padding: 40px 10px 25px;
          display: grid;
          justify-items: center;
          position: relative;
          z-index: 2;

          .rw-1 {
            display: grid;
            grid-template-columns: 108px auto;
            column-gap: 20px;
            align-items: center;
            justify-content: center;

            img {
              width: 108px;
              height: 108px;
            }

            i {
              font-size: 50px;
              color: var(--purple-8c);
            }

            span {
              font-size: 53px;
              font-weight: bold;
              color: var(--red-5e);
              transform: rotate(335deg);
            }
          }

          .rw-2 {
            margin-top: 30px;
            color: var(--dark-2b);
            font-size: 18px;
            text-align: center;
          }

          .rw-3 {
            margin-top: 10px;
            font-size: 30px;
            font-weight: bold;
            text-align: center;
            color: var(--purple-8c);
          }

          .rw-4 {
            margin-top: 5px;
            font-size: 30px;
            font-weight: 500;
            color: var(--red-5e);
            text-align: center;
          }

          .rw-5 {
            margin-top: 22px;
            font-size: 18px;
            color: var(--dark-2b);
            text-align: center;
          }

          @include normal-btn() {
            margin-top: 25px;
            background: var(--purple-8c);
            color: white;
            font-size: 16px;
            font-weight: bold;
            height: 60px;
            width: auto;
          }
        }
      }
    }

    .tenor-gif-embed {
      height: 475px;
      z-index: 0;
      position: absolute !important;
      top: 0;
      opacity: 0.85;
    }

    @include tablet-down() {
      max-width: 600px;
      width: 95%;
      margin: auto;
    }
  }
}
</style>
