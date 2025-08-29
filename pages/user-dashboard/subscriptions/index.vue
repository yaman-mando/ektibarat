<template>
  
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
      //activeStep: steps.subscriptions,
      activeStep: steps.offers,
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

    async goToSubscriptionsParent() {
      try {
        await this.panelStore.getStudentSubscriptionsParent()
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
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

.subscriptions-part {
  padding: 0 25px;
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
    padding: 20px 18px;

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
      grid-template-columns: 1fr;
      grid-row-gap: 15px;
      column-gap: 4.61%;
      align-items: center;
      margin-top: 21px;

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
              grid-template-columns: 150px 80px;
              column-gap: 10px;
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
    grid-row-gap: 15px;
    row-gap: 15px;
    padding: 20% 15px;
    justify-items: center;

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
      text-align: center;
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
    padding: 0 15px;
    margin: 0 0 50px;

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

::v-deep #my-modal {
  max-width: max-content;
}
</style>
