<template>
  <prime-dialog
    v-model:visible="isOpen"
    :modal="true"
    :closable="!isLocked"
    :dismissable-mask="!isLocked"
    :close-on-escape="!isLocked"
    :draggable="false"
    :style="{ width: '50rem', borderRadius: '15px', overflow: 'hidden' }"
    :pt="{
      content: 'rounded-[15px] overflow-hidden',
      root: `mx-auto w-container ${modalId}`,
      header: 'hidden',
      closeButton: 'hidden',
      footer: 'hidden',
      mask: isLocked ? 'pointer-events-none' : '',
    }"
  >
    <div class="wl-t">
      <i
        v-if="!isLocked"
        class="fa fa-close"
        @click="hideModal"
      />
    </div>
    <div class="wl-b">
      <div class="wl-b__co">
        <div class="wl-b__co__line" />
        <div class="wl-b__co__label">ليس لديك حساب في اختبارات؟</div>
        <div class="wl-b__co__line" />
      </div>
      <app-button
        class="re-b"
        color-type="primary"
        type="flat"
        label="إنشاء حساب جديد"
        @click="_toRegister"
      />
      <div class="wl-b__co">
        <div class="wl-b__co__line" />
        <div class="wl-b__co__label">لديك حساب سابق؟</div>
        <div class="wl-b__co__line" />
      </div>
      <app-button
        class="re-b lo"
        color-type="primary"
        type="outline"
        label="تسجيل الدخول"
        @click="_toLogin"
      />
    </div>
  </prime-dialog>
</template>
<script setup lang="ts">
//constant
import AppButton from '~/components/shared/app-button.vue';

const modalId = 'web-login-register-modal';

//composable
const router = useRouter();

//data
const isOpen = ref(false);
const isLocked = ref(false);

//methods
const _toLogin = () => {
  hideModal();
  router.push('/auth/signup');
};
const _toRegister = () => {
  hideModal();
  router.push({
    path: '/auth/signup',
    query: { isSignup: 'true' },
  });
};
const _showModal = () => {
  isOpen.value = true;
};
const hideModal = () => {
  document.body.classList.remove('modal-blur');
  isOpen.value = false;
};
</script>
<style lang="scss" scoped>
@import 'assets/scss/mixin';
.web-login-register-modal {
  .modal-content {
    width: 340px;
    margin: 0 auto;
    max-width: 90vw;
  }

  .wl-t {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20px 20px 46px 20px;
    i {
      font-size: 24px;
      color: var(--purple-8c);
      cursor: pointer;
    }
  }

  .wl-b {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 20px;

    &__co {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &__line {
        display: block;
        height: 1px;
        background-color: var(--dark-63);
        width: 100%;
        max-width: 36px;
      }
      &__label {
        display: block;
        font-weight: bold;
        padding: 0 5px;
        font-size: 16px;
        color: var(--dark-63);
        text-align: center;
        flex-shrink: 0;
      }
    }

    .re-b {
      height: 45px !important;
      align-self: center;
      margin-top: 20px;
      margin-bottom: 60px;
      width: 100%;

      &.lo {
        margin-top: 14px;
        margin-bottom: 90px;
      }
    }
  }
}
.modal-blur .modal-backdrop {
  background: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(8px);
  opacity: 1;
}
</style>
