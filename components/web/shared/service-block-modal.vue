<template>
  <lazy-prime-dialog
    id="sbm-modal-id"
    v-model:visible="isOpen"
    :closable="true"
    :showHeader="false"
    class="mx-auto sbm-modal-c"
    hideFooter
    :dismissableMask="true"
    :modal="true"
    :closeOnEscape="true"
  >
    <div class="sbm-wrapper">
      <img
        alt=""
        class="sbm-wrapper__pic !mb-[15px]"
        src="/images/lock-circle-image.png"
      />
      <span class="sbm-wrapper__la !text-[28px]">للمشتركين فقط</span>
      <div class="sbm-sf">
        <div class="sbm-sf__w">
          <div class="sbm-sf__items">
            <div
              v-for="item of staticItems"
              :key="item.label"
              class="sbm-sf__items__el !gap-[10px]"
            >
              <span class="w-[3px] h-[3px] rounded-[50%] bg-[#000]"></span>
              <span class="!text-[16px]">{{ item.label }}</span>
            </div>
          </div>
          <span class="sbm-sf__ll sq !text-center font-bold !text-[16px]">
            وغيرها الكثير من المزايا...
          </span>
        </div>
      </div>
    </div>
    <div class="sbm-actions">
      <app-button
        class="!rounded-[8px] !w-[164px] !h-[43px] !bg-[linear-gradient(270deg,#24A7F1_0%,#0266D6_100%)] !border-transparent"
        :label="'اشترك الآن'"
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
          label: 'تدريبات غير محدودة',
        },
        {
          label: 'تحديد مستوى الأسئلة',
        },
        {
          label: 'تدرب على الأسئلة الحديثة والتقفيلات',
        },
        {
          label: 'إمكانية مراجعة أخطاءك',
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
  width: min(330px, 90vw) !important;
  margin: 0 auto;
  --p-dialog-content-padding: 0;

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
    margin-top: 30px;

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
        padding: 0 15px;
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
