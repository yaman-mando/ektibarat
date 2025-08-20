<template>
  <div
    v-if="fetchLoading"
    class="b-overly relative"
  >
    <app-overlay
      msg="جاري تحميل البيانات ..."
      :fullScreen="true"
    />
  </div>
  <div
    v-else
    class="learning-panel-part"
  >
    <div class="c-show">
      <div class="info-section">
        <span
          class="title"
          @click="isDev ? startTour(true) : null"
        >
          {{ staticData.slideTitle }}
        </span>
        <span class="caption">
          <text-slice
            :length="120"
            :text="staticData.slideCaption"
          />
        </span>
        <div
          :data-title="tourModel.title"
          :data-intro="tourModel.content"
          class="c-actions"
        >
          <training-button :buttonStyle="TrainingButtonType.noIcon" />
        </div>
      </div>
    </div>
    <div
      v-if="cardsData"
      class="c-data"
    >
      <div
        v-for="(card, index) of cardsData"
        :key="index"
        class="s-card"
      >
        <div class="rw-1">
          <span>معلومات التعلم</span>
        </div>
        <div class="rw-2">
          <div class="r-part">
            <span>{{ card.subjectName }}</span>
            <app-button
              size="md"
              label="التحليلات"
              @click="goAnalytics"
            />
          </div>
          <div class="l-part">
            <div class="c-1">
              <span class="label">ترتيبك</span>
              <span class="info">{{ card.studentSort }}</span>
            </div>
            <div class="c-2">
              <span class="label">نقاطك</span>
              <span class="info">{{ card.studentPoints }}</span>
            </div>
            <div class="c-2">
              <span class="label">التقييم</span>
              <span class="info gr">
                {{ getRateLabel(card.studentRate) }}
              </span>
            </div>
            <div
              class="c-4"
              :class="[{ 'no-sub': !hasAnalyzeService }]"
            >
              <template v-if="!hasAnalyzeService">
                <service-block />
                <service-lock />
              </template>

              <client-only>
                <a-progress
                  :size="66"
                  type="circle"
                  :percent="card.studentRate"
                  stroke-linecap="round"
                  :strokeColor="{
                    '0%': '#FD6C6C',
                    '100%': '#008FFB',
                  }"
                  trailColor="#cfd1d4"
                  :strokeWidth="11"
                >
                  <template #format="percent">
                    <span class="percent">
                      <span style="font-size: 16px; margin-inline-end: 2px">
                        %
                      </span>
                      <span>{{ percent }}</span>
                    </span>
                  </template>
                </a-progress>
              </client-only>
            </div>
          </div>
        </div>
        <div
          v-if="card.learningInfoCategories"
          class="rw-3"
        >
          <div class="c-subjects-cards">
            <div
              v-for="(subCard, i) of card.learningInfoCategories"
              :key="`sub-card-${i}`"
              class="c-card"
            >
              <div class="ca-rw-1">
                <span>{{ subCard.categoryName }}</span>
              </div>
              <div class="ca-rw-2">
                <div class="c-1">
                  <span class="t-1">الأسئلة</span>
                  <span class="t-2">{{ subCard.questionsCount }}</span>
                </div>
                <div class="c-2">
                  <span class="t-1">الإجابات</span>
                  <span class="t-2">
                    <span class="t-2-1">
                      {{ subCard.correctAnswersCount }}
                    </span>
                    <span class="t-2-2"></span>
                    <span class="t-2-3">
                      {{ subCard.wrongAnswersCount }}
                    </span>
                  </span>
                </div>
                <div class="c-3">
                  <span class="t-1">النسبة</span>
                  <template v-if="hasAnalyzeService">
                    <template v-if="subCard.rate > 0">
                      <span class="t-2">{{ subCard.rate }}%</span>
                    </template>
                    <template v-else>
                      <span class="t-2">عدد الاسئلة غير كافي</span>
                    </template>
                  </template>
                  <template v-else>
                    <div class="relative">
                      <service-block />
                      <subs-only-block />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="c-info">
      <div class="subscriptions-step">
        <div
          v-if="subscriptions"
          class="_sub_list"
        >
          <div
            v-for="(sub, index) of subscriptions"
            :key="`sub_${index}`"
            class="_sub"
          >
            <div class="_rp">
              <div class="c_title">
                <span class="_title">
                  <template v-if="sub.subjectId == defaultSub">
                    اختبار القدرات العامة
                  </template>
                  <template v-else-if="sub.subjectId == defaultSubTahsele">
                    اختبار التحصيلي
                  </template>
                  <template v-else>غير معروف</template>
                </span>
                <span
                  class="_type"
                  :class="{ 'is-free': sub.freeType != null }"
                >
                  <template v-if="sub.freeType == null">
                    {{ sub.title }}
                  </template>
                  <template v-else>الأساسية</template>
                </span>
              </div>
              <div
                v-if="sub.freeType == null && sub.endDate"
                class="c_date"
              >
                <span>
                  ينتهي اشتراكك بتاريخ
                  {{ getDataModal(sub.endDate) }}
                </span>
              </div>
              <div
                v-if="sub.freeType != null"
                class="c_free"
              >
                <span class="_t1">ميزات اشتراكك محدودة الآن</span>
                <span class="_t2">
                  اشترك في باقات اختبارات
                  <br v-if="windowSize.isMobileSize" />
                  للحصول على المزيد من المزايا
                </span>
              </div>
            </div>
            <div class="_lp">
              <app-button
                :label="sub.freeType == null ? 'تجديد' : 'اشترك'"
                @click="
                  sub.freeType == null
                    ? reNewSubscription(sub.id, sub.subjectId)
                    : goToPrice(sub.subjectId)
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useIntroService } from '~/main/services/useIntroService';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { RouteHelper } from '~/main/utils/route-helper';
import { dateUi } from '~/main/utils/date-utils';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useIsAliveRx } from '~/main/shared/rx/useIsAliveRx';
import {
  getRateLabel,
  IS_PRODUCTION_APP,
  sleepUtil,
} from '~/main/utils/shared-utils';
import { TrainingButtonType } from '~/main/constants/training-button-type';
import { useLocalStorageStore } from '~/main/useLocalStorageStore';
import { AppLocalStorage } from '~/main/utils/app-storage';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import { GlobalTypes } from '~/main/constants/global-types';
import { appEvents } from '~/main/shared/events/app.events';
import { take } from 'rxjs';
import { Progress } from 'ant-design-vue';

export default {
  components: { 'a-progress': Progress },
  setup() {
    const runtimeConfig = useRuntimeConfig();
    const globalStore = useGlobalStore();
    const introService = useIntroService();
    const subscriptionsStore = useSubscriptionsStore();
    const localStorageStore = useLocalStorageStore();
    return {
      localStorageStore,
      isDev: !IS_PRODUCTION_APP,
      runtimeConfig,
      introService,
      defaultSub: runtimeConfig.public.defaultSubjectId,
      defaultSubTahsele: runtimeConfig.public.defaultSubjectIdTahsele,
      userCurrentSub: subscriptionsStore.state.userCurrentSubVal,
      userServicesState: subscriptionsStore.state.userServicesStateVal,
      ...useSetupAuth(),
      ...useSetupRoute(),
      globalStore,
      ...useIsAliveRx(),
      windowSize: useWindowSize(),
    };
  },
  data() {
    return {
      fetchLoading: false,
      cardsData: null as any[] | null,
      openModalsCount: 0,
    };
  },

  computed: {
    TrainingButtonType() {
      return TrainingButtonType;
    },
    tourModel() {
      return {
        title: this.introService.learningPanelTour?.step0.title,
        content: this.introService.learningPanelTour?.step0.content,
      };
    },
    routerHelper() {
      return RouteHelper;
    },
    currentSubEndDate() {
      if (!this.userCurrentSub) return null;
      return dateUi(new Date(this.userCurrentSub.endDate));
    },
    hasAnalyzeService() {
      return this.userServicesState.ANALAZEDEGRE.isActive;
    },
    staticData() {
      return this.$store.state.learningPanelStatic;
    },
    canStartTour() {
      return this.introService.isIntroLibReady && !this.fetchLoading;
    },
    subscriptions() {
      if (!this.appAuth.loggedIn) {
        return null;
      }
      if (
        !!this.appAuth.user?.subscriptions &&
        this.appAuth.user?.subscriptions?.length > 0
      ) {
        return this.appAuth.user.subscriptions;
      }
      return null;
    },
    globalTypeUserVal() {
      return this.globalStore.state.globalTypeUserValue;
    },
  },
  watch: {
    canStartTour: {
      deep: true,
      handler(val) {
        if (val) {
          this.checkOpenModals();
        }
      },
    },
    openModalsCount(newVal) {
      if (newVal === 0) {
        this.startTour();
      }
    },
    globalTypeUserVal: {
      deep: true,
      handler(newVal) {
        this.getAnalyticsData();
      },
    },
  },

  async created() {
    try {
      this.fetchLoading = true;
      const { data } = await this.$axios.get(
        `/dashboard/learningInfo?grade=${this.globalTypeUserVal}`
      );
      this.cardsData = data;
      await this.$store.dispatch('getLearningPanelStatic');
      this.fetchLoading = false;
    } catch (e) {
      this.fetchLoading = false;
      console.log(e);
    }
  },
  beforeUnmount() {
    this.exitTour();
  },

  methods: {
    checkOpenModals() {
      if (import.meta.client) {
        const firstRegister = this.localStorageStore.getFirstRegister(
          this.appAuth.user.id
        );
        if (this.appAuth.loggedIn && firstRegister) {
          this.openModalsCount++; // المودال الأول مفتوح

          appEvents.helloModal$.pipe(take(1)).subscribe(() => {
            this.openModalsCount--; // تقليل العدد عند الإغلاق
          });
        }

        if (!sessionStorage.getItem('adModalShown')) {
          this.openModalsCount++; // المودال الثاني مفتوح

          appEvents.pannerModalHidden$.pipe(take(1)).subscribe(() => {
            this.openModalsCount--; // تقليل العدد عند الإغلاق
          });
        }

        // إذا لم يكن هناك أي مودال مفتوح، نبدأ الجولة فورًا
        if (this.openModalsCount === 0) {
          this.startTour();
        }
      }
    },
    async getAnalyticsData() {
      try {
        this.fetchLoading = true;
        const { data } = await this.$axios.get(
          `/dashboard/learningInfo?grade=${this.globalTypeUserVal}`
        );
        this.cardsData = data;
        await sleepUtil(1500);
        this.fetchLoading = false;
      } catch (e) {
        console.log(e);
        this.fetchLoading = false;
      }
    },

    async startTour(forceShow = false) {
      await sleepUtil(300);
      this.$nextTick(async () => {
        const userId = this.appAuth.user.id;

        // Retrieve the tour state from local storage
        const learningTourState =
          AppLocalStorage.getTourState(userId).learningPanel;

        // Check if the tour has already been shown and forceShow is not enabled
        if (learningTourState.isShown && !forceShow) return;

        // Update the state to "shown" in local storage
        AppLocalStorage.setIntroState(userId, {
          learningPanel: {
            isShown: true,
          },
        });

        if (!this.introService.introInstanceState.lib) return;
        // Configure options and start the tour
        await this.introService.introInstanceState.lib
          .setOptions({
            ...this.introService.tourConfig,
            scrollToElement: false,
            disableInteraction: false,
            exitOnOverlayClick: false,
            showButtons: false,
            tooltipClass: 'no-close',
          })
          .onbeforechange(() => {
            const overlay = document.querySelector('.introjs-overlay');

            // Add a close button if it doesn't already exist
            if (overlay && !document.querySelector('.introjs-close-button')) {
              const closeButton = document.createElement('button');
              closeButton.innerText = 'X';
              closeButton.classList.add('introjs-close-button');
              closeButton.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            background: white;
            color: var(--purple-af);
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            z-index: 99999999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          `;

              // Attach a click event to exit the tour when the button is clicked
              closeButton.addEventListener('click', () => {
                this.introService.introInstanceState.lib?.exit(true);
              });

              // Append the button to the document
              document.body.appendChild(closeButton);
            }

            return true;
          })
          .onexit(() => {
            // Remove the close button when the tour ends
            const closeButton = document.querySelector('.introjs-close-button');
            if (closeButton) {
              closeButton.remove();
            }
          })
          .start();
      });
    },
    async exitTour() {
      this.introService.introInstanceState.lib?.exit(true);
    },
    getRateLabel(rate) {
      if (!this.hasAnalyzeService) {
        return 'للمشتركين';
      }
      return getRateLabel(rate);
    },

    goTraining() {
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[UserPanelItems.trainings],
        },
      });
    },

    goAnalytics() {
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[UserPanelItems.analytics],
        },
      });
    },

    selectPacket(id) {
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[UserPanelItems.subscriptionList],
          id: id,
        },
      });
    },

    reNewSubscription(id, subId) {
      const global_type_user =
        subId == 3 ? GlobalTypes.tahsele : GlobalTypes.kudrat;
      this.globalStore.patchState({
        globalTypeUserValue: global_type_user,
      });
      this.selectPacket(id);
    },

    goToPrice(subId: any | null = null) {
      try {
        if (subId) {
          const global_type_user =
            subId == 3 ? GlobalTypes.tahsele : GlobalTypes.kudrat;
          this.globalStore.patchState({
            globalTypeUserValue: global_type_user,
          });
          this.appRouter.push(RouteHelper.webPrices());
          return;
        }
        this.appRouter.push(RouteHelper.webPrices());
      } catch (e) {
        console.log(e);
      }
    },

    getDataModal(date) {
      if (!date) return null;
      return dateUi(new Date(date));
    },
  },
};
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.learning-panel-part {
  display: grid;
  justify-items: center;
  row-gap: 30px;
  .b-overly {
    height: 580px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .c-show {
    width: 100%;
    height: 301px;
    border-radius: 19px;
    background-image: url('/images/png/subscribe.png');
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    margin-left: auto;
    margin-right: auto;
    padding-right: 30px;
    display: grid;
    .info-section {
      display: grid;
      width: 300px;
      justify-items: center;
      margin-top: auto;
      margin-bottom: auto;
      .title {
        font-size: 26px;
        font-weight: bold;
        color: var(--orange-39);
      }
      .caption {
        margin-top: 10px;
        font-size: 16px;
        color: var(--black-24);
        line-height: 24px;
        text-align: center;
        min-height: 75px;
        width: 300px;
      }
      .c-actions {
        margin-top: 20px;
        display: grid;
        grid-auto-flow: column;
        column-gap: 20px;
        @include normal-btn() {
          width: 140px;
          height: 40px;
          border-radius: 3px;
          color: white;
          font-size: 16px;
          font-weight: bold;
        }
        .training {
          background: var(--purple-8c);
        }
        .exam {
          background: var(--red-5e);
        }
      }
    }
  }
  .c-data {
    width: 100%;
    .s-card {
      padding: 20px 33px 25px;
      box-shadow: 0px 0px 15px #00000033;
      border-radius: 19px;
      .rw-1 {
        display: flex;
        justify-content: center;
        span {
          font-size: 18px;
          font-weight: bold;
          color: var(--purple-8c);
        }
      }
      .rw-2 {
        margin-top: 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .r-part {
          display: grid;
          grid-auto-flow: column;
          column-gap: 25px;
          align-items: center;
          span {
            font-size: 26px;
            font-weight: bold;
            color: var(--orange-39);
          }
          @include normal-btn() {
            color: white;
            font-size: 16px;
            font-weight: bold;
            border-radius: 3px;
            background: var(--purple-8c);
            width: 100px;
            height: 40px;
          }
        }
        .l-part {
          display: flex;
          align-items: center;
          .c-1,
          .c-2 {
            display: grid;
            row-gap: 6px;
            justify-items: center;
            .label {
              font-size: 16px;
              font-weight: bold;
              color: var(--purple-8c);
            }
            .info {
              font-size: 16px;
              color: var(--gray-63);
              &.gr {
                font-weight: bold;
                color: var(--green-8c);
              }
            }
          }
          .c-2 {
            margin-inline-start: 48px;
          }
          .c-3 {
            margin-inline-start: 35px;
            span {
              font-size: 18px;
              font-weight: bold;
              color: var(--purple-c2);
            }
          }
          .c-4 {
            margin-inline-start: 12px;
            position: relative;
            ::v-deep .ant-progress-text {
              //position: absolute;
              width: 50px;
              //left: 10px;
              display: flex;
              align-items: center;
              //top: 10px;
              justify-content: center;
              height: 50px;
              .percent {
                font-size: 24px;
                font-weight: bold;
                color: var(--black-29);
                display: flex;
                align-items: center;
              }
            }

            &.no-sub {
              ::v-deep .ant-progress-text {
                display: none;
              }
              .service-loc-icon {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }
        }
      }
      .rw-3 {
        margin-top: 15px;
        .c-subjects-cards {
          display: grid;
          column-gap: 2.7%;
          row-gap: 15px;
          grid-template-columns: repeat(2, 1fr);
          align-items: center;
          .c-card {
            box-shadow: 0px 3px 8px #00000026;
            border-radius: 6px;
            background: #bcccdb33;
            padding: 20px;
            display: grid;
            row-gap: 15px;
            .ca-rw-1 {
              span {
                font-size: 18px;
                font-weight: bold;
                color: var(--orange-39);
                line-height: 26px;
              }
            }
            .ca-rw-2 {
              display: grid;
              align-items: center;
              //column-gap: 13.3%;
              grid-auto-flow: column;
              justify-content: space-between;
              .c-1,
              .c-2,
              .c-3 {
                display: grid;
                align-items: center;
                justify-items: center;
                row-gap: 5px;
                .t-1 {
                  font-size: 16px;
                  font-weight: bold;
                  color: var(--purple-8c);
                }
                .t-2 {
                  font-size: 16px;
                  color: var(--gray-63);
                  line-height: 22px;
                }
              }
              .c-2 {
                .t-2 {
                  font-size: 16px;
                  color: var(--gray-63);
                  display: grid;
                  column-gap: 8px;
                  align-items: center;
                  grid-template-columns: repeat(3, auto);
                  margin-top: -3px;
                  .t-2-1 {
                    font-size: 14px;
                    font-weight: bold;
                    color: var(--green-8c);
                  }
                  .t-2-2 {
                    height: 25px;
                    border-left: 1px solid var(--gray-63);
                    opacity: 0.4;
                  }
                  .t-2-3 {
                    font-size: 14px;
                    color: var(--red-5e);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .c-info {
    width: 100%;
    box-shadow: 0px 0px 15px #00000033;
    border-radius: 19px;
    //padding: 20px 31px 20px 32px;
    /*display: flex;
    justify-content: space-between;
    align-items: end;*/
    /*.r-part {
      display: grid;
      row-gap: 14px;
      margin-bottom: 9px;
      .label {
        font-size: 18px;
        font-weight: bold;
        color: var(--purple-8c);
        line-height: 26px;
      }
      .date {
        font-size: 16px;
        color: var(--black-24);
        line-height: 22px;
      }
    }
    .l-part {
      @include normal-btn() {
        width: 100px;
        height: 40px;
        border-radius: 3px;
        color: white;
        font-size: 16px;
        font-weight: bold;
      }
    }

    .ro-q {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
      @include web-desktop-up() {
        flex-direction: row;
      }
      &__sub {
        font-size: 18px;
        font-weight: bold;
        color: var(--purple-8c);
        margin-inline-start: 10px;
      }
    }*/

    .subscriptions-step {
      ._sub_list {
        ._sub {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 0 32px 25px 31px;
          margin-top: 25px;
          &:not(:last-child) {
            border-bottom: 2px solid #bcccdb;
          }
          ._rp {
            display: grid;
            row-gap: 15px;
            .c_title {
              display: flex;
              align-items: center;
              column-gap: 10px;
              ._title {
                font-size: 18px;
                font-weight: bold;
                color: var(--purple-8c);
              }
              ._type {
                padding: 3px 10px;
                border: 1px solid;
                font-size: 11px;
                font-weight: bold;
                color: var(--blue-d6);
                border-color: var(--blue-d6);
                border-radius: 12px;
                &.is-free {
                  color: var(--gray-8f);
                  border-color: var(--gray-8f);
                }
              }
            }
            .c_date {
              font-size: 16px;
              color: var(--red-5e);
            }
            .c_free {
              display: grid;
              row-gap: 8px;
              ._t1 {
                font-size: 16px;
                color: var(--dark-2b);
              }
              ._t2 {
                font-weight: 500;
                font-size: 16px;
                color: var(--blue-d6);
                text-align: center;
              }
            }
          }
          ._lp {
            button {
              font-size: 16px;
              font-weight: bold;
              background: var(--purple-8c);
              color: white;
              width: 100px;
              height: 40px;
              border-radius: 3px;
            }
          }
          @include mobile-down() {
            row-gap: 20px;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            ._rp {
              justify-items: center;
              .c_free {
                justify-items: center;
              }
            }
          }
        }
      }
    }
  }

  @include tablet-down() {
    margin: 16px 15px 50px;
  }

  @include mobile-down() {
    .c-show {
      padding-inline-start: 0;
      justify-content: center;
      background-image: url('/images/png/subscribe-opacity.png');
    }

    .c-data {
      .s-card {
        display: grid;
        justify-items: center;
        padding: 20px 15px 25px;
        .rw-2 {
          display: grid;
          justify-items: center;
          row-gap: 17px;
          .r-part {
            width: 100%;
            justify-content: space-between;
          }
          .l-part {
            .c-2 {
              margin-inline-start: 33px;
            }
            .c-3 {
              margin-inline-start: 40px;
            }
            @media (max-width: 355px) {
              .c-2 {
                margin-inline-start: 8%;
              }
              .c-3 {
                margin-inline-start: 10%;
              }
            }
          }
        }

        .rw-3 {
          margin-top: 20px;
          width: 100%;
          .c-subjects-cards {
            grid-template-columns: 1fr;
          }
        }
      }
    }

    /*.c-info {
      display: grid;
      justify-content: center;
      justify-items: center;
      .r-part {
        justify-items: center;
        margin-bottom: 12px;
      }
    }*/
  }
}
</style>
<style lang="scss">
@import '@/assets/scss/lib/intro-lib';
</style>
