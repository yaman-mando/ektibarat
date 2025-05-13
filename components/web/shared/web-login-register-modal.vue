<template>
  <lazy-prime-dialog
    :id="modalId"
    v-model:visible="isOpen"
    :modal="true"
    :closable="false"
    :dismissableMask="!isLocked"
    :closeOnEscape="!isLocked"
    :draggable="false"
    :showHeader="false"
    :style="{ width: '50rem', borderRadius: '15px', overflow: 'hidden' }"
  >
    <div class="wl-t">
      <i
        v-if="!isLocked"
        class="fa fa-close"
        @click="hideModal"
      ></i>
    </div>
    <div class="wl-b">
      <div class="wl-b__co">
        <div class="wl-b__co__line"></div>
        <div class="wl-b__co__label">ليس لديك حساب في اختبارات؟</div>
        <div class="wl-b__co__line"></div>
      </div>
      <app-button
        class="re-b"
        colorType="primary"
        variant="flat"
        label="إنشاء حساب جديد"
        @click="_toRegister"
      />
      <div class="wl-b__co">
        <div class="wl-b__co__line"></div>
        <div class="wl-b__co__label">لديك حساب سابق؟</div>
        <div class="wl-b__co__line"></div>
      </div>
      <app-button
        class="re-b lo"
        colorType="primary"
        variant="outline"
        label="تسجيل الدخول"
        :isDisabled="authState.loading.value"
        @click="toLogin"
      />
    </div>
  </lazy-prime-dialog>
</template>
<script setup lang="ts">
//constant
import { webAuthPathUtil } from '~/main/utils/web-routes.utils';
import { useAuthState } from '#imports';

const modalId = 'web-login-register-modal';

//composable
const router = useRouter();
const authState = useAuthState();
const auth = useAuth();

//data
const isOpen = ref(false);
const isLocked = ref(false);

//methods
const hideModal = () => {
  document.body.classList.remove('modal-blur');
  isOpen.value = false;
};

const toLogin = async () => {
  hideModal();
  // await auth.signIn(
  //   { username: 'admin_ekhts', password: 'dsaewq321' },
  //   { callbackUrl: '/', redirect: false }
  // );
  router.push(webAuthPathUtil());
};
const _toRegister = () => {
  hideModal();
  router.push({
    path: webAuthPathUtil(),
    query: { isSignup: 'true' },
  });
};
const _showModal = () => {
  isOpen.value = true;
};

defineExpose({
  _showModal,
});
</script>
<style lang="scss">
@import '@/assets/scss/mixin';
#web-login-register-modal {
  --p-dialog-content-padding: 0;
  max-width: 340px;
  margin: 0 auto;

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
