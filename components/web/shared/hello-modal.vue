<template>
  <prime-dialog
    :id="modalId"
    v-model:visible="isOpen"
    :modal="true"
    :dismissableMask="true"
    :closable="false"
    :showHeader="false"
    :style="{ width: '100%', maxWidth: '720px' }"
    :pt="{
      root: { class: 'rounded-[15px] overflow-hidden hello-modal-c mx-auto' },
      content: { class: '!p-0 mb-2' },
    }"
  >
    <div class="flex items-center justify-end sbm-close-w">
      <i
        class="fa fa-close sbm-close-icon"
        @click="hideModal"
      ></i>
    </div>
    <div class="sbm-wrapper">
      <img
        class="sbm-wrapper__pic"
        src="/images/free-image.png"
      />
      <span class="sbm-wrapper__la">تم تسجيلك بنجاح</span>
      <div class="sbm-sf">
        <div class="sbm-sf__w">
          <span class="sbm-sf__ll">أنت الآن مشترك في الباقة الأساسية</span>
          <div class="sbm-sf__items">
            <div
              v-for="item of staticItems"
              :key="item.label"
              class="sbm-sf__items__el"
            >
              <i
                v-if="item.check"
                class="fa fa-check"
              ></i>
              <i
                v-else
                class="fa fa-times c-red"
              ></i>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sbm-actions">
      <app-button
        :label="'ترقية الاشتراك'"
        :type="'flat'"
        @click="upgradeClicked"
      />
    </div>
  </prime-dialog>
</template>
<script setup lang="ts">
import { webUserPanelSubscriptions } from '#shared/utils/web-routes.utils';

//emits
defineEmits(['hello-modal-hidden']);

//constant
const modalId = 'hello-modal-id';
const staticItems = [
  {
    label: 'مجانية دائما',
    check: true,
  },
  {
    label: 'تدريب شامل (كمي - لفظي)',
    check: true,
  },
  {
    label: 'التدرب على الأقسام الفرعية',
    check: true,
  },
  {
    label: 'تحليل الأداء (قسم واحد فقط)',
    check: true,
  },
  {
    label: 'محاكي الاختبار الحقيقي (3 محاولات)',
    check: true,
  },
  {
    label: 'أدوات مساعدة في التدريب',
    check: false,
  },
  {
    label: 'خيارات أكثر للتدرب على اختبارك',
    check: false,
  },
  {
    label: 'نصائح الذكاء الاصطناعي',
    check: false,
  },
];

//composable
const router = useRouter();

//data
const isOpen = ref(false);

//method
const upgradeClicked = () => {
  hideModal();
  router.push(webUserPanelSubscriptions());
};
//TODO-z
const _showModal = () => {
  isOpen.value = true;
};
const hideModal = () => {
  isOpen.value = false;
};
</script>
<style lang="scss">
#hello-modal-id {
  z-index: 99999999999;
}
.hello-modal-c {
  .modal-body {
    margin-bottom: 0 !important;
  }

  .modal-content {
    width: 340px;
    margin: 0 auto;
    max-width: 90vw;
  }

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
            &.c-red {
              color: var(--red-5e);
            }
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
