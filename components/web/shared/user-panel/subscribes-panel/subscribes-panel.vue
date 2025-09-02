<template>
  <div
    class="subscriptions-part"
    :class="{ 'is-sub': activeStep == steps.subscriptions }"
  >
    <div
      v-if="fetchLoading"
      class="b-overly"
    >
      <app-overlay />
    </div>
    <template v-else>
      <lazy-vee-validate-provider>
        <template v-if="!successPaymentCase">
          <div
            class="rw-1 !mis-0"
            :class="{ 'is-sub': activeStep == steps.subscriptions }"
          >
            <span>الاشتراكات</span>
          </div>
          <template v-if="activeStep == steps.subscriptions">
            <div class="subscriptions-step">
              <div
                v-if="subscriptions"
                class="_sub_list"
              >
                <div
                  v-for="sub of subscriptions"
                  :key="sub.id"
                  class="_sub"
                >
                  <div class="_rp">
                    <div class="c_title">
                      <span class="_title">
                        <template v-if="sub.subjectId == defaultSub">
                          اختبار القدرات العامة
                        </template>
                        <template
                          v-else-if="sub.subjectId == defaultSubTahsele"
                        >
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
                      size="md"
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
            <lazy-complete-info-modal
              :key="completeInfoModalKey"
              v-model:isOpenModal="isOpenCompleteInfoModal"
              @onCompleteInfo="onCompleteInfo"
            />
          </template>
          <template v-if="activeStep == steps.payment">
            <div
              v-if="selectedPacket"
              class="payment-step"
            >
              <div class="s1-rw-1">
                <span class="p-selected">
                  الباقة المختارة:
                  <span class="p-name">{{ selectedPacket.title }}</span>
                </span>
                <span
                  class="p-change"
                  @click="goToPrice()"
                >
                  تغيير الباقة
                </span>
              </div>
              <hr class="hide-to-tablet" />
              <div class="s1-info relative">
                <app-overlay v-if="!appleIsLoaded" />
                <div
                  :style="{ opacity: !appleIsLoaded ? 0 : 1 }"
                  class="s1-p1-info relative"
                  :class="{ free: total <= 0 }"
                >
                  <template v-if="!selectedPacket.isFree">
                    <div class="s1-p1-rw-1">
                      <span>معلومات الدفع</span>
                    </div>
                    <div class="s1-p1-rw-2">
                      <div class="r-part hide-to-tablet">
                        <span>كود الخصم</span>
                      </div>
                      <div class="l-part">
                        <vee-form
                          v-slot="{ meta }"
                          tag="div"
                          class="a-discount-form w-full"
                        >
                          <form-input
                            v-model:inputValue="discountCodeInput"
                            :rules="{ required: true }"
                            inputId="codeInputSm"
                            :isDisabled="coupon.hasCoupon"
                            inputPlaceholder="كود الخصم"
                            :hideLabel="true"
                            :hideErrorLabel="true"
                          />
                          <app-button
                            v-if="coupon.hasCoupon"
                            size="md"
                            label="إزالة"
                            @click="removeCoupon()"
                          />
                          <app-button
                            v-else
                            size="md"
                            colorType="success"
                            :isLoading="couponLoad"
                            :isDisabled="!meta.valid"
                            label="تطبيق"
                            @click="requestCoupon"
                          />
                        </vee-form>
                      </div>
                    </div>
                    <hr />
                  </template>
                  <div v-show="total > 0">
                    <div class="s1-p1-rw-3">
                      <span class="title">وسيلة الدفع</span>
                      <div class="s1-p1-rw-3-rw-2 relative">
                        <div
                          :class="{
                            active: activePaymentType === paymentTypes.cards,
                          }"
                          class="s1-p1-rw-3-rw-2-cl-1"
                          @click="changePaymentMethod(paymentTypes.cards)"
                        >
                          <span class="c-check"></span>
                          <div class="c-content">
                            <img
                              src="/images/svg/Mada.svg"
                              alt="اختبارات"
                            />
                            <img
                              src="/images/svg/Visa.svg"
                              alt="اختبارات"
                            />
                            <img
                              src="/images/svg/Mastercard.svg"
                              alt="اختبارات"
                            />
                          </div>
                        </div>
                        <app-overlay v-if="!appleIsLoaded" />

                        <div
                          class="s1-p1-rw-3-rw-2-cl-2"
                          :class="{
                            active: activePaymentType === paymentTypes.apple,
                            disabled: disableApple,
                          }"
                          @click="changePaymentMethod(paymentTypes.apple)"
                        >
                          <span class="c-check"></span>
                          <div class="c-content">
                            <img
                              src="/images/svg/payment-apple-pay.svg"
                              alt="apple-pay"
                            />
                            <span>أبل باي</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="card-info relative">
                      <form
                        v-show="activePaymentType == paymentTypes.cards"
                        id="form-container"
                        class="relative"
                        method="post"
                        action="/charge"
                      >
                        <div
                          id="element-container"
                          class="relative"
                          style="min-height: 176px"
                        >
                          <app-overlay v-if="loadPaymentForm" />
                        </div>
                        <div
                          id="error-handler"
                          role="alert"
                        ></div>
                        <div
                          id="success"
                          style="display: none; position: relative; float: left"
                        >
                          <i
                            class="fa fa-check-circle"
                            style="color: var(--green-8c)"
                          ></i>
                          <span id="token"></span>
                        </div>
                      </form>

                      <div
                        v-if="activePaymentType == paymentTypes.apple"
                        class="card-apple-info"
                      >
                        <span>
                          تأكد من استخدامك لمتصفح سفاري
                          <br class="hide-from-tablet" />
                          لإتمام عملية الدفع عبر أبل
                        </span>
                      </div>
                      <app-overlay v-if="paymentLoad" />
                      <app-button
                        v-if="activePaymentType == paymentTypes.cards"
                        class="!mx-auto"
                        label="إتمام الدفع"
                        @click="payByCard4()"
                      />
                      <div
                        id="apple-pay-button"
                        :style="{
                          display:
                            activePaymentType == paymentTypes.apple
                              ? 'flex'
                              : 'none',
                        }"
                      ></div>

                      <span class="b-note">
                        سيتم تفعيل اشتراكك على هذا الحساب تلقائيا بعد إتمامك
                        لعملية الدفع
                      </span>
                    </div>
                  </div>
                  <template v-if="total <= 0">
                    <app-overlay v-if="paymentLoad" />
                    <app-button
                      class="normal-btn payment-free-btn"
                      label="إتمام التسجيل"
                      @click="payByFree()"
                    />
                  </template>
                </div>
                <div class="s1-p2-info">
                  <div class="s1-p2-rw-1">
                    <span>ملخص الطلب</span>
                  </div>
                  <div class="s1-p2-info-data">
                    <div class="info-item">
                      <span class="title">الباقة</span>
                      <span class="caption">{{ selectedPacket.title }}</span>
                    </div>
                    <div class="info-item">
                      <span class="title">مدة الاشتراك</span>
                      <span class="caption">
                        {{ selectedPacket.period }}
                        <span v-if="selectedPacket.period < 11">أشهر</span>
                        <span v-else>شهر</span>
                      </span>
                    </div>
                    <template v-if="!selectedPacket.isFree">
                      <div class="info-item">
                        <span class="title">السعر</span>
                        <span class="caption">
                          {{ selectedPacket.oldPrice.toFixed(2) }} ريال
                        </span>
                      </div>
                      <div class="info-item">
                        <span class="title">تخفيض الباقة</span>
                        <span
                          class="caption red"
                          style="
                            display: flex;
                            align-items: center;
                            column-gap: 3px;
                          "
                        >
                          <span style="direction: ltr">{{ discount }}</span>
                          <span>ريال</span>
                        </span>
                      </div>
                    </template>
                    <div
                      v-if="coupon.hasCoupon"
                      class="info-item"
                    >
                      <span class="title">كود الخصم</span>
                      <span class="caption red">
                        <!--                    {{ Number(coupon.couponAmount).toFixed(2) }}- ريال-->
                        {{ '%' + coupon.couponAmount }}
                      </span>
                    </div>
                  </div>
                  <hr />
                  <div class="s1-p2-toplam">
                    <span class="title">السعر الإجمالي</span>
                    <div
                      v-if="total > 0"
                      class="price"
                    >
                      <span class="total">{{ total }}</span>
                      <span>ريال</span>
                    </div>
                    <div
                      v-else
                      class="price"
                    >
                      <span class="total">مجاناً</span>
                    </div>
                  </div>
                  <span
                    v-if="total > 0"
                    class="s1-p2-note"
                  >
                    شامل ضريبة القيمة المضافة
                  </span>
                </div>
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <div class="confirm-payment">
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
            <span
              v-if="!isFreePayment"
              class="c-mail"
            >
              أرسلنا نسخة من إيصال الدفع إلى بريدك الإلكتروني
              <a :href="'mailto:' + appAuth.user.email">
                {{ appAuth.user.email }}
              </a>
            </span>
            <app-button
              class="!mt-3"
              label="لوحتي التعليمية"
              @click="toLearningPanel()"
            />
          </div>
        </template>
      </lazy-vee-validate-provider>
    </template>

    <prime-dialog
      id="my-modal"
      :modal="true"
      :showHeader="false"
      :closable="true"
    >
      <iframe
        :src="frameLink"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        name="iframe_a"
        height="700px"
        width="700px"
        allowfullscreen
        frameborder="0"
        scrolling="no"
        title="Iframe Example"
      ></iframe>
    </prime-dialog>
  </div>
</template>
<script lang="ts">
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { deepCloneUtil } from '~/main/utils/lodash.utils';
import { useGlobalStore } from '~/main/useGlobalStore';
import { RouteHelper } from '~/main/utils/route-helper';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import { dateUi } from '~/main/utils/date-utils';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { GlobalTypes } from '~/main/constants/global-types';
import { sleepUtil } from '~/main/utils/shared-utils';
import {
  paymentMechanism,
  paymentTypeEnum,
} from '~/main/constants/payment-type.enum';
import { appEvents } from '~/main/shared/events/app.events';
import { defineRule, Form as VeeForm } from 'vee-validate';

defineRule('verify_cready', (value: string, [email]: [string]) => {
  return RegExp(`[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}`).test(value);
});

defineRule('period_date', (value: string, [email]: [string]) => {
  return RegExp(`^(0?[1-9]|1[0-2])/([2-9][0-9])`).test(value);
});

defineRule('cvv_code', (value: string, [email]: [string]) => {
  return RegExp(`^[0-9]{3}`).test(value);
});

defineRule('discount_code', (value: string, [email]: [string]) => {
  return RegExp(`^[A-Z0-9]{3,}`).test(value);
});

const style = {
  base: {
    color: '#535353',
    lineHeight: '18px',
    fontFamily: 'Tajawal',
    fontSmoothing: 'antialiased',
    fontSize: '18px',
    '::placeholder': {
      fontFamily: 'Tajawal',
      color: 'rgba(0, 0, 0, 0.4)',
      fontSize: '18px',
      textAlign: 'right',
    },
  },
  invalid: {
    color: 'red',
  },
};
// input labels/placeholders
const labels = {
  cardNumber: 'رقم البطاقة',
  expirationDate: 'MM/YY',
  cvv: 'CVV',
  cardHolder: 'الاسم على البطاقة',
};
//payment options
const paymentOptions = {
  currencyCode: ['USD', 'SAR'],
  labels: labels,
  TextDirection: 'ltr',
};

export class cardForm {
  name = null;
  number = null;
  expireDate = null;
  cvc = null;
}

export class paymentBody {
  subscriptionId = null;
  couponId = null;
  amount = null as null | number | string;
  tokenId = null;
  paymentMechanism = null as number | null;
}

export class couponItem {
  couponId = null;
  hasCoupon = false;
  couponAmount = null as number | null;
}

export class customer {
  id = null;
  first_name = null;
  middle_name = null;
  last_name = null;
  email = null;
}

const steps = {
  subscriptions: 0,
  offers: 1,
  payment: 2,
};

const paymentTypes = {
  cards: 1,
  apple: 2,
};

export default {
  components: { VeeForm },
  setup() {
    const windowSize = useWindowSize();
    const globalStore = useGlobalStore();
    const subscriptionsStore = useSubscriptionsStore();
    const runtimeConfig = useRuntimeConfig();
    return {
      windowSize,
      subscriptionsStore,
      globalStore,
      ...useToastMessage(),
      ...useSetupAuth(),
      ...useSetupRoute(),
      runtimeConfig,
      globalTypeUser: computed(() => globalStore.state.globalTypeUserValue),
      currentUserSub: computed(
        () => subscriptionsStore.state.userCurrentSubVal!
      ),
      defaultSub: runtimeConfig.public.defaultSubjectId,
      defaultSubTahsele: runtimeConfig.public.defaultSubjectIdTahsele,
    };
  },
  data() {
    return {
      fetchLoading: false,
      cardsData: [] as any[],
      nodeRSA: null,
      key: null,
      galleryOptions: {
        speed: 400,
        perMove: 1,
        start: 0,
        fixedWidth: '260px',
        minHeight: '640px',
        arrows: false,
        type: 'slide',
        pagination: false,
        direction: 'rtl',
        gap: '0px',
        drag: false,
        rewind: true,
        /*breakpoints: {
          2000: {
            //width: '98%',
          },
          1300: {
            type: 'loop',
            drag: 'free',
          },
          991: {
            type: 'slide',
            drag: false,
          },
          815: {
            focus: 'center',
            type: 'loop',
            drag: 'free',
          },
        }*/
      },
      activeStep: steps.subscriptions,
      activePaymentType: paymentTypes.cards,
      paymentLoad: false,
      couponLoad: false,
      selectedPacketId: null,
      maskVal: null,
      maskCardNumber: {
        mask: '0000 0000 0000 0000',
      },
      maskDate: {
        mask: '00/00',
        definitions: {
          a: /[1]/,
        },
      },
      maskCvc: {
        mask: '000',
      },
      maskCode: {
        mask: '000',
      },
      cardForm: new cardForm(),
      coupon: new couponItem(),
      discountCodeInput: null,
      successPaymentCase: false,
      isFreePayment: false,
      tap: null as any,
      elements: null,
      card: null as any,
      paymentId: null,
      frameLink: undefined as string | undefined,
      applePayData: {
        renderApplePayButton: null,
        ThemeMode: null,
        SupportedNetworks: null,
        Scope: null,
        Environment: null,
        Locale: null,
        ButtonTypeL: null,
        Edges: null,
      } as any,
      loadPaymentForm: false,
      customerData: new customer(),
      appleIsLoaded: false,
      scriptEle: null,
      scriptEle2: null,
      scriptEle3: null,
      int: false,
      isLoadingCurrentSub: false,
      isOpenCompleteInfoModal: false,
      completeInfoModalKey: 1,
    };
  },

  head() {
    return {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js',
          type: 'text/javascript',
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://tap-sdks.b-cdn.net/apple-pay/build-1.0.13/main.css',
        },
      ],
    };
  },

  computed: {
    isStartSub() {
      if (!this.currentUserSub) return false;

      return this.currentUserSub.freeType == null;
    },
    currentSubEndDateModel() {
      if (!this.currentUserSub) return '';

      return dateUi(new Date(this.currentUserSub.endDate));
    },
    steps() {
      return steps;
    },
    paymentTypes() {
      return paymentTypes;
    },
    selectedPacket() {
      return this.cardsData.filter((k) => k.id == this.selectedPacketId)[0];
    },
    discount() {
      return (
        this.selectedPacket.currentPrice - this.selectedPacket.oldPrice
      ).toFixed(2);
    },
    total(): any {
      return (
        this.selectedPacket.currentPrice -
        (this.selectedPacket.currentPrice * this.coupon.couponAmount!) / 100
      ).toFixed(2);
    },

    disableApple() {
      return (
        this.customerData.id == null || !this.appleIsLoaded || !this.isMacOrIos
      );
    },

    isMacOrIos() {
      const is_OSX = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
      const mac = window.navigator.userAgent.indexOf('Mac') != -1;
      const is_Mac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const is_iphone =
        ['iPhone', 'iPad', 'iPod'].indexOf(window.navigator.platform) !== -1;
      return is_OSX || is_Mac || mac || is_iphone;
    },

    notCompleteInfo() {
      if (this.appAuth.loggedIn) {
        const userInfo = this.appAuth.user;
        return !userInfo.firstName || !userInfo.lastName || !userInfo.email;
      }
      return false;
    },

    subscriptions() {
      if (!this.appAuth.loggedIn) {
        return null;
      }
      if (
        !!this.appAuth.user?.subscriptions?.length &&
        this.appAuth.user?.subscriptions?.length > 0
      ) {
        return this.appAuth.user.subscriptions;
      }
      return null;
    },
  },

  watch: {
    'appRoute.query.id': {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal != undefined && newVal != null) {
          this.selectPacket(newVal);
        }
      },
    },

    globalTypeUser: {
      deep: true,
      handler(newVal) {
        this.activeStep = steps.subscriptions;
        this.getSubscriptionsData();
      },
    },
  },

  created() {
    if (!this.subscriptions) {
      this.activeStep = steps.offers;
    }
    this.getSubscriptionsData();
  },

  async mounted() {
    if (import.meta.client) {
      await this.loadPaymentLib();
      const id = this.appRoute.query.id;
      if (id) {
        this.selectPacket(id);
        this.appRouter.replace({
          query: { ...this.appRoute.query, id: undefined },
        });
      }
    }
    this.getUserCurrentSub();
  },

  beforeUnmount() {
    this.removeScript('apple-pay');
    this.removeScript('tab-1');
    this.removeScript('tab-2');
  },

  methods: {
    async getUserCurrentSub() {
      try {
        this.isLoadingCurrentSub = true;
        await this.subscriptionsStore.getCurrentSub(GlobalTypes.kudrat);
        this.isLoadingCurrentSub = false;
      } catch (e) {
        this.isLoadingCurrentSub = false;
        throw e;
      }
    },

    openCompleteInfoModal() {
      this.completeInfoModalKey++;
      this.isOpenCompleteInfoModal = true;
    },

    async onCompleteInfo() {
      this.isOpenCompleteInfoModal = false;
      await sleepUtil(300);
      this.selectPacket(this.selectedPacketId);
    },

    reNewSubscription(id, subId) {
      const global_type_user =
        subId == 3 ? GlobalTypes.tahsele : GlobalTypes.kudrat;
      this.globalStore.patchState({ globalTypeUserValue: global_type_user });
      this.selectPacket(id);
    },

    async selectPacket(id) {
      try {
        this.selectedPacketId = id;
        if (this.notCompleteInfo) {
          this.openCompleteInfoModal();
          return;
        }
        this.loadPaymentForm = true;
        this.appleIsLoaded = !this.isMacOrIos;
        this.removeCoupon();
        this.activeStep = steps.payment;
        if (this.isMacOrIos) {
          await this.loadApplePay();
        }
        await sleepUtil(200);
        await this.createPaymentForm();
        await sleepUtil(300);
        this.loadPaymentForm = false;
        if (this.isMacOrIos) {
          if (!this.customerData.id) {
            await this.getCustomerData();
          }
          this.applePayData.renderApplePayButton(
            {
              publicKey: this.runtimeConfig.public.paymentKey,
              environment: this.applePayData.Environment.Development,
              scope: this.applePayData.Scope.TapToken,
              merchant: {
                domain: 'ekhtibarat.com',
                id: 'merchant_e6rh23241141JrIi30oO07322',
              },
              transaction: {
                currency: 'SAR',
                amount: Number(this.total).toFixed(0),
              },
              acceptance: {
                supportedBrands: [
                  this.applePayData.SupportedNetworks.Mada,
                  this.applePayData.SupportedNetworks.Visa,
                  this.applePayData.SupportedNetworks.MasterCard,
                ],
                supportedCardsWithAuthentications: ['3DS', 'EMV'],
              },
              customer: {
                id: this.customerData.id,
                name: [
                  {
                    locale: 'ar',
                    first: this.customerData.first_name,
                    last: this.customerData.last_name,
                    middle: this.customerData.middle_name,
                  },
                ],
                contact: {
                  email: this.customerData.email,
                },
              },
              interface: {
                locale: this.applePayData.Locale.EN,
                theme: this.applePayData.ThemeMode.DARK,
                type: this.applePayData.ButtonType.BUY,
                edges: this.applePayData.Edges.CURVED,
              },
              onCancel: async (event) => {
                console.log('Payment cancelled');
              },
              onError: async (error) => {
                this.showError({ summary: error });
                console.log('Payment error:', error);
              },
              onSuccess: async (data) => {
                console.log('Payment successful:', data);
                const token = data.token || data.id || data.tokenId;
                this.payByApple(token);
              },
              onReady: async () => {
                const element = document.getElementById('apple-pay-button')!;
                element.firstElementChild!.innerHTML = 'إتمام الدفع عبر أبل';
                this.appleIsLoaded = true;
                console.log('Apple Pay button is ready');
              },
            },
            'apple-pay-button'
          );
        }
      } catch (e) {
        console.log(e);
        if (!this.int) {
          this.selectPacket(id);
          this.int = true;
        }
      }
    },

    goToPrice(subId: number | null = null) {
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

    changePacket() {
      this.activeStep = steps.offers;
      this.activePaymentType = paymentTypes.cards;
      this.removeScript('apple-pay');
    },

    async getCustomerData() {
      try {
        const { data: res } = await this.$axios.get(`/payment/getCustomer`);
        if (res.statusCode == 200 && res.data) {
          this.customerData = { ...this.customerData, ...res.data };
        } else {
          this.showError();
          console.log(res.content.errors);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getSubscriptionsData() {
      try {
        this.fetchLoading = true;
        const subData = (
          await this.$axios.get(
            `/subscriptions/all?grades=${this.globalTypeUser}`
          )
        ).data;
        this.cardsData = subData;
        const newArray = deepCloneUtil(this.cardsData);
        newArray.sort((a, b) => {
          return a.sort - b.sort;
        });
        this.cardsData = newArray;
        /*const _index = this.cardsData.findIndex((k) => k.isRecommended == true);
        if (this.$mq == 'mobile') {
          this.cardsData.splice(1, 0, this.cardsData.splice(_index, 1)[0]);
          //this.galleryOptions.start = 1;
        }*/
        if (this.cardsData.length > 3) {
          this.galleryOptions.drag = true;
          // this.galleryOptions.type = 'loop';
          //this.galleryOptions.breakpoints['991'].drag = true;
          // this.galleryOptions.breakpoints['991'].type = 'loop';
        }
        await this.$store.dispatch('getSubscriptionsPanelStatic');
        this.fetchLoading = false;
      } catch (e) {
        this.fetchLoading = false;
        console.log(e);
      }
    },

    async requestCoupon() {
      try {
        this.couponLoad = true;
        const res = await this.$axios.post(`/students/useCoupon`, {
          code: this.discountCodeInput,
          subscriptionId: this.selectedPacket.id,
        });
        if (res.status == 200) {
          this.coupon.couponAmount = res.data.discount;
          this.coupon.couponId = res.data.couponId;
          this.coupon.hasCoupon = true;
          this.couponLoad = false;
        } else {
          this.couponLoad = false;
          this.showError();
        }
      } catch (e: any) {
        this.couponLoad = false;
        if (e.response.status == 404) {
          this.showError({
            life: 2000,
            summary: 'الكود غير صالح أو غير صحيح',
          });
          document.getElementById('codeInput')?.focus();
          document.getElementById('codeInputSm')?.focus();
          setTimeout(() => {
            //@ts-expect-error access el method
            document.getElementById('codeInput')?.select();
            //@ts-expect-error access el method
            document.getElementById('codeInputSm')?.select();
          }, 200);
        }
        console.log(e);
      }
    },
    removeCoupon() {
      this.coupon = new couponItem();
      this.discountCodeInput = null;
    },

    async payByCard4() {
      try {
        this.paymentLoad = true;
        const result = await this.tap.createToken(this.card);
        if (result.error) {
          // Inform the user if there was an error
          const errorElement = document.getElementById('error-handler')!;
          errorElement.style.color = '#dc3545';
          errorElement.textContent =
            this.getErrorMsg(result.error.key) || result.error.message;
          errorElement.style.display = 'block';
          this.paymentLoad = false;
        } else {
          // Send the token to your server
          if (result.id) {
            const form = new paymentBody();
            form.tokenId = result.id;
            form.couponId = this.coupon.couponId;
            form.subscriptionId = this.selectedPacket.id;
            form.amount = Number(this.total).toFixed(0);
            form.paymentMechanism =
              paymentTypeEnum[result.card.scheme.toLowerCase()];
            const { data: res } = await this.$axios.post(
              `payment/purchase`,
              form
            );
            if (res.data) {
              const _data = res.data;
              switch (_data.status) {
                case 1: {
                  if (_data.frameLink) {
                    this.frameLink = _data.frameLink;
                    window.open(
                      this.frameLink,
                      '_self',
                      'noopener=yes,noreferrer=yes'
                    );
                  }
                  break;
                }
                case 8: {
                  this.appRouter.push({
                    path: '/confirm-payment',
                    query: {
                      tab_id: _data.id,
                    },
                  });
                  break;
                }
                default: {
                  this.appRouter.push({
                    path: '/user-panel',
                    query: {
                      page: UserPanelItemsRecord[
                        UserPanelItems.subscriptionList
                      ],
                      id: this.selectedPacket.id,
                      failPayment: 1,
                    },
                  });
                }
              }
              this.paymentId = _data.id;
              this.paymentLoad = false;
            } else {
              this.paymentLoad = false;
              this.showError({
                summary: 'حدثت مشكلة في عملية الدفع يرجى المحاولة مرة أخرى',
              });
            }
          } else {
            this.showError({
              summary: 'حدثت مشكلة في عملية الدفع يرجى المحاولة مرة أخرى',
            });
            this.paymentLoad = false;
          }
        }
      } catch (e: any) {
        this.showError({ summary: e });
        this.paymentLoad = false;
        console.log(e);
      }
    },
    async payByApple(token) {
      try {
        this.paymentLoad = true;
        const form = new paymentBody();
        form.tokenId = token;
        form.couponId = this.coupon.couponId;
        form.subscriptionId = this.selectedPacket.id;
        form.amount = Number(this.total).toFixed(0);
        form.paymentMechanism = paymentTypeEnum.apple;
        const { data: res } = await this.$axios.post(`payment/purchase`, form);
        if (res.data) {
          const _data = res.data;
          switch (_data.status) {
            case 1: {
              if (_data.frameLink) {
                this.frameLink = _data.frameLink;
                window.open(
                  this.frameLink,
                  '_self',
                  'noopener=yes,noreferrer=yes'
                );
              }
              break;
            }
            case 8: {
              this.appRouter.push({
                path: '/confirm-payment',
                query: {
                  tab_id: _data.id,
                },
              });
              break;
            }
            default: {
              this.appRouter.push({
                path: '/user-panel',
                query: {
                  page: UserPanelItemsRecord[UserPanelItems.subscriptionList],
                  id: this.selectedPacket.id,
                  failPayment: 1,
                },
              });
            }
          }
          this.paymentId = _data.id;
          this.paymentLoad = false;
        } else {
          this.paymentLoad = false;
          this.showError({
            summary: 'حدثت مشكلة في عملية الدفع يرجى المحاولة مرة أخرى',
          });
        }
      } catch (e) {
        this.paymentLoad = false;
      }
    },
    fillFreeBody() {
      const body = new paymentBody();
      body.paymentMechanism = paymentMechanism.freeWithCoupon;
      body.amount = 0;
      body.subscriptionId = this.selectedPacket.id;
      body.couponId = this.coupon.couponId;
      body.tokenId = null;
      return body;
    },
    async payByFree() {
      try {
        this.paymentLoad = true;
        const freeBody = this.fillFreeBody();
        const { data: res } = await this.$axios.post(
          `payment/purchase`,
          freeBody
        );
        if (res.data) {
          this.isFreePayment = true;
          await this.appAuth.fetchUser();
          this.paymentLoad = false;
          this.successPaymentCase = true;
          this.surveysCheck();
        } else {
          this.paymentLoad = false;
          this.showError();
        }
      } catch (e) {
        this.paymentLoad = false;
        this.showError();
      }
    },

    async surveysCheck() {
      if (!sessionStorage.getItem('surveys')) return;
      const surveysSetting = JSON.parse(sessionStorage.getItem('surveys')!);
      const formId = surveysSetting['afterSubscribed'].id;
      if (formId) {
        await this.$store.dispatch('surveysRequest', formId);
        this.$store.commit(
          'SET_SELECTED_SURVEYS',
          surveysSetting['afterSubscribed']
        );
        appEvents.emitSurveyModal();
      }
    },

    loadPaymentLib() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          await this.loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js',
            'tab-1'
          );
          await this.loadScript(
            'https://secure.gosell.io/js/sdk/tap.min.js',
            'tab-2'
          );
          //@ts-expect-error access tapjs lib
          this.tap = await Tapjsli(this.runtimeConfig.public.paymentKey);
          this.elements = this.tap.elements({});
          resolve(true);
        } catch (e) {
          console.log(e);
          reject(false);
        }
      });
    },
    async loadApplePay() {
      await this.loadScript(
        'https://tap-sdks.b-cdn.net/apple-pay/build-1.0.13/main.js',
        'apple-pay',
        true
      );
      //@ts-expect-error access tapsdks lib
      this.applePayData = { ...this.applePayData, ...window.TapSDKs };
    },
    createPaymentForm() {
      //create element, pass style and payment options
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          //@ts-expect-error access create method
          this.card = this.elements!.create(
            'card',
            { style: style },
            paymentOptions
          );

          //mount element
          await this.card!.mount('#element-container');
          //card change event listener
          await this.card!.addEventListener('change', (event) => {
            // if (event.BIN) {
            // }
            // if (event.loaded) {
            // }
            const displayError = document.getElementById('error-handler')!;
            if (event.error) {
              displayError.style.display = 'none';
              console.log('eventError', event.error);
              /*setTimeout(() => {
                displayError.style.color = '#dc3545';
                displayError.textContent =
                  this.getErrorMsg(event.error.key) || event.error.message;
                displayError.style.display = 'block';
              }, 150);*/
            } else {
              displayError.textContent = '';
            }
          });

          resolve(true);
        } catch (e) {
          reject(e);
          console.log(e);
        }
      });
    },

    loadScript(FILE_URL, id, async = true, type = 'text/javascript') {
      return new Promise((resolve, reject) => {
        try {
          const scriptEle = document.createElement('script');
          scriptEle.type = type;
          scriptEle.async = async;
          scriptEle.src = FILE_URL;
          scriptEle.id = id;

          scriptEle.addEventListener('load', (ev) => {
            resolve({ status: true });
          });

          scriptEle.addEventListener('error', (ev) => {
            reject({
              status: false,
              message: `Failed to load the script ${FILE_URL}`,
            });
          });

          document.body.appendChild(scriptEle);
        } catch (error) {
          reject(error);
        }
      });
    },
    removeScript(id) {
      document.getElementById(id)?.remove();
    },

    getErrorMsg(key) {
      switch (key) {
        case 'card_number_required':
          return 'يرجى إدخال رقم البطاقة';
        case 'expiry_date_required':
          return 'يرجى إدخال تاريخ الصلاحية للبطاقة';
        case 'cvv_required':
          return 'يرجى إدخال رقم CVC خلف البطاقة';
        case 'card_holder_required':
          return 'يرجى إدخال الاسم على البطاقة';
        case 'expiry_date_past':
          return 'تاريخ انتهاء صلاحية بطاقتك مدخل في الماضي.';
        case 'error_invalid_card':
          return 'بطاقة غير صالحة';
        case 'error_invalid_expiry_characters':
          return 'تاريخ انتهاء صلاحية البطاقة غير صالحة';
        case 'cvv_digit_required':
          return 'يجب إدخال 3 أرقام في خانة CVC';
        case 'expiry_year_required':
          return 'يجب إدخال السنة في خانة التاريخ';
        case 'error_card_holder_short':
          return 'يجب أن يكون الاسم على الأقل 3 أحرف';
        default: {
          return null;
        }
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

    async changePaymentMethod(id) {
      if (id != this.activePaymentType) {
        this.activePaymentType = id;
      }
    },

    test() {
      // this.$bvModal.show('my-modal');
    },

    getDataModal(date) {
      if (!date) return null;
      return dateUi(new Date(date));
    },
  },
};
</script>
<style lang="scss" src="./subscribes-panel.scss" scoped></style>
