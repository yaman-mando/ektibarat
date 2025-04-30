<template>
  <lazy-prime-dialog
    id="permission-modal"
    :visible="globalStore.state.showBlockModal"
    :modal="true"
    :closable="false"
    :dismissableMask="false"
    :showHeader="false"
    @hide="closeModal"
  >
    <div class="modal-contents">
      <div class="e-1">
        <i class="fa fa-warning"></i>
      </div>
      <div class="e-2">
        <span>رسالة تنبيه</span>
      </div>
      <div class="e-3">
        <span>
          تم ايقاف الحساب بشكل مؤقت من قبل المسؤولين يرجى مراجعة إدارة المنصة
        </span>
      </div>
      <div class="e-4">
        <app-button
          type="outline"
          label="إغلاق"
          @click="closeModal"
        />
        <app-button
          type="outline"
          label="الذهاب لصفحة التواصل"
          @click="goToContact"
        />
      </div>
    </div>
  </lazy-prime-dialog>
</template>
<script setup lang="ts">
//props
import { useGlobalStore } from '~/main/useGlobalStore';
import { webContactUsPathUtil } from '~/main/utils/web-routes.utils';

//composable
const globalStore = useGlobalStore();
const router = useRouter();

//method
const closeModal = () => {
  globalStore.patchState({ showBlockModal: false });
};
const goToContact = () => {
  globalStore.patchState({ showBlockModal: false });
  router.push(webContactUsPathUtil());
};
</script>
<style lang="scss">
#permission-modal {
  background: var(--bg-modal);
  max-width: 402px;
  @media (max-width: 640px) {
    max-width: 95%;
  }

  .p-dialog-content {
    padding: 15px 30px;
    background: var(--bg-modal);
    border-radius: 13px;

    .modal-contents {
      .e-1 {
        display: flex;
        justify-content: center;

        i {
          font-size: 26px;
          color: var(--red-63);
        }
      }

      .e-2 {
        margin-top: 10px;
        display: flex;
        justify-content: center;

        span {
          font-size: 18px;
          font-weight: bold;
          color: var(--red-63);
        }
      }

      .e-3 {
        margin: 20px 0;
        display: flex;
        justify-content: center;

        span {
          text-align: center;
          font-size: 16px;
          color: var(--text2-modal);
        }
      }

      .e-4 {
        display: grid;
        grid-auto-flow: column;
        //grid-template-columns: 1fr 1fr;
        align-items: center;
        grid-column-gap: 10px;
        margin-top: 10px;
        .a-confirm {
          font-size: 18px;
          background-color: var(--red-63);
          border: none !important;
          box-shadow: none !important;
        }
        .a-cancel {
          font-size: 18px;
          //background-color: transparent !important;
          color: white;
          background-color: var(--red-63);
        }
      }
    }
  }
}
</style>
