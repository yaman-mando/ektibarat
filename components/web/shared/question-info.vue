<template>
  <div class="aq-info">
    <div class="aq-head">
      <span>ما هو اختبارات؟</span>
    </div>
    <div class="_ac-content">
      <div class="aqt-1">
        <span>اختبارات يخلّي الذكاء الاصطناعي</span>
        <span>يساعدك في التدرب على اختباراتك</span>
      </div>
      <web-video-show-modal
        :isTahsele="isTahsele"
        style="width: 100%; min-height: 250px; display: block"
      />
    </div>
    <div class="_ac-footer">
      <app-button
        class="reg-btn"
        :label="textBtn"
        @click="goAction"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { GlobalTypes } from '~/main/constants/global-types';
import { RouteHelper } from '~/main/utils/route-helper';
import { webAuthSignup } from '~/main/utils/web-routes.utils';
import { useGlobalStore } from '~/main/useGlobalStore';

export default {
  props: {
    grade: {
      type: Number,
      default: GlobalTypes.kudrat,
    },
  },
  setup() {
    const imageUrl = useImageUrl();
    const globalStore = useGlobalStore();
    return {
      ...useSetupAuth(),
      ...useSetupRoute(),
      imageUrl,
      globalStore,
    };
  },
  data() {
    return {};
  },

  computed: {
    isTahsele() {
      return this.grade == GlobalTypes.tahsele;
    },
    isLoggedIn() {
      return this.appAuth.loggedIn;
    },
    textBtn() {
      if (this.isLoggedIn) {
        if (this.isTahsele) {
          return 'تدرب على التحصيلي';
        }
        return 'تدرب على القدرات';
      }
      return 'التسجيل في اختبارات';
    },
  },

  async mounted() {
    //await this.loadVideoComponent()
  },

  methods: {
    getImageUrl(fileName) {
      return this.imageUrl.staticImageUrl(fileName);
    },

    goAction() {
      if (this.appAuth.loggedIn) {
        if (this.isTahsele) {
          this.globalStore.patchState({
            globalTypeUserValue: GlobalTypes.tahsele,
          });
        } else {
          this.globalStore.patchState({
            globalTypeUserValue: GlobalTypes.kudrat,
          });
        }
        this.appRouter.push({ path: RouteHelper.userPanelTraining() });
      } else {
        this.appRouter.push(webAuthSignup());
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.aq-info {
  box-shadow: 0px 0px 15px #00000033;
  border-radius: 15px;
  padding-bottom: 25px;
  min-height: 400px;
  .aq-head {
    height: 80px;
    display: flex;
    align-items: center;
    padding: 18px 25px;
    background: transparent
      linear-gradient(180deg, #46008c 0%, #885bc2 50%, #46008c 100%) 0% 0%
      no-repeat padding-box;
    border-radius: 15px 15px 0px 0px;
    font-size: 30px;
    font-weight: bold;
    color: white;
  }
  ._ac-content {
    padding: 25px 15px 16px;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    justify-content: center;
    align-content: center;
    height: calc(100% - 185px);
    min-height: 350px;
    .aqt-1 {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: 24px;
      font-weight: bold;
      color: var(--purple-8c);
      text-align: center;
      min-height: 72px;
      span {
        font-size: 24px;
        min-height: 36px;
      }
    }

    .aqt-2 {
      margin-top: 16px;
      position: relative;
      min-height: 217px;
      iframe {
        height: 217px;
      }
      .video-play-button {
        position: absolute;
        z-index: 10;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        box-sizing: content-box;
        display: block;
        width: 32px;
        height: 44px;
        /* background: #fa183d; */
        border-radius: 50%;
        padding: 18px 20px 18px 28px;
      }

      .video-play-button:before {
        content: '';
        position: absolute;
        z-index: 0;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        display: block;
        width: 80px;
        height: 80px;
        background: white;
        border-radius: 50%;
        animation: pulse-border 1500ms ease-out infinite;
      }

      .video-play-button:after {
        content: '';
        position: absolute;
        z-index: 1;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        display: block;
        width: 80px;
        height: 80px;
        background: #fe0000;
        border-radius: 50%;
        transition: all 200ms;
      }

      .video-play-button:hover:after {
        background-color: #fe0000;
      }
      .video-play-button:before {
        content: '';
        color: white;
        position: absolute;
        z-index: 0;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        display: block;
        width: 80px;
        height: 80px;
        background: white;
        border-radius: 50%;
        animation: pulse-border 1500ms ease-out infinite;
      }

      .video-play-button img {
        position: relative;
        z-index: 3;
        max-width: 100%;
        width: auto;
        height: auto;
      }

      .video-play-button span {
        display: block;
        position: relative;
        z-index: 3;
        width: 0;
        height: 0;
        border-left: 32px solid #fff;
        border-top: 22px solid transparent;
        border-bottom: 22px solid transparent;
      }

      @keyframes pulse-border {
        0% {
          transform: translateX(-50%) translateY(-50%) translateZ(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateX(-50%) translateY(-50%) translateZ(0) scale(1.5);
          opacity: 0;
        }
      }

      @include tablet-down() {
        margin-top: 10px;
        iframe {
          height: auto;
        }
      }
    }
    ul {
      margin-bottom: 0;
      margin-top: 30px;
      line-height: 39px;
      padding: 0;
      li {
        list-style: inside;
        color: var(--black-24);
        font-size: 20px;
        font-weight: 500;
      }
    }
    .t-3 {
      margin-top: 30px;
      font-size: 18px;
      color: var(--dark-63);
      text-align: center;
    }
  }

  ._ac-footer {
    margin: 0 15px;
    display: flex;
    justify-content: center;
    .reg-btn {
        background: var(--purple-8c);
        color: white;
        border-radius: 10px;
        font-size: 24px;
        font-weight: bold;
        width: 300px;
        height: 80px;
        min-height: 80px;
        @include tablet-down() {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
          min-height: 60px;
        }
      }
  }
}

@include tablet-down() {
  .aq-info {
    border-radius: 0;
    margin-top: 0;
    box-shadow: none;
    padding-bottom: 0;
    width: 600px;
    margin-right: auto;
    margin-left: auto;
    //border-bottom: 1px solid;
    .aq-head {
      height: 50px;
      padding: 14px 10px;
      border-radius: 0;
      font-size: 16px;
      font-weight: normal;
    }
    ._ac-content {
      padding: 10px 15px 10px;
      height: calc(100% - 100px);
      .aqt-1 {
        font-size: 16px;
        text-align: center;
        padding: 0 20px;
      }
      ul {
        margin-top: 15px;
        line-height: 32px;
        li {
          font-size: 16px;
        }
      }
      .t-3 {
        margin-top: 10px;
        font-size: 16px;
        line-height: 32px;
      }
    }
    ._ac-footer {
      .normal-btn.reg-btn {
        font-size: 16px;
        height: 50px;
        width: 300px;
      }
    }
  }
}

@include mobile-down() {
  .aq-info {
    width: 340px;
    ._ac-content {
      min-height: 295px;
    }
  }
}
</style>
