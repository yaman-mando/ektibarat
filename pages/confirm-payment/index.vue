<template>
  <client-only>
    <div class="confirm-payment">
      <template v-if="isLoadingPage">
        <app-spinner v-if="isLoadingPage" />
      </template>
      <template v-else>
        <div class="r-part">
          <span class="c-title">أهلا بك في اختبارات!</span>
          <span class="c-msg">
            <i class="fa fa-check-circle"></i>
            <span>تم تفعيل اشتراكك بنجاح</span>
          </span>
          <span class="c-date">
            ينتهي اشتراكك بتاريخ
            <span>
              {{ currentSubEndDateModel }}
            </span>
          </span>
          <span class="c-mail">
            أرسلنا نسخة من إيصال الدفع إلى بريدك الإلكتروني
            <a :href="`'mailto:' + ${appAuth.user.email}`">
              {{ appAuth.user.email }}
            </a>
          </span>
          <app-button
            label="لوحتي التعليمية"
            size="md"
            @click="toLearningPanel"
          />
        </div>
        <div
          v-if="paymentData"
          class="l-part"
        >
          <div class="s1-p2-info">
            <div class="s1-p2-rw-1">
              <span>ملخص الطلب</span>
            </div>
            <div class="s1-p2-info-data">
              <div class="info-item">
                <span class="title">الباقة</span>
                <span class="caption">{{ paymentData.subscriptionTitle }}</span>
              </div>
              <div class="info-item">
                <span class="title">مدة الاشتراك</span>
                <span class="caption">
                  {{ paymentData.subscriptionPeriod }}
                  <!--              <span v-if="selectedPacket.period < 11">أشهر</span>-->
                  <span v-if="paymentData.subscriptionPeriod < 11">أشهر</span>
                  <span v-else>شهر</span>
                </span>
              </div>
              <div class="info-item">
                <span class="title">السعر</span>
                <span class="caption">
                  {{ paymentData.subscriptionOldPrice.toFixed(2) }} ريال
                </span>
              </div>
              <div class="discount-group">
                <div class="info-item sm">
                  <span class="title">تخفيض الباقة</span>
                  <span
                    class="caption red"
                    style="display: flex; align-items: center; column-gap: 3px"
                  >
                    <span style="direction: ltr">
                      {{
                        (
                          paymentData.subscriptionCurrentPrice -
                          paymentData.subscriptionOldPrice
                        ).toFixed(2)
                      }}
                    </span>
                    <span>ريال</span>
                  </span>
                </div>
                <div
                  v-if="
                    paymentData.couponDiscount && paymentData.couponDiscount > 0
                  "
                  class="info-item sm"
                >
                  <span class="title">كود الخصم</span>
                  <span class="caption red">
                    {{ '%' + paymentData.couponDiscount }}
                  </span>
                </div>
              </div>
            </div>
            <hr />
            <div class="s1-p2-toplam">
              <span class="title">السعر الإجمالي</span>
              <div class="price">
                <span class="total">{{ paymentData.amount }}</span>
                <span>ريال</span>
              </div>
            </div>
            <span class="s1-p2-note">شامل ضريبة القيمة المضافة</span>
            <app-button
              variant="outline"
              size="md"
              label="تحميل الإيصال"
              @click="downloadInvoice()"
            />
          </div>
        </div>
      </template>
    </div>
  </client-only>
</template>
<script lang="ts">
import { dateUi } from '~/main/utils/date-utils';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { GlobalTypes } from '~/main/constants/global-types';
import { webErrorPathUtil } from '~/main/utils/web-routes.utils';

export default {
  setup() {
    const setupAuth = useSetupAuth();
    const setupRoute = useSetupRoute();
    const runtimeConfig = useRuntimeConfig();
    const subscriptionsStore = useSubscriptionsStore();
    const userCurrentSub = computed(
      () => subscriptionsStore.state.userCurrentSubVal
    );

    return {
      userCurrentSub,
      ...setupAuth,
      ...setupRoute,
      subscriptionsStore,
      runtimeConfig,
    };
  },
  data() {
    return {
      isLoadingPage: true,
      paymentData: null as any,
      id: null as any,
    };
  },

  computed: {
    currentSubEndDateModel() {
      if (!this.userCurrentSub) return '';

      return dateUi(new Date(this.userCurrentSub.endDate));
    },
  },

  async mounted() {
    await this.initPage();
    await this.appAuth.fetchUser();
    await this.subscriptionsStore.getCurrentSub(GlobalTypes.kudrat);
  },

  methods: {
    async initPage() {
      try {
        this.isLoadingPage = true;
        const id =
          this.appRoute.query['tap_id'] ?? this.appRoute.query['tab_id'];
        if (!id) return navigateTo(webErrorPathUtil());

        const { data: paymentData } = await this.$axios.get(
          `/payment/checkCharge/${id}`
        );
        if (paymentData.status != 8) {
          return navigateTo({
            path: '/user-panel',
            query: {
              page: UserPanelItemsRecord[UserPanelItems.subscriptionList],
              failPayment: 1,
            },
          });
        }

        this.isLoadingPage = false;
      } catch (e) {
        return navigateTo(webErrorPathUtil());
      }
    },
    toLearningPanel() {
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[UserPanelItems.learningPanel],
        },
      });
    },

    async downloadInvoice() {
      try {
        const url = `${this.runtimeConfig.public.apiUrl}/payment/exportInvoice/${this.id}`;
        const link = document.createElement('a');
        // If you don't know the name or want to use
        // the webserver default set name = ''
        link.setAttribute('download', 'ekhtibaratInvoice');
        link.href = url;
        document.body.appendChild(link);
        link.click();
        link.remove();
        console.log(link);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';
.confirm-payment {
  display: grid;
  column-gap: 100px;
  grid-template-columns: auto 303px;
  align-items: center;
  justify-content: center;
  min-height: 475px;
  .r-part {
    display: grid;
    row-gap: 15px;
    .c-title {
      color: var(--purple-8c);
      font-size: 26px;
      font-weight: bold;
    }
    .c-msg {
      margin-top: 5px;
      display: flex;
      align-items: center;
      i {
        margin-inline-end: 10px;
        color: var(--green-8c);
        font-size: 14px;
      }
      span {
        color: var(--green-8c);
        font-size: 16px;
        font-weight: bold;
      }
    }
    .c-date,
    .c-mail {
      font-size: 16px;
      color: var(--black-24);
      font-weight: 500;
    }
    @include normal-btn() {
      margin-top: 25px;
      background: var(--purple-8c);
      color: white;
      border-radius: 10px;
      width: 221px;
      height: 45px;
      margin-left: auto;
      margin-right: auto;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .l-part {
    .s1-p2-info {
      box-shadow: 0px 0px 15px #00000033;
      border-radius: 20px;
      min-height: 348px;
      padding: 15px;

      .s1-p2-rw-1 {
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          font-size: 18px;
          font-weight: bold;
          color: var(--purple-8c);
          height: 26px;
        }
      }

      .s1-p2-info-data {
        margin-top: 20px;
        display: grid;
        row-gap: 10px;

        .info-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 22px;

          .title {
            font-size: 16px;
            color: var(--gray-63);
          }

          .caption {
            font-size: 16px;
            color: var(--purple-8c);

            &.red {
              color: var(--red-63);
            }
          }

          &.sm {
            height: 19px;
            .title,
            .caption {
              font-size: 14px;
            }
          }
        }

        .discount-group {
          display: grid;
          row-gap: 6px;
        }
      }

      hr {
        margin-top: 15px;
        margin-bottom: 10px;
        border-top: 2px solid #000000;
        opacity: 0.2;
      }

      .s1-p2-toplam {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 24px;

        .title {
          font-size: 16px;
          color: var(--purple-8c);
          font-weight: bold;
        }

        .price {
          font-size: 16px;
          color: var(--purple-8c);

          .total {
            font-size: 20px;
            font-weight: bold;
          }
        }
      }

      .s1-p2-note {
        font-size: 12px;
        color: var(--gray-63);
      }

      @include outline-btn() {
        border: 1px solid var(--purple-8c);
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        width: 274px;
        height: 45px;
        color: var(--purple-8c);
        margin-top: 13px;
      }
    }
  }

  @include ipad-down() {
    grid-template-columns: none;
    row-gap: 25px;
    padding: 25px 15px 50px;
    .r-part {
      .c-title {
        text-align: center;
      }
      .c-date,
      .c-mail {
        font-weight: normal;
      }
    }
  }
}
</style>
