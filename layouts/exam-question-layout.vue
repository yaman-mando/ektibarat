<template>
  <div id="exam-question-layout" class="exam-question-layout">
    <div class="app-nuxt">
      <div class="wrapper">
        <div class="main-section">
          <main-menu />
          <div id="scroll-page" class="scroll-page">
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
    <div class="chat-btn" @click="goChat">
      <i class="fa fa-comment"></i>
    </div>
    <client-only>
      <lazy-surveys-modal ref="modal_surveys_ref" />
    </client-only>
  </div>
</template>

<script lang="ts">
import { removeScript, scrollToTopUtil } from '~/main/utils/shared-utils';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { ScriptsIdEnum } from '~/main/constants/scripts-id.enum';
import { UserPanelItems } from '~/main/constants/user-panel-items';
import { webAuthSignup } from '~/main/utils/web-routes.utils';
import { deepEqualUtil } from '~/main/utils/lodash.utils';

export default {
  setup() {
    const route = useRoute();
      
    watch(route, (newVal, oldVal) => {
      if (!deepEqualUtil(newVal, oldVal)) {
        scrollToTopUtil('scroll-page');
        scrollToTopUtil('exam-question-layout');
      }
    });
    useHead({
      htmlAttrs: {
        dir: 'rtl',
        class: 'app-light',
      },
    });
    definePageMeta({
      middleware: 'user-services-middleware',
    });
    return {
      ...useSetupAuth(),
      ...useSetupRoute(),
    };
  },

  data() {
    return {
      openModalTimeoutId: null as any,
    }
  },

  mounted() {
    this.initFooterClass();
  },

  beforeUnmount() {
    this.removeFooterClass();
    removeScript(ScriptsIdEnum.appleId);
  },

  methods: {
    goChat() {
      if (this.appAuth.loggedIn) {
        this.appRouter.push({
          path: '/user-panel',
          query: { page: UserPanelItems.chat },
        });
      } else {
        this.appRouter.push(webAuthSignup());
      }
    },

    initFooterClass() {
      try {
        if (this.appAuth.loggedIn) {
          setTimeout(() => {
            document
              .getElementById('web-footer')
              ?.classList.add('is-user-panel');
          }, 500);
        }
      } catch (e) {
        console.log('Error initializing footer class: ', e);
      }
    },

    removeFooterClass() {
      const footer = document.getElementById('web-footer');
      if (footer) footer.classList.remove('is-user-panel');
    },

    openSurveysModal() {
      if (import.meta.client) {
        //@ts-expect-error access prop ref
        this.$refs['modal_surveys_ref']?.showModal()
      }
    }
  },

  computed: {
    selectedSurveys() {
      return this.$store.state.selectedSurveys
    }
  },

  watch: {
    selectedSurveys: {
      immediate: true,
      handler(newVal) {
        if (this.openModalTimeoutId) {
          clearTimeout(this.openModalTimeoutId);
          this.openModalTimeoutId = null;
        }

        if (!newVal) return;

        const waitTime = (newVal.timeInitialize || 0) * 1000;

        this.openModalTimeoutId = setTimeout(() => {
          this.openSurveysModal();
          this.openModalTimeoutId = null;
        }, waitTime);
      },
    },
  }

};
</script>

<style lang="scss">
@import '@/assets/scss/mixin';
@import '@/assets/scss/shared/sidebar-filter';
@import '@/assets/scss/style.scss';
@import '@/assets/scss/main';

* {
  @include app-scroll-bar();
}

#g_a11y_announcement {
  display: none;
}

#__layout,
__nuxt,
body,
html {
  height: 100%;
  overflow-y: hidden;
}

.exam-question-layout {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  overflow-y: auto;

  .app-nuxt {
    width: 100%;
    height: 100%;

    .wrapper {
      .main-section {
        background: #fff;
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

  &:hover {
    transform: scale(1.1);
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
}
</style>
