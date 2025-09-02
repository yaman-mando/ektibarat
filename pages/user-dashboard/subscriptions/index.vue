<template>
  <user-panel-wrapper :hasLInfo="windowSize.isDesktop" :hasRInfo="windowSize.isDesktop" :showMobileHeader="true"
    :pageTitle="pageTitle" :innerBack="activeStep != steps.subscriptions" @backToEvent="toBack"
    contentClass="max-w-[1060px] !mx-auto lg:px-0 px-[5px]" contentWrapperClass="!mb-0">
    <div class="subscriptions-part" :class="{ 'is-sub': activeStep == steps.subscriptions }">
      <div v-if="fetchLoading" class="b-overly">
        <app-overlay />
      </div>
      <template v-else>
        <lazy-vee-validate-provider>

          <template v-if="activeStep == steps.subscriptions">
            
            <div class="subscriptions-step bg-white shadow-custom rounded-[8px] py-[30px] px-[25px] xl:mt-[50px]">
              <span class=" font-bold text-[24px] text-gray-63">الاشتراكات</span>
              <div v-if="subscriptions" class="_sub_list">
                <div v-for="sub of subscriptions.filter(k => k.subjectId !== 3)" :key="sub.id" class="_sub">
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
                      <span class="_type" :class="{ 'is-free': sub.freeType != null }">
                        <template v-if="sub.freeType == null">
                          {{ sub.title }}
                        </template>
                        <template v-else>الأساسية</template>
                      </span>
                    </div>
                    <div v-if="sub.freeType == null && sub.endDate" class="c_date">
                      <span>
                        ينتهي اشتراكك بتاريخ
                        {{ getDataModal(sub.endDate) }}
                      </span>
                    </div>
                    <div v-if="sub.freeType != null" class="c_free">
                      <span class="_t1">ميزات اشتراكك محدودة الآن</span>
                      <span class="_t2">
                        اشترك في باقات اختبارات
                        <br v-if="windowSize.isMobileSize" />
                        للحصول على المزيد من المزايا
                      </span>
                    </div>
                  </div>
                  <div class="_lp">
                    <app-button size="md" :label="sub.freeType == null ? 'تجديد' : 'اشترك'" @click="
                      sub.freeType == null
                        ? reNewSubscription(sub.id, sub.subjectId)
                        : goToPrice(sub.subjectId)
                      " />
                  </div>
                </div>
              </div>
            </div>
            <lazy-complete-info-modal :key="completeInfoModalKey" v-model:isOpenModal="isOpenCompleteInfoModal"
              @onCompleteInfo="onCompleteInfo" />
          </template>
          <template v-if="activeStep == steps.offersParent">
            <div class="">
              <div v-if="windowSize.isDesktop" @click="toBack"
                class="flex items-center gap-x-[10px] cursor-pointer mt-[-30px] mb-[28px]">
                <i class="fa fa-chevron-right"></i>
                <span>رجوع للخلف</span>
              </div>
              <div class="flex justify-center" v-if="windowSize.isDesktop">
                <span class="text-orange-39 text-[30px] font-bold">اختيار الباقة</span>
              </div>
              <section class="py-[15px]">
                <app-subscription-parent-cards :packets="subscriptionsParentList"
                  @select="id => goToSubscriptions(id)" />
              </section>
            </div>

          </template>
          <template v-if="activeStep === steps.offers && subscriptionsList">
            <div v-if="windowSize.isDesktop" @click="toBack"
              class="flex items-center gap-x-[10px] cursor-pointer mt-[-30px] mb-[28px]">
              <i class="fa fa-chevron-right"></i>
              <span>رجوع للخلف</span>
            </div>
            <subscription-offers @select="id => selectPacket(id)" :parent="subscriptionsList" />
          </template>
          <template v-if="activeStep == steps.payment">
            <div v-if="windowSize.isDesktop" @click="toBack"
              class="flex items-center gap-x-[10px] cursor-pointer mt-[-30px] mb-[28px]">
              <i class="fa fa-chevron-right"></i>
              <span>رجوع للخلف</span>
            </div>
            <div v-if="selectedPacket" class="payment-step">
              <div v-if="windowSize.isDesktop" class="grid gap-y-[10px]">
                <span class=" text-blue-d6 font-bold text-[24px]">الدفع</span>
                <span class="p-selected text-dark-63 text-[18px] font-medium">
                  الباقة:
                  <span class="p-name">{{ selectedPacket.title }}</span>
                </span>
              </div>
              <div class="s1-info relative">
                <app-overlay v-if="!appleIsLoaded" />
                <div :style="{ opacity: !appleIsLoaded ? 0 : 1 }" class="s1-p1-info relative"
                  :class="{ free: total <= 0 }">
                  <template v-if="!selectedPacket.freeType">
                    <div class="s1-p1-rw-1">
                      <span>معلومات الدفع</span>
                    </div>
                    <div class="flex justify-center">
                      <span class=" text-dark-63 font-medium text-[16px]">
                        سيتم تفعيل اشتراكك على هذا الحساب تلقائيا بعد إتمامك
                        لعملية الدفع
                      </span>
                    </div>
                    <div class="s1-p1-rw-2">
                      <div class="r-part hide-to-tablet">
                        <span>كود الخصم</span>
                      </div>
                      <div class="l-part">
                        <vee-form v-slot="{ meta }" tag="div" class="a-discount-form w-full">
                          <form-input v-model:inputValue="discountCodeInput" :rules="{ required: true }"
                            inputId="codeInputSm" :isDisabled="coupon.hasCoupon" :hideLabel="true"
                            :hideErrorLabel="true" />
                          <app-button v-if="coupon.hasCoupon" size="md" label="إزالة" @click="removeCoupon()" />
                          <app-button v-else class="!w-[90px] !h-[36px]" size="md" colorType="success"
                            :isLoading="couponLoad" :isDisabled="!meta.valid" label="تطبيق" @click="requestCoupon" />
                        </vee-form>
                      </div>
                    </div>
                    <hr style="border-width: 1px;border-color: #8F8F8F" />
                  </template>
                  <div v-show="total > 0">
                    <div class="s1-p1-rw-3">
                      <span class="title">وسيلة الدفع</span>
                      <div class="s1-p1-rw-3-rw-2 relative">
                        <div :class="{
                          active: activePaymentType === paymentTypes.cards,
                        }" class="s1-p1-rw-3-rw-2-cl-1" @click="changePaymentMethod(paymentTypes.cards)">
                          <span class="c-check"></span>
                          <div class="c-content">
                            <img src="/images/svg/payment-credit.svg" alt="اختبارات" />
                          </div>
                        </div>
                        <app-overlay v-if="!appleIsLoaded" />

                        <div class="s1-p1-rw-3-rw-2-cl-2" :class="{
                          active: activePaymentType === paymentTypes.apple,
                          disabled: disableApple,
                        }" @click="changePaymentMethod(paymentTypes.apple)">
                          <span class="c-check"></span>
                          <div class="c-content">
                            <img src="/images/svg/payment-apple-pay.svg" alt="apple-pay" />
                            <span>أبل باي</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="card-info relative">
                      <form v-show="activePaymentType == paymentTypes.cards" id="form-container" class="relative"
                        method="post" action="/charge">
                        <div id="element-container" class="relative" style="min-height: 176px">
                          <app-overlay v-if="loadPaymentForm" />
                        </div>
                        <div id="error-handler" role="alert"></div>
                        <div id="success" style="display: none; position: relative; float: left">
                          <i class="fa fa-check-circle" style="color: var(--green-8c)"></i>
                          <span id="token"></span>
                        </div>
                      </form>

                      <div v-if="activePaymentType == paymentTypes.apple" class="card-apple-info">
                        <span>
                          تأكد من استخدامك لمتصفح سفاري
                          <br class="hide-from-tablet" />
                          لإتمام عملية الدفع عبر أبل
                        </span>
                      </div>
                      <app-overlay v-if="paymentLoad" />
                      <div class="flex justify-center items-center">
                        <app-g-button v-if="activePaymentType == paymentTypes.cards" @click="payByCard4()" width="250px"
                          height="48px" radius="8px" bg-class="bg-purple-78" text-color="text-white">
                          إتمام عملية الدفع
                        </app-g-button>
                      </div>
                      <div id="apple-pay-button" :style="{
                        display:
                          activePaymentType == paymentTypes.apple
                            ? 'flex'
                            : 'none',
                      }"></div>
                    </div>
                  </div>
                  <template v-if="total <= 0">
                    <app-overlay v-if="paymentLoad" />
                    <app-button class="normal-btn payment-free-btn" label="إتمام التسجيل" @click="payByFree()" />
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
                    <template v-if="!selectedPacket.freeType">
                      <div class="info-item">
                        <span class="title">السعر</span>
                        <span class="caption">
                          {{ selectedPacket.oldPrice.toFixed(2) }} ريال
                        </span>
                      </div>
                      <div class="info-item">
                        <span class="title">تخفيض الباقة</span>
                        <span class="caption red" style="
                            display: flex;
                            align-items: center;
                            column-gap: 3px;
                          ">
                          <span style="direction: ltr">{{ discount }}</span>
                          <span>ريال</span>
                        </span>
                      </div>
                    </template>
                    <div v-if="coupon.hasCoupon" class="info-item">
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
                    <div v-if="total > 0" class="price">
                      <span class="total">{{ total }}</span>
                      <img src="/images/svg/s-riyal-purple.svg" />
                    </div>
                    <div v-else class="price">
                      <span class="total">مجاناً</span>
                    </div>
                  </div>
                  <span v-if="total > 0" class="s1-p2-note">
                    شامل ضريبة القيمة المضافة
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="activeStep == steps.successPayment">
            <client-only>
              <div class="confirm-payment">
                <div class="r-part">
                  <span class="c-title">حيّاك الله في اختبارات!</span>
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

                  <div class="mt-[20px] flex justify-between items-center">
                    <span v-if="windowSize.isDesktop" class=" text-purple-78 font-bold text-[26px]">جاهز تبدأ
                      تدريبك؟</span>
                    <app-g-button @click="router.push(webUserTrainWithUs())" bg-class="bg-purple-78"
                      text-color="text-white" radius="8px" :width="windowSize.isDesktop ? '160px' : '100%'"
                      height="46px">ابدأ تدريبك الآن!</app-g-button>
                  </div>
                  <div class="grid">
                    <span class="text-purple-78 font-bold text-[26px] mb-[10px]">انضم لقنوات اختبارات</span>
                    <span class="text-dark-2b font-medium text-[16px]">محتوى إثرائي مميز، ومسابقات وعروض حصريّة لأعضاء
                      اختبارات</span>
                    <div class="flex items-center gap-[15px] sm:gap-[25px] mt-[25px]">
                      <app-g-button bg-class="bg-[#25D366]" text-color="text-white" radius="8px"
                        :width="windowSize.isDesktop ? '140px' : '100%'" height="46px">
                        <div class="flex items-center gap-x-[10px]">
                          <i class="fab fa-whatsapp"></i>
                          <span>واتساب</span>
                        </div>
                      </app-g-button>
                      <app-g-button bg-class="bg-[#25A3E1]" text-color="text-white" radius="8px"
                        :width="windowSize.isDesktop ? '140px' : '100%'" height="46px">
                        <div class="flex items-center gap-x-[10px]">
                          <i class="fab fa-telegram"></i>
                          <span>تلغرام</span>
                        </div>
                      </app-g-button>
                    </div>

                  </div>
                </div>
                <div v-if="paymentData" class="l-part w-full">
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
                          <span v-else>شهراً</span>
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
                          <span class="caption red" style="display: flex; align-items: center; column-gap: 3px">
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
                        <div v-if="
                          paymentData.couponDiscount && paymentData.couponDiscount > 0
                        " class="info-item sm">
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
                        <img src="/images/svg/s-riyal-purple.svg" />
                      </div>
                    </div>
                    <span class="s1-p2-note">شامل ضريبة القيمة المضافة</span>
                    <app-g-button class="mt-[15px]" :border="true" border-color="border-purple-78"
                      bg-class="bg-transparent" text-color="text-purple-78" radius="8px" width="100%"
                      @click="downloadInvoice()" height="46px">
                      تحميل الإيصال
                    </app-g-button>
                  </div>
                </div>
              </div>
            </client-only>
          </template>
          <template v-if="activeStep == steps.failPayment">
            <div class="grid justify-center gap-x-[20px]">
              <p class=" text-red-5e text-[16px] font-bold">فشلت عملية الدفع</p>
              <app-g-button class="mt-[15px]" :border="true" border-color="border-purple-78" bg-class="bg-transparent"
                text-color="text-purple-78" radius="8px" width="100%" @click="activeStep = steps.subscriptions"
                height="46px">
                العودة للاشتراكات
              </app-g-button>
            </div>
          </template>

        </lazy-vee-validate-provider>
      </template>

      <prime-dialog id="my-modal" :modal="true" :showHeader="false" :closable="true">
        <iframe :src="frameLink" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          name="iframe_a" height="700px" width="700px" allowfullscreen frameborder="0" scrolling="no"
          title="Iframe Example"></iframe>
      </prime-dialog>
    </div>
  </user-panel-wrapper>
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
import { useUserPanelStore } from '~/store/user-panel';
import type { SubscriptionsResponse } from '~/main/modules/subscriptions/data-access/subscriptions.model';
import { webUserTrainWithUs } from '~/main/utils/web-routes.utils';

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
  subscriptionId = null as null | number;
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
  offersParent: 1,
  offers: 2,
  payment: 3,
  successPayment: 4,
  failPayment: 5
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
    const panelStore = useUserPanelStore()
    const subscriptionsStore = useSubscriptionsStore();
    const runtimeConfig = useRuntimeConfig();
    const router = useRouter()
    return {
      panelStore,
      windowSize,
      subscriptionsStore,
      globalStore,
      ...useToastMessage(),
      ...useSetupAuth(),
      ...useSetupRoute(),
      runtimeConfig,
      router,
      globalTypeUser: computed(() => panelStore.globalType),
      currentUserSub: computed(
        () => subscriptionsStore.state.userCurrentSubVal!
      ),
      subscriptionsParentList: computed(() => panelStore.subscriptionsParents),
      subscriptionsList: computed(() => panelStore.subscriptions),
      defaultSub: runtimeConfig.public.defaultSubjectId,
      defaultSubTahsele: runtimeConfig.public.defaultSubjectIdTahsele,
    };
  },
  data() {
    return {
      fetchLoading: false,
      cardsData: null as SubscriptionsResponse | null,
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
      successPaymentCase: true,
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
      paymentData: null as any,
      invoiceId: null as any,
      prevStep: null as any,
      webUserTrainWithUs
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
      return this.cardsData?.subscriptions.filter((k) => k.id == this.selectedPacketId)[0];
    },
    discount() {
      if (!this.selectedPacket) return "0.00";

      const current = this.selectedPacket.currentPrice ?? 0;
      const old = this.selectedPacket.oldPrice ?? 0;

      return (current - old).toFixed(2);
    },

    total(): any {
      if (!this.selectedPacket) return "0.00";

      const price = this.selectedPacket.currentPrice ?? 0;
      const discount = this.coupon?.couponAmount ?? 0;

      const finalTotal = price - (price * discount) / 100;

      return finalTotal.toFixed(2);
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
    subscriptionsParent() {
      return this.panelStore.subscriptionsParents
    },

    pageTitle() {
      switch (this.activeStep) {
        case this.steps.offersParent:
          return 'اختيار باقة';
        case this.steps.offers:
          return 'اختيار مدة الاشتراك';
        case this.steps.payment:
          return 'الدفع';
        default:
          return 'الاشتراكات';
      }
    }
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

    activeStep: {
      handler(newVal, oldVal) {
        if (newVal > oldVal) this.prevStep = oldVal
        else {
          if (this.prevStep) {
            this.prevStep -= 1
          }
        }
      }
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
      this.invoiceId = this.appRoute.query['tap_id'] ?? this.appRoute.query['tab_id'];
      if (this.invoiceId) {
        this.checkCharge()
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

    async checkCharge() {
      try {
        this.paymentData = await this.$axios.get(
          `/payment/checkCharge/${this.invoiceId}`
        );
        if (this.paymentData.status != 8) {
          this.activeStep = steps.failPayment
        }

        this.activeStep = steps.successPayment
      } catch (e) {

      }
    },

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

    async goToSubscriptionsParent() {
      try {
        await this.panelStore.getStudentSubscriptionsParent()
        this.activeStep = steps.offersParent
      } catch (e) {
        console.log(e)
      }
    },

    async goToSubscriptions(id) {
      try {
        await this.panelStore.getStudentSubscriptions(id)
        this.activeStep = steps.offers
      } catch (e) {
        console.log(e)
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
        newArray?.subscriptions.sort((a, b) => {
          return a.sort - b.sort;
        });
        this.cardsData = newArray;
        /*const _index = this.cardsData.findIndex((k) => k.isRecommended == true);
        if (this.$mq == 'mobile') {
          this.cardsData.splice(1, 0, this.cardsData.splice(_index, 1)[0]);
          //this.galleryOptions.start = 1;
        }*/
        if (this.cardsData && this.cardsData?.subscriptions.length > 3) {
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
          subscriptionId: this.selectedPacket?.id,
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
            form.subscriptionId = this.selectedPacket?.id ?? 0;
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
                      id: this.selectedPacket?.id,
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
        form.subscriptionId = this.selectedPacket?.id ?? 0;
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
                  id: this.selectedPacket?.id,
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
      body.subscriptionId = this.selectedPacket?.id ?? 0;
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


    toBack() {
      if (this.prevStep !== null)
        this.activeStep = this.prevStep
      // if (this.activeStep == steps.offersParent) {
      //   this.activeStep = steps.subscriptions
      // }
      // if (this.activeStep == steps.offers) {
      //   this.activeStep = steps.offersParent
      // }
      // if (this.activeStep == steps.payment) {
      //   this.activeStep = steps.offers
      // }
    },

    async downloadInvoice() {
      try {
        const url = `${this.runtimeConfig.public.apiUrl}/payment/exportInvoice/${this.invoiceId}`;
        const link = document.createElement('a');
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

    async changePaymentMethod(id) {
      if (id != this.activePaymentType) {
        this.activePaymentType = id;
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

.subscriptions-part {
  //padding: 0 25px;
  width: 100%;
  margin-left: auto !important;
  margin-right: auto !important;
  max-width: 100vw;

  .web-subs-part-co {
    width: 100%;
    max-width: 100%;

    ::v-deep {
      .asd-col-wrapper {
        max-width: 100%;
      }
    }
  }

  .qw_r {
    margin: 0 !important;
    align-self: center;

    @include web-desktop-up() {
      align-self: flex-start;
    }
  }

  .sub-en-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;

    @include web-desktop-up() {
      flex-direction: row;
      justify-content: space-between;
    }

    &__q {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-direction: column;

      @include web-desktop-up() {
        flex-direction: row;
        justify-content: flex-start;
      }
    }

    &__su-name {
      font-weight: bold;
      color: var(--purple-8c);
    }
  }

  .su-m-label {
    text-align: center;
    display: block;
    font-weight: bold;
    font-size: 16px;
    align-self: center;

    @include web-desktop-up() {
      align-self: flex-start;
    }
  }

  .b-overly {
    height: 580px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rw-1 {
    display: flex;
    justify-content: center;
    margin-inline-start: 16px;

    span {
      font-size: 18px;
      font-weight: bold;
      color: var(--purple-8c);
    }

    &.is-sub {
      justify-content: flex-start;

      span {
        color: var(--dark-63);
        font-size: 24px;
        //margin-inline-start: 34px;
        font-weight: bold;
      }

      @include mobile-down() {
        justify-content: center;

        span {
          font-size: 18px;
          margin-inline-start: 0;
        }
      }
    }
  }

  .rw-2 {
    margin-top: 10px;
    display: grid;
    row-gap: 10px;
    margin-inline-start: 16px;
    margin-bottom: 20px;

    .c-date {
      font-size: 16px;
      color: var(--black-24);
    }

    .c-note {
      font-size: 16px;
      color: var(--black-24);
      font-weight: bold;
    }
  }

  .t-2 {
    font-size: 14px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    color: var(--dark-2b);
    margin-top: 10px;
  }

  .rw-3 {
    width: 100%;

    .splide {
      ::v-deep .splide__track {
        padding: 10px 8px 30px;

        ul.splide__list {
          //align-items: baseline;
          justify-content: center;
          justify-items: center;
          margin-left: auto !important;
          margin-right: auto !important;
          box-shadow: 0 0px 15px #00000033;
          border-radius: 20px;

          @media (min-width: 816px) and (max-width: 992px) {
            //width: 100%;
            //justify-content: center;
          }

          @media (min-width: 1299px) {
            //width: 100%;
            //justify-content: center;
          }

          li {
            display: grid;
            align-items: end;
            min-height: 442px;
            height: 100%;
          }
        }
      }
    }
  }

  .subscriptions-step {
    ._sub_list {
      background: white;

      ._sub {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 20px 0;
        margin-top: 15px;

        &:not(:last-child) {
          border-bottom: 1px solid #bcccdb;
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
              color: var(--purple-78);
            }

            ._type {
              padding: 3px 10px;
              border: 1px solid;
              font-size: 12px;
              font-weight: 500;
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
            font-weight: 500;
          }

          .c_free {
            display: grid;
            row-gap: 8px;

            ._t1 {
              font-size: 16px;
              font-weight: 500;
              color: var(--dark-63);
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
            background: var(--purple-78);
            color: white;
            width: 100px;
            height: 40px;
            border-radius: 8px;
          }
        }

        @include web-mobile-only() {
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

  .payment-step {
    //padding: 20px 18px;

    .s1-rw-1 {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .p-selected {
        font-size: 16px;
        color: var(--gray-63);

        .p-name {
          color: var(--purple-8c);
          margin-inline-start: 3px;
        }
      }

      .p-change {
        font-size: 16px;
        font-weight: bold;
        color: var(--purple-8c);
        cursor: pointer;
      }
    }

    hr {
      border-width: 2px;
      border-color: var(--gray-63);
      opacity: 0.5;
      margin-top: 10px;
      margin-bottom: 0;
    }

    .s1-info {
      display: grid;
      grid-template-columns: 1fr 330px;
      grid-row-gap: 15px;
      column-gap: 20px;
      align-items: center;

      @media (min-width:960px) {
        margin-top: 21px;
      }

      .s1-p1-info {
        box-shadow: 0px 0px 15px #00000033;
        border-radius: 20px;
        min-height: 518px;
        padding: 14px 20px 25px 21px;

        .s1-p1-rw-1 {
          display: flex;
          align-items: center;
          justify-content: center;

          span {
            font-size: 18px;
            font-weight: bold;
            color: var(--purple-8c);
          }
        }

        .s1-p1-rw-2 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;

          .r-part {
            span {
              font-size: 16px;
              color: var(--black-24);
            }
          }

          .l-part {
            .a-discount-form {
              display: grid;
              grid-template-columns: 200px 90px;
              column-gap: 15px;
              align-items: center;

              .discountCode {
                position: relative;

                input {
                  box-shadow: none;
                  height: 32px;
                  border: 1px solid #b7b7b7cc;
                  border-radius: 3px;
                  font-size: 14px;
                  color: var(--black-24);

                  &[disabled] {
                    opacity: 0.7;
                  }
                }

                i {
                  position: absolute;
                  top: 8px;
                  left: 10px;
                  color: var(--green-8c);
                  font-size: 13px;
                }
              }

              @include normal-btn() {
                border-radius: 3px;
                background: var(--green-8c);
                font-size: 14px;
                height: 32px;
                width: 80px;
                color: white;
              }
            }
          }
        }

        hr {
          margin-top: 14px;
        }

        .s1-p1-rw-3 {
          display: grid;
          row-gap: 12px;
          margin-top: 18px;

          .s1-p1-rw-3-rw-2 {
            display: grid;
            align-items: center;
            column-gap: 24px;
            grid-template-columns: repeat(2, 1fr);

            .s1-p1-rw-3-rw-2-cl-1,
            .s1-p1-rw-3-rw-2-cl-2 {
              display: grid;
              align-items: center;
              grid-template-columns: 18px auto;
              border-radius: 5px;
              height: 42px;
              padding-inline-start: 10px;
              column-gap: 10%;
              cursor: pointer;
              background: white;
              border: 0.5px solid #8f8f8f80;

              &.disabled {
                border: none;
                pointer-events: none;
                opacity: 0.5;
              }

              .c-check {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                border: 0.5px solid #8f8f8f80;
                opacity: 0.8;
                cursor: pointer;
              }

              &.active {
                border: 1px solid #46008c;
                background: white;

                .c-check {
                  border: 5px solid var(--purple-8c);
                }
              }
            }

            .s1-p1-rw-3-rw-2-cl-1 {
              .c-content {
                display: grid;
                grid-template-columns: repeat(3, auto);
                column-gap: 8px;
                align-items: center;
                justify-content: flex-start;

                img {
                  width: 100%;
                }
              }
            }

            .s1-p1-rw-3-rw-2-cl-2 {
              .c-content {
                display: grid;
                grid-template-columns: repeat(2, auto);
                column-gap: 12px;
                align-items: center;
                justify-content: flex-start;

                span {
                  font-size: 16px;
                  color: var(--gray-63);
                }
              }

              &.disabled {
                background: #eeeeee;
              }
            }
          }
        }

        .payment-free-btn {
          margin-top: 30px;
          border-radius: 10px;
          width: 221px;
          height: 45px;
          background: var(--purple-8c);
          color: white;
          font-weight: bold;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          margin-right: auto;
        }
      }

      .s1-p2-info {
        box-shadow: 0px 0px 15px #00000033;
        border-radius: 20px;
        min-height: 518px;
        padding: 15px;

        .s1-p2-rw-1 {
          display: flex;
          align-items: center;
          justify-content: center;

          span {
            font-size: 18px;
            font-weight: bold;
            color: var(--purple-8c);
          }
        }

        .s1-p2-info-data {
          margin-top: 20px;
          padding-bottom: 2px;
          display: grid;
          row-gap: 10px;

          .info-item {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .title {
              font-size: 14px;
              color: var(--gray-63);
            }

            .caption {
              font-size: 16px;
              color: var(--purple-8c);

              &.red {
                color: var(--red-63);
              }
            }
          }
        }

        .s1-p2-toplam {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          height: 29px;

          .title {
            font-size: 16px;
            color: var(--purple-8c);
            font-weight: bold;
          }

          .price {
            font-size: 16px;
            color: var(--purple-8c);
            display: flex;
            column-gap: 6px;
            align-items: center;

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
      }

      .card-info {
        margin-top: 24px;

        .a-card-info-form {
          .form-el {
            display: grid;
            row-gap: 23px;

            label {
              font-size: 16px;
              color: var(--gray-63);
              margin-bottom: 7px;
            }

            input {
              height: 32px;
              border-radius: 3px;
              border-color: #b7b7b7cc;
              padding: 6px 10px;
              box-shadow: none;
              font-size: 14px;
              color: var(--gray-63);

              &::placeholder {
                opacity: 0.5;
              }

              &.invalid {
                border-color: var(--red-63);
              }
            }

            .c-rw-info {
              display: grid;
              grid-template-columns: 46.31% 28.42% 18.94%;
              column-gap: 3.15%;
              align-items: center;

              .c-number {
                .input-group {
                  position: relative;

                  img {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                  }
                }
              }

              .c-expireDate-rw-1,
              .c-cvc-rw-1 {
                display: grid;
                column-gap: 5px;
                align-items: center;
                justify-content: flex-start;
                grid-template-columns: auto 16px;
                margin-bottom: 8px;

                i {
                  font-size: 16px;
                  color: #b7bac0;
                  cursor: pointer;
                }

                label {
                  margin: 0;
                }
              }
            }
          }
        }

        @include normal-btn() {
          width: 221px;
          height: 45px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          color: white;
          background: var(--purple-8c);
          justify-self: center;
          margin-top: 5px;
          margin-left: auto;
          margin-right: auto;
          display: block;
        }

        .b-note {
          color: var(--black-24);
          font-size: 13px;
          margin-top: 15px;
          display: flex;
        }

        #apple-pay-button {
          display: flex;
          justify-content: center;
          margin-top: 20px;

          ::v-deep button {
            width: 221px;
            height: 45px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            background: var(--purple-8c);

            &:disabled {
              opacity: 0.5;
            }
          }
        }
      }

      .card-apple-info {
        display: flex;
        justify-content: center;

        span {
          text-align: center;
          line-height: 22px;
          font-size: 14px;
          font-weight: bold;
          color: var(--black-24);
        }
      }
    }
  }

  .c-check {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 0.5px solid #8f8f8f80;
    opacity: 0.8;
    cursor: pointer;

    &.active {
      border: 5px solid var(--purple-8c);
    }
  }

  .confirm-payment {
    display: grid;
    grid-row-gap: 40px;
    row-gap: 40px;
    //padding: 20% 15px;
    //justify-items: center;

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

  @include lg-down() {
    .payment-step {
      .s1-info {
        grid-template-columns: 1fr;
        grid-row-gap: 15px;
      }
    }
  }

  @include web-mobile-only() {
    //padding: 0 15px;
    margin: 0 0 100px;

    .rw-1 {
      margin-inline-start: 15px;
    }

    .rw-2 {
      margin-top: 5px;
      row-gap: 5px;
      margin-inline-start: 15px;
    }

    .rw-3 {
      .splide {
        ::v-deep .splide__track {
          padding: 30px 0 20px;
        }

        ul {
          li {
            display: grid;
            align-items: end;
          }
        }
      }

      @include mobile-down() {
        margin-bottom: 30px;

        ::v-deep .hooper-list {
          box-shadow: 0 0 15px #00000033;

          .first-slide {
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;

            .price-card {
              box-shadow: 10px 0 15px rgba(0, 0, 0, 0.2);
            }
          }

          .last-slide {
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;

            .price-card {
              box-shadow: -10px 0 15px rgba(0, 0, 0, 0.2);
            }
          }
        }
      }
    }

    .payment-step {
      padding: 15px 15px 0;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;

      .s1-info {
        grid-row-gap: 20px;

        .s1-p1-info {
          grid-row: 2;
          padding: 14px 10px 33px;

          .s1-p1-rw-2 {
            .l-part {
              width: 100%;

              .a-discount-form {
                grid-template-columns: 1fr 80px;
              }
            }
          }

          .s1-p1-rw-3 {
            display: grid;
            row-gap: 12px;

            .s1-p1-rw-3-rw-2 {
              grid-template-columns: 1fr;
              row-gap: 15px;
            }
          }

          .card-info {
            .a-card-info-form {
              .form-el {
                .c-rw-info {
                  display: flex;
                  flex-wrap: wrap;
                  row-gap: 25px;

                  .creadyNum {
                    flex: 1 0 100%;
                  }

                  .periodDate,
                  .cvcCode {
                    flex: 0 0 48.4%;
                  }
                }
              }
            }

            .b-note {
              color: var(--black-24);
              font-size: 13px;
              margin-top: 15px;
              display: flex;
            }
          }

          &.free {
            min-height: 242px;
          }
        }

        .s1-p2-info {
          min-height: 287px;
          padding: 15px 10px;
        }
      }
    }
  }

  .form-row {
    width: 70%;
    float: left;
    background-color: #ededed;
  }

  #card-element {
    background-color: transparent;
    height: 40px;
    border-radius: 4px;
    border: 1px solid transparent;
    box-shadow: 0 1px 3px 0 #e6ebf1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
  }

  #card-element--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
  }

  #card-element--invalid {
    border-color: #fa755a;
  }

  #card-element--webkit-autofill {
    background-color: #fefde5 !important;
  }

  #submitbutton,
  #tap-btn {
    align-items: flex-start;
    background-attachment: scroll;
    background-clip: border-box;
    background-color: rgb(50, 50, 93);
    background-image: none;
    background-origin: padding-box;
    background-position-x: 0%;
    background-position-y: 0%;
    background-size: auto;
    border-bottom-color: rgb(255, 255, 255);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom-style: none;
    border-bottom-width: 0px;
    border-image-outset: 0px;
    border-image-repeat: stretch;
    border-image-slice: 100%;
    border-image-source: none;
    border-image-width: 1;
    border-left-color: rgb(255, 255, 255);
    border-left-style: none;
    border-left-width: 0px;
    border-right-color: rgb(255, 255, 255);
    border-right-style: none;
    border-right-width: 0px;
    border-top-color: rgb(255, 255, 255);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-top-style: none;
    border-top-width: 0px;
    box-shadow:
      rgba(50, 50, 93, 0.11) 0px 4px 6px 0px,
      rgba(0, 0, 0, 0.08) 0px 1px 3px 0px;
    box-sizing: border-box;
    color: rgb(255, 255, 255);
    cursor: pointer;
    display: block;
    float: left;
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 15px;
    font-stretch: 100%;
    font-style: normal;
    font-variant-caps: normal;
    font-variant-east-asian: normal;
    font-variant-ligatures: normal;
    font-variant-numeric: normal;
    font-weight: 600;
    height: 35px;
    letter-spacing: 0.375px;
    line-height: 35px;
    margin-bottom: 0px;
    margin-left: 12px;
    margin-right: 0px;
    margin-top: 28px;
    outline-color: rgb(255, 255, 255);
    outline-style: none;
    outline-width: 0px;
    overflow-x: visible;
    overflow-y: visible;
    padding-bottom: 0px;
    padding-left: 14px;
    padding-right: 14px;
    padding-top: 0px;
    text-align: center;
    text-decoration-color: rgb(255, 255, 255);
    text-decoration-line: none;
    text-decoration-style: solid;
    text-indent: 0px;
    text-rendering: auto;
    text-shadow: none;
    text-size-adjust: 100%;
    text-transform: none;
    transition-delay: 0s;
    transition-duration: 0.15s;
    transition-property: all;
    transition-timing-function: ease;
    white-space: nowrap;
    width: 150.781px;
    word-spacing: 0px;
    writing-mode: horizontal-tb;
    -webkit-appearance: none;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-border-image: none;
  }
}

.confirm-payment {
  display: grid;
  column-gap: 30px;
  grid-template-columns: 1fr 330px;
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
          display: flex;
          align-items: center;
          column-gap: 6px;

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
    padding: 15px 15px 10px;

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

::v-deep #my-modal {
  max-width: max-content;
}

::v-deep #codeInputSm {
  height: 36px;
}
</style>
