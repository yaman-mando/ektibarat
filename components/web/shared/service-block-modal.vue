<template>
  <lazy-prime-dialog
    id="sbm-modal-id"
    v-model:visible="isOpen"
    :closable="true"
    :showHeader="false"
    class="mx-auto w-container sbm-modal-c"
    hideFooter
    :dismissableMask="true"
    :modal="true"
    :closeOnEscape="true"
  >
    <div class="flex items-center justify-end sbm-close-w">
      <i
        class="fa fa-close sbm-close-icon"
        @click="hideModal"
      ></i>
    </div>
    <div class="sbm-wrapper">
      <img
        alt=""
        class="sbm-wrapper__pic"
        src="/images/service-lock-image.svg"
      />
      <span class="sbm-wrapper__la">غير متاح في الباقة الأساسية</span>
      <div class="sbm-sf">
        <div class="sbm-sf__w">
          <span class="sbm-sf__ll">
            قم بترقية اشتراكك واحصل على جميع المزايا
          </span>
          <div class="sbm-sf__items">
            <div
              v-for="item of staticItems"
              :key="item.label"
              class="sbm-sf__items__el"
            >
              <i class="fa fa-check"></i>
              <span>{{ item.label }}</span>
            </div>
          </div>
          <span class="sbm-sf__ll sq">وغيرها الكثير من المزايا...</span>
        </div>
      </div>
    </div>
    <div class="sbm-actions">
      <app-button
        :label="'ترقية الاشتراك'"
        :variant="'flat'"
        @click="upgradeClicked"
      />
    </div>
  </lazy-prime-dialog>
</template>
<script lang="ts">
import { RouteHelper } from '~/main/utils/route-helper.js';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';

export default {
  setup(props, { expose }) {
    const isOpen = ref(false);
    function showModal() {
      isOpen.value = true;
    }

    expose({
      showModal,
    });
    return {
      ...useSetupRoute(),
      showModal,
      isOpen,
    };
  },
  data() {
    return {};
  },
  computed: {
    staticItems() {
      return [
        {
          label: 'تحليل أداءك في جميع الأقسام',
        },
        {
          label: 'اكتشاف نقاط ضعفك وطرق معالجتها',
        },
        {
          label: 'توقع نتيجتك في الاختبار الحقيقي',
        },
        {
          label: 'عرض القوانين والمهارات',
        },
        {
          label: 'نصائح الذكاء الاصطناعي',
        },
        {
          label: 'خيارات أكثر للتدرب على اختبارك',
        },
        {
          label: 'محاكي الاختبار الحقيقي',
        },
      ];
    },
  },
  methods: {
    upgradeClicked() {
      this.hideModal();
      this.appRouter.push(RouteHelper.userPanelSubscriptions());
    },

    hideModal() {
      this.isOpen = false;
    },
  },
};
</script>
<style lang="scss">
.sbm-modal-c {
  width: 340px !important;
  margin: 0 auto;
  max-width: 90vw;

  .sbm-close-w {
    position: absolute;
    left: 0;
    padding-top: 20px;
    margin-inline-end: 20px;

    i {
      cursor: pointer;
      font-size: 18px;
    }
  }

  .sbm-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 25px;
    gap: 15px;

    &__pic {
      display: block;
      margin: auto;
      width: 120px;
      height: 120px;
    }

    &__la {
      display: block;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: var(--purple-8c);
    }

    .sbm-sf {
      width: 100%;
      display: flex;
      flex-direction: column;

      &__w {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 12px 15px;
        background: #bcccdb33;
      }

      &__ll {
        display: block;
        font-size: 16px;
        text-align: center;
        font-weight: bold;
        &.sq {
          font-size: 14px;
        }
      }

      &__items {
        margin: 10px 0;
        display: flex;
        flex-direction: column;
        gap: 5px;

        &__el {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 5px;
          i {
            font-size: 14px;
            color: var(--green-87);
          }
          span {
            display: inline-block;
            font-size: 13px;
            color: var(--gray-63);
          }
        }
      }
    }
  }

  .sbm-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;

    .app-button {
      width: 200px !important;
      height: 44px !important;
      margin-bottom: 22px;

      span {
        font-size: 16px !important;
      }
    }
  }
}
</style>
